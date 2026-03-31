import { ref } from 'vue'
import { defineStore } from 'pinia'
import { OneBotTransport } from '@/services/onebot-transport'
import { useConversationsStore, useSessionStore, useContactsStore, useGroupsStore } from './mock-data'

export const useOneBotStore = defineStore('onebot', () => {
  const transport = ref<OneBotTransport | null>(null)
  const connected = ref(false)
  const loggedIn = ref(false)
  const config = ref({
    url: 'ws://localhost:8080/webqq/ws',
    enabled: false,
  })

  const connect = async () => {
    if (transport.value) {
      transport.value.disconnect()
    }

    transport.value = new OneBotTransport({ url: config.value.url })

    transport.value.onMessage((msg) => {
      handleMessage(msg)
    })

    transport.value.connect()

    // 等待连接建立
    await new Promise(resolve => setTimeout(resolve, 500))

    connected.value = true
    loggedIn.value = true

    // 连接成功后获取好友和群组列表
    await fetchContactsAndGroups()
  }

  const disconnect = () => {
    transport.value?.disconnect()
    transport.value = null
    connected.value = false
    loggedIn.value = false
  }

  const fetchContactsAndGroups = async () => {
    if (!transport.value) return

    try {
      // 获取登录信息
      const loginInfo = await transport.value.callApi('get_login_info')
      console.log('[OneBot] Login info:', loginInfo)

      // 更新 session store
      const sessionStore = useSessionStore()
      if (loginInfo) {
        sessionStore.profile.qqNumber = loginInfo.user_id.toString()
        sessionStore.profile.nickname = loginInfo.nickname || `QQ用户${loginInfo.user_id}`
      }

      const [friendList, groupList] = await Promise.all([
        transport.value.callApi('get_friend_list'),
        transport.value.callApi('get_group_list'),
      ])

      console.log('[OneBot] Friend list:', friendList)
      console.log('[OneBot] Group list:', groupList)

      const conversationsStore = useConversationsStore()
      const contactsStore = useContactsStore()
      const groupsStore = useGroupsStore()

      if (friendList && Array.isArray(friendList)) {
        friendList.forEach((friend: any) => {
          // 添加到 contacts store
          contactsStore.contacts.push({
            id: friend.user_id.toString(),
            qqNumber: friend.user_id.toString(),
            nickname: friend.nickname || friend.remark || `用户${friend.user_id}`,
            groupName: '我的好友',
            status: 'online',
            remark: friend.remark,
          })

          // 添加到 conversations store
          conversationsStore.ensureConversation({
            id: `user_${friend.user_id}`,
            kind: 'private',
            contactId: friend.user_id.toString(),
            title: friend.nickname || friend.remark || `用户${friend.user_id}`,
            unreadCount: 0,
            lastMessagePreview: '',
          })
        })
      }

      if (groupList && Array.isArray(groupList)) {
        groupList.forEach((group: any) => {
          // 添加到 groups store
          groupsStore.groups.push({
            id: group.group_id.toString(),
            groupCode: group.group_id.toString(),
            name: group.group_name || `群${group.group_id}`,
            memberCount: group.member_count,
          })

          // 添加到 conversations store
          conversationsStore.ensureConversation({
            id: `group_${group.group_id}`,
            kind: 'group',
            groupId: group.group_id.toString(),
            title: group.group_name || `群${group.group_id}`,
            unreadCount: 0,
            lastMessagePreview: '',
          })
        })
      }
    } catch (e) {
      console.error('[OneBot] Failed to fetch contacts/groups:', e)
    }
  }

  const handleMessage = (msg: any) => {
    console.log('[OneBot Store] Handling message:', msg)
    const conversationsStore = useConversationsStore()

    if (msg.post_type === 'message') {
      const conversationId =
        msg.message_type === 'private' ? `user_${msg.user_id}` : `group_${msg.group_id}`

      console.log('[OneBot Store] Adding message to conversation:', conversationId)

      conversationsStore.addRealMessage({
        conversationId,
        senderId: msg.user_id,
        senderName: msg.sender?.nickname || '未知',
        text: msg.message,
        time: new Date(msg.time * 1000).toLocaleTimeString(),
      })
    }
  }

  const sendMessage = (conversationId: string, message: string) => {
    if (!transport.value) return

    const isGroup = conversationId.startsWith('group_')
    const targetId = parseInt(conversationId.split('_')[1])

    transport.value.sendMessage(isGroup ? 'group' : 'private', targetId, message)
  }

  const uploadAndSendImage = async (conversationId: string, file: File) => {
    if (!transport.value) return

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/upload_image', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    const cqCode = `[CQ:image,file=${data.file}]`

    // 本地预览：用 object URL 显示图片
    const localUrl = URL.createObjectURL(file)
    const localCQ = `[CQ:image,url=${localUrl}]`
    const conversationsStore = useConversationsStore()
    conversationsStore.appendLocalDraft(conversationId, localCQ)

    const isGroup = conversationId.startsWith('group_')
    const targetId = parseInt(conversationId.split('_')[1])

    transport.value.sendMessage(isGroup ? 'group' : 'private', targetId, cqCode)
  }

  const uploadAndSendFile = async (conversationId: string, file: File) => {
    if (!transport.value) return

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/upload_file', {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()

    // 本地显示文件消息
    const conversationsStore = useConversationsStore()
    conversationsStore.appendLocalDraft(conversationId, `[CQ:file,file=${file.name},file_id=local]`)

    const isGroup = conversationId.startsWith('group_')
    const targetId = parseInt(conversationId.split('_')[1])

    if (isGroup) {
      await transport.value.callApi('upload_group_file', {
        group_id: targetId,
        file: data.file,
        name: data.name,
      })
    } else {
      await transport.value.callApi('upload_private_file', {
        user_id: targetId,
        file: data.file,
        name: data.name,
      })
    }
  }

  return {
    connected,
    loggedIn,
    config,
    connect,
    disconnect,
    sendMessage,
    uploadAndSendImage,
    uploadAndSendFile,
  }
})

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ChatMessage, Contact, Conversation, Group, UserProfile } from '@/domain/models'
import { MockTransport } from '@/services/api/mockTransport'
import { SessionRepository } from '@/services/repositories/sessionRepository'
import { ContactRepository } from '@/services/repositories/contactRepository'
import { ConversationRepository } from '@/services/repositories/conversationRepository'
import { formatMessagePreview } from '@/utils/cqcode'

const transport = new MockTransport()
const sessionRepository = new SessionRepository(transport)
const contactRepository = new ContactRepository(transport)
const conversationRepository = new ConversationRepository(transport)

void transport.connect()

export const useSessionStore = defineStore('session', () => {
  const profile = ref<UserProfile>({
    id: 'self-10000',
    qqNumber: '10000',
    nickname: 'WebQQ 体验号',
    status: 'online',
    signature: '欢迎回来，今天也来聊点什么吧。',
  })

  const load = async () => {
    profile.value = await sessionRepository.getSelf()
  }

  void load()
  return { profile, load }
})

export const useContactsStore = defineStore('contacts', () => {
  const contacts = ref<Contact[]>([])

  const load = async () => {
    contacts.value = await contactRepository.getContacts()
  }

  const groupedContacts = computed(() => {
    const groups = new Map<string, Contact[]>()

    for (const contact of contacts.value) {
      const current = groups.get(contact.groupName) ?? []
      current.push(contact)
      groups.set(contact.groupName, current)
    }

    return Array.from(groups.entries()).map(([groupName, items]) => ({
      groupName,
      items,
    }))
  })

  const getContactById = (id: string) => contacts.value.find((contact) => contact.id === id)

  void load()

  return {
    contacts,
    groupedContacts,
    getContactById,
    load,
  }
})

export const useGroupsStore = defineStore('groups', () => {
  const groups = ref<Group[]>([])

  const load = async () => {
    groups.value = await conversationRepository.getGroups()
  }

  void load()

  return {
    groups,
    load,
  }
})

export const useConversationsStore = defineStore('conversations', () => {
  const conversations = ref<Conversation[]>([])
  const messages = ref<ChatMessage[]>([])
  const activeConversationId = ref<string>('')

  const load = async () => {
    conversations.value = await conversationRepository.getConversations()
    activeConversationId.value = conversations.value[0]?.id ?? ''

    const loadedMessages = await Promise.all(
      conversations.value.map((conversation) => conversationRepository.getMessages(conversation.id)),
    )
    messages.value = loadedMessages.flat()
  }

  const setActiveConversation = (conversationId: string) => {
    activeConversationId.value = conversationId
  }

  const getConversationById = (conversationId: string) =>
    conversations.value.find((conversation) => conversation.id === conversationId)

  const getConversationByContactId = (contactId: string) =>
    conversations.value.find((conversation) => conversation.kind === 'private' && conversation.contactId === contactId)

  const getConversationByGroupId = (groupId: string) =>
    conversations.value.find((conversation) => conversation.kind === 'group' && conversation.groupId === groupId)

  const getMessagesByConversationId = (conversationId: string) =>
    messages.value.filter((message) => message.conversationId === conversationId)

  const appendLocalDraft = (conversationId: string, text: string) => {
    const cleanText = text.trim()
    if (!cleanText) {
      return
    }

    messages.value.push({
      id: `draft-${Date.now()}`,
      conversationId,
      sender: 'self',
      senderName: '我',
      text: cleanText,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    })

    const conversation = getConversationById(conversationId)
    if (conversation) {
      conversation.lastMessagePreview = formatMessagePreview(cleanText)
    }
  }

  const addRealMessage = (data: {
    conversationId: string
    senderId: number
    senderName: string
    text: string
    time: string
  }) => {
    messages.value.push({
      id: `msg-${Date.now()}`,
      conversationId: data.conversationId,
      sender: 'contact',
      senderName: data.senderName,
      text: data.text,
      time: data.time,
    })

    const conversation = getConversationById(data.conversationId)
    if (conversation) {
      conversation.lastMessagePreview = formatMessagePreview(data.text)
      conversation.unreadCount = (conversation.unreadCount || 0) + 1

      // 移到最前面
      const index = conversations.value.indexOf(conversation)
      if (index > 0) {
        conversations.value.splice(index, 1)
        conversations.value.unshift(conversation)
      }
    }
  }

  const ensureConversation = (conv: Conversation) => {
    const existing = getConversationById(conv.id)
    if (!existing) {
      conversations.value.push(conv)
    }
  }

  void load()

  return {
    conversations,
    messages,
    activeConversationId,
    setActiveConversation,
    getConversationById,
    getConversationByContactId,
    getConversationByGroupId,
    getMessagesByConversationId,
    appendLocalDraft,
    addRealMessage,
    ensureConversation,
    load,
  }
})

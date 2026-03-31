<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue'
import { useConversationsStore } from '@/stores/mock-data'
import { useNotificationsStore } from '@/stores/notifications'
import { useOneBotStore } from '@/stores/onebot'
import MessageContent from '@/components/message/MessageContent.vue'

interface Props {
  conversationId: string
}

const props = defineProps<Props>()

const conversationsStore = useConversationsStore()
const notificationsStore = useNotificationsStore()
const oneBotStore = useOneBotStore()
const { getMessagesByConversationId } = conversationsStore

const messages = computed(() => getMessagesByConversationId(props.conversationId))

const inputText = ref('')
const showEmojiPicker = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const emojis = ['😊', '😂', '❤️', '👍', '🎉', '😭', '😅', '🤔', '😎', '🙏', '💯', '🔥']

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

watch(messages, () => {
  scrollToBottom()
}, { deep: true })

const handleSend = () => {
  if (!inputText.value.trim()) {
    return
  }

  const text = inputText.value.trim()

  // 立即在本地显示
  conversationsStore.appendLocalDraft(props.conversationId, text)

  // 发送到服务器
  oneBotStore.sendMessage(props.conversationId, text)

  inputText.value = ''
}

const insertEmoji = (emoji: string) => {
  inputText.value += emoji
  showEmojiPicker.value = false
}

const handleImageUpload = async () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      try {
        await oneBotStore.uploadAndSendImage(props.conversationId, file)
        notificationsStore.pushNotification({
          type: 'success',
          title: '图片已发送',
          message: file.name,
          duration: 2000,
        })
      } catch (error) {
        notificationsStore.pushNotification({
          type: 'error',
          title: '图片发送失败',
          message: String(error),
          duration: 3000,
        })
      }
    }
  }
  input.click()
}

const handleFileUpload = async () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      try {
        await oneBotStore.uploadAndSendFile(props.conversationId, file)
        notificationsStore.pushNotification({
          type: 'success',
          title: '文件已发送',
          message: file.name,
          duration: 2000,
        })
      } catch (error) {
        notificationsStore.pushNotification({
          type: 'error',
          title: '文件发送失败',
          message: String(error),
          duration: 3000,
        })
      }
    }
  }
  input.click()
}
</script>

<template>
  <div class="chat-window">
    <div ref="messagesContainer" class="chat-window__messages">
      <div v-for="message in messages" :key="message.id" class="chat-message" :data-sender="message.sender">
        <div class="chat-message__meta">
          <span class="chat-message__sender">{{ message.senderName }}</span>
          <span class="chat-message__time">{{ message.time }}</span>
        </div>
        <div class="chat-message__bubble">
          <MessageContent :text="message.text" />
        </div>
      </div>
    </div>
    <div class="chat-window__input-area">
      <div class="chat-window__toolbar">
        <div style="position: relative">
          <button class="chat-toolbar-btn" type="button" title="表情" @click="showEmojiPicker = !showEmojiPicker">😊</button>
          <div v-if="showEmojiPicker" class="emoji-picker">
            <button v-for="emoji in emojis" :key="emoji" class="emoji-btn" type="button" @click="insertEmoji(emoji)">
              {{ emoji }}
            </button>
          </div>
        </div>
        <button class="chat-toolbar-btn" type="button" title="图片" @click="handleImageUpload">🖼️</button>
        <button class="chat-toolbar-btn" type="button" title="文件" @click="handleFileUpload">📎</button>
      </div>
      <div class="chat-window__input-wrapper">
        <textarea
          v-model="inputText"
          class="chat-window__input"
          placeholder="输入消息"
          @keydown.enter.exact.prevent="handleSend"
        ></textarea>
      </div>
      <div class="chat-window__actions">
        <button class="chat-send-btn" type="button" @click="handleSend">发送</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-window {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.48);
}

.chat-window__messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chat-message {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-message[data-sender='self'] {
  align-items: flex-end;
}

.chat-message__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  color: rgba(45, 95, 143, 0.58);
}

.chat-message[data-sender='self'] .chat-message__meta {
  flex-direction: row-reverse;
}

.chat-message__sender {
  font-weight: 600;
}

.chat-message__bubble {
  max-width: 68%;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.5;
  word-wrap: break-word;
}

.chat-message[data-sender='contact'] .chat-message__bubble {
  background: rgba(255, 255, 255, 0.88);
  color: #2d5f8f;
  border: 1px solid rgba(74, 131, 186, 0.18);
}

.chat-message[data-sender='self'] .chat-message__bubble {
  background: linear-gradient(135deg, #5fb3f6, #4a9de8);
  color: #fff;
  box-shadow: 0 2px 8px rgba(74, 157, 232, 0.24);
}

.chat-message[data-sender='system'] .chat-message__bubble {
  background: rgba(140, 140, 140, 0.12);
  color: rgba(45, 95, 143, 0.68);
  font-size: 11px;
  align-self: center;
}

.chat-window__input-area {
  border-top: 1px solid rgba(74, 131, 186, 0.18);
  background: rgba(255, 255, 255, 0.68);
}

.chat-window__toolbar {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(74, 131, 186, 0.12);
}

.chat-toolbar-btn {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid rgba(74, 131, 186, 0.18);
  background: rgba(255, 255, 255, 0.78);
  cursor: pointer;
  transition: background 120ms ease;
}

.chat-toolbar-btn:hover {
  background: rgba(255, 255, 255, 0.95);
}

.chat-window__input-wrapper {
  padding: 8px 12px;
}

.chat-window__input {
  width: 100%;
  height: 68px;
  border: 1px solid rgba(74, 131, 186, 0.22);
  border-radius: 8px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.88);
  font-size: 13px;
  color: #2d5f8f;
  resize: none;
  font-family: inherit;
}

.chat-window__input::placeholder {
  color: rgba(45, 95, 143, 0.48);
}

.chat-window__actions {
  display: flex;
  justify-content: flex-end;
  padding: 0 12px 12px;
}

.chat-send-btn {
  height: 32px;
  padding: 0 24px;
  border-radius: 16px;
  border: 1px solid rgba(74, 157, 232, 0.32);
  background: linear-gradient(180deg, #5fb3f6, #4a9de8);
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 80ms ease;
}

.chat-send-btn:hover {
  transform: translateY(-1px);
}

.chat-send-btn:active {
  transform: translateY(0);
}

.emoji-picker {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(74, 131, 186, 0.22);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(45, 95, 143, 0.18);
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 4px;
  z-index: 10;
}

.emoji-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 18px;
  border-radius: 4px;
  transition: background 120ms ease;
}

.emoji-btn:hover {
  background: rgba(95, 179, 246, 0.12);
}
</style>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDesktopStore } from '@/stores/desktop'
import { useContactsStore, useConversationsStore } from '@/stores/mock-data'
import { useWindowManagerStore } from '@/stores/windowManager'
import { useOneBotStore } from '@/stores/onebot'
import WindowLayer from '@/components/window/WindowLayer.vue'
import ToastLayer from '@/components/notifications/ToastLayer.vue'
import BotLoginWindow from '@/components/apps/BotLoginWindow.vue'
import ToggleBar from './ToggleBar.vue'

const desktopStore = useDesktopStore()
const contactsStore = useContactsStore()
const conversationsStore = useConversationsStore()
const windowManager = useWindowManagerStore()
const oneBotStore = useOneBotStore()

const { sidebarOpen } = storeToRefs(desktopStore)
const { contacts } = storeToRefs(contactsStore)
const { conversations } = storeToRefs(conversationsStore)

const recentSessions = computed(() => conversations.value.slice(0, 6))

const openConversation = (conversationId: string) => {
  const conversation = conversationsStore.getConversationById(conversationId)
  if (!conversation) {
    return
  }

  // 清除未读
  conversation.unreadCount = 0

  if (conversation.kind === 'group' && conversation.groupId) {
    windowManager.openGroupChatWindow(conversation.groupId, conversation.id, conversation.title)
    return
  }

  if (conversation.kind === 'private' && conversation.contactId) {
    const contact = contacts.value.find((item) => item.id === conversation.contactId)
    if (!contact) {
      return
    }

    windowManager.openChatWindow(contact.id, conversation.id, `与 ${contact.nickname} 对话中`)
  }
}

const openPrimaryChat = () => {
  const primaryConversation = conversations.value[0]
  if (!primaryConversation) {
    return
  }
  openConversation(primaryConversation.id)
}
</script>

<template>
  <div id="mainPanel">
    <!-- 未登录时显示登录窗口 -->
    <div v-if="!oneBotStore.loggedIn" class="desktop-stage desktop-stage--fullscreen">
      <BotLoginWindow />
      <ToastLayer />
    </div>

    <!-- 已登录时显示正常界面 -->
    <template v-else>
      <ToggleBar />

      <div
        id="sideBarReplacement"
        class="sideBarReplacement"
        :class="{ 'sideBarReplacement--collapsed': !sidebarOpen }"
      >
        <div class="sidebar-card">
          <div class="sidebar-card__title">应用侧边栏</div>
          <button class="sidebar-card__item sidebar-card__item--button" type="button" @click="windowManager.openBuddyListWindow()">我的好友</button>
          <button class="sidebar-card__item sidebar-card__item--button" type="button" @click="windowManager.openGroupListWindow()">
            群组
          </button>
          <button class="sidebar-card__item sidebar-card__item--button" type="button" @click="windowManager.openSettingsWindow()">
            设置中心
          </button>
          <button class="sidebar-card__item sidebar-card__item--button" type="button" @click="windowManager.openAboutWindow()">
            关于
          </button>
        </div>

        <div class="sidebar-card sidebar-card--sessions">
          <div class="sidebar-card__title">最近会话</div>
          <button
            v-for="conversation in recentSessions"
            :key="conversation.id"
            class="session-item"
            type="button"
            @click="openConversation(conversation.id)"
          >
            <div class="session-item__title-row">
              <span class="session-item__title">{{ conversation.title }}</span>
              <span class="session-item__badge" v-if="conversation.unreadCount > 0">{{ conversation.unreadCount }}</span>
            </div>
            <div class="session-item__meta">
              <span class="session-item__kind">{{ conversation.kind === 'group' ? '群聊' : '私聊' }}</span>
              <span class="session-item__preview">{{ conversation.lastMessagePreview }}</span>
            </div>
          </button>
        </div>
      </div>

    <div class="desktop-stage">
      <div class="desktop-stage__quick-actions">
        <button class="quick-action" type="button" @click="openPrimaryChat">打开聊天</button>
      </div>
      <WindowLayer />
      <ToastLayer />
    </div>
    </template>
  </div>
</template>

<style scoped>
.desktop-stage--fullscreen {
  grid-column: 1 / -1;
}

.sidebar-card--sessions {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(74, 131, 186, 0.3) transparent;
}

.sidebar-card--sessions::-webkit-scrollbar {
  width: 6px;
}

.sidebar-card--sessions::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-card--sessions::-webkit-scrollbar-thumb {
  background: rgba(74, 131, 186, 0.3);
  border-radius: 3px;
}

.sidebar-card--sessions::-webkit-scrollbar-thumb:hover {
  background: rgba(74, 131, 186, 0.5);
}

.session-item {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid rgba(74, 131, 186, 0.14);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.72);
  text-align: left;
  cursor: pointer;
}

.session-item + .session-item {
  margin-top: 8px;
}

.session-item:hover {
  background: rgba(255, 255, 255, 0.9);
}

.session-item__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.session-item__title {
  font-size: 12px;
  font-weight: 700;
  color: #2d5f8f;
}

.session-item__badge {
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: 9px;
  display: inline-grid;
  place-items: center;
  background: #f5222d;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
}

.session-item__meta {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.session-item__kind,
.session-item__preview {
  font-size: 11px;
  color: rgba(45, 95, 143, 0.58);
}

.session-item__preview {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-card--sessions {
  margin-top: 12px;
}
</style>

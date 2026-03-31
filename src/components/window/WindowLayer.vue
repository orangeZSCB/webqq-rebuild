<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useWindowManagerStore } from '@/stores/windowManager'
import AppWindow from './AppWindow.vue'
import BuddyListWindow from '@/components/apps/BuddyListWindow.vue'
import ChatWindow from '@/components/apps/ChatWindow.vue'
import GroupListWindow from '@/components/apps/GroupListWindow.vue'
import GroupChatWindow from '@/components/apps/GroupChatWindow.vue'
import SettingsCenterWindow from '@/components/apps/SettingsCenterWindow.vue'
import AboutWindow from '@/components/apps/AboutWindow.vue'

const windowManager = useWindowManagerStore()
const { visibleWindows } = storeToRefs(windowManager)
</script>

<template>
  <div class="window-layer">
    <AppWindow v-for="windowItem in visibleWindows" :key="windowItem.id" :window-id="windowItem.id">
      <BuddyListWindow v-if="windowItem.kind === 'buddy-list'" />
      <ChatWindow
        v-else-if="windowItem.kind === 'chat'"
        :conversation-id="windowItem.meta?.conversationId ?? ''"
      />
      <GroupListWindow v-else-if="windowItem.kind === 'group-list'" />
      <GroupChatWindow
        v-else-if="windowItem.kind === 'group-chat'"
        :conversation-id="windowItem.meta?.conversationId ?? ''"
      />
      <SettingsCenterWindow v-else-if="windowItem.kind === 'settings'" />
      <AboutWindow v-else-if="windowItem.kind === 'about'" />
    </AppWindow>
  </div>
</template>

<style scoped>
.window-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.window-layer > * {
  pointer-events: auto;
}
</style>

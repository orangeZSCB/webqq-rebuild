<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'

const notificationsStore = useNotificationsStore()
const { notifications } = storeToRefs(notificationsStore)
</script>

<template>
  <div class="toast-layer">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="toast"
      :data-type="notification.type"
      @click="notificationsStore.dismissNotification(notification.id)"
    >
      <div class="toast__title">{{ notification.title }}</div>
      <div class="toast__message">{{ notification.message }}</div>
    </div>
  </div>
</template>

<style scoped>
.toast-layer {
  position: absolute;
  top: 18px;
  right: 18px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  min-width: 240px;
  max-width: 320px;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.52);
  box-shadow: 0 10px 32px rgba(28, 68, 112, 0.24);
  backdrop-filter: blur(8px);
  cursor: pointer;
  pointer-events: auto;
}

.toast[data-type='success'] {
  border-color: rgba(82, 196, 26, 0.28);
}

.toast[data-type='warning'] {
  border-color: rgba(250, 173, 20, 0.28);
}

.toast[data-type='error'] {
  border-color: rgba(245, 34, 45, 0.28);
}

.toast__title {
  font-size: 13px;
  font-weight: 700;
  color: #2d5f8f;
  margin-bottom: 4px;
}

.toast__message {
  font-size: 12px;
  line-height: 1.5;
  color: #4a78a6;
}
</style>

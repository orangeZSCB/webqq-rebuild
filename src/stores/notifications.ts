import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ToastNotification } from '@/domain/models'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<ToastNotification[]>([])

  const pushNotification = (notification: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    notifications.value.push({ id, ...notification })

    window.setTimeout(() => {
      dismissNotification(id)
    }, notification.duration)
  }

  const dismissNotification = (id: string) => {
    notifications.value = notifications.value.filter((item) => item.id !== id)
  }

  return {
    notifications,
    pushNotification,
    dismissNotification,
  }
})

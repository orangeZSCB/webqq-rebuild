import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { WindowState } from '@/domain/models'

const desktopBounds = {
  width: 1200,
  height: 760,
}

const storageKey = 'webqq-rebuild.window-layout'

const defaultWindows: WindowState[] = []

const getInitialWindows = () => {
  const saved = localStorage.getItem(storageKey)
  if (!saved) {
    return structuredClone(defaultWindows)
  }

  try {
    const parsed = JSON.parse(saved) as WindowState[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : structuredClone(defaultWindows)
  } catch {
    return structuredClone(defaultWindows)
  }
}

export const useWindowManagerStore = defineStore('window-manager', () => {
  const windows = ref<WindowState[]>(getInitialWindows())
  const maxZIndex = ref(Math.max(10, ...windows.value.map((windowItem) => windowItem.zIndex)))

  watch(
    windows,
    (value) => {
      localStorage.setItem(storageKey, JSON.stringify(value))
    },
    { deep: true },
  )

  const visibleWindows = computed(() => windows.value.filter((windowItem) => !windowItem.minimized))
  const taskbarWindows = computed(() => windows.value)

  const getWindow = (windowId: string) => windows.value.find((windowItem) => windowItem.id === windowId)

  const focusWindow = (windowId: string) => {
    const target = getWindow(windowId)
    if (!target) {
      return
    }

    maxZIndex.value += 1
    windows.value.forEach((windowItem) => {
      windowItem.active = windowItem.id === windowId
    })
    target.zIndex = maxZIndex.value
    target.minimized = false
  }

  const minimizeWindow = (windowId: string) => {
    const target = getWindow(windowId)
    if (!target) {
      return
    }
    target.minimized = true
    target.active = false
  }

  const closeWindow = (windowId: string) => {
    windows.value = windows.value.filter((windowItem) => windowItem.id !== windowId)
  }

  const toggleMaximizeWindow = (windowId: string) => {
    const target = getWindow(windowId)
    if (!target) {
      return
    }

    if (!target.maximized) {
      target.meta = {
        ...target.meta,
        restoreX: String(target.x),
        restoreY: String(target.y),
        restoreWidth: String(target.width),
        restoreHeight: String(target.height),
      }
      target.x = 10
      target.y = 10
      target.width = desktopBounds.width - 20
      target.height = desktopBounds.height - 20
      target.maximized = true
    } else {
      target.x = Number(target.meta?.restoreX ?? 40)
      target.y = Number(target.meta?.restoreY ?? 40)
      target.width = Number(target.meta?.restoreWidth ?? 520)
      target.height = Number(target.meta?.restoreHeight ?? 400)
      target.maximized = false
    }

    focusWindow(windowId)
  }

  const restoreFromTaskbar = (windowId: string) => {
    const target = getWindow(windowId)
    if (!target) {
      return
    }

    if (target.minimized) {
      target.minimized = false
    }
    focusWindow(windowId)
  }

  const openChatWindow = (contactId: string, conversationId: string, title: string) => {
    const existing = windows.value.find((windowItem) => windowItem.meta?.conversationId === conversationId)
    if (existing) {
      restoreFromTaskbar(existing.id)
      return
    }

    maxZIndex.value += 1
    windows.value.forEach((windowItem) => {
      windowItem.active = false
    })

    windows.value.push({
      id: `chat-${conversationId}`,
      title,
      kind: 'chat',
      x: 380 + windows.value.length * 18,
      y: 80 + windows.value.length * 18,
      width: 520,
      height: 430,
      minWidth: 420,
      minHeight: 300,
      zIndex: maxZIndex.value,
      minimized: false,
      maximized: false,
      active: true,
      resizable: true,
      meta: { contactId, conversationId },
    })
  }

  const openGroupChatWindow = (groupId: string, conversationId: string, title: string) => {
    const existing = windows.value.find((windowItem) => windowItem.meta?.conversationId === conversationId)
    if (existing) {
      restoreFromTaskbar(existing.id)
      return
    }

    maxZIndex.value += 1
    windows.value.forEach((windowItem) => {
      windowItem.active = false
    })

    windows.value.push({
      id: `group-chat-${conversationId}`,
      title: `群聊：${title}`,
      kind: 'group-chat',
      x: 400 + windows.value.length * 18,
      y: 96 + windows.value.length * 18,
      width: 560,
      height: 460,
      minWidth: 440,
      minHeight: 320,
      zIndex: maxZIndex.value,
      minimized: false,
      maximized: false,
      active: true,
      resizable: true,
      meta: { groupId, conversationId },
    })
  }

  const openBuddyListWindow = () => {
    const existing = windows.value.find((windowItem) => windowItem.kind === 'buddy-list')
    if (existing) {
      restoreFromTaskbar(existing.id)
      return
    }

    maxZIndex.value += 1
    windows.value.forEach((windowItem) => {
      windowItem.active = false
    })

    windows.value.push({
      id: 'buddy-list',
      title: '我的好友',
      kind: 'buddy-list',
      x: 32,
      y: 36,
      width: 280,
      height: 560,
      minWidth: 250,
      minHeight: 360,
      zIndex: maxZIndex.value,
      minimized: false,
      maximized: false,
      active: true,
      resizable: true,
    })
  }

  const openGroupListWindow = () => {
    const existing = windows.value.find((windowItem) => windowItem.kind === 'group-list')
    if (existing) {
      restoreFromTaskbar(existing.id)
      return
    }

    maxZIndex.value += 1
    windows.value.forEach((windowItem) => {
      windowItem.active = false
    })

    windows.value.push({
      id: 'group-list',
      title: '我的群组',
      kind: 'group-list',
      x: 340,
      y: 60,
      width: 300,
      height: 480,
      minWidth: 260,
      minHeight: 360,
      zIndex: maxZIndex.value,
      minimized: false,
      maximized: false,
      active: true,
      resizable: true,
    })
  }

  const openSettingsWindow = () => {
    const existing = windows.value.find((windowItem) => windowItem.kind === 'settings')
    if (existing) {
      restoreFromTaskbar(existing.id)
      return
    }

    maxZIndex.value += 1
    windows.value.forEach((windowItem) => {
      windowItem.active = false
    })

    windows.value.push({
      id: 'settings-center',
      title: '设置中心',
      kind: 'settings',
      x: 420,
      y: 100,
      width: 460,
      height: 520,
      minWidth: 400,
      minHeight: 420,
      zIndex: maxZIndex.value,
      minimized: false,
      maximized: false,
      active: true,
      resizable: true,
    })
  }

  const openAboutWindow = () => {
    const existing = windows.value.find((windowItem) => windowItem.kind === 'about')
    if (existing) {
      restoreFromTaskbar(existing.id)
      return
    }

    maxZIndex.value += 1
    windows.value.forEach((windowItem) => {
      windowItem.active = false
    })

    windows.value.push({
      id: 'about',
      title: '关于',
      kind: 'about',
      x: 400,
      y: 120,
      width: 480,
      height: 440,
      minWidth: 400,
      minHeight: 360,
      zIndex: maxZIndex.value,
      minimized: false,
      maximized: false,
      active: true,
      resizable: true,
    })
  }

  const updateWindowRect = (
    windowId: string,
    patch: Partial<Pick<WindowState, 'x' | 'y' | 'width' | 'height'>>,
  ) => {
    const target = getWindow(windowId)
    if (!target || target.maximized) {
      return
    }

    if (typeof patch.x === 'number') {
      target.x = Math.max(0, Math.min(patch.x, desktopBounds.width - 120))
    }
    if (typeof patch.y === 'number') {
      target.y = Math.max(0, Math.min(patch.y, desktopBounds.height - 80))
    }
    if (typeof patch.width === 'number') {
      target.width = Math.max(target.minWidth, patch.width)
    }
    if (typeof patch.height === 'number') {
      target.height = Math.max(target.minHeight, patch.height)
    }
  }

  return {
    windows,
    visibleWindows,
    taskbarWindows,
    getWindow,
    focusWindow,
    minimizeWindow,
    closeWindow,
    toggleMaximizeWindow,
    restoreFromTaskbar,
    openChatWindow,
    openGroupChatWindow,
    openBuddyListWindow,
    openGroupListWindow,
    openSettingsWindow,
    openAboutWindow,
    updateWindowRect,
  }
})

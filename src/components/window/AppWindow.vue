<script setup lang="ts">
import { computed } from 'vue'
import { useWindowManagerStore } from '@/stores/windowManager'
import { useDraggableWindow } from '@/composables/useDraggableWindow'
import { useResizableWindow } from '@/composables/useResizableWindow'

interface Props {
  windowId: string
}

const props = defineProps<Props>()

const windowManager = useWindowManagerStore()
const { getWindow } = windowManager

const windowState = computed(() => getWindow(props.windowId))

const style = computed(() => {
  if (!windowState.value) {
    return {}
  }
  return {
    left: `${windowState.value.x}px`,
    top: `${windowState.value.y}px`,
    width: `${windowState.value.width}px`,
    height: `${windowState.value.height}px`,
    zIndex: windowState.value.zIndex,
  }
})

const { startDragging } = useDraggableWindow({
  onMove: ({ deltaX, deltaY }) => {
    if (!windowState.value) {
      return
    }
    windowManager.updateWindowRect(props.windowId, {
      x: windowState.value.x + deltaX,
      y: windowState.value.y + deltaY,
    })
  },
})

const { startResizing } = useResizableWindow({
  onResize: ({ deltaX, deltaY }) => {
    if (!windowState.value) {
      return
    }
    windowManager.updateWindowRect(props.windowId, {
      width: windowState.value.width + deltaX,
      height: windowState.value.height + deltaY,
    })
  },
})

const handleTitlebarPointerDown = (event: PointerEvent) => {
  windowManager.focusWindow(props.windowId)
  startDragging(event)
}

const handleMinimize = () => {
  windowManager.minimizeWindow(props.windowId)
}

const handleMaximize = () => {
  windowManager.toggleMaximizeWindow(props.windowId)
}

const handleClose = () => {
  windowManager.closeWindow(props.windowId)
}

const handleBodyPointerDown = () => {
  windowManager.focusWindow(props.windowId)
}
</script>

<template>
  <div
    v-if="windowState"
    class="window"
    :class="{ 'window--inactive': !windowState.active }"
    :style="style"
  >
    <div class="window__titlebar" @pointerdown="handleTitlebarPointerDown">
      <div class="window__title">{{ windowState.title }}</div>
      <div class="window__controls">
        <button class="window__control-btn" type="button" @click.stop="handleMinimize">_</button>
        <button class="window__control-btn" type="button" @click.stop="handleMaximize">□</button>
        <button class="window__control-btn" type="button" @click.stop="handleClose">×</button>
      </div>
    </div>
    <div class="window__body" @pointerdown="handleBodyPointerDown">
      <slot />
      <div
        v-if="windowState.resizable && !windowState.maximized"
        class="window__resize-handle"
        @pointerdown.stop="startResizing"
      ></div>
    </div>
  </div>
</template>

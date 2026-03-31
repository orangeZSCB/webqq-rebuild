import { onBeforeUnmount } from 'vue'

interface ResizeOptions {
  onResize: (payload: { deltaX: number; deltaY: number }) => void
}

export const useResizableWindow = ({ onResize }: ResizeOptions) => {
  let startX = 0
  let startY = 0

  const handlePointerMove = (event: PointerEvent) => {
    onResize({
      deltaX: event.clientX - startX,
      deltaY: event.clientY - startY,
    })
    startX = event.clientX
    startY = event.clientY
  }

  const stopResizing = () => {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', stopResizing)
  }

  const startResizing = (event: PointerEvent) => {
    startX = event.clientX
    startY = event.clientY
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopResizing)
  }

  onBeforeUnmount(() => {
    stopResizing()
  })

  return { startResizing }
}

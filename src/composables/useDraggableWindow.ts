import { onBeforeUnmount } from 'vue'

interface DragOptions {
  onMove: (payload: { deltaX: number; deltaY: number }) => void
}

export const useDraggableWindow = ({ onMove }: DragOptions) => {
  let startX = 0
  let startY = 0

  const handlePointerMove = (event: PointerEvent) => {
    onMove({
      deltaX: event.clientX - startX,
      deltaY: event.clientY - startY,
    })
    startX = event.clientX
    startY = event.clientY
  }

  const stopDragging = () => {
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerup', stopDragging)
  }

  const startDragging = (event: PointerEvent) => {
    startX = event.clientX
    startY = event.clientY
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopDragging)
  }

  onBeforeUnmount(() => {
    stopDragging()
  })

  return { startDragging }
}

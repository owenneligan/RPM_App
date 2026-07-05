import { useRef, useCallback } from 'react'

interface SwipeOptions {
  threshold?: number
  edgeOnly?: number // swipe-right only fires if touch started within this many px from left edge
}

export function useSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  options: SwipeOptions = {}
) {
  const { threshold = 50, edgeOnly } = options
  const start = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    start.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!start.current) return
      const dx = start.current.x - e.changedTouches[0].clientX
      const dy = Math.abs(start.current.y - e.changedTouches[0].clientY)
      const startX = start.current.x
      start.current = null

      if (Math.abs(dx) < threshold || Math.abs(dx) < dy * 1.2) return

      if (dx > 0) {
        onSwipeLeft?.()
      } else {
        if (edgeOnly !== undefined && startX > edgeOnly) return
        onSwipeRight?.()
      }
    },
    [onSwipeLeft, onSwipeRight, threshold, edgeOnly]
  )

  return { onTouchStart, onTouchEnd }
}

import { useState, useRef, useCallback } from 'react'

export const useStableHover = (
  delay = 100
): {
  isStableHover
  handleHoverStart
  handleHoverEnd
} => {
  const [isStableHover, setIsStableHover] = useState(false)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastPositionRef = useRef<number>(0)

  const handleHoverStart = useCallback(
    (position: number) => {
      // Clear any existing timer
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
      }

      // Only update if position changed significantly
      const positionChanged = Math.abs(position - lastPositionRef.current) > 1
      lastPositionRef.current = position

      if (positionChanged) {
        setIsStableHover(false)
      }

      hoverTimerRef.current = setTimeout(() => {
        setIsStableHover(true)
      }, delay)
    },
    [delay]
  )

  const handleHoverEnd = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
    }
    setIsStableHover(false)
  }, [])

  return {
    isStableHover,
    handleHoverStart,
    handleHoverEnd
  }
}

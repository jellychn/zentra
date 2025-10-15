import { useEffect } from 'react'

export const useCleanUp = ({
  barRef,
  setClicked,
  setHovered,
  setHoverPrice,
  setHoveredSide,
  hoverTimeoutRef,
  clickTimeoutRef
}: {
  barRef
  setClicked
  setHovered
  setHoverPrice
  setHoveredSide
  hoverTimeoutRef
  clickTimeoutRef
}): void => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (barRef.current && !barRef.current.contains(event.target as Node)) {
        setClicked(false)
        setHovered(false)
        setHoverPrice(null)
        setHoveredSide('left')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
    }
  }, [
    barRef,
    clickTimeoutRef,
    hoverTimeoutRef,
    setClicked,
    setHoverPrice,
    setHovered,
    setHoveredSide
  ])
}

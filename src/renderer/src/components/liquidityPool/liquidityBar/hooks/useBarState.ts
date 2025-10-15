import { usePriceLine } from '@renderer/contexts/PriceLineContext'
import { useCallback, useRef, useState } from 'react'

export const useBarState = (
  price: number,
  side: string,
  setHoveredSide: (side: string) => void
): {
  hovered
  clicked
  hoverTimeoutRef
  clickTimeoutRef
  handleMouseEnter
  handleMouseLeave
  handleClick
  setHovered
  setClicked
} => {
  const { setHoverPrice } = usePriceLine()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => {
      if (!clicked) {
        setHovered(true)
        setHoverPrice(price)
        setHoveredSide(side)
      }
    }, 50)
  }, [clicked, price, side, setHoverPrice, setHoveredSide])

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current && clearTimeout(hoverTimeoutRef.current)
    if (!clicked) {
      setHovered(false)
      setHoverPrice(null)
      setHoveredSide('left')
    }
  }, [clicked, setHoverPrice, setHoveredSide])

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setHovered(false)
      setHoverPrice(null)
      setHoveredSide('left')
      setClicked(true)
    },
    [setHoverPrice, setHoveredSide]
  )

  return {
    hovered,
    clicked,
    hoverTimeoutRef,
    clickTimeoutRef,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
    setHovered,
    setClicked
  }
}

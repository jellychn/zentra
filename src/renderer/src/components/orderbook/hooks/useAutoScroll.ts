import { RefObject, useEffect, useRef } from 'react'

export const useAutoScroll = (showFullOrderBook: boolean): RefObject<HTMLDivElement | null> => {
  const currentPriceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentPriceRef.current) {
      currentPriceRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, [showFullOrderBook])

  return currentPriceRef
}

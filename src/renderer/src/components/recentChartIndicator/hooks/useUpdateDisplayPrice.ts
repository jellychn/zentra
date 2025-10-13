import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { useEffect } from 'react'

export const useUpdateDisplayPrice = ({
  displayPrice,
  setDisplayPrice
}: {
  displayPrice
  setDisplayPrice
}): void => {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { lastPrice = 0 } = exchangeData || {}

  useEffect(() => {
    if (lastPrice !== displayPrice) {
      setDisplayPrice(lastPrice)
    }
  }, [lastPrice, displayPrice])
}

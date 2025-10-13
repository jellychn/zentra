import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { useEffect } from 'react'

export const useUpdateLastCandle = ({ updateLastCandle }: { updateLastCandle }): void => {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { candles = [], lastPrice = 0 } = exchangeData || {}

  useEffect(() => {
    if (candles.length > 0 && lastPrice > 0) {
      updateLastCandle()
    }
  }, [lastPrice, candles])
}

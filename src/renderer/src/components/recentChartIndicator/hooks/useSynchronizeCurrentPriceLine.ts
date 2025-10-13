import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { useEffect } from 'react'

export const useSynchronizeCurrentPriceLine = ({
  candlestickSeriesRef,
  lineSeriesRef,
  updateLastCandle
}: {
  candlestickSeriesRef
  lineSeriesRef
  updateLastCandle
}): void => {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { candles = [], lastPrice = 0 } = exchangeData || {}

  useEffect(() => {
    if (!candlestickSeriesRef.current || !lineSeriesRef.current || !candles.length) return

    const lastCandle = candles[candles.length - 1]

    if (Math.abs(lastCandle.close - lastPrice) > 0.000001) {
      lineSeriesRef.current.setData([
        {
          time: lastCandle.time,
          value: lastPrice
        }
      ])

      updateLastCandle()
    }
  }, [lastPrice, candles])
}

import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { useEffect } from 'react'

export const useUpdateCandles = ({
  candlestickSeriesRef,
  lineSeriesRef,
  isUserInteracting,
  updateLastCandle,
  setViewportToRecent,
  previousDataLength,
  setPreviousDataLength
}: {
  candlestickSeriesRef
  lineSeriesRef
  isUserInteracting
  updateLastCandle
  setViewportToRecent
  previousDataLength
  setPreviousDataLength
}): void => {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { candles = [], lastPrice = 0 } = exchangeData || {}

  useEffect(() => {
    if (!candlestickSeriesRef.current || !candles.length) return

    try {
      const currentLength = candles.length
      const lastCandle = candles[candles.length - 1]

      // Always update the data
      candlestickSeriesRef.current.setData(candles)

      // Update current price line with lastPrice - ensure perfect alignment
      if (lineSeriesRef.current) {
        lineSeriesRef.current.setData([
          {
            time: lastCandle.time,
            value: lastPrice
          }
        ])
      }

      // Update the last candle with current price for perfect alignment
      updateLastCandle()

      // Only auto-scroll if user isn't interacting AND we have new data
      if (!isUserInteracting && currentLength > previousDataLength) {
        setTimeout(() => {
          setViewportToRecent()
        }, 100)
      }

      setPreviousDataLength(currentLength)
    } catch (error) {
      console.error('Chart data update error:', error)
    }
  }, [candles, lastPrice, isUserInteracting, previousDataLength])
}

export const useUpdateCandlesRef = ({
  currentCandlestickDataRef
}: {
  currentCandlestickDataRef
}): void => {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { candles = [] } = exchangeData || {}

  useEffect(() => {
    currentCandlestickDataRef.current = candles
  }, [candles])
}

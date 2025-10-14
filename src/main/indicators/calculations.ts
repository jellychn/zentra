import { ATR } from 'technicalindicators'

export const calculateATR = (
  candles: Array<{ high: number; low: number; close: number }>,
  period: number = 14
): number | null => {
  if (candles.length < period + 1) {
    return null
  }

  const highs = candles.map((candle) => candle.high)
  const lows = candles.map((candle) => candle.low)
  const closes = candles.map((candle) => candle.close)

  try {
    const atrValues = ATR.calculate({
      high: highs,
      low: lows,
      close: closes,
      period: period
    })

    if (
      atrValues.length === 0 ||
      atrValues[atrValues.length - 1] === null ||
      atrValues[atrValues.length - 1] === undefined
    ) {
      return null
    }

    return atrValues[atrValues.length - 1]
  } catch (error) {
    console.error('Error calculating ATR:', error)
    return null
  }
}

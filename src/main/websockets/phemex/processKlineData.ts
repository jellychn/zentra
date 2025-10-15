// {
//   dts: 1760119792301257500,
//   kline_p: [
//     [
//       1760119740,
//       60,
//       '0.7774',
//       '0.7768',
//       '0.7768',
//       '0.7768',
//       '0.7768',
//       '238023.07',
//       '184896.320776'
//     ],
//     [
//       1760119680,
//       60,
//       '0.7762',
//       '0.7774',
//       '0.7774',
//       '0.7774',
//       '0.7774',
//       '234415.8',
//       '182234.84292'
//     ]
//   ],
//   mts: 1760119792300501500,
//   sequence: 25634744146,
//   symbol: 'ADAUSDT',
//   type: 'incremental'
// }

import { processKlineEntry, Resolution } from '../../api/phemex/klines'
import { DataStoreType, mainDataStore } from '../../data/dataStore'
import { ProcessedCandlestick } from '../../data/types'
import { mainStateStore, StateType } from '../../state/stateStore'
import { MessageType } from './types'

export interface KlineMessage {
  dts: number
  kline_p: KlineEntry[]
  mts: number
  sequence: number
  symbol: string
  type: 'incremental' | 'snapshot'
}

type KlineEntry = [
  number, // timestamp (1760119740)
  number, // interval in seconds (60)
  string, // open price ('0.7774')
  string, // high price ('0.7768')
  string, // low price ('0.7768')
  string, // close price ('0.7768')
  string, // volume in base asset? ('0.7768')
  string, // volume ('238023.07')
  string // turnover? ('184896.320776')
]

export const processKlineData = (data: KlineMessage): void => {
  const symbol = data.symbol
  const klines = data.kline_p

  if (klines.length === 0) return

  const interval = klines[0][1]
  const processedCandlesticks: ProcessedCandlestick[] = []

  for (let i = 0; i < klines.length; i++) {
    const entry = klines[i]
    const processedEntry = processKlineEntry(entry)
    processedCandlesticks.push(processedEntry)
  }

  let dataType: DataStoreType
  switch (interval) {
    case Resolution.MINUTE_1:
      dataType = DataStoreType.CANDLES_1M
      break
    case Resolution.MINUTE_5:
      dataType = DataStoreType.CANDLES_5M
      break
    case Resolution.MINUTE_15:
      dataType = DataStoreType.CANDLES_15M
      break
    case Resolution.HOUR_4:
      dataType = DataStoreType.CANDLES_4H
      break
    case Resolution.DAY_1:
      dataType = DataStoreType.CANDLES_1D
      break
    case Resolution.MONTH_1:
      dataType = DataStoreType.CANDLES_1MON
      break
    default:
      console.warn(`Unknown interval ${interval}, defaulting to 1M`)
      dataType = DataStoreType.CANDLES_1M
  }

  const existingCandles =
    (mainDataStore.getByDataType(symbol, dataType) as ProcessedCandlestick[]) || []
  const type = data.type

  let updatedCandles: ProcessedCandlestick[] = []

  if (type === MessageType.SNAPSHOT) {
    updatedCandles = mergeCandlesticks(existingCandles, processedCandlesticks)
  } else {
    updatedCandles = mergeCandlesticks(existingCandles, processedCandlesticks)
  }

  mainDataStore.updateDataStore({
    symbol: symbol,
    dataType: dataType,
    data: updatedCandles
  })

  processKlineMetrics(interval, updatedCandles)
}

function mergeCandlesticks(
  existing: ProcessedCandlestick[],
  updates: ProcessedCandlestick[]
): ProcessedCandlestick[] {
  const timestampMap = new Map<number, ProcessedCandlestick>()

  // Add all existing candles
  existing.forEach((candle) => {
    timestampMap.set(candle.time, candle)
  })

  // Update or add new candles
  updates.forEach((candle) => {
    timestampMap.set(candle.time, candle)
  })

  // Convert to array and sort by timestamp in ascending order (oldest first)
  return Array.from(timestampMap.values()).sort((a, b) => a.time - b.time)
}

// Volume sentiment analysis functions
interface VolumeSentiment {
  sentiment: 'positive' | 'negative' | 'neutral'
  strength: number
  volumePressure: number
  turnover: number
}

function analyzeVolumeSentiment(candle: ProcessedCandlestick): VolumeSentiment {
  const priceChange = candle.close - candle.open
  const priceChangePercent = (priceChange / candle.open) * 100

  // Calculate turnover (use provided turnover or calculate from volume and average price)
  const averagePrice = (candle.high + candle.low + candle.close) / 3
  const turnover = candle.turnover || candle.volume * averagePrice

  if (priceChange > 0 && candle.volume > 0) {
    // Bullish: price up with volume = positive volume
    return {
      sentiment: 'positive',
      strength: Math.abs(priceChangePercent),
      volumePressure: candle.volume * priceChangePercent,
      turnover
    }
  } else if (priceChange < 0 && candle.volume > 0) {
    // Bearish: price down with volume = negative volume
    return {
      sentiment: 'negative',
      strength: Math.abs(priceChangePercent),
      volumePressure: candle.volume * priceChangePercent, // Will be negative
      turnover
    }
  } else {
    // Neutral or unclear
    return {
      sentiment: 'neutral',
      strength: 0,
      volumePressure: 0,
      turnover
    }
  }
}

function calculateCumulativeSentiment(candles: ProcessedCandlestick[]): {
  overallSentiment: 'positive' | 'negative' | 'neutral'
  cumulativePressure: number
  totalTurnover: number
  avgTurnover: number
} {
  let cumulativePressure = 0
  let totalTurnover = 0
  let positiveCount = 0
  let negativeCount = 0

  candles.forEach((candle) => {
    const sentiment = analyzeVolumeSentiment(candle)
    cumulativePressure += sentiment.volumePressure
    totalTurnover += sentiment.turnover

    if (sentiment.sentiment === 'positive') positiveCount++
    if (sentiment.sentiment === 'negative') negativeCount++
  })

  const avgTurnover = candles.length > 0 ? totalTurnover / candles.length : 0

  let overallSentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
  if (positiveCount > negativeCount && cumulativePressure > 0) {
    overallSentiment = 'positive'
  } else if (negativeCount > positiveCount && cumulativePressure < 0) {
    overallSentiment = 'negative'
  }

  return {
    overallSentiment,
    cumulativePressure,
    totalTurnover,
    avgTurnover
  }
}

const processKlineMetrics = (interval: number, candles: ProcessedCandlestick[]): void => {
  const state = mainStateStore.getState()
  const settings = state[StateType.SETTINGS]
  const selectedSymbol = settings.selectedSymbol
  const selectedPriceLineTimeframe = settings.selectedPriceLineTimeframe

  // Calculate overall volume sentiment
  const cumulativeSentiment = calculateCumulativeSentiment(candles)

  if (interval === 60 && selectedPriceLineTimeframe !== '1 MONTH') {
    const priceFrequency: { [price: number]: number } = {}
    const volumeProfile: { [price: number]: number } = {}
    const volumeSentimentByPrice: {
      [price: number]: { positive: number; negative: number; turnover: number }
    } = {}
    const priceAgo = candles[candles.length - 5].close

    if (candles.length > 0) {
      // 60 = 1h
      // 720 = 12h
      let timeframe = 720

      if (selectedPriceLineTimeframe === 'ZOOM') {
        timeframe = 60
      }

      const recentCandles = candles.slice(-timeframe)

      recentCandles.forEach((candle) => {
        const priceLevels = generateKeyPriceLevels(candle.low, candle.high)
        const sentiment = analyzeVolumeSentiment(candle)
        const volumePerLevel = candle.volume / priceLevels.length
        const turnoverPerLevel = sentiment.turnover / priceLevels.length

        priceLevels.forEach((price) => {
          priceFrequency[price] = (priceFrequency[price] || 0) + 1

          // Accumulate volume with sentiment
          if (!volumeSentimentByPrice[price]) {
            volumeSentimentByPrice[price] = { positive: 0, negative: 0, turnover: 0 }
          }

          if (sentiment.sentiment === 'positive') {
            volumeSentimentByPrice[price].positive += volumePerLevel
          } else if (sentiment.sentiment === 'negative') {
            volumeSentimentByPrice[price].negative += volumePerLevel
          }
          volumeSentimentByPrice[price].turnover += turnoverPerLevel
        })
      })

      // Calculate net volume for each price level
      Object.keys(volumeSentimentByPrice).forEach((price) => {
        const netVolume =
          volumeSentimentByPrice[price].positive - volumeSentimentByPrice[price].negative
        volumeProfile[price] = netVolume
      })
    }

    mainDataStore.updateMetrics({
      symbol: selectedSymbol,
      data: {
        priceFrequency,
        volumeProfile,
        volumeSentimentByPrice,
        cumulativeVolumeSentiment: cumulativeSentiment,
        agoPrice: priceAgo
      }
    })
  }

  if (interval === 86400) {
    if (selectedPriceLineTimeframe === '1 MONTH') {
      const priceFrequency: { [price: number]: number } = {}
      const volumeProfile: { [price: number]: number } = {}
      const volumeSentimentByPrice: {
        [price: number]: { positive: number; negative: number; turnover: number }
      } = {}

      if (candles.length > 0) {
        const timeframe = 30

        const recentCandles = candles.slice(-timeframe)

        recentCandles.forEach((candle) => {
          const priceLevels = generateKeyPriceLevels(candle.low, candle.high)
          const sentiment = analyzeVolumeSentiment(candle)
          const volumePerLevel = candle.volume / priceLevels.length
          const turnoverPerLevel = sentiment.turnover / priceLevels.length

          priceLevels.forEach((price) => {
            priceFrequency[price] = (priceFrequency[price] || 0) + 1

            if (!volumeSentimentByPrice[price]) {
              volumeSentimentByPrice[price] = { positive: 0, negative: 0, turnover: 0 }
            }

            if (sentiment.sentiment === 'positive') {
              volumeSentimentByPrice[price].positive += volumePerLevel
            } else if (sentiment.sentiment === 'negative') {
              volumeSentimentByPrice[price].negative += volumePerLevel
            }
            volumeSentimentByPrice[price].turnover += turnoverPerLevel
          })
        })

        // Calculate net volume for each price level
        Object.keys(volumeSentimentByPrice).forEach((price) => {
          const netVolume =
            volumeSentimentByPrice[price].positive - volumeSentimentByPrice[price].negative
          volumeProfile[price] = netVolume
        })
      }

      mainDataStore.updateMetrics({
        symbol: selectedSymbol,
        data: {
          priceFrequency,
          volumeProfile,
          volumeSentimentByPrice,
          cumulativeVolumeSentiment: cumulativeSentiment
        }
      })
    }

    const lastCandle = candles[candles.length - 1]
    const high = lastCandle.high
    const low = lastCandle.low

    const max1D = high
    const min1D = low

    mainDataStore.updateMetrics({
      symbol: selectedSymbol,
      data: {
        max1D,
        min1D,
        cumulativeVolumeSentiment: cumulativeSentiment
      }
    })
  }

  if (interval === 2592000) {
    const lastCandle = candles[candles.length - 1]
    const high = lastCandle.high
    const low = lastCandle.low

    const max1Mon = high
    const min1Mon = low

    mainDataStore.updateMetrics({
      symbol: selectedSymbol,
      data: {
        max1Mon,
        min1Mon,
        cumulativeVolumeSentiment: cumulativeSentiment
      }
    })
  }
}

function generateKeyPriceLevels(low: number, high: number): number[] {
  const range = high - low
  const keyLevels = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]

  return keyLevels.map((level) => {
    const price = low + range * level
    return roundToSignificant(price, 4)
  })
}

function roundToSignificant(num: number, significantDigits: number): number {
  if (num === 0) return 0
  const magnitude = Math.floor(Math.log10(Math.abs(num)))
  const scale = Math.pow(10, significantDigits - magnitude - 1)
  return Math.round(num * scale) / scale
}

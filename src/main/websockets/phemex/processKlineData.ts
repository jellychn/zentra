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

import { DataStoreType, mainDataStore } from '../../data/dataStore'
import { ProcessedCandlestick } from '../../data/types'
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
    case 60:
      dataType = DataStoreType.CANDLES_1M
      break
    case 900:
      dataType = DataStoreType.CANDLES_15M
      break
    case 86400:
      dataType = DataStoreType.CANDLES_1D
      break
    default:
      console.warn(`Unknown interval ${interval}, defaulting to 1M`)
      dataType = DataStoreType.CANDLES_1M
  }

  const existingData = mainDataStore.getDataStore().symbolData.get(symbol)
  const existingCandles = (existingData?.[dataType] as ProcessedCandlestick[] | undefined) || []
  const type = data.type

  let updatedCandles: ProcessedCandlestick[]

  if (type === MessageType.SNAPSHOT) {
    updatedCandles = processedCandlesticks
  } else {
    updatedCandles = mergeCandlesticks(existingCandles, processedCandlesticks)
  }

  updatedCandles.sort((a, b) => a.time - b.time)

  mainDataStore.updateDataStore({
    symbol: symbol,
    dataType: dataType,
    data: updatedCandles
  })
}

function processKlineEntry(entry: KlineEntry): ProcessedCandlestick {
  return {
    time: entry[0],
    // interval: entry[1],
    open: parseFloat(entry[3]),
    high: parseFloat(entry[4]),
    low: parseFloat(entry[5]),
    close: parseFloat(entry[6])
    // volume: parseFloat(entry[7])
  }
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

  return Array.from(timestampMap.values())
}

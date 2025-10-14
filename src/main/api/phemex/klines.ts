import { ProcessedCandlestick } from '../../data/types'
import { apiCall } from '../api'

const enum Resolution {
  MINUTE_1 = 60,
  MINUTE_5 = 300,
  MINUTE_15 = 900,
  MINUTE_30 = 1800,
  HOUR_1 = 3600,
  HOUR_4 = 14400,
  DAY_1 = 86400,
  WEEK_1 = 604800,
  MONTH_1 = 2592000,
  SEASON_1 = 7776000,
  YEAR_1 = 31104000
}

export type KlineEntry = [
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

async function getCandles(
  symbol: string,
  resolution: Resolution,
  limit = 1000
): Promise<ProcessedCandlestick[]> {
  const data = await apiCall('/exchange/public/md/v2/kline/last', {
    symbol: symbol,
    resolution: resolution,
    limit: limit
  })

  const rows = data.data?.rows || []

  const candles = rows.map((row) => processKlineEntry(row))

  candles.sort((a, b) => a.time - b.time)

  return candles
}

function processKlineEntry(entry: KlineEntry): ProcessedCandlestick {
  return {
    time: entry[0],
    interval: entry[1],
    open: parseFloat(entry[3]),
    high: parseFloat(entry[4]),
    low: parseFloat(entry[5]),
    close: parseFloat(entry[6]),
    volume: parseFloat(entry[7]),
    turnover: parseFloat(entry[8])
  }
}

export { Resolution, getCandles, processKlineEntry }

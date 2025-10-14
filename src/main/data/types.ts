import { Side } from '../../shared/types'

export interface ProcessedOrderBookLevel {
  price: number
  size: number
}

export interface ProcessedOrderBook {
  bids: { [price: number]: number }
  asks: { [price: number]: number }
}

export interface ProcessedTrade {
  timestamp: number
  side: Side
  price: number
  size: number
}

export interface ProcessedCandlestick {
  time: number // timestamp (seconds)
  interval: number // interval (seconds)
  open: number // '0.7774'
  high: number // '0.7768'
  low: number // '0.7768'
  close: number // '0.7768'
  volume: number // '238023.07'
  turnover: number
}

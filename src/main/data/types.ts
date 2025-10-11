import { Side } from '../../shared/types'

export interface ProcessedOrderBookLevel {
  price: number
  quantity: number
}

export interface ProcessedOrderBook {
  bids: { [price: number]: number }
  asks: { [price: number]: number }
}

export interface ProcessedTrade {
  timestamp: number
  side: Side
  price: number
  quantity: number
}

export interface ProcessedCandlestick {
  timestamp: number // timestamp in milliseconds
  interval: number // interval (seconds)
  open: number // '0.7774'
  high: number // '0.7768'
  low: number // '0.7768'
  close: number // '0.7768'
  volume: number // '238023.07'
}

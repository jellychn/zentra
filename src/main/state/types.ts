import { ProcessedCandlestick } from '../data/types'
import { Order } from '../db/dbOrders'
import { Trade } from '../db/dbTrades'

export interface ExchangeData {
  orderbook: object
  trades: object[]
  lastPrice: number
  candles: ProcessedCandlestick[]
}

export interface UserTrades {
  orders: Order[]
  positions: Trade[]
}

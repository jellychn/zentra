import { AppState } from '../main/state/stateStore'

export type { AppState }

export enum Environment {
  DEVELOPMENT = 'Development',
  PRODUCTION = 'Production'
}

export enum Exchanges {
  BINANCE = 'Binance',
  PHEMEX = 'Phemex'
}

export enum TradingMode {
  REAL = 'Real',
  PAPER = 'Paper'
}

export enum MessageSenderType {
  CREATE_ORDER = 'create_order',
  CHANGE_LIQUIDITY_POOL_TIMEFRAME = 'change_liquidity_pool_timeframe'
}

export const enum MessageReceiverType {
  NOTIFY = 'notify'
}

export enum Side {
  BUY = 'Buy',
  SELL = 'Sell'
}

export enum PosSide {
  LONG = 'Long',
  SHORT = 'Short'
}

export enum OrderType {
  MARKET = 'Market',
  LIMIT = 'Limit',
  STOP = 'Stop',
  MARKET_IF_TOUCHED = 'MarketIfTouched',
  STOP_LIMIT = 'StopLimit',
  LIMIT_IF_TOUCHED = 'LimitIfTouched'
}

export enum TradeStatus {
  OPEN = 'Open',
  CLOSED = 'Closed'
}

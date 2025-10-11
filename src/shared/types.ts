import { AppState } from '../main/state/stateStore'

export const MAKER_FEE = 0.0001
export const TAKER_FEE = 0.0006

export type { AppState }

export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production'
}

export enum Exchanges {
  BINANCE = 'binance',
  PHEMEX = 'phemex'
}

export enum Side {
  BUY = 'Buy',
  SELL = 'Sell'
}

export enum TradingMode {
  REAL = 'Real',
  PAPER = 'Paper'
}

export enum MessageType {
  CREATE_ORDER = 'create_order'
}

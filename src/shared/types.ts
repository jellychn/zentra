import { AppState } from '../main/state/stateStore'

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

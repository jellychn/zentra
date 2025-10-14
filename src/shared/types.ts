import { AppState } from '../main/state/stateStore'

export type { AppState }

export enum Environment {
  DEVELOPMENT = 'Development',
  PRODUCTION = 'Production'
}

export enum TIMEFRAME {
  MINUTE_1 = '1M',
  MINUTE_5 = '5M',
  MINUTE_15 = '15M',
  MINUTE_30 = '30M',
  HOUR_1 = '1H',
  HOUR_4 = '4H',
  DAY_1 = '1D',
  WEEK_1 = '1W',
  MONTH_1 = '1MON',
  SEASON_1 = '1SEA',
  YEAR_1 = '1Y'
}

export enum PRICE_LINE_TIMEFRAME {}

export enum Exchanges {
  BINANCE = 'Binance',
  BYBIT = 'Bybit',
  OKX = 'OKX',
  KRAKEN = 'Kraken',
  KUCOIN = 'KuCoin',
  PHEMEX = 'Phemex'
}

export enum TradingMode {
  REAL = 'Real',
  PAPER = 'Paper'
}

export enum MessageSenderType {
  CREATE_ORDER = 'create_order',
  CHANGE_LIQUIDITY_POOL_TIMEFRAME = 'change_liquidity_pool_timeframe',
  CHANGE_CANDLE_TIMEFRAME = 'change_candle_timeframe',
  CHANGE_PRICE_LINE_TIMEFRAME = 'change_price_line_timeframe'
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

import { EventEmitter } from 'events'
import { Environment, Exchanges, TIMEFRAME, TradingMode } from '../../shared/types'
import config from '../config/config'
import { initSymbolMetrics, SymbolMetrics } from '../data/dataStore'
import { UserSettings, userSettingsState } from '../db/dbUserSettings'
import { ExchangeData, UserTrades } from './types'
import { Trade } from '../db/dbTrades'
import { Order } from '../db/dbOrders'

export enum StateType {
  USER = 'user',
  USER_SETTINGS = 'userSettings',
  USER_TRADES = 'userTrades',
  SETTINGS = 'settings',
  EXCHANGE_DATA = 'exchangeData',
  METRICS = 'metrics'
}

export interface AppState {
  [StateType.USER]: {
    id: string
  }
  [StateType.USER_SETTINGS]: UserSettings
  [StateType.USER_TRADES]: UserTrades
  [StateType.SETTINGS]: {
    environment: Environment
    selectedExchange: string
    selectedSymbol: string
    tradingMode: TradingMode
    selectedCandleTimeframe: string
    selectedLiquidityPoolTimeframe: string
    selectedAtrTimeframe: string
    selectedPriceLineTimeframe: string
  }
  [StateType.EXCHANGE_DATA]: ExchangeData
  [StateType.METRICS]: SymbolMetrics
}

class MainStateStore extends EventEmitter {
  private state: AppState
  private isDestroyed = false

  constructor() {
    super()
    this.state = this.initializeState()
  }

  private initializeState(): AppState {
    const selectedExchange = Exchanges.PHEMEX

    return {
      user: {
        id: '1'
      },
      userSettings: { ...userSettingsState },
      userTrades: {
        orders: [],
        positions: []
      },
      settings: {
        environment: config.env,
        selectedExchange,
        selectedSymbol: 'ADAUSDT',
        tradingMode: TradingMode.PAPER,
        selectedCandleTimeframe: TIMEFRAME.MINUTE_1,
        selectedLiquidityPoolTimeframe: TIMEFRAME.MINUTE_15,
        selectedAtrTimeframe: TIMEFRAME.MINUTE_15,
        selectedPriceLineTimeframe: '1 DAY'
      },
      exchangeData: {
        lastPrice: 0,
        orderbook: {},
        trades: [],
        candles: []
      },
      metrics: initSymbolMetrics
    }
  }

  getState(): AppState {
    return this.state
  }

  setState(newState: Partial<AppState>): void {
    if (this.isDestroyed) {
      console.log('StateStore: Ignoring setState - store is destroyed')
      return
    }

    this.state = { ...this.state, ...newState }
    this.emit('state-changed', this.state)
  }

  update<T extends keyof AppState>(stateType: T, data: Partial<AppState[T]>): void {
    if (this.isDestroyed) {
      console.log('StateStore: Ignoring update - store is destroyed')
      return
    }

    this.state[stateType] = { ...this.state[stateType], ...data } as AppState[T]

    this.emit(`${String(stateType)}-changed`, this.state[stateType])
    this.emit('state-changed', this.state)
  }

  updateUserProducts(data: Trade[]): void {
    this.state[StateType.USER_TRADES] = {
      ...this.state[StateType.USER_TRADES],
      positions: [...this.state[StateType.USER_TRADES].positions, ...data]
    }

    this.emit('state-changed', this.state)
  }

  updateUserOrders(data: Order[]): void {
    this.state[StateType.USER_TRADES] = {
      ...this.state[StateType.USER_TRADES],
      orders: [...this.state[StateType.USER_TRADES].orders, ...data]
    }

    this.emit('state-changed', this.state)
  }

  destroy(): void {
    this.isDestroyed = true
    this.removeAllListeners()
    console.log('StateStore: Store destroyed')
  }

  reinitialize(): void {
    if (this.isDestroyed) {
      console.log('StateStore: Cannot reinitialize - store is destroyed')
      return
    }

    this.state = this.initializeState()
    this.emit('state-changed', this.state)
  }
}

export const mainStateStore = new MainStateStore()

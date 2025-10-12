import { EventEmitter } from 'events'
import { Environment, Exchanges, TradingMode } from '../../shared/types'
import config from '../config/config'
import { SymbolMetrics } from '../data/dataStore'
import { UserSettings, userSettingsState } from '../db/dbUserSettings'
import { ProcessedCandlestick } from '../data/types'

interface ExchangeData {
  orderbook: object
  trades: object[]
  lastPrice: number
  candles: ProcessedCandlestick[]
}

export interface AppState {
  user: {
    id: string
  }
  userSettings: UserSettings
  settings: {
    environment: Environment
    selectedExchange: string
    selectedSymbol: string
    tradingMode: TradingMode
    selectedCandleTimeframe: string
  }
  exchangeData: ExchangeData
  metrics: SymbolMetrics
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
      settings: {
        environment: config.env,
        selectedExchange,
        selectedSymbol: 'BTCUSDT',
        tradingMode: TradingMode.PAPER,
        selectedCandleTimeframe: '1M'
      },
      exchangeData: {
        lastPrice: 0,
        orderbook: {},
        trades: [],
        candles: []
      },
      metrics: {
        buyVolume: 0,
        sellVolume: 0,
        tradeLiquidity: {},
        bidVolume: 0,
        askVolume: 0
      }
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

  updateSettings(settings: Partial<AppState['settings']>): void {
    if (this.isDestroyed) {
      console.log('StateStore: Ignoring updateSettings - store is destroyed')
      return
    }

    this.state.settings = { ...this.state.settings, ...settings }

    this.emit('settings-changed', this.state.settings)
    this.emit('state-changed', this.state)
  }

  updateExchangeData(data: Partial<AppState['exchangeData']>): void {
    if (this.isDestroyed) {
      console.log('StateStore: Ignoring updateExchangeData - store is destroyed')
      return
    }

    this.state.exchangeData = { ...this.state.exchangeData, ...data }
    this.emit('exchange-data-changed', this.state.exchangeData)
    this.emit('state-changed', this.state)
  }

  updateMetrics(data: Partial<AppState['metrics']>): void {
    if (this.isDestroyed) {
      console.log('StateStore: Ignoring updateMetrics - store is destroyed')
      return
    }

    this.state.metrics = { ...this.state.metrics, ...data }
    this.emit('metrics-changed', this.state.metrics)
    this.emit('state-changed', this.state)
  }

  // Add destroy method
  destroy(): void {
    this.isDestroyed = true
    this.removeAllListeners() // Clean up all event listeners
    console.log('StateStore: Store destroyed')
  }

  // Optional: Public method to reinitialize if needed
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

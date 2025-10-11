import { EventEmitter } from 'events'
import { Environment, Exchanges } from '../../shared/types'
import config from '../config/config'
import { SymbolMetrics } from '../data/dataStore'

interface ExchangeData {
  orderbook: object
  trades: object[]
  lastPrice: number
}

export interface AppState {
  settings: {
    environment: Environment
    selectedExchange: string
    selectedSymbol: string
  }
  exchangeData: ExchangeData
  metrics: SymbolMetrics
}

class MainStateStore extends EventEmitter {
  private state: AppState

  constructor() {
    super()
    this.state = this.initializeState()
  }

  private initializeState(): AppState {
    const selectedExchange = Exchanges.PHEMEX

    return {
      settings: {
        environment: config.env,
        selectedExchange,
        selectedSymbol: 'BTCUSDT'
      },
      exchangeData: {
        lastPrice: 0,
        orderbook: {},
        trades: []
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
    this.state = { ...this.state, ...newState }
    this.emit('state-changed', this.state)
  }

  updateSettings(settings: Partial<AppState['settings']>): void {
    this.state.settings = { ...this.state.settings, ...settings }

    this.emit('settings-changed', this.state.settings)
    this.emit('state-changed', this.state)
  }

  updateExchangeData(data: Partial<AppState['exchangeData']>): void {
    this.state.exchangeData = { ...this.state.exchangeData, ...data }
    this.emit('exchange-data-changed', this.state.exchangeData)
    this.emit('state-changed', this.state)
  }

  updateMetrics(data: Partial<AppState['metrics']>): void {
    this.state.metrics = { ...this.state.metrics, ...data }
    this.emit('metrics-changed', this.state.metrics)
    this.emit('state-changed', this.state)
  }

  // Optional: Public method to reinitialize if needed
  reinitialize(): void {
    this.state = this.initializeState()
    this.emit('state-changed', this.state)
  }
}

export const mainStateStore = new MainStateStore()

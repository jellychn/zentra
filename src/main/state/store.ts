import { EventEmitter } from 'events'
import { Environment } from '../../shared/shared'
import config, { ExchangeConfig } from '../config/config'

interface AppState {
  settings: {
    notifications: boolean
    environment: Environment
    selectedExchange?: string
  }
  connections: {
    [exchange: string]: {
      connected: boolean
      lastUpdate: number
      config: ExchangeConfig
    }
  }
  data: {
    [key: string]: unknown
  }
}

class MainStateStore extends EventEmitter {
  private state: AppState = {
    settings: {
      notifications: true,
      environment: config.env
    },
    connections: {},
    data: {}
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

  selectExchange(exchange: string): void {
    const exchangeConfig = this.getExchangeConfig(exchange)

    this.state.settings.selectedExchange = exchange

    this.state.connections[exchange] = {
      ...this.state.connections[exchange],
      connected: false,
      lastUpdate: Date.now(),
      config: exchangeConfig
    }

    this.emit('exchange-selected', exchange, exchangeConfig)
    this.emit('settings-changed', this.state.settings)
    this.emit('state-changed', this.state)
  }

  updateConnection(exchange: string, status: Partial<AppState['connections'][string]>): void {
    this.state.connections[exchange] = {
      ...this.state.connections[exchange],
      ...status
    }
    this.emit('connection-changed', exchange, this.state.connections[exchange])
    this.emit('state-changed', this.state)
  }

  // Get configuration for a specific exchange
  getExchangeConfig(exchange: string): ExchangeConfig {
    const exchangeSettings = config.exchanges[exchange]
    if (!exchangeSettings) {
      throw new Error(`Exchange ${exchange} not configured`)
    }

    return config.isProd ? exchangeSettings.production : exchangeSettings.development
  }

  // Get current selected exchange configuration
  getCurrentExchangeConfig(): ExchangeConfig | null {
    const { selectedExchange } = this.state.settings
    return selectedExchange ? this.getExchangeConfig(selectedExchange) : null
  }

  // Switch environment (dev/prod)
  switchEnvironment(env: Environment): void {
    this.state.settings.environment = env

    // Update all connection configurations
    Object.keys(this.state.connections).forEach((exchange) => {
      const newConfig = this.getExchangeConfig(exchange)
      this.state.connections[exchange].config = newConfig
    })

    this.emit('environment-changed', env)
    this.emit('settings-changed', this.state.settings)
    this.emit('state-changed', this.state)
  }

  // Persistence
  async saveState(): Promise<void> {
    // Save to file or database - include selected exchange and settings
  }

  async loadState(): Promise<void> {
    // Load from file or database
  }
}

export const mainStateStore = new MainStateStore()

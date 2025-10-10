import dotenv from 'dotenv'
import { Environment, Exchanges } from '../../shared/shared'

dotenv.config()

export interface ExchangeConfig {
  restBase: string
  wsBase: string
  apiKey?: string
  apiSecret?: string
}

interface Config {
  env: Environment
  isDev: boolean
  isProd: boolean
  exchanges: {
    [exchange: string]: {
      development: ExchangeConfig
      production: ExchangeConfig
    }
  }
}

const config: Config = {
  env: (process.env.ENVIRONMENT as Environment) || Environment.DEVELOPMENT,
  get isDev() {
    return this.env === Environment.DEVELOPMENT
  },
  get isProd() {
    return this.env === Environment.PRODUCTION
  },
  exchanges: {
    [Exchanges.PHEMEX]: {
      development: {
        restBase: process.env.DEV_PHEMEX_REST_BASE || 'https://testnet-api.phemex.com',
        wsBase: process.env.DEV_PHEMEX_WS_BASE || 'wss://testnet-api.phemex.com/ws',
        apiKey: process.env.DEV_PHEMEX_API_KEY,
        apiSecret: process.env.DEV_PHEMEX_API_SECRET
      },
      production: {
        restBase: process.env.PROD_PHEMEX_REST_BASE || 'https://api.phemex.com',
        wsBase: process.env.PROD_PHEMEX_WS_BASE || 'wss://ws.phemex.com',
        apiKey: process.env.PROD_PHEMEX_API_KEY,
        apiSecret: process.env.PROD_PHEMEX_API_SECRET
      }
    },
    [Exchanges.BINANCE]: {
      development: {
        restBase: process.env.DEV_BINANCE_REST_BASE || 'https://testnet.binance.vision',
        wsBase: process.env.DEV_BINANCE_WS_BASE || 'wss://testnet.binance.vision/ws',
        apiKey: process.env.DEV_BINANCE_API_KEY,
        apiSecret: process.env.DEV_BINANCE_API_SECRET
      },
      production: {
        restBase: process.env.PROD_BINANCE_REST_BASE || 'https://api.binance.com',
        wsBase: process.env.PROD_BINANCE_WS_BASE || 'wss://stream.binance.com:9443/ws',
        apiKey: process.env.PROD_BINANCE_API_KEY,
        apiSecret: process.env.PROD_BINANCE_API_SECRET
      }
    }
    // Add more exchanges as needed
  }
}

export default config

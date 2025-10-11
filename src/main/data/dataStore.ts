import { EventEmitter } from 'events'
import { ProcessedCandlestick, ProcessedOrderBook, ProcessedTrade } from './types'
import { mainStateStore } from '../state/stateStore'

export interface SymbolMetrics {
  buyVolume: number
  sellVolume: number
  tradeLiquidity: { [price: number]: number }
  bidVolume: number
  askVolume: number
}

interface SymbolData {
  [DataStoreType.LAST_PRICE]?: number
  [DataStoreType.ORDERBOOK]?: ProcessedOrderBook
  [DataStoreType.TRADES]?: ProcessedTrade[]
  [DataStoreType.CANDLES_1M]?: ProcessedCandlestick[]
  [DataStoreType.CANDLES_15M]?: ProcessedCandlestick[]
  [DataStoreType.CANDLES_1D]?: ProcessedCandlestick[]
  [DataStoreType.METRICS]?: SymbolMetrics
}
export interface DataStore {
  subscribedSymbols: string[]
  symbolData: Map<string, SymbolData>
}

export enum DataStoreType {
  LAST_PRICE = 'last_price',
  ORDERBOOK = 'orderbook',
  TRADES = 'trades',
  CANDLES_1M = 'candles_1m',
  CANDLES_15M = 'candles_15m',
  CANDLES_1D = 'candles_1d',
  METRICS = 'metrics'
}

class MainDataStore extends EventEmitter {
  private dataStore: DataStore

  constructor() {
    super()
    this.dataStore = this.initializeStore()
  }

  private initializeStore(): DataStore {
    return {
      subscribedSymbols: [],
      symbolData: new Map<string, SymbolData>()
    }
  }

  getDataStore(): DataStore {
    return this.dataStore
  }

  getByDataType(symbol: string, dataType: DataStoreType): SymbolData[DataStoreType] | undefined {
    const symbolData = this.dataStore.symbolData.get(symbol)
    return symbolData ? symbolData[dataType] : undefined
  }

  updateDataStore({
    symbol,
    dataType,
    data
  }: {
    symbol: string
    dataType: DataStoreType
    data: unknown
  }): void {
    const existingSymbolData = this.dataStore.symbolData.get(symbol) || {}

    const updatedSymbolData = {
      ...existingSymbolData,
      [dataType]: data
    }

    this.dataStore.symbolData.set(symbol, updatedSymbolData)

    if (dataType === DataStoreType.LAST_PRICE) {
      mainStateStore.updateExchangeData({ lastPrice: data as number })
    } else if (
      dataType !== DataStoreType.CANDLES_1D &&
      dataType !== DataStoreType.CANDLES_15M &&
      dataType !== DataStoreType.CANDLES_1M
    ) {
      mainStateStore.updateExchangeData({ [dataType]: data })
    }
  }

  updateMetrics({ symbol, data }: { symbol: string; data: Partial<SymbolMetrics> }): void {
    const existingSymbolData = this.dataStore.symbolData.get(symbol) || {}
    const existingMetrics = existingSymbolData[DataStoreType.METRICS] || {}

    const updatedMetrics = { ...existingMetrics, ...data }

    const updatedSymbolData = {
      ...existingSymbolData,
      [DataStoreType.METRICS]: {
        ...updatedMetrics
      }
    } as SymbolData

    this.dataStore.symbolData.set(symbol, updatedSymbolData)
    mainStateStore.updateMetrics(updatedMetrics)
  }
}

export const mainDataStore = new MainDataStore()

import { EventEmitter } from 'events'
import { ProcessedCandlestick, ProcessedOrderBook, ProcessedTrade } from './types'
import { mainStateStore } from '../state/stateStore'
import { calculateATR } from '../indicators/calculations'

interface LiquidityPool {
  [price: number]: { volume: number; last_updated: number }
}

export interface SymbolMetrics {
  buyVolume: number
  sellVolume: number
  avgTradeVolume: number
  tradeLiquidity: LiquidityPool
  bidVolume: number
  askVolume: number
  max1D: number
  min1D: number
  max1Mon: number
  min1Mon: number
  agoPrice: number
  atr: number
  priceFrequency: { [price: number]: number }
  volumeProfile: { [price: number]: number }
  recentTrades: ProcessedTrade[]
}

export const initSymbolMetrics: SymbolMetrics = {
  buyVolume: 0,
  sellVolume: 0,
  avgTradeVolume: 0,
  tradeLiquidity: {},
  bidVolume: 0,
  askVolume: 0,
  max1D: 0,
  min1D: 0,
  max1Mon: 0,
  min1Mon: 0,
  agoPrice: 0,
  atr: 0,
  priceFrequency: {},
  volumeProfile: {},
  recentTrades: []
}

interface SymbolData {
  [DataStoreType.LAST_PRICE]?: number
  [DataStoreType.ORDERBOOK]?: ProcessedOrderBook
  [DataStoreType.TRADES]?: ProcessedTrade[]
  [DataStoreType.CANDLES_1M]?: ProcessedCandlestick[]
  [DataStoreType.CANDLES_15M]?: ProcessedCandlestick[]
  [DataStoreType.CANDLES_1D]?: ProcessedCandlestick[]
  [DataStoreType.CANDLES_1MON]?: ProcessedCandlestick[]
  [DataStoreType.LIQUIDITY_POOL]?: LiquidityPool
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
  CANDLES_1MON = 'candles_1mon',
  LIQUIDITY_POOL = 'liquidity_pool',
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
      dataType === DataStoreType.CANDLES_1D ||
      dataType === DataStoreType.CANDLES_15M ||
      dataType === DataStoreType.CANDLES_1M
    ) {
      const state = mainStateStore.getState()
      const selectedCandleTimeframe = state.settings.selectedCandleTimeframe

      if (
        (dataType === DataStoreType.CANDLES_1M && selectedCandleTimeframe === '1M') ||
        (dataType === DataStoreType.CANDLES_15M && selectedCandleTimeframe === '15M') ||
        (dataType === DataStoreType.CANDLES_1D && selectedCandleTimeframe === '1D')
      ) {
        mainStateStore.updateExchangeData({ candles: data as ProcessedCandlestick[] })
      }

      this.recalculateATR(symbol)
    } else {
      mainStateStore.updateExchangeData({ [dataType]: data })
    }
  }

  private recalculateATR(symbol: string): void {
    const state = mainStateStore.getState()
    const selectedAtrTimeframe = state.settings.selectedAtrTimeframe

    let candleData: ProcessedCandlestick[] | undefined

    switch (selectedAtrTimeframe) {
      case '1M':
        candleData = this.getByDataType(symbol, DataStoreType.CANDLES_1M) as ProcessedCandlestick[]
        break
      case '15M':
        candleData = this.getByDataType(symbol, DataStoreType.CANDLES_15M) as ProcessedCandlestick[]
        break
    }

    if (candleData && candleData.length > 0) {
      const atr = calculateATR(candleData)
      if (atr) {
        this.updateMetrics({
          symbol: symbol,
          data: { atr }
        })
      }
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

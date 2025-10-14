import { getCandles, Resolution } from './api/phemex/klines'
import { DataStoreType, mainDataStore } from './data/dataStore'
import { mainStateStore } from './state/stateStore'

const initialize = async (): Promise<void> => {
  const state = mainStateStore.getState()
  const symbol = state.settings.selectedSymbol

  const initialCandles1M = await getCandles(symbol, Resolution.MINUTE_1, 1000)
  const initialCandles5M = await getCandles(symbol, Resolution.MINUTE_5, 1000)
  const initialCandles15M = await getCandles(symbol, Resolution.MINUTE_15, 1000)
  const initialCandles4H = await getCandles(symbol, Resolution.HOUR_4, 1000)
  const initialCandles1D = await getCandles(symbol, Resolution.DAY_1, 1000)
  const initialCandles1MON = await getCandles(symbol, Resolution.MONTH_1, 1000)

  // Store initial data
  mainDataStore.updateDataStore({
    symbol: symbol,
    dataType: DataStoreType.CANDLES_1M,
    data: initialCandles1M
  })

  mainDataStore.updateDataStore({
    symbol: symbol,
    dataType: DataStoreType.CANDLES_5M,
    data: initialCandles5M
  })

  mainDataStore.updateDataStore({
    symbol: symbol,
    dataType: DataStoreType.CANDLES_15M,
    data: initialCandles15M
  })

  mainDataStore.updateDataStore({
    symbol: symbol,
    dataType: DataStoreType.CANDLES_4H,
    data: initialCandles4H
  })

  mainDataStore.updateDataStore({
    symbol: symbol,
    dataType: DataStoreType.CANDLES_1D,
    data: initialCandles1D
  })

  mainDataStore.updateDataStore({
    symbol: symbol,
    dataType: DataStoreType.CANDLES_1MON,
    data: initialCandles1MON
  })
}

export { initialize }

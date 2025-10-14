import { TIMEFRAME } from '../../../shared/types'
import { DataStoreType, mainDataStore } from '../../data/dataStore'
import { ProcessedCandlestick } from '../../data/types'
import { mainStateStore } from '../../state/stateStore'

export const processChangeLiquidityPoolTimeframe = (data: { timeframe: string }): void => {
  const { timeframe } = data
  mainStateStore.updateSettings({ selectedLiquidityPoolTimeframe: timeframe })

  const state = mainStateStore.getState()
  const selectedSymbol = state.settings.selectedSymbol

  const existingLiquidityPool = mainDataStore.getByDataType(
    selectedSymbol,
    DataStoreType.LIQUIDITY_POOL
  )

  if (!existingLiquidityPool) return

  let timeWindowMinutes = 15
  if (timeframe === TIMEFRAME.MINUTE_1) {
    timeWindowMinutes = 1
  } else if (timeframe === TIMEFRAME.MINUTE_5) {
    timeWindowMinutes = 5
  } else if (timeframe === TIMEFRAME.MINUTE_15) {
    timeWindowMinutes = 15
  } else if (timeframe === TIMEFRAME.MINUTE_30) {
    timeWindowMinutes = 30
  } else if (timeframe === TIMEFRAME.HOUR_1) {
    timeWindowMinutes = 60
  }

  const minSizeThreshold = 0.001
  const currentTimeNs = BigInt(Date.now()) * 1_000_000n
  const windowNanoseconds = BigInt(timeWindowMinutes * 60 * 1_000_000_000)

  const filteredTradeLiquidity: { [price: number]: { volume: number; last_updated: number } } = {}
  Object.entries(existingLiquidityPool).forEach(([price, data]) => {
    const lastUpdatedNs = BigInt(data.last_updated)

    if (
      currentTimeNs - lastUpdatedNs <= windowNanoseconds &&
      Math.abs(data.volume) > minSizeThreshold
    ) {
      filteredTradeLiquidity[parseFloat(price)] = data
    }
  })

  mainDataStore.updateMetrics({
    symbol: selectedSymbol,
    data: {
      tradeLiquidity: filteredTradeLiquidity
    }
  })
}

export const processChangeCandleTimeframe = async (data: { timeframe: string }): Promise<void> => {
  const { timeframe } = data
  mainStateStore.updateSettings({ selectedCandleTimeframe: timeframe })

  const state = mainStateStore.getState()
  const selectedSymbol = state.settings.selectedSymbol

  let dataType = DataStoreType.CANDLES_1M
  if (timeframe === TIMEFRAME.MINUTE_15) {
    dataType = DataStoreType.CANDLES_15M
  } else if (timeframe === TIMEFRAME.DAY_1) {
    dataType = DataStoreType.CANDLES_1D
  }

  const existingCandles = mainDataStore.getByDataType(
    selectedSymbol,
    dataType
  ) as ProcessedCandlestick[]
  mainStateStore.updateExchangeData({ candles: existingCandles })
}

export const processChangePriceListTimeframe = async (data: {
  timeframe: string
}): Promise<void> => {
  const { timeframe } = data
  mainStateStore.updateSettings({ selectedPriceLineTimeframe: timeframe })
}

import { dbStore } from '../dbStore'
import { OrderType, PosSide, Side } from '../../../shared/types'
import { mainStateStore, StateType } from '../../state/stateStore'
import { DataStoreType, mainDataStore } from '../../data/dataStore'
import { ProcessedOrderBook } from '../../data/types'
import { createTrade } from '../trades/tradesOperations'

export const createOrder = async ({
  orderType,
  side,
  posSide
}: {
  orderType: OrderType
  side: Side
  posSide: PosSide
}): Promise<void> => {
  const state = mainStateStore.getState()
  const userId = state[StateType.USER].id
  const availableCapital = await dbStore.tradeStore.getCapital(userId)

  const userSettings = state[StateType.USER_SETTINGS]

  const leverage = userSettings.leverage
  const capitalAllocation = userSettings.capitalAllocation

  const selectedSymbol = state[StateType.SETTINGS].selectedSymbol
  const lastPrice = mainDataStore.getByDataType(selectedSymbol, DataStoreType.LAST_PRICE)

  const capital = availableCapital * capitalAllocation

  let price: number | null = typeof lastPrice === 'number' ? lastPrice : null

  if (orderType === OrderType.LIMIT) {
    price = getBestLimitPrice(posSide)
  }

  if (price) {
    const size = Math.floor(((capital * leverage) / price) * 1000000) / 1000000
    const symbol = selectedSymbol

    if (orderType === OrderType.MARKET) {
      const trade = {
        symbol: selectedSymbol,
        entryPrice: price,
        size,
        side,
        posSide,
        leverage,
        type: orderType
      }
      createTrade(trade)
      return
    }

    const order = {
      orderType: orderType,
      size: size,
      side: side,
      posSide: posSide,
      price: price,
      symbol: symbol,
      leverage: leverage
    }
    dbStore.orderStore.createOrder(order)
  }
}

export const cancelOrder = async ({
  userId,
  orderId
}: {
  userId: string
  orderId: string
}): Promise<void> => {
  dbStore.orderStore.deleteOrder(userId, orderId)
}

const getBestLimitPrice = (posSide: PosSide): number | null => {
  const state = mainStateStore.getState()
  const selectedSymbol = state[StateType.SETTINGS].selectedSymbol
  const orderBook = mainDataStore.getByDataType(selectedSymbol, DataStoreType.ORDERBOOK)

  if (
    !orderBook ||
    typeof orderBook !== 'object' ||
    !('bids' in orderBook) ||
    !('asks' in orderBook)
  ) {
    console.error('Order book data not available')
    return null
  }

  const { bids, asks } = orderBook as ProcessedOrderBook

  try {
    if (posSide === PosSide.LONG) {
      // For LONG: Buy at the lowest ask price
      const askPrices = Object.keys(asks)
        .map((price) => parseFloat(price))
        .filter((price) => !isNaN(price) && asks[price] > 0)

      if (askPrices.length === 0) {
        console.warn('No valid ask prices found')
        return null
      }

      const bestAskPrice = Math.min(...askPrices)
      console.log(`Best limit price for LONG (BUY): ${bestAskPrice}`)
      return bestAskPrice
    } else if (posSide === PosSide.SHORT) {
      // For SHORT: Sell at the highest bid price
      const bidPrices = Object.keys(bids)
        .map((price) => parseFloat(price))
        .filter((price) => !isNaN(price) && bids[price] > 0)

      if (bidPrices.length === 0) {
        console.warn('No valid bid prices found')
        return null
      }

      const bestBidPrice = Math.max(...bidPrices)
      console.log(`Best limit price for SHORT (SELL): ${bestBidPrice}`)
      return bestBidPrice
    }
  } catch (error) {
    console.error('Error calculating best limit price:', error)
  }

  return null
}

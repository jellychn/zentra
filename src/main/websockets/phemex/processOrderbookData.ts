import { DataStoreType, mainDataStore } from '../../data/dataStore'
import { MessageType } from './types'
import { ProcessedOrderBook } from '../../data/types'

interface OrderBookLevel {
  [0]: string // price
  [1]: string // quantity
}

interface OrderBookData {
  asks: OrderBookLevel[]
  bids: OrderBookLevel[]
}

export interface OrderBookMessage {
  depth: number
  orderbook_p: OrderBookData
  sequence: number
  symbol: string
  timestamp: number
  type: MessageType
}

export const processOrderbookData = (data: OrderBookMessage): void => {
  const symbol = data.symbol
  const orderbook = data.orderbook_p
  const type = data.type

  const existingData = mainDataStore.getDataStore().symbolData.get(symbol)
  let newOrderbook: ProcessedOrderBook = (existingData?.[
    DataStoreType.ORDERBOOK
  ] as ProcessedOrderBook) || {
    bids: {},
    asks: {}
  }

  if (type === MessageType.SNAPSHOT) {
    // For snapshot, create fresh objects
    const bids: { [price: number]: number } = {}
    const asks: { [price: number]: number } = {}

    for (let i = 0; i < orderbook.bids.length; i++) {
      const level = orderbook.bids[i]
      bids[parseFloat(level[0])] = parseFloat(level[1])
    }

    for (let i = 0; i < orderbook.asks.length; i++) {
      const level = orderbook.asks[i]
      asks[parseFloat(level[0])] = parseFloat(level[1])
    }

    newOrderbook = { bids, asks }
  } else if (type === MessageType.INCREMENTAL) {
    // For incremental, work on a COPY to avoid mutation issues
    const updatedBids = { ...newOrderbook.bids }
    const updatedAsks = { ...newOrderbook.asks }

    // Apply bid updates
    for (let i = 0; i < orderbook.bids.length; i++) {
      const level = orderbook.bids[i]
      const price = parseFloat(level[0])
      const size = parseFloat(level[1])

      if (size === 0) {
        delete updatedBids[price]
      } else {
        updatedBids[price] = size
      }
    }

    // Apply ask updates
    for (let i = 0; i < orderbook.asks.length; i++) {
      const level = orderbook.asks[i]
      const price = parseFloat(level[0])
      const size = parseFloat(level[1])

      if (size === 0) {
        delete updatedAsks[price]
      } else {
        updatedAsks[price] = size
      }
    }

    newOrderbook = { bids: updatedBids, asks: updatedAsks }
  }

  // Sort the final result (no need to recreate objects)
  newOrderbook.bids = Object.fromEntries(
    Object.entries(newOrderbook.bids).sort(([a], [b]) => parseFloat(b) - parseFloat(a))
  )

  newOrderbook.asks = Object.fromEntries(
    Object.entries(newOrderbook.asks).sort(([a], [b]) => parseFloat(a) - parseFloat(b))
  )

  mainDataStore.updateDataStore({
    symbol: symbol,
    dataType: DataStoreType.ORDERBOOK,
    data: newOrderbook
  })

  processOrderbookMetrics(symbol, newOrderbook)
}

const processOrderbookMetrics = (symbol: string, orderbook: ProcessedOrderBook): void => {
  let bidVolume = 0
  let askVolume = 0

  for (const size of Object.values(orderbook.bids)) {
    bidVolume += size
  }

  for (const size of Object.values(orderbook.asks)) {
    askVolume += size
  }

  mainDataStore.updateMetrics({
    symbol: symbol,
    data: {
      bidVolume,
      askVolume
    }
  })
}

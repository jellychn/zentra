// {
//     "sequence": 77663551,
//     "symbol": "BTCUSDT",
//     "trades_p": [
//         [
//             1666856062351916300,
//             "Sell",
//             "20703.6",
//             "0.669"
//         ],
//         [
//             1666854025545354000,
//             "Buy",
//             "20699",
//             "0.001"
//         ]
//     ],
//     "type": "snapshot"
// }

import { Side } from '../../../shared/types'
import { DataStoreType, mainDataStore } from '../../data/dataStore'
import { ProcessedTrade } from '../../data/types'
import { MessageType } from './types'

export interface TradeMessage {
  sequence: number
  symbol: string
  trades_p: TradeEntry[]
  type: MessageType
}

type TradeEntry = [
  number, // timestamp
  Side, // side
  string, // price
  string // quantity
]

export const processTradeData = (data: TradeMessage): void => {
  const symbol = data.symbol
  const trades = data.trades_p
  const type = data.type

  const processedTrades: ProcessedTrade[] = trades.map((trade) => ({
    timestamp: trade[0],
    side: trade[1] as Side,
    price: parseFloat(trade[2]),
    quantity: parseFloat(trade[3])
  }))

  if (type === MessageType.SNAPSHOT) {
    const sortedTrades = processedTrades.sort((a, b) => b.timestamp - a.timestamp)

    mainDataStore.updateDataStore({
      symbol: symbol,
      dataType: DataStoreType.TRADES,
      data: sortedTrades
    })

    processTradeMetrics(symbol, sortedTrades)
  } else {
    const existingData = mainDataStore.getDataStore().symbolData.get(symbol)
    const existingTrades =
      (existingData?.[DataStoreType.TRADES] as ProcessedTrade[] | undefined) || []

    const mergedTrades = [...processedTrades, ...existingTrades].sort(
      (a, b) => b.timestamp - a.timestamp
    )

    mainDataStore.updateDataStore({
      symbol: symbol,
      dataType: DataStoreType.TRADES,
      data: mergedTrades
    })

    processTradeMetrics(symbol, mergedTrades)
  }
}

const processTradeMetrics = (symbol: string, trades: ProcessedTrade[]): void => {
  const tradeLiquidity: { [price: number]: { volume: number; last_updated: number } } = {}
  let buyVolume = 0
  let sellVolume = 0

  trades.forEach((trade) => {
    if (trade.side === Side.BUY) {
      buyVolume += trade.quantity
    } else if (trade.side === Side.SELL) {
      sellVolume += trade.quantity
    }

    const price = trade.price
    const quantity = trade.quantity

    if (!tradeLiquidity[price]) {
      tradeLiquidity[price] = {
        volume: trade.side === Side.BUY ? quantity : -quantity,
        last_updated: trade.timestamp
      }
    } else {
      tradeLiquidity[price].volume += trade.side === Side.BUY ? quantity : -quantity
      tradeLiquidity[price].last_updated = trade.timestamp
    }
  })

  mainDataStore.updateMetrics({
    symbol: symbol,
    data: {
      buyVolume,
      sellVolume,
      tradeLiquidity
    }
  })
}

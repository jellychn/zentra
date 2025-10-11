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
  const tradeLiquidity = {}
  let buyVolume = 0
  let sellVolume = 0

  trades.forEach((trade) => {
    if (trade.side === Side.BUY) {
      buyVolume += trade.quantity
    } else if (trade.side === Side.SELL) {
      sellVolume += trade.quantity
    }

    if (!tradeLiquidity[trade.price]) {
      tradeLiquidity[trade.price] = trade.side === Side.BUY ? trade.quantity : -trade.quantity
    } else {
      tradeLiquidity[trade.price] += trade.side === Side.BUY ? trade.quantity : -trade.quantity
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

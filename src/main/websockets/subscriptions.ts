import { Exchanges } from '../../shared/types'
import { mainStateStore, StateType } from '../state/stateStore'
import { sendWsMessage } from './ws'

export async function subscribeToSymbol(symbol: string): Promise<void> {
  const state = mainStateStore.getState()
  const selectedExchange = state[StateType.SETTINGS].selectedExchange

  if (selectedExchange === Exchanges.PHEMEX) {
    phemexSubscriptions(symbol)
  }
}

const phemexSubscriptions = async (symbol: string): Promise<void> => {
  try {
    const formattedSymbol = symbol.startsWith('.M') ? symbol : `.M${symbol}`

    const subscriptions = [
      {
        id: 2,
        method: 'tick_p.subscribe',
        params: [formattedSymbol]
      },
      {
        id: 3,
        method: 'orderbook_p.subscribe',
        params: [symbol, false, 0]
      },
      {
        id: 4,
        method: 'trade_p.subscribe',
        params: [symbol]
      },
      {
        id: 5,
        method: 'kline_p.subscribe',
        params: [symbol, 60]
      },
      {
        id: 5,
        method: 'kline_p.subscribe',
        params: [symbol, 300]
      },
      {
        id: 6,
        method: 'kline_p.subscribe',
        params: [symbol, 900]
      },
      {
        id: 6,
        method: 'kline_p.subscribe',
        params: [symbol, 14400]
      },
      {
        id: 7,
        method: 'kline_p.subscribe',
        params: [symbol, 86400]
      },
      {
        id: 8,
        method: 'kline_p.subscribe',
        params: [symbol, 2592000]
      }
    ]

    for (const sub of subscriptions) {
      await sendWsMessage(sub)
    }

    console.log(`Subscribed to symbol: ${symbol}`)
  } catch (error) {
    console.error(`Failed to subscribe to symbol (${symbol}):`, error)
  }
}

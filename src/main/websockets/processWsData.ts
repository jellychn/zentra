import { Exchanges } from '../../shared/types'
import { mainStateStore } from '../state/stateStore'
import { processTickData, TickMessage } from './phemex/processTickData'
import { processOrderbookData, OrderBookMessage } from './phemex/processOrderbookData'
import { KlineMessage, processKlineData } from './phemex/processKlineData'
import { processTradeData, TradeMessage } from './phemex/processTradeData'

export default function processWsData(data: unknown): void {
  const state = mainStateStore.getState()
  const selectedExchange = state.settings.selectedExchange

  if (selectedExchange === Exchanges.PHEMEX) {
    if (typeof data === 'object' && data !== null && Object.keys(data).includes('tick_p')) {
      processTickData((data as TickMessage)['tick_p'])
    }

    if (typeof data === 'object' && data !== null && Object.keys(data).includes('orderbook_p')) {
      processOrderbookData(data as OrderBookMessage)
    }

    if (typeof data === 'object' && data !== null && Object.keys(data).includes('trade_p')) {
      processTradeData(data as TradeMessage)
    }

    if (typeof data === 'object' && data !== null && Object.keys(data).includes('kline_p')) {
      processKlineData(data as KlineMessage)
    }
  }
}

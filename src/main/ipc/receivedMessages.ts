import { ipcMain } from 'electron'
import { MessageSenderType } from '../../shared/types'
import { processCancelOrder, processCreateOrder } from './processMessages/orderMessages'
import {
  processChangeCandleTimeframe,
  processChangeLiquidityPoolTimeframe,
  processChangePriceListTimeframe
} from './processMessages/settingsMessages'
import { processGetOpenTrades } from './processMessages/tradesMessages'

export const receivedMessages = (): void => {
  ipcMain.on(MessageSenderType.CHANGE_LIQUIDITY_POOL_TIMEFRAME, (_event, data) => {
    console.log(
      `Received from frontend: ${MessageSenderType.CHANGE_LIQUIDITY_POOL_TIMEFRAME}`,
      data
    )
    processChangeLiquidityPoolTimeframe(data)
  })

  ipcMain.on(MessageSenderType.CHANGE_CANDLE_TIMEFRAME, (_event, data) => {
    console.log(`Received from frontend: ${MessageSenderType.CHANGE_CANDLE_TIMEFRAME}`, data)
    processChangeCandleTimeframe(data)
  })

  ipcMain.on(MessageSenderType.CHANGE_PRICE_LINE_TIMEFRAME, (_event, data) => {
    console.log(`Received from frontend: ${MessageSenderType.CHANGE_PRICE_LINE_TIMEFRAME}`, data)
    processChangePriceListTimeframe(data)
  })

  tradesMessages()
  orderMessages()
}

const tradesMessages = (): void => {
  ipcMain.on(MessageSenderType.GET_OPEN_TRADES, (_event, data) => {
    console.log(`Received from frontend: ${MessageSenderType.GET_OPEN_TRADES}`, data)
    processGetOpenTrades(data)
  })
}

const orderMessages = (): void => {
  ipcMain.on(MessageSenderType.CANCEL_ORDER, (_event, data) => {
    console.log(`Received from frontend: ${MessageSenderType.CANCEL_ORDER}`, data)
    processCancelOrder(data)
  })

  ipcMain.on(MessageSenderType.CREATE_ORDER, (_event, data) => {
    console.log(`Received from frontend: ${MessageSenderType.CREATE_ORDER}`, data)
    processCreateOrder(data)
  })
}

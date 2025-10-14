import { ipcMain } from 'electron'
import { MessageSenderType } from '../../shared/types'
import { processCreateOrder } from './processMessages/orderMessages'
import {
  processChangeCandleTimeframe,
  processChangeLiquidityPoolTimeframe
} from './processMessages/settingsMessages'

export const receivedMessages = (): void => {
  ipcMain.on(MessageSenderType.CREATE_ORDER, (_event, data) => {
    console.log(`Received from frontend: ${MessageSenderType.CREATE_ORDER}`, data)
    processCreateOrder(data)

    // _event.reply('log-reply', 'Message received ✅')
  })

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
}

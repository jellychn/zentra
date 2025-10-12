import { ipcMain } from 'electron'
import { MessageSenderType } from '../../shared/types'
import { processCreateOrder } from './processMessages/orderMessages'

export const receivedMessages = (): void => {
  ipcMain.on(MessageSenderType.CREATE_ORDER, (_event, data) => {
    console.log(`Received from frontend: ${MessageSenderType.CREATE_ORDER}`, data)
    processCreateOrder(data)

    // _event.reply('log-reply', 'Message received ✅')
  })
}

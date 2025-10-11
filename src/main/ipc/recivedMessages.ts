import { ipcMain } from 'electron'
import { MessageType } from '../../shared/types'
import { processCreateOrder } from './processMessages/orderMessages'

export const receivedMessages = (): void => {
  ipcMain.on(MessageType.CREATE_ORDER, (_event, data) => {
    console.log(`Received from frontend: ${MessageType.CREATE_ORDER}`, data)
    processCreateOrder()

    // _event.reply('log-reply', 'Message received ✅')
  })
}

import { ipcMain } from 'electron'
import { MessageType } from '../../shared/types'

export const receivedMessages = (): void => {
  ipcMain.on(MessageType.CREATE_ORDER, (_event, data) => {
    console.log(`Received from frontend: ${MessageType.CREATE_ORDER}`, data)

    // _event.reply('log-reply', 'Message received ✅')
  })
}

import { notificationEmitter } from '../notification/notificationHelper'

export function registerNotificationIpc(mainWindow): void {
  notificationEmitter.initialize(mainWindow)
}

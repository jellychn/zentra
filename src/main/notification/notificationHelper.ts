import { EventEmitter } from 'events'

export interface Notification {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  timestamp: number
  duration?: number
}

class NotificationEmitter extends EventEmitter {
  private static instance: NotificationEmitter
  private isInitialized = false

  private constructor() {
    super()
  }

  static getInstance(): NotificationEmitter {
    if (!NotificationEmitter.instance) {
      NotificationEmitter.instance = new NotificationEmitter()
    }
    return NotificationEmitter.instance
  }

  // Prevent multiple initializations
  initialize(mainWindow?: any): void {
    if (this.isInitialized) {
      return
    }

    if (mainWindow) {
      this.on('notification', (notification) => {
        console.log('📢 Sending notification to renderer:', notification)
        mainWindow.webContents.send('notification:notify', notification)
      })
    }

    this.isInitialized = true
  }
}

export const notificationEmitter = NotificationEmitter.getInstance()

export class NotificationHelper {
  static sendSuccess(message: string, duration?: number): void {
    notificationEmitter.emit('notification', {
      type: 'success',
      message,
      timestamp: Date.now(),
      duration
    })
  }

  static sendError(message: string, duration?: number): void {
    notificationEmitter.emit('notification', {
      type: 'error',
      message,
      timestamp: Date.now(),
      duration: duration || 7000
    })
  }

  static sendWarning(message: string, duration?: number): void {
    notificationEmitter.emit('notification', {
      type: 'warning',
      message,
      timestamp: Date.now(),
      duration
    })
  }

  static sendInfo(message: string, duration?: number): void {
    notificationEmitter.emit('notification', {
      type: 'info',
      message,
      timestamp: Date.now(),
      duration
    })
  }
}

import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  send: (channel: string, data: unknown) => {
    ipcRenderer.send(channel, data)
  },
  on: (channel: string, callback: (data: unknown) => void) => {
    // Remove any existing listeners for this channel to prevent duplicates
    ipcRenderer.removeAllListeners(channel)
    ipcRenderer.on(channel, (_, data) => callback(data))
  },
  removeListener: (channel: string, callback: (data: unknown) => void) => {
    ipcRenderer.removeListener(channel, callback)
  }
}

// Notification-specific API
const notificationAPI = {
  onNotification: (callback: (notification: unknown) => void) => {
    // CRITICAL: Remove all existing listeners first to prevent duplicates
    ipcRenderer.removeAllListeners('notification:notify')
    ipcRenderer.on('notification:notify', (_, notification) => {
      console.log('📨 Preload: Notification received from main process')
      callback(notification)
    })
  },
  removeNotificationListener: (callback: (notification: unknown) => void) => {
    ipcRenderer.removeListener('notification:notify', callback)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('notification', notificationAPI)
    contextBridge.exposeInMainWorld('electronAPI', {
      initializeApp: () => ipcRenderer.invoke('initialize-app')
      // ... your other APIs
    })
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
  // @ts-ignore (define in dts)
  window.notification = notificationAPI
}

import { app, shell, BrowserWindow } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { cleanupWebSocket, initWebSocket } from './websockets/ws'
import { registerStateIpc } from './ipc/stateIpc'
import { receivedMessages } from './ipc/recivedMessages'
import { dbStore } from './db/dbStore'
import { registerNotificationIpc } from './ipc/notificationIpc'
import { mainStateStore } from './state/stateStore'
import { registerInitializeIpc } from './ipc/initializeIpc'

function createWindow(): BrowserWindow {
  const mainWindow = new BrowserWindow({
    fullscreen: true,
    frame: false,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  return mainWindow
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  dbStore.initializeStores('user-settings-table', 'orders-table', 'trades-table')
  dbStore
    .initializeTables()
    .then(() => {
      console.log('Database tables ready')
    })
    .catch((error) => {
      console.error('Failed to initialize tables:', error)
    })

  const mainWindow = createWindow()

  registerInitializeIpc()
  registerStateIpc(mainWindow)
  registerNotificationIpc(mainWindow)
  initWebSocket(mainWindow)

  receivedMessages()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('before-quit', () => {
  console.log('🔄 Cleaning up before quit...')
  cleanupWebSocket()
  mainStateStore.destroy() // Add this line
})

app.on('window-all-closed', () => {
  console.log('🔄 All windows closed, cleaning up...')
  cleanupWebSocket()
  mainStateStore.destroy()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

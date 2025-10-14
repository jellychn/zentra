import { ipcMain } from 'electron'
import { mainStateStore } from '../state/stateStore'

export function registerStateIpc(mainWindow): void {
  if (mainWindow && !mainWindow.isDestroyed()) {
    // Handle one-time state requests
    ipcMain.handle('state:get', () => {
      return mainStateStore.getState()
    })

    // Subscribe to ongoing state changes
    mainStateStore.on('state-changed', (newState) => {
      mainWindow.webContents.send('state:update', newState)
    })
  }
}

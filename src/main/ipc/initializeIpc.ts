import { ipcMain } from 'electron'
import { initialize } from '../initialize'

export const registerInitializeIpc = (): void => {
  ipcMain.handle('initialize-app', async () => {
    try {
      await initialize()
      return { success: true }
    } catch (error: any) {
      console.error('Initialization failed:', error)
      return { success: false, error: error.message }
    }
  })
}

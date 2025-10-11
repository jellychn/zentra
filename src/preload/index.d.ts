import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      send: (channel: string, data: unknown) => void
      on: (channel: string, callback: (data: unknown) => void) => void
    }
  }
}

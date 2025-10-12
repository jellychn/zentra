import WebSocket from 'ws'
import { BrowserWindow } from 'electron'

import { mainStateStore } from '../state/stateStore'
import { subscribeToSymbol } from './subscriptions'
import processWsData from './processWsData'
import config from '../config/config'

let ws: WebSocket | null = null
let heartbeatInterval: NodeJS.Timeout | null = null
let mainWindow: BrowserWindow | null = null
let isAppClosing = false

export function initWebSocket(window: BrowserWindow): void {
  mainWindow = window

  const state = mainStateStore.getState()
  const environment = state.settings.environment
  const selectedExchange = state.settings.selectedExchange
  const selectedSymbol = state.settings.selectedSymbol
  const wsBase = config.exchanges[selectedExchange][environment].wsBase

  ws = new WebSocket(wsBase)

  ws.on('open', () => {
    if (isAppClosing) return
    console.log('WebSocket connected')
    startHeartbeat()
    subscribeToSymbol(selectedSymbol)
  })

  ws.on('message', (data) => {
    // Check if app is closing before processing any data
    if (isAppClosing) {
      return
    }

    try {
      const parsedData = JSON.parse(data.toString())
      processWsData(parsedData)

      // Send message to renderer only if window is still valid
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('ws-message', data.toString())
      }
    } catch (error) {
      if (!isAppClosing) {
        console.error('Error processing WebSocket message:', error)
      }
    }
  })

  ws.on('close', () => {
    console.log('WebSocket closed')
    stopHeartbeat()
  })

  ws.on('error', (err) => {
    if (!isAppClosing) {
      console.error('WebSocket error', err)
    }
    stopHeartbeat()
  })
}

function startHeartbeat(): void {
  if (isAppClosing) return

  const heartbeatIntervalMs = 15000 // 15 seconds

  heartbeatInterval = setInterval(async () => {
    if (isAppClosing) {
      stopHeartbeat()
      return
    }
    await sendHeartbeat()
  }, heartbeatIntervalMs)
}

function stopHeartbeat(): void {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval)
    heartbeatInterval = null
  }
}

async function sendHeartbeat(): Promise<void> {
  if (isAppClosing) return

  const currentTime = new Date().toISOString().replace('T', ' ').split('.')[0]

  try {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const pingMsg = { id: 12345, method: 'server.ping', params: [] }
      await sendWsMessage(pingMsg)
      console.log(`💓 [${currentTime}] Heartbeat sent`)
    } else {
      console.log(`⚠️ [${currentTime}] Heartbeat skipped - WebSocket not connected`)
    }
  } catch (error) {
    if (!isAppClosing) {
      console.error(`⚠️ [${currentTime}] Heartbeat failed:`, error)
    }
  }
}

export async function sendWsMessage(data: unknown): Promise<void> {
  if (isAppClosing) {
    throw new Error('App is closing')
  }

  return new Promise((resolve, reject) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data), (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    } else {
      reject(new Error('WebSocket is not connected'))
    }
  })
}

// Cleanup function to call when app is closing
export function cleanupWebSocket(): void {
  isAppClosing = true
  stopHeartbeat()
  if (ws) {
    ws.close()
    ws = null
  }
  mainWindow = null
}

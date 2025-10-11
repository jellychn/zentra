import WebSocket from 'ws'
import { BrowserWindow } from 'electron'

import { mainStateStore } from '../state/stateStore'
import { subscribeToSymbol } from './subscriptions'
import processWsData from './processWsData'
import config from '../config/config'

let ws: WebSocket | null = null
let heartbeatInterval: NodeJS.Timeout | null = null

export function initWebSocket(mainWindow: BrowserWindow): void {
  const state = mainStateStore.getState()
  const environment = state.settings.environment
  const selectedExchange = state.settings.selectedExchange
  const wsBase = config.exchanges[selectedExchange][environment].wsBase

  ws = new WebSocket(wsBase)

  ws.on('open', () => {
    console.log('WebSocket connected')
    startHeartbeat()
    subscribeToSymbol('BTCUSDT')
  })

  ws.on('message', (data) => {
    const parsedData = JSON.parse(data.toString())
    processWsData(parsedData)

    data.toString()
    // Send message to renderer
    mainWindow.webContents.send('ws-message', data.toString())
  })

  ws.on('close', () => {
    console.log('WebSocket closed')
    stopHeartbeat()
  })

  ws.on('error', (err) => {
    console.error('WebSocket error', err)
    stopHeartbeat()
  })
}

function startHeartbeat(): void {
  const heartbeatIntervalMs = 15000 // 15 seconds

  heartbeatInterval = setInterval(async () => {
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
    console.error(`⚠️ [${currentTime}] Heartbeat failed:`, error)
  }
}

export async function sendWsMessage(data: unknown): Promise<void> {
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
  stopHeartbeat()
  if (ws) {
    ws.close()
    ws = null
  }
}

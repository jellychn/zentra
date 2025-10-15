/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import config from '../config/config'
import { mainStateStore, StateType } from '../state/stateStore'

export async function apiCall(endpoint: string, params: Record<string, any> = {}): Promise<any> {
  const state = mainStateStore.getState()
  const environment = state[StateType.SETTINGS].environment
  const selectedExchange = state.settings.selectedExchange
  const restBase = config.exchanges[selectedExchange][environment].restBase

  const url = `${restBase}${endpoint}`

  try {
    const response = await axios.get(url, { params })

    if (response.data.code !== 0 && response.data.code !== undefined) {
      throw new Error(`API Error: ${response.data.msg || 'Unknown error'}`)
    }

    return response.data
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error)
    throw error
  }
}

/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AppState } from '../../../shared/types'

const { ipcRenderer } = window.electron

interface StateStoreContextProps {
  state: AppState | null
}

const StateStoreContext = createContext<StateStoreContextProps | undefined>(undefined)

export const StateStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState | null>(null)

  useEffect(() => {
    ipcRenderer.invoke('state:get').then((initialState) => {
      setState(initialState)
    })

    ipcRenderer.on('state:update', (_event, updatedState) => {
      setState(updatedState)
    })

    return () => {
      ipcRenderer.removeAllListeners('state:update')
    }
  }, [])

  return <StateStoreContext.Provider value={{ state }}>{children}</StateStoreContext.Provider>
}

export function useStateStore(): StateStoreContextProps {
  const context = useContext(StateStoreContext)
  if (!context) {
    throw new Error('useStateStore must be used within a StateStoreProvider')
  }
  return context
}

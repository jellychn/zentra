import { useStateStore } from './contexts/StateStoreContext'
import Spinner from './elements/Spinner'
import Notification from './components/Notification'
import Trade from './pages/Trade'
import { useEffect, useState } from 'react'

function AppContent(): React.JSX.Element {
  const { state } = useStateStore()

  const [isInitializing, setIsInitializing] = useState(true)
  const [initError, setInitError] = useState<string | null>(null)

  useEffect(() => {
    const initializeApp = async (): Promise<void> => {
      try {
        setIsInitializing(true)
        const result = await window.electronAPI.initializeApp()
        if (!result.success) {
          setInitError(result.error || 'Initialization failed')
        }
      } catch (error) {
        setInitError(error.message)
      } finally {
        setIsInitializing(false)
      }
    }

    initializeApp()
  }, [])

  if (initError) {
    return <div>Error: {initError}</div>
  }

  if (!state || isInitializing) {
    return <Spinner />
  }

  return (
    <>
      <Notification />
      <Trade />
    </>
  )
}

export default AppContent

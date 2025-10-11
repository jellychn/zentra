import AppContent from './AppContent'
import { StateStoreProvider } from './contexts/StateStoreContext'

function App(): React.JSX.Element {
  return (
    <>
      <StateStoreProvider>
        <AppContent />
      </StateStoreProvider>
    </>
  )
}

export default App

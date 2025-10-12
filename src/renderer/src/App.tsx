import AppContent from './AppContent'
import { PriceLineProvider } from './contexts/PriceLineContext'
import { StateStoreProvider } from './contexts/StateStoreContext'

function App(): React.JSX.Element {
  return (
    <>
      <StateStoreProvider>
        <PriceLineProvider>
          <AppContent />
        </PriceLineProvider>
      </StateStoreProvider>
    </>
  )
}

export default App

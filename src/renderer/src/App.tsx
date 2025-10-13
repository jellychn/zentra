import AppContent from './AppContent'
import { LiquidityPoolProvider } from './contexts/LiquidityPoolContext'
import { PriceLineProvider } from './contexts/PriceLineContext'
import { StateStoreProvider } from './contexts/StateStoreContext'

function App(): React.JSX.Element {
  return (
    <>
      <StateStoreProvider>
        <PriceLineProvider>
          <LiquidityPoolProvider>
            <AppContent />
          </LiquidityPoolProvider>
        </PriceLineProvider>
      </StateStoreProvider>
    </>
  )
}

export default App

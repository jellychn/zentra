import PriceLine from './components/PriceLine'
import TradePanel from './components/TradePanel'
import { useStateStore } from './contexts/StateStoreContext'
import Spinner from './elements/Spinner'

function AppContent(): React.JSX.Element {
  const { state } = useStateStore()
  if (!state) {
    return <Spinner />
  }

  return (
    <>
      <PriceLine />
      <TradePanel />
    </>
  )
}

export default AppContent

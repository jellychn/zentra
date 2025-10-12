import PriceLine from './components/PriceLine'
import TradePanel from './components/TradePanel'
import { useStateStore } from './contexts/StateStoreContext'
import Spinner from './elements/Spinner'
import Notification from './components/Notification'
import LiquidityPool from './components/LiqudityPool'

function AppContent(): React.JSX.Element {
  const { state } = useStateStore()
  if (!state) {
    return <Spinner />
  }

  return (
    <>
      <Notification />
      <div style={{ display: 'flex' }}>
        <PriceLine />
        <LiquidityPool />
      </div>
      <TradePanel />
    </>
  )
}

export default AppContent

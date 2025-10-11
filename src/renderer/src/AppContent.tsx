import OrderBook from './components/OrderBook'
import RecentTrades from './components/RecentTrades'
import { useStateStore } from './contexts/StateStoreContext'
import Spinner from './elements/Spinner'

function AppContent(): React.JSX.Element {
  const { state } = useStateStore()
  if (!state) {
    return <Spinner />
  }

  return (
    <>
      <RecentTrades />
      <OrderBook />
    </>
  )
}

export default AppContent

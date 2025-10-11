import LiquidityPool from './components/LiqudityPool'
import { useStateStore } from './contexts/StateStoreContext'
import Spinner from './elements/Spinner'

function AppContent(): React.JSX.Element {
  const { state } = useStateStore()
  if (!state) {
    return <Spinner />
  }

  return (
    <>
      <LiquidityPool />
    </>
  )
}

export default AppContent

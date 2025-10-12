import { useStateStore } from './contexts/StateStoreContext'
import Spinner from './elements/Spinner'
import Notification from './components/Notification'
import Trade from './pages/Trade'

function AppContent(): React.JSX.Element {
  const { state } = useStateStore()
  if (!state) {
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

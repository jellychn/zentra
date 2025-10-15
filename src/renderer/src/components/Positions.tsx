import { useStateStore } from '@renderer/contexts/StateStoreContext'
import Position from './Position'

export default function Positions(): React.JSX.Element {
  const { state } = useStateStore()
  const { userTrades } = state || {}
  const { positions = [] } = userTrades || {}

  if (positions.length === 0) {
    return (
      <div
        style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <p>No open positions</p>
      </div>
    )
  }

  return (
    <div style={{ height: '300px', overflow: 'auto' }}>
      {positions.map((position) => (
        <Position key={position.tradeId} position={position} />
      ))}
    </div>
  )
}

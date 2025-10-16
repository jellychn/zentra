import { useStateStore } from '@renderer/contexts/StateStoreContext'
import PositionIndicator from './positions/PositionIndicator'

export default function Positions({
  getTopPercentage
}: {
  getTopPercentage: (price: number) => number
}): React.JSX.Element {
  const { state } = useStateStore()
  const { userTrades } = state || {}
  const { positions = [] } = userTrades || {}

  return (
    <div>
      {positions.map((position) => (
        <PositionIndicator
          key={position.createdAt}
          position={position}
          getTopPercentage={getTopPercentage}
        />
      ))}
      <style>
        {`
          .position-tooltip {
            opacity: 0;
            transition: opacity 0.2s;
          }
          div:hover .position-tooltip {
            opacity: 1;
          }
        `}
      </style>
    </div>
  )
}

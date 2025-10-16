import { useStateStore } from '@renderer/contexts/StateStoreContext'
import PositionLine from './positionLines/PositionLine'
import PositionBand from './positionLines/PositionBand'

export default function PositionLines({
  getTopPercentage
}: {
  getTopPercentage: (price: number) => number
}): React.JSX.Element {
  const { state } = useStateStore()
  const { userTrades, settings } = state || {}
  const { selectedSymbol } = settings || {}
  const { positions = [] } = userTrades || {}

  const filteredPositions = positions.filter((position) => position.symbol === selectedSymbol)

  return (
    <>
      {filteredPositions?.map((position) => (
        <>
          <PositionLine position={position} getTopPercentage={getTopPercentage} />
          <PositionBand position={position} getTopPercentage={getTopPercentage} />
        </>
      ))}
    </>
  )
}

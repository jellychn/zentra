import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { memo } from 'react'
import PositionLine from './positionLines/PositionLine'

const PositionLines = memo(
  ({ getPositionPercentage }: { getPositionPercentage: (price: number) => number }) => {
    const { state } = useStateStore()
    const { userTrades, settings } = state || {}
    const { selectedSymbol } = settings || {}
    const { positions = [] } = userTrades || {}

    const filteredPositions = positions.filter((position) => position.symbol === selectedSymbol)

    return (
      <div>
        {filteredPositions.map((position: any, index: number) => (
          <PositionLine
            key={`${position.entryPrice}-${index}`}
            position={position}
            getPositionPercentage={getPositionPercentage}
          />
        ))}
      </div>
    )
  }
)

PositionLines.displayName = 'PositionLines'
export default PositionLines

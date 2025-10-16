import { memo } from 'react'

import { useStateStore } from '../../contexts/StateStoreContext'
import PositionBand from './positionBands/PositionBand'
import { Trade } from 'src/main/db/dbTrades'

const PositionBands = memo(
  ({ getPositionPercentage }: { getPositionPercentage: (price: number) => number }) => {
    const { state } = useStateStore()
    const { userTrades, settings } = state || {}
    const { selectedSymbol } = settings || {}
    const { positions = [] } = userTrades || {}

    const filteredPositions = positions.filter((position) => position.symbol === selectedSymbol)

    return (
      <div>
        {filteredPositions.map((position: Trade, index: number) => {
          return (
            <PositionBand
              key={`band-${position.entryPrice}-${index}`}
              position={position}
              getPositionPercentage={getPositionPercentage}
            />
          )
        })}
      </div>
    )
  }
)

PositionBands.displayName = 'PositionBands'
export default PositionBands

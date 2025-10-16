import { memo } from 'react'

import { useStateStore } from '../../contexts/StateStoreContext'
import ProfitLine from './profitPriceLines/ProfitLine'

const ProfitPriceLines = memo(
  ({ getPositionPercentage }: { getPositionPercentage: (price: number) => number }) => {
    const { state } = useStateStore()
    const { userTrades, settings } = state || {}
    const { selectedSymbol } = settings || {}
    const { positions = [] } = userTrades || {}

    const filteredPositions = positions.filter((position) => position.symbol === selectedSymbol)

    return (
      <>
        {filteredPositions.map((position: any, index: number) => (
          <ProfitLine
            key={index}
            position={position}
            getPositionPercentage={getPositionPercentage}
          />
        ))}
      </>
    )
  }
)

ProfitPriceLines.displayName = 'ProfitPriceLines'

export default ProfitPriceLines

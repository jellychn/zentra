import { usePositionColors } from '@renderer/hooks/usePositionColors'
import { usePriceLines } from '@renderer/hooks/usePriceLines'
import { memo } from 'react'
import BreakEven from './BreakEven'
import TakerProfit from './TakerProfit'
import MakerProfit from './MakerProfit'
import { Trade } from 'src/main/db/dbTrades'

const ProfitLine = memo(
  ({
    position,
    getPositionPercentage
  }: {
    position: Trade
    getPositionPercentage: (price: number) => number
  }) => {
    const { breakEvenColor, makerColor, takerColor } = usePositionColors(position)
    const { isLong, breakEvenPriceLine, profitableMakerPriceLine, profitableTakerPriceLine } =
      usePriceLines(position)

    return (
      <>
        {/* Break-even line */}
        <div
          style={{
            position: 'absolute',
            top: `${getPositionPercentage(breakEvenPriceLine)}%`,
            left: '0',
            right: '0',
            height: '1px',
            background: 'transparent',
            border: `1px dashed ${breakEvenColor}`
          }}
        >
          <BreakEven breakEvenColor={breakEvenColor} breakEvenPriceLine={breakEvenPriceLine} />
        </div>

        {/* Maker profit line */}
        <div
          style={{
            position: 'absolute',
            top: `${getPositionPercentage(profitableMakerPriceLine)}%`,
            left: '0',
            right: '0',
            height: '1px',
            background: 'transparent',
            border: `1px dashed ${makerColor}`
          }}
        >
          <MakerProfit
            isLong={isLong}
            makerColor={makerColor}
            profitableMakerPriceLine={profitableMakerPriceLine}
          />
        </div>

        {/* Taker profit line */}
        <div
          style={{
            position: 'absolute',
            top: `${getPositionPercentage(profitableTakerPriceLine)}%`,
            left: '0',
            right: '0',
            height: '1px',
            background: 'transparent',
            border: `1px dashed ${takerColor}`
          }}
        >
          <TakerProfit
            takerColor={takerColor}
            profitableTakerPriceLine={profitableTakerPriceLine}
          />
        </div>
      </>
    )
  }
)

ProfitLine.displayName = 'ProfitLine'
export default ProfitLine

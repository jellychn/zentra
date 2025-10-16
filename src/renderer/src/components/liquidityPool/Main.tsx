import { useCallback, useState } from 'react'
import { ProcessedLiquidityItem } from '../LiqudityPool'
import { COLORS } from './colors'
import LiquidityBar from './LiquidityBar'
import CurrentPriceLine from './CurrentPriceLine'
import HoveredPriceLine from './HoveredPriceLine'
import PriceLabel from './PriceLabel'
import { usePriceLine } from '@renderer/contexts/PriceLineContext'
import { useStateStore } from '@renderer/contexts/StateStoreContext'
import PositionLines from './PositionLines'
import PositionBands from './PositionBands'
import OrderLines from './OrderLines'
import ProfitPriceLines from './ProfitPriceLines'

const Main = ({
  filteredLeftData,
  filteredRightData,
  maxLeftLiquidity,
  maxRightLiquidity,
  leftAvgLiquidity,
  rightAvgLiquidity,
  displayMax,
  displayMin,
  getPositionPercentage
}: {
  filteredLeftData: ProcessedLiquidityItem[]
  filteredRightData: ProcessedLiquidityItem[]
  maxLeftLiquidity: number
  maxRightLiquidity: number
  leftAvgLiquidity: number
  rightAvgLiquidity: number
  displayMax: number
  displayMin: number
  getPositionPercentage: (price: number) => number
}): React.JSX.Element => {
  const { hoverPrice } = usePriceLine()
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { lastPrice = 0 } = exchangeData || {}

  const [hoveredSide, setHoveredSide] = useState('left')

  const getBarWidth = useCallback(
    (liquidity: number, side: 'left' | 'right') => {
      const absLiquidity = Math.abs(liquidity)
      const sideMaxLiquidity = side === 'left' ? maxLeftLiquidity : maxRightLiquidity
      const scalingMax =
        sideMaxLiquidity > 0 ? sideMaxLiquidity : Math.max(maxLeftLiquidity, maxRightLiquidity)

      if (scalingMax === 0) return 20

      const sqrtMax = Math.sqrt(scalingMax)
      const sqrtValue = Math.sqrt(absLiquidity)
      const normalizedSqrt = sqrtValue / sqrtMax
      const powerNormalized = (absLiquidity / scalingMax) ** 0.7
      const combined = (normalizedSqrt * 0.6 + powerNormalized * 0.4) * 0.8

      const baseWidth = combined * 100
      return Math.max(20, Math.min(baseWidth, 100))
    },
    [maxLeftLiquidity, maxRightLiquidity]
  )

  const getAgeBasedOpacity = useCallback((item: ProcessedLiquidityItem): number => {
    if (!item.age) return 0.1

    const FRESH = 60
    const RECENT_THRESHOLD = 180
    const OLD_THRESHOLD = 300
    const VERY_OLD_THRESHOLD = 900

    if (item.age <= FRESH) return 1
    if (item.age <= RECENT_THRESHOLD) return 0.8
    if (item.age <= OLD_THRESHOLD) return 0.6
    if (item.age <= VERY_OLD_THRESHOLD) return 0.2
    return 0.1
  }, [])

  return (
    <div
      style={{
        position: 'relative',
        height: '100%',
        background: 'rgba(15, 23, 42, 0.3)',
        borderRadius: '8px',
        margin: '8px',
        border: `1px solid ${COLORS.border}`,
        flex: 1
      }}
    >
      {filteredLeftData.map((item) => (
        <LiquidityBar
          key={`left-${item.price}`}
          price={item.price}
          liquidity={item.liquidity}
          position={getPositionPercentage(item.price)}
          barWidth={getBarWidth(item.liquidity, 'left')}
          maxLiquidity={maxLeftLiquidity}
          avgLiquidity={leftAvgLiquidity}
          isCurrentPrice={Math.abs(item.price - lastPrice) < 0.001}
          side="left"
          type="pool"
          age={item.age}
          getAgeBasedOpacity={getAgeBasedOpacity}
          currentPricePosition={getPositionPercentage(lastPrice)}
          setHoveredSide={setHoveredSide}
        />
      ))}
      {filteredRightData.map((item) => (
        <LiquidityBar
          key={`right-${item.price}-${item.side}`}
          price={item.price}
          liquidity={item.liquidity}
          position={getPositionPercentage(item.price)}
          barWidth={getBarWidth(item.liquidity, 'right')}
          maxLiquidity={maxRightLiquidity}
          avgLiquidity={rightAvgLiquidity}
          isCurrentPrice={Math.abs(item.price - lastPrice) < 0.001}
          side="right"
          type={item.side}
          getAgeBasedOpacity={getAgeBasedOpacity}
          currentPricePosition={getPositionPercentage(lastPrice)}
          setHoveredSide={setHoveredSide}
        />
      ))}

      <CurrentPriceLine price={lastPrice} position={getPositionPercentage(lastPrice)} />
      <HoveredPriceLine
        price={hoverPrice}
        position={getPositionPercentage(hoverPrice)}
        hoveredSide={hoveredSide}
      />

      <PositionLines getPositionPercentage={getPositionPercentage} />
      <PositionBands getPositionPercentage={getPositionPercentage} />
      <OrderLines getPositionPercentage={getPositionPercentage} />
      <ProfitPriceLines getPositionPercentage={getPositionPercentage} />

      <PriceLabel price={displayMin} position={100} label="MIN" side="left" />
      <PriceLabel price={displayMax} position={0} label="MAX" side="left" />
    </div>
  )
}

export default Main

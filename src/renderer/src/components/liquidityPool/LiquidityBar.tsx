import React, { useRef, memo } from 'react'
import { ProcessedLiquidityItem } from '../LiqudityPool'
import { usePriceLine } from '@renderer/contexts/PriceLineContext'
import PlaceOrder from './PlaceOrder'
import BarTooltip from './BarTooltip'
import {
  BandStyles,
  BarElementStyle,
  ContainerStyle,
  getBarStyles,
  getTooltipData,
  PatternStyle
} from './liquidityBar/helper'
import ConnectionBands from './liquidityBar/ConnectionBands'
import { useAutoClosePopup } from './hooks/useAutoClosePopup'
import { useCleanUp } from './hooks/useCleanUp'
import { useBarState } from './hooks/useBarState'

const LiquidityBar = memo(
  ({
    price,
    liquidity,
    position,
    barWidth,
    maxLiquidity,
    avgLiquidity,
    isCurrentPrice,
    side,
    type,
    age,
    getAgeBasedOpacity,
    currentPricePosition,
    setHoveredSide
  }: {
    price: number
    liquidity: number
    position: number
    barWidth: number
    maxLiquidity: number
    avgLiquidity: number
    isCurrentPrice: boolean
    side: 'left' | 'right'
    type: 'pool' | 'bid' | 'ask'
    age?: number
    getAgeBasedOpacity: (item: ProcessedLiquidityItem) => number
    currentPricePosition: number
    setHoveredSide: (side: string) => void
  }): React.JSX.Element => {
    const { setHoverPrice } = usePriceLine()

    const {
      hovered,
      clicked,
      hoverTimeoutRef,
      clickTimeoutRef,
      handleMouseEnter,
      handleMouseLeave,
      handleClick,
      setHovered,
      setClicked
    } = useBarState(price, side, setHoveredSide)
    const barRef = useRef<HTMLDivElement>(null)

    useAutoClosePopup({ clicked, clickTimeoutRef, setClicked })
    useCleanUp({
      barRef,
      setClicked,
      setHovered,
      setHoverPrice,
      setHoveredSide,
      hoverTimeoutRef,
      clickTimeoutRef
    })

    const tooltipData = getTooltipData({
      liquidity,
      maxLiquidity,
      age
    })
    const barStyles = getBarStyles({ liquidity, maxLiquidity, type, age, getAgeBasedOpacity })

    const bandStyles = BandStyles({ hovered, clicked, currentPricePosition, position, side })
    const containerStyle = ContainerStyle({
      position,
      side,
      hovered,
      clicked,
      isCurrentPrice,
      tooltipData
    })
    const barElementStyle = BarElementStyle({
      barWidth,
      barStyles,
      hovered,
      clicked
    })

    const patternStyle = PatternStyle({ tooltipData, barStyles, type })

    return (
      <>
        <ConnectionBands bandStyles={bandStyles} side={side} />
        <div
          ref={barRef}
          style={containerStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          <div style={barElementStyle}>{patternStyle && <div style={patternStyle} />}</div>

          <BarTooltip
            hovered={hovered}
            tooltipData={tooltipData}
            side={side}
            position={position}
            maxLiquidity={maxLiquidity}
            type={type}
            isNegative={liquidity < 0}
            age={age}
            avgLiquidity={avgLiquidity}
          />

          <PlaceOrder
            clicked={clicked}
            price={price}
            side={side}
            setClicked={setClicked}
            setHoverPrice={setHoverPrice}
          />
        </div>
      </>
    )
  }
)

LiquidityBar.displayName = 'LiquidityBar'

export default LiquidityBar

import React, { useCallback, useRef, useState, memo } from 'react'
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

    const [hovered, setHovered] = useState(false)
    const [clicked, setClicked] = useState(false)
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const barRef = useRef<HTMLDivElement>(null)

    const handleMouseEnter = useCallback(() => {
      hoverTimeoutRef.current = setTimeout(() => {
        if (!clicked) {
          setHovered(true)
          setHoverPrice(price)
          setHoveredSide(side)
        }
      }, 50)
    }, [clicked, setHoverPrice, price, setHoveredSide, side])

    const handleMouseLeave = useCallback(() => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      if (!clicked) {
        setHovered(false)
        setHoverPrice(null)
        setHoveredSide('left')
      }
    }, [clicked, setHoverPrice, setHoveredSide])

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        setHovered(false)
        setHoverPrice(null)
        setHoveredSide('left')
        setClicked(true)
      },
      [setHoverPrice, setHoveredSide]
    )

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

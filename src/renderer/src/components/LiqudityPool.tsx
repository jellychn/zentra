import { useStateStore } from '@renderer/contexts/StateStoreContext'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Header from './liquidityPool/Header'
import NoLiquidityData from './liquidityPool/NoLiquidityData'
import Timeframe from './liquidityPool/Timeframe'
import AverageFilterIndicator from './liquidityPool/AverageFilterIndicator'
import { COLORS } from './liquidityPool/colors'
import { ProcessedOrderBook } from 'src/main/data/types'
import CurrentPriceLine from './liquidityPool/CurrentPriceLine'
import PriceLabel from './liquidityPool/PriceLabel'
import LiquidityBar from './liquidityPool/LiquidityBar'
import { usePriceLine } from '@renderer/contexts/PriceLineContext'
import HoveredPriceLine from './liquidityPool/HoveredPriceLine'
import BarTooltip from './liquidityPool/BarTooltip'

interface LiquidityData {
  volume: number
  last_updated: number
  side: 'buy' | 'sell' | 'unknown'
}

export interface ProcessedLiquidityItem {
  price: number
  liquidity: number
  side: 'pool' | 'bid' | 'ask'
  last_updated?: number
  age?: number
}

export default function LiquidityPool(): React.JSX.Element {
  const { hoverPrice } = usePriceLine()
  const { state } = useStateStore()
  const { metrics, exchangeData } = state || {}
  const { lastPrice = 0, orderbook = {} } = exchangeData || {}
  const { bids = {}, asks = {} } = (orderbook as ProcessedOrderBook) || {}
  const { tradeLiquidity = {} } = metrics || {}

  const [hoveredSide, setHoveredSide] = useState('left')
  const [currentTime, setCurrentTime] = useState(Date.now())
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const currentTimeNs = currentTime * 1000000

  const { leftLiquidityData, rightLiquidityData, hasLiquidityPool, hasOrderBook } = useMemo(() => {
    const hasOrderBook = orderbook && (Object.keys(bids).length > 0 || Object.keys(asks).length > 0)
    const hasLiquidityPool = tradeLiquidity && Object.keys(tradeLiquidity).length > 0

    const leftLiquidityData: ProcessedLiquidityItem[] = hasLiquidityPool
      ? Object.entries(tradeLiquidity)
          .map(([price, liquidityData]) => {
            const data = liquidityData as LiquidityData
            const ageInSeconds = (currentTimeNs - data.last_updated) / 1000000000
            return {
              price: parseFloat(price),
              liquidity: data.volume,
              side: 'pool' as const,
              last_updated: data.last_updated,
              age: ageInSeconds
            }
          })
          .sort((a, b) => a.price - b.price)
      : []

    const rightLiquidityData: ProcessedLiquidityItem[] = []
    if (hasOrderBook) {
      if (bids && Object.keys(bids).length > 0) {
        Object.entries(bids).forEach(([price, amount]) => {
          rightLiquidityData.push({
            price: parseFloat(price),
            liquidity: -(amount as number),
            side: 'bid' as const
          })
        })
      }
      if (asks && Object.keys(asks).length > 0) {
        Object.entries(asks).forEach(([price, amount]) => {
          rightLiquidityData.push({
            price: parseFloat(price),
            liquidity: amount as number,
            side: 'ask' as const
          })
        })
      }
    }

    return {
      leftLiquidityData,
      rightLiquidityData,
      hasLiquidityPool,
      hasOrderBook
    }
  }, [orderbook, bids, asks, tradeLiquidity, currentTimeNs])
  const { maxLeftLiquidity, maxRightLiquidity, leftAvgLiquidity, rightAvgLiquidity } =
    useMemo(() => {
      const leftLiquidityValues = leftLiquidityData.map((item) => Math.abs(item.liquidity))
      const rightLiquidityValues = rightLiquidityData.map((item) => Math.abs(item.liquidity))

      const maxLeftLiquidity = leftLiquidityValues.length > 0 ? Math.max(...leftLiquidityValues) : 0
      const maxRightLiquidity =
        rightLiquidityValues.length > 0 ? Math.max(...rightLiquidityValues) : 0

      const leftAvgLiquidity =
        leftLiquidityValues.length > 0
          ? leftLiquidityValues.reduce((sum, val) => sum + val, 0) / leftLiquidityValues.length
          : 0

      const rightAvgLiquidity =
        rightLiquidityValues.length > 0
          ? rightLiquidityValues.reduce((sum, val) => sum + val, 0) / rightLiquidityValues.length
          : 0

      return {
        maxLeftLiquidity,
        maxRightLiquidity,
        leftAvgLiquidity,
        rightAvgLiquidity
      }
    }, [leftLiquidityData, rightLiquidityData])

  const { filteredLeftData, filteredRightData, displayData } = useMemo(() => {
    const filteredLeftData = leftLiquidityData
    const filteredRightData = rightLiquidityData.filter(
      (item) => Math.abs(item.liquidity) > rightAvgLiquidity
    )
    const displayData = [...filteredLeftData, ...filteredRightData]

    return { filteredLeftData, filteredRightData, displayData }
  }, [leftLiquidityData, rightLiquidityData, rightAvgLiquidity])

  const { displayMin, displayMax, getPositionPercentage } = useMemo(() => {
    const allData = [...leftLiquidityData, ...rightLiquidityData]

    if (allData.length === 0) {
      return {
        displayMin: 0,
        displayMax: 0,
        getPositionPercentage: () => 50
      }
    }

    const minPrice = Math.min(...allData.map((item) => item.price))
    const maxPrice = Math.max(...allData.map((item) => item.price))
    const priceRange = maxPrice - minPrice
    const buffer = priceRange * 0.05
    const displayMin = minPrice - buffer
    const displayMax = maxPrice + buffer

    const getPositionPercentage = (price: number | null): number => {
      if (!price) {
        return 0
      }

      if (displayMax === displayMin) return 50

      // Calculate percentage with 20px gaps at top and bottom
      // The available height is 100% - 40px (20px top + 20px bottom)
      const percentage = ((displayMax - price) / (displayMax - displayMin)) * 100

      // Convert to constrained percentage within the padded area
      // 0% = 20px from top, 100% = 20px from bottom
      const constrainedPercentage = percentage * 0.8 + 10 // 80% range + 10% offset

      return Math.max(0, Math.min(100, constrainedPercentage))
    }

    return { displayMin, displayMax, getPositionPercentage }
  }, [leftLiquidityData, rightLiquidityData])

  if (!hasOrderBook && !hasLiquidityPool) {
    return <NoLiquidityData />
  }

  if (displayData.length === 0) {
    return (
      <NoLiquidityData
        message="No significant liquidity data above average"
        showAverageWarning={true}
        leftAvgLiquidity={leftAvgLiquidity}
        rightAvgLiquidity={rightAvgLiquidity}
        hasLiquidityPool={hasLiquidityPool}
        hasOrderBook={hasOrderBook}
      />
    )
  }

  return (
    <div
      style={{
        flex: 1,
        background: COLORS.background,
        borderRight: `1px solid ${COLORS.border}`,
        // overflow: 'hidden',
        padding: '0 0 10px 20px',
        zIndex: 1,
        backdropFilter: 'blur(20px)',
        minWidth: '400px',
        maxWidth: '400px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Header hasLiquidityPool={hasLiquidityPool} hasOrderBook={hasOrderBook} />
      <Instruction />
      <Timeframe />
      <Main
        lastPrice={lastPrice}
        hoverPrice={hoverPrice}
        filteredLeftData={filteredLeftData}
        filteredRightData={filteredRightData}
        maxLeftLiquidity={maxLeftLiquidity}
        maxRightLiquidity={maxRightLiquidity}
        leftAvgLiquidity={leftAvgLiquidity}
        rightAvgLiquidity={rightAvgLiquidity}
        displayMax={displayMax}
        displayMin={displayMin}
        hoveredSide={hoveredSide}
        getPositionPercentage={getPositionPercentage}
        setHoveredSide={setHoveredSide}
      />
      <AverageFilterIndicator
        hasLiquidityPool={hasLiquidityPool}
        hasOrderBook={hasOrderBook}
        leftAvgLiquidity={leftAvgLiquidity}
        rightAvgLiquidity={rightAvgLiquidity}
      />
    </div>
  )
}

const Instruction = (): React.JSX.Element => {
  return (
    <div
      style={{
        fontSize: '10px',
        color: COLORS.text.muted,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: '8px',
        letterSpacing: '0.3px',
        lineHeight: '1.4'
      }}
    >
      <div>SHIFT: HIDE HOVER • HOVER BARS FOR DETAILS</div>
      <div
        style={{
          marginTop: '2px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div
            style={{ width: '8px', height: '2px', background: '#8b5cf6', borderRadius: '1px' }}
          />
          <span>PRICE FREQ (12H)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div
            style={{ width: '8px', height: '2px', background: '#22c55e', borderRadius: '1px' }}
          />
          <span>VOLUME (12H)</span>
        </div>
      </div>
    </div>
  )
}

const Main = ({
  lastPrice,
  hoverPrice,
  filteredLeftData,
  filteredRightData,
  maxLeftLiquidity,
  maxRightLiquidity,
  leftAvgLiquidity,
  rightAvgLiquidity,
  displayMax,
  displayMin,
  hoveredSide,
  getPositionPercentage,
  setHoveredSide
}: {
  lastPrice: number
  hoverPrice: number | null
  filteredLeftData: ProcessedLiquidityItem[]
  filteredRightData: ProcessedLiquidityItem[]
  maxLeftLiquidity: number
  maxRightLiquidity: number
  leftAvgLiquidity: number
  rightAvgLiquidity: number
  displayMax: number
  displayMin: number
  hoveredSide: string
  getPositionPercentage: (price: number) => number
  setHoveredSide: (side: string) => void
}): React.JSX.Element => {
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

      <BarTooltip />

      {/* TODO: <PositionLines getPositionPercentage={getPositionPercentage} />
      <PositionBands getPositionPercentage={getPositionPercentage} />
      <ProfitPriceLines getPositionPercentage={getPositionPercentage} />
      <OrderLines getPositionPercentage={getPositionPercentage} /> */}

      <PriceLabel price={displayMin} position={100} label="MIN" side="left" />
      <PriceLabel price={displayMax} position={0} label="MAX" side="left" />
    </div>
  )
}

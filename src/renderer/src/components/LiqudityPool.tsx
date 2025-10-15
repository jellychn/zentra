import { useStateStore } from '@renderer/contexts/StateStoreContext'
import React, { useMemo } from 'react'
import Header from './liquidityPool/Header'
import NoLiquidityData from './liquidityPool/NoLiquidityData'
import Timeframe from './liquidityPool/Timeframe'
import { COLORS } from './liquidityPool/colors'
import Instruction from './liquidityPool/Instruction'
import Main from './liquidityPool/Main'
import { useCurrentTime } from './liquidityPool/hooks/useCurrentTime'
import { useLiquidityData } from './liquidityPool/hooks/useLiquidityData'
import { useLiquidityMetrics } from './liquidityPool/hooks/useLiquidityMetrics'
import { usePriceRange } from './liquidityPool/hooks/usePriceRange'

export interface LiquidityData {
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
  const { state } = useStateStore()
  const { metrics, exchangeData } = state || {}
  const { orderbook = {} } = exchangeData || {}
  const { tradeLiquidity = {} } = metrics || {}

  const currentTime = useCurrentTime()
  const currentTimeNs = currentTime * 1000000

  const { leftLiquidityData, rightLiquidityData, hasLiquidityPool, hasOrderBook } =
    useLiquidityData(orderbook, tradeLiquidity, currentTimeNs)

  const { maxLeftLiquidity, maxRightLiquidity, leftAvgLiquidity, rightAvgLiquidity } =
    useLiquidityMetrics(leftLiquidityData, rightLiquidityData)

  const { displayMin, displayMax, getPositionPercentage } = usePriceRange(
    leftLiquidityData,
    rightLiquidityData
  )

  const { filteredLeftData, filteredRightData, displayData } = useMemo(() => {
    const filteredRightData = rightLiquidityData.filter(
      (item) => Math.abs(item.liquidity) > rightAvgLiquidity
    )
    const displayData =
      leftLiquidityData.length + filteredRightData.length > 0
        ? [...leftLiquidityData, ...filteredRightData]
        : []

    return {
      filteredLeftData: leftLiquidityData,
      filteredRightData,
      displayData
    }
  }, [leftLiquidityData, rightLiquidityData, rightAvgLiquidity])

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
        padding: '0 0 10px 20px',
        zIndex: 2,
        backdropFilter: 'blur(20px)',
        minWidth: '350px',
        maxWidth: '350px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Header hasLiquidityPool={hasLiquidityPool} hasOrderBook={hasOrderBook} />
      <Instruction />
      <Timeframe />
      <Main
        filteredLeftData={filteredLeftData}
        filteredRightData={filteredRightData}
        maxLeftLiquidity={maxLeftLiquidity}
        maxRightLiquidity={maxRightLiquidity}
        leftAvgLiquidity={leftAvgLiquidity}
        rightAvgLiquidity={rightAvgLiquidity}
        displayMax={displayMax}
        displayMin={displayMin}
        getPositionPercentage={getPositionPercentage}
      />
    </div>
  )
}

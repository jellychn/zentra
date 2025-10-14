import { useStateStore } from '@renderer/contexts/StateStoreContext'
import React, { useEffect, useMemo, useState } from 'react'
import Header from './liquidityPool/Header'
import NoLiquidityData from './liquidityPool/NoLiquidityData'
import Timeframe from './liquidityPool/Timeframe'
import { COLORS } from './liquidityPool/colors'
import { ProcessedOrderBook } from 'src/main/data/types'
import Instruction from './liquidityPool/Instruction'
import Main from './liquidityPool/Main'

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
  const { state } = useStateStore()
  const { metrics, exchangeData } = state || {}
  const { orderbook = {} } = exchangeData || {}
  const { bids = {}, asks = {} } = (orderbook as ProcessedOrderBook) || {}
  const { tradeLiquidity = {} } = metrics || {}

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

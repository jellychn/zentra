import { LiquidityData, ProcessedLiquidityItem } from '@renderer/components/LiqudityPool'
import { useMemo } from 'react'
import { ProcessedOrderBook } from 'src/main/data/types'

export const useLiquidityData = (
  orderbook: ProcessedOrderBook | undefined,
  tradeLiquidity: ProcessedOrderBook,
  currentTimeNs: number
): {
  leftLiquidityData
  rightLiquidityData
  hasLiquidityPool
  hasOrderBook
} => {
  return useMemo(() => {
    const bids = orderbook?.bids || {}
    const asks = orderbook?.asks || {}

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
  }, [orderbook, tradeLiquidity, currentTimeNs])
}

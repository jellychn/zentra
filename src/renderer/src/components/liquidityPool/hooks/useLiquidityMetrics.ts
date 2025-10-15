import { ProcessedLiquidityItem } from '@renderer/components/LiqudityPool'
import { useMemo } from 'react'

export const useLiquidityMetrics = (
  leftLiquidityData: ProcessedLiquidityItem[],
  rightLiquidityData: ProcessedLiquidityItem[]
): {
  maxLeftLiquidity
  maxRightLiquidity
  leftAvgLiquidity
  rightAvgLiquidity
} => {
  return useMemo(() => {
    // Calculate metrics in single passes
    let leftSum = 0,
      rightSum = 0
    let leftMax = 0,
      rightMax = 0
    let leftCount = 0,
      rightCount = 0

    // Process left data
    for (let i = 0; i < leftLiquidityData.length; i++) {
      const absVal = Math.abs(leftLiquidityData[i].liquidity)
      leftSum += absVal
      leftCount++
      if (absVal > leftMax) leftMax = absVal
    }

    // Process right data
    for (let i = 0; i < rightLiquidityData.length; i++) {
      const absVal = Math.abs(rightLiquidityData[i].liquidity)
      rightSum += absVal
      rightCount++
      if (absVal > rightMax) rightMax = absVal
    }

    return {
      maxLeftLiquidity: leftMax,
      maxRightLiquidity: rightMax,
      leftAvgLiquidity: leftCount > 0 ? leftSum / leftCount : 0,
      rightAvgLiquidity: rightCount > 0 ? rightSum / rightCount : 0
    }
  }, [leftLiquidityData, rightLiquidityData])
}

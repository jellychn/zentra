import { ProcessedLiquidityItem } from '@renderer/components/LiqudityPool'
import { useMemo } from 'react'

export const usePriceRange = (
  leftLiquidityData: ProcessedLiquidityItem[],
  rightLiquidityData: ProcessedLiquidityItem[]
): {
  displayMin
  displayMax
  getPositionPercentage
} => {
  return useMemo(() => {
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
}

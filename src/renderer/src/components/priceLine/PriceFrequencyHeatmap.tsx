import { useStateStore } from '@renderer/contexts/StateStoreContext'
import React, { memo } from 'react'

interface PriceFrequencyHeatmapProps {
  getTopPercentage: (price: number) => number
}

const PriceFrequencyHeatmap = memo(
  ({ getTopPercentage }: PriceFrequencyHeatmapProps): React.JSX.Element => {
    const { state } = useStateStore()
    const { metrics } = state || {}
    const { priceFrequency = {} } = metrics || {}

    const prices = Object.keys(priceFrequency)
      .map(Number)
      .sort((a, b) => a - b)
    const maxFrequency = Math.max(...Object.values(priceFrequency), 1)

    // Calculate frequency thresholds for better visual hierarchy
    const highFrequencyThreshold = maxFrequency * 0.7
    const mediumFrequencyThreshold = maxFrequency * 0.4

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '12px', // Increased width to accommodate larger elements
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        {prices.map((price) => {
          const frequency = priceFrequency[price]
          const frequencyRatio = frequency / maxFrequency

          // Enhanced opacity scaling with exponential curve for better differentiation
          const frequencyOpacity = Math.max(0.2, Math.min(0.9, Math.pow(frequencyRatio, 0.7)))

          // Dynamic sizing based on frequency with exponential scaling
          const baseWidth = 8
          const maxAdditionalWidth = 25
          const width = baseWidth + Math.pow(frequencyRatio, 1.5) * maxAdditionalWidth

          // Dynamic height based on frequency
          const baseHeight = 2
          const maxAdditionalHeight = 6
          const height = baseHeight + Math.pow(frequencyRatio, 1.3) * maxAdditionalHeight

          // Color intensity based on frequency
          const baseColor = [139, 92, 246] // Purple base
          const intensity = 0.3 + frequencyRatio * 0.7

          // Determine visual prominence level
          const isHighFrequency = frequency >= highFrequencyThreshold
          const isMediumFrequency =
            frequency >= mediumFrequencyThreshold && frequency < highFrequencyThreshold

          return (
            <div
              key={price}
              style={{
                position: 'absolute',
                left: 0,
                top: `${getTopPercentage(price)}%`,
                width: `${width}px`,
                height: `${height}px`,
                background: isHighFrequency
                  ? `linear-gradient(90deg, 
                     rgba(139, 92, 246, ${intensity}), 
                     rgba(168, 85, 247, ${intensity * 0.8}))`
                  : `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${intensity})`,
                borderRadius: isHighFrequency ? '3px' : '2px',
                transform: `translateY(-${height / 2}px)`,
                transition: 'all 0.3s ease',
                zIndex: isHighFrequency ? 3 : isMediumFrequency ? 2 : 1
              }}
            />
          )
        })}
      </div>
    )
  }
)

PriceFrequencyHeatmap.displayName = 'PriceFrequencyHeatmap'

export default PriceFrequencyHeatmap

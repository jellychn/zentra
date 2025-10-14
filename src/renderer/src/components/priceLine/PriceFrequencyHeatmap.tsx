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

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '8px',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        {prices.map((price) => {
          const frequency = priceFrequency[price]
          const frequencyOpacity = Math.max(0.1, Math.min(0.8, frequency / maxFrequency))

          return (
            <div
              key={price}
              style={{
                position: 'absolute',
                left: 0,
                top: `${getTopPercentage(price)}%`,
                width: `${10 + (frequency / maxFrequency) * 20}px`,
                height: '3px',
                background: `rgba(139, 92, 246, ${0.2 + frequencyOpacity * 0.6})`,
                borderRadius: '1.5px',
                transform: 'translateY(-1.5px)',
                boxShadow:
                  frequency > maxFrequency * 0.8 ? '0 0 8px rgba(139, 92, 246, 0.6)' : 'none'
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

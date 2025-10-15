import { useStateStore } from '@renderer/contexts/StateStoreContext'
import React, { memo } from 'react'

interface VolumeProfileBarsProps {
  showHoverPrice: boolean
  getTopPercentage: (price: number) => number
}

const VolumeProfileBars = memo(
  ({ showHoverPrice, getTopPercentage }: VolumeProfileBarsProps): React.JSX.Element => {
    const { state } = useStateStore()
    const { metrics } = state || {}
    const {
      volumeProfile = {},
      volumeSentimentByPrice = {},
      cumulativeVolumeSentiment
    } = metrics || {}

    const maxVolume = Math.max(...Object.values(volumeProfile).map(Math.abs), 1)

    const avgTurnover = cumulativeVolumeSentiment?.avgTurnover || 0

    if (!showHoverPrice) {
      return <></>
    }

    return (
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '12px',
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        {Object.entries(volumeProfile).map(([price, netVolume]) => {
          const sentimentData = volumeSentimentByPrice[price] || {
            positive: 0,
            negative: 0,
            turnover: 0
          }
          const volumeRatio = Math.abs(netVolume) / maxVolume

          // Determine if this price level is positive or negative
          const isPositive = netVolume > 0
          const isHighTurnover = sentimentData.turnover > avgTurnover

          // Match frequency heatmap sizing with exponential scaling
          const baseWidth = 8
          const maxAdditionalWidth = 25
          const width = baseWidth + Math.pow(volumeRatio, 1.5) * maxAdditionalWidth

          // Dynamic height based on volume
          const baseHeight = 2
          const maxAdditionalHeight = 6
          const height = baseHeight + Math.pow(volumeRatio, 1.3) * maxAdditionalHeight

          // Color based on sentiment - red for negative, green for positive
          const positiveBaseColor = [34, 197, 94] // Green base
          const negativeBaseColor = [239, 68, 68] // Red base
          const positiveHighlightColor = [16, 185, 129] // Emerald green
          const negativeHighlightColor = [220, 38, 38] // Darker red

          // Use base color for normal, highlight color for high turnover
          const baseColor = isPositive ? positiveBaseColor : negativeBaseColor
          const highlightColor = isPositive ? positiveHighlightColor : negativeHighlightColor

          // Color intensity based on volume ratio
          const intensity = 0.3 + volumeRatio * 0.7

          // Determine visual prominence level based on turnover
          const isHighVolume = isHighTurnover
          const isMediumVolume = !isHighVolume && volumeRatio > 0.4

          return (
            <div
              key={price}
              style={{
                position: 'absolute',
                right: 0, // Position on right side instead of left
                top: `${getTopPercentage(Number(price))}%`,
                width: `${width}px`,
                height: `${height}px`,
                background: isHighVolume
                  ? `linear-gradient(90deg, 
                     rgba(${highlightColor[0]}, ${highlightColor[1]}, ${highlightColor[2]}, ${intensity}), 
                     rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${intensity * 0.8}))`
                  : `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${intensity})`,
                borderRadius: isHighVolume ? '3px' : '2px',
                transform: `translateY(-${height / 2}px)`,
                transition: 'all 0.3s ease',
                zIndex: isHighVolume ? 3 : isMediumVolume ? 2 : 1
              }}
            />
          )
        })}
      </div>
    )
  }
)

VolumeProfileBars.displayName = 'VolumeProfileBars'

export default VolumeProfileBars

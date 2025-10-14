import { useStateStore } from '@renderer/contexts/StateStoreContext'
import React, { memo } from 'react'

interface VolumeProfileBarsProps {
  getTopPercentage: (price: number) => number
}

const VolumeProfileBars = memo(
  ({ getTopPercentage }: VolumeProfileBarsProps): React.JSX.Element => {
    const { state } = useStateStore()
    const { metrics } = state || {}
    const { volumeProfile = {} } = metrics || {}

    const maxVolume = Math.max(...Object.values(volumeProfile), 1)

    // Calculate volume thresholds for visual hierarchy
    const highVolumeThreshold = maxVolume * 0.7
    const mediumVolumeThreshold = maxVolume * 0.4

    return (
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '40px', // Increased width for more prominent bars
          zIndex: 1,
          pointerEvents: 'none'
        }}
      >
        {Object.entries(volumeProfile).map(([price, volume]) => {
          const volumeRatio = volume / maxVolume

          // Enhanced width scaling with exponential curve
          const baseWidth = 30
          const maxAdditionalWidth = 70
          const width = baseWidth + Math.pow(volumeRatio, 1.4) * maxAdditionalWidth

          // Dynamic height based on volume
          const baseHeight = 1
          const maxAdditionalHeight = 8
          const height = baseHeight + Math.pow(volumeRatio, 1.3) * maxAdditionalHeight

          // Color intensity and effects based on volume
          const isHighVolume = volume >= highVolumeThreshold
          const isMediumVolume = volume >= mediumVolumeThreshold && volume < highVolumeThreshold

          // Gradient colors based on volume intensity
          const baseColor = [34, 197, 94] // Green base
          const highVolumeColor = [16, 185, 129] // Emerald for high volume
          const intensity = 0.4 + volumeRatio * 0.6

          return (
            <div
              key={price}
              style={{
                position: 'absolute',
                right: 0,
                top: `${getTopPercentage(Number(price))}%`,
                width: `${width}%`,
                height: `${height}px`,
                background: isHighVolume
                  ? `linear-gradient(90deg, 
                     transparent, 
                     rgba(${highVolumeColor[0]}, ${highVolumeColor[1]}, ${highVolumeColor[2]}, ${intensity}) 30%,
                     rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${intensity * 0.8}))`
                  : isMediumVolume
                    ? `linear-gradient(90deg, 
                     transparent, 
                     rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${intensity}))`
                    : `rgba(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]}, ${intensity})`,
                borderRadius: isHighVolume
                  ? '4px 0 0 4px'
                  : isMediumVolume
                    ? '2px 0 0 2px'
                    : '1px 0 0 1px',
                transform: `translateY(-${height / 2}px)`,
                boxShadow: isHighVolume
                  ? `inset 2px 0 4px rgba(255, 255, 255, 0.3),
                     0 0 12px rgba(34, 197, 94, ${0.3 + volumeRatio * 0.3}),
                     0 0 6px rgba(255, 255, 255, 0.2)`
                  : isMediumVolume
                    ? `inset 1px 0 2px rgba(255, 255, 255, 0.2),
                     0 0 6px rgba(34, 197, 94, ${0.2 + volumeRatio * 0.2})`
                    : `inset 1px 0 1px rgba(255, 255, 255, 0.1)`,
                border: isHighVolume
                  ? '1px solid rgba(255, 255, 255, 0.5)'
                  : isMediumVolume
                    ? '1px solid rgba(255, 255, 255, 0.3)'
                    : 'none',
                borderRight: 'none',
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

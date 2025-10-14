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

    return (
      <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '30px' }}>
        {Object.entries(volumeProfile).map(([price, volume]) => (
          <div
            key={price}
            style={{
              position: 'absolute',
              right: 0,
              top: `${getTopPercentage(Number(price))}%`,
              width: `${(volume / maxVolume) * 100}%`,
              height: '2px',
              background: 'rgba(34, 197, 94, 0.6)',
              transform: 'translateY(-1px)'
            }}
          />
        ))}
      </div>
    )
  }
)

VolumeProfileBars.displayName = 'VolumeProfileBars'

export default VolumeProfileBars

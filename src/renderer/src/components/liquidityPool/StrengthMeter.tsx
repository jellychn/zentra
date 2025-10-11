import { memo } from 'react'
import { COLORS } from './colors'

const StrengthMeter = memo(({ intensity }: { intensity: number }) => {
  const segments = 5
  return (
    <div style={{ display: 'flex', gap: '2px', marginLeft: '6px' }}>
      {[...Array(segments)].map((_, i) => (
        <div
          key={i}
          style={{
            width: '4px',
            height: '10px',
            background:
              i < Math.floor(intensity * segments)
                ? `linear-gradient(180deg, ${COLORS.warning} 0%, #d97706 100%)`
                : 'rgba(255,255,255,0.15)',
            borderRadius: '2px',
            boxShadow: i < Math.floor(intensity * segments) ? `0 0 6px ${COLORS.warning}` : 'none',
            transition: 'all 0.2s ease'
          }}
        />
      ))}
    </div>
  )
})

StrengthMeter.displayName = 'StrengthMeter'
export default StrengthMeter

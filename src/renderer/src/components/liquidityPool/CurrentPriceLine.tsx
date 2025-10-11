import React from 'react'

import { formatNumber } from '../../../../shared/helper'
import { COLORS } from './colors'

const CurrentPriceLine = ({
  price,
  position
}: {
  price: number
  position: number
}): React.JSX.Element => {
  const constrainedPosition = Math.max(0, Math.min(100, position))
  const glow = COLORS.glow

  return (
    <div
      style={{
        position: 'absolute',
        top: `${constrainedPosition}%`,
        left: 0,
        right: 0,
        transform: 'translateY(-50%)',
        zIndex: 35
      }}
    >
      <div
        style={{
          height: '3px',
          background: `linear-gradient(90deg,
                transparent 0%,
                ${COLORS.primary} 50%,
                transparent 100%)`,
          position: 'relative',
          boxShadow: `0 0 20px ${glow.primary}`
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '60px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: COLORS.primary,
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '11px',
          fontWeight: '800',
          color: 'white',
          fontFamily: 'Inter, monospace',
          boxShadow: `0 4px 12px rgba(59, 130, 246, 0.4)`,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        ${formatNumber(price)}
      </div>
    </div>
  )
}

export default CurrentPriceLine

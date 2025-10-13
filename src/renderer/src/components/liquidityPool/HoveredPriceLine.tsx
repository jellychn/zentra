import React, { memo } from 'react'
import { formatNumber } from '../../../../shared/helper'
import { COLORS } from './colors'

const HoveredPriceLine = memo(
  ({
    price,
    position,
    hoveredSide
  }: {
    price: number
    position: number
    hoveredSide: string
  }): React.JSX.Element => {
    const glow = COLORS.glow

    if (!price) {
      return <></>
    }

    return (
      <div
        style={{
          position: 'absolute',
          top: `${position}%`,
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          zIndex: 100,
          pointerEvents: 'none'
        }}
      >
        <div
          style={{
            height: '3px',
            background: `linear-gradient(90deg,
                transparent 0%,
                ${COLORS.hovered} 50%,
                transparent 100%)`,
            position: 'relative',
            boxShadow: `0 0 20px ${glow.hover}`,
            pointerEvents: 'none'
          }}
        />
        <div
          style={{
            position: 'absolute',

            [hoveredSide === 'left' ? 'right' : 'left']: '60px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: COLORS.hovered,
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: '800',
            color: '#1a1a1a',
            fontFamily: 'Inter, monospace',
            boxShadow: `0 4px 12px rgba(255, 183, 77, 0.4)`,
            border: '1px solid rgba(255, 255, 255, 0.4)',
            textShadow: '0 1px 1px rgba(255, 255, 255, 0.3)',
            pointerEvents: 'none'
          }}
        >
          ${formatNumber(price)}
        </div>
      </div>
    )
  }
)

HoveredPriceLine.displayName = 'HoveredPriceLine'

export default HoveredPriceLine

import { memo } from 'react'

import { formatNumber } from '../../../../shared/helper'
import { COLORS } from './colors'

const PriceLabel = memo(
  ({
    price,
    position,
    label,
    side
  }: {
    price: number
    position: number
    label: string
    side: 'left' | 'right'
  }) => {
    const constrainedPosition = Math.max(5, Math.min(95, position))

    return (
      <div
        style={{
          position: 'absolute',
          top: `${constrainedPosition}%`,
          [side]: '12px',
          transform: 'translateY(-50%)',
          background: COLORS.surface,
          padding: '6px 10px',
          borderRadius: '6px',
          fontSize: '10px',
          fontWeight: '700',
          color: COLORS.text.primary,
          fontFamily: 'Inter, monospace',
          border: `1px solid ${COLORS.border}`,
          zIndex: 2,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}
      >
        <div
          style={{
            fontSize: '8px',
            color: COLORS.text.secondary,
            marginBottom: '2px'
          }}
        >
          {label}
        </div>
        <div>${formatNumber(price)}</div>
      </div>
    )
  }
)

PriceLabel.displayName = 'PriceLabel'
export default PriceLabel

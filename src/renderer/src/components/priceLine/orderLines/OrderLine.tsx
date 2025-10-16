import React from 'react'
import { Side } from '../../../../../shared/types'

export default function OrderLine({
  order,
  getTopPercentage
}: {
  order: any
  getTopPercentage: (price: number) => number
}): React.JSX.Element {
  const color = order.side === Side.BUY ? '#10b981' : '#ef4444'
  const glowColor = order.side === Side.BUY ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'

  const orderPercentage = getTopPercentage(order.price)

  return (
    <>
      {/* Gradient dashed line */}
      <div
        style={{
          position: 'absolute',
          top: `${orderPercentage}%`,
          left: 0,
          width: '100%',
          height: '1px',
          background:
            'repeating-linear-gradient(90deg, #94a3b8, #94a3b8 3px, transparent 3px, transparent 6px)',
          zIndex: 1000,
          transform: 'translateY(-50%)',
          opacity: 0.7,
          boxShadow: `0 0 8px ${glowColor}`
        }}
      />
    </>
  )
}

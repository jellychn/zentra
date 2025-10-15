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

      {/* Animated pulse effect */}
      <div
        style={{
          position: 'absolute',
          top: `calc(${orderPercentage}% - 3px)`,
          right: '10px',
          width: '6px',
          height: '6px',
          background: color,
          borderRadius: '50%',
          zIndex: 11,
          transform: 'translateX(50%)',
          opacity: 0.9,
          boxShadow: `0 0 0 0 ${glowColor}`,
          animation: 'pulse 2s infinite'
        }}
      />

      <style>
        {`
          @keyframes pulse {
            0% {
              transform: translateX(50%) scale(0.8);
              box-shadow: 0 0 0 0 ${glowColor};
            }
            70% {
              transform: translateX(50%) scale(1);
              box-shadow: 0 0 0 4px rgba(148, 163, 184, 0);
            }
            100% {
              transform: translateX(50%) scale(0.8);
              box-shadow: 0 0 0 0 rgba(148, 163, 184, 0);
            }
          }
        `}
      </style>
    </>
  )
}

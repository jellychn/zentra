import React from 'react'
import { Side } from '../../../../../shared/types'
import { Order } from 'src/main/db/dbOrders'

export default function OrderLine({
  order,
  getTopPercentage
}: {
  order: Order
  getTopPercentage: (price: number) => number
}): React.JSX.Element {
  const { side, price } = order
  const glowColor = side === Side.BUY ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'

  const orderPercentage = getTopPercentage(price)

  return (
    <>
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

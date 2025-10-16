import React, { useState } from 'react'
import OrderDetails from './OrderDetails'
import { Order } from 'src/main/db/dbOrders'
import { Side } from '../../../../../shared/types'

export default function OrderTooltip({
  order,
  clicked,
  getTopPercentage
}: {
  order: Order
  clicked: boolean
  getTopPercentage: (price: number) => number
}): React.JSX.Element {
  const [hovered, setHovered] = useState(false)
  const { price, side } = order

  const onClose = (): void => {}

  const isBuy = side === Side.BUY
  const orderColor = isBuy ? '#10b981' : '#ef4444'
  const orderColorLight = isBuy ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'

  if (!clicked) {
    return <></>
  }

  return (
    <div
      onClick={() => onClose()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        cursor: 'pointer',
        top: `${getTopPercentage(price)}%`,
        transform: 'translateY(-50%)',
        left: '30px',
        padding: hovered ? '10px 12px' : '6px 8px',
        background: hovered
          ? `linear-gradient(135deg, ${orderColorLight}, rgba(30, 41, 59, 1))`
          : 'rgba(15, 23, 42, 0.6)',
        color: hovered ? '#f8fafc' : 'rgba(248, 250, 252, 0.6)',
        fontWeight: 600,
        textAlign: 'right',
        zIndex: hovered ? 30 : 5,
        fontSize: hovered ? '10px' : '9px',
        border: hovered
          ? `1px solid ${isBuy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          : `1px solid ${isBuy ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`,
        borderRadius: '6px',
        boxShadow: hovered
          ? `0 6px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px ${orderColor}40`
          : '0 2px 8px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(8px)',
        minWidth: hovered ? '130px' : '100px',
        borderLeft: `3px solid ${hovered ? orderColor : orderColor + '80'}`,
        scale: hovered ? '1' : '0.95'
      }}
    >
      <OrderDetails order={order} hovered={hovered} orderColor={orderColor} />
    </div>
  )
}

OrderTooltip.displayName = 'OrderTooltip'

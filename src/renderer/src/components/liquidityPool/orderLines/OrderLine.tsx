import { Side } from '../../../../../shared/types'
import { formatNumber } from '../../../../../shared/helper'
import { COLORS } from './colors'
import { useStateStore } from '@renderer/contexts/StateStoreContext'
import React, { useState } from 'react'
import { Order } from 'src/main/db/dbOrders'

const OrderLine = ({
  order,
  getPositionPercentage
}: {
  order: Order
  getPositionPercentage: (price: number) => number
}): React.JSX.Element => {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { lastPrice = 0 } = exchangeData || {}

  const [hover, setHover] = useState(false)

  const { price, side } = order

  const orderPosition = getPositionPercentage(price)
  const constrainedPosition = Math.max(0, Math.min(100, orderPosition))

  const isBuyOrder = side === Side.BUY
  const orderColor = isBuyOrder ? COLORS.success : COLORS.danger
  const glowColor = isBuyOrder ? COLORS.glow.primary : COLORS.glow.warning

  return (
    <div
      style={{
        position: 'absolute',
        top: `${constrainedPosition}%`,
        left: 0,
        right: 0,
        transform: 'translateY(-50%)',
        zIndex: 1
      }}
    >
      {/* Dashed order line */}
      <div
        style={{
          height: '2px',
          background:
            'repeating-linear-gradient(90deg, #94a3b8, #94a3b8 3px, transparent 3px, transparent 6px)',
          position: 'relative',
          boxShadow: `0 0 12px ${glowColor}`,
          opacity: 0.8
        }}
      />

      {/* Order direction indicator */}
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: 'absolute',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: orderColor,
          borderRadius: '2px',
          padding: '6px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          zIndex: 2
        }}
      >
        {/* Arrow indicator inside the box */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: orderColor,
            borderRadius: '2px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            zIndex: 2,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: 'bold',
            height: '16px',
            width: '16px'
          }}
        >
          {isBuyOrder ? 'B' : 'S'}
        </div>
      </div>

      <HoveredContent order={order} hover={hover} orderColor={orderColor} />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '1px',
          height: Math.abs(getPositionPercentage(lastPrice) - constrainedPosition) + '%',
          background: `repeating-linear-gradient(${
            constrainedPosition > getPositionPercentage(lastPrice) ? 'to bottom' : 'to top'
          },
              ${orderColor}40,
              ${orderColor}40 2px,
              transparent 2px,
              transparent 4px)`,
          transform: 'translateX(-50%)',
          transformOrigin: 'top',
          zIndex: 1,
          opacity: 0.5
        }}
      />
    </div>
  )
}

export default OrderLine

const HoveredContent = ({
  order,
  hover,
  orderColor
}: {
  order: Order
  hover: boolean
  orderColor: string
}): React.JSX.Element => {
  const { price } = order

  if (!hover) {
    return <></>
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: '35px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: `rgba(30, 41, 59, 0.95)`,
        padding: '5px 8px',
        borderRadius: '5px',
        fontSize: '9px',
        fontWeight: '700',
        color: 'white',
        fontFamily: 'Inter, monospace',
        boxShadow: `0 3px 10px rgba(0, 0, 0, 0.3)`,
        border: `1px dashed ${orderColor}60`,
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        zIndex: 100
      }}
    >
      <span style={{ color: orderColor, fontWeight: '800' }}>${formatNumber(price)}</span>
    </div>
  )
}

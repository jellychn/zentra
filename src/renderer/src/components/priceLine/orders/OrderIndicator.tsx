import { PosSide } from '../../../../../shared/types'
import { useState } from 'react'
import OrderTooltip from './OrderTooltip'
import { Order } from 'src/main/db/dbOrders'

export default function OrderIndicator({
  order,
  getTopPercentage
}: {
  order: Order
  getTopPercentage: (price: number) => number
}): React.JSX.Element {
  const isLong = order.posSide === PosSide.LONG
  const orderColor = isLong ? '#10b981' : '#ef4444'
  const [clicked, setClicked] = useState(false)
  const [hover, setHover] = useState(false)

  const { price } = order

  const handleClicked = (): void => {
    if (clicked) {
      setHover(false)
    }

    setClicked(!clicked)
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: `${getTopPercentage(price)}%`,
        transform: hover ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%) scale(1)',
        zIndex: 99,
        right: '-25px',
        backgroundColor: orderColor,
        borderRadius: '3px',
        width: '18px',
        height: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 8px ${orderColor}80, 0 8px 32px rgba(0, 0, 0, 0.2)`,
        cursor: 'pointer',
        opacity: clicked ? 1 : hover ? 0.8 : 0.5,
        transition: 'all 0.2s ease',
        border: `1px solid ${orderColor}`
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleClicked}
    >
      <div
        style={{
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold'
        }}
      >
        {isLong ? 'B' : 'S'}
      </div>

      <OrderTooltip order={order} getTopPercentage={getTopPercentage} clicked={clicked} />
      <Instructions hover={hover} clicked={clicked} orderColor={orderColor} />

      <style>
        {`
          .position-tooltip {
            opacity: 0;
            transition: all 0.2s ease;
          }
          div:hover .position-tooltip {
            opacity: 1;
            transform: translateY(-50%) translateX(-5px);
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(5px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  )
}

const Instructions = ({
  hover,
  clicked,
  orderColor
}: {
  hover: boolean
  clicked: boolean
  orderColor: string
}): React.JSX.Element => {
  if (!hover || clicked) {
    return <></>
  }

  return (
    <div
      style={{
        position: 'absolute',
        left: '25px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
        color: '#f1f5f9',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '11px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
        border: `1px solid ${orderColor}30`,
        boxShadow: `
              0 4px 20px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.05)
            `,
        backdropFilter: 'blur(12px)',
        zIndex: 1000,
        pointerEvents: 'none',
        animation: 'fadeInUp 0.2s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: orderColor
          }}
        />
        Click to view order details
      </div>
    </div>
  )
}

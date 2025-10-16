import { Side } from '../../../../../shared/types'
import { formatNumber } from '../../../../../shared/helper'
import { COLORS } from './colors'
import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { useState } from 'react'

const OrderLine = ({
  order,
  getPositionPercentage
}: {
  order: any
  getPositionPercentage: (price: number) => number
}): React.JSX.Element => {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { lastPrice = 0 } = exchangeData || {}

  const [hover, setHover] = useState(false)

  const orderPosition = getPositionPercentage(order.price)
  const constrainedPosition = Math.max(0, Math.min(100, orderPosition))

  const isBuyOrder = order.side === Side.BUY
  const color = isBuyOrder ? COLORS.success : COLORS.danger
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
          background: color,
          borderRadius: '2px',
          padding: '6px',
          boxShadow: `0 0 10px ${glowColor}`,
          zIndex: 2,
          border: `2px dashed rgba(30, 41, 59, 0.95)`
        }}
      >
        {/* Arrow indicator inside the box */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            background: color,
            borderRadius: '2px',
            boxShadow: `0 0 10px ${glowColor}`,
            zIndex: 2,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '8px'
          }}
        >
          {isBuyOrder ? '▲' : '▼'}
        </div>
      </div>

      {/* Order info badge */}
      {hover && (
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
            border: `1px dashed ${color}60`,
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            zIndex: 100
          }}
        >
          {/* Price */}
          <span style={{ color: color, fontWeight: '800' }}>${formatNumber(order.price)}</span>
        </div>
      )}

      {/* Connection line to current price with dashed style */}
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
              ${color}40,
              ${color}40 2px,
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

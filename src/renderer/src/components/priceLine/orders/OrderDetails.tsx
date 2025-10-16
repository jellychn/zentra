import { formatNumber } from '../../../../../shared/helper'
import { Side } from '../../../../../shared/types'

const OrderDetails = ({
  hovered,
  price,
  side,
  value,
  currentLeverage,
  orderQty,
  symbol,
  orderColor
}: {
  hovered: boolean
  price: number
  side: string
  value: number
  currentLeverage: number
  orderQty: number
  symbol: string
  orderColor: string
}): React.JSX.Element => {
  const isBuy = side === Side.BUY

  return (
    <>
      {/* Compact Price Section */}
      <div
        style={{
          color: hovered ? orderColor : orderColor + 'CC',
          paddingBottom: hovered ? '6px' : '4px',
          fontWeight: 700,
          fontSize: hovered ? '11px' : '10px',
          borderBottom: hovered ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span
          style={{
            fontSize: '8px',
            fontWeight: 600,
            color: hovered ? '#94a3b8' : 'rgba(148, 163, 184, 0.6)',
            background: hovered ? 'rgba(30, 41, 59, 0.8)' : 'rgba(30, 41, 59, 0.5)',
            padding: '1px 4px',
            borderRadius: '3px'
          }}
        >
          {isBuy ? 'BUY' : 'SELL'}
        </span>
        {formatNumber(Number(price))}
      </div>

      {/* Compact Value and Size Section */}
      <div
        style={{
          marginTop: hovered ? '6px' : '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div
            style={{
              fontSize: hovered ? '9px' : '8px',
              fontWeight: 700,
              color: hovered ? '#f8fafc' : 'rgba(248, 250, 252, 0.7)'
            }}
          >
            ${formatNumber(Number(value))}
          </div>
          <div
            style={{
              fontSize: '7px',
              color: hovered ? '#94a3b8' : 'rgba(148, 163, 184, 0.5)',
              marginTop: '1px'
            }}
          >
            Val
          </div>
        </div>

        <div style={{ textAlign: 'right', flex: 1 }}>
          <div
            style={{
              fontSize: hovered ? '9px' : '8px',
              fontWeight: 700,
              color: hovered ? '#f8fafc' : 'rgba(248, 250, 252, 0.7)'
            }}
          >
            {formatNumber(Number(orderQty))}
          </div>
          <div
            style={{
              fontSize: '7px',
              color: hovered ? '#94a3b8' : 'rgba(148, 163, 184, 0.5)',
              marginTop: '1px'
            }}
          >
            Size
          </div>
        </div>
      </div>

      {/* Compact Leverage and Symbol */}
      <div
        style={{
          marginTop: hovered ? '6px' : '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            background: hovered ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
            padding: '1px 4px',
            borderRadius: '3px',
            fontSize: '7px',
            fontWeight: 700,
            color: hovered ? '#3b82f6' : 'rgba(59, 130, 246, 0.7)'
          }}
        >
          {currentLeverage}x
        </div>

        <div
          style={{
            fontSize: '7px',
            color: hovered ? '#64748b' : 'rgba(100, 116, 139, 0.5)',
            fontWeight: 600
          }}
        >
          {symbol}
        </div>
      </div>

      {/* Close Button - Only on Hover */}
      {hovered && (
        <div
          style={{
            marginTop: '8px',
            padding: '4px 8px',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            fontSize: '8px',
            fontWeight: 700,
            borderRadius: '4px',
            textAlign: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(239, 68, 68, 0.3)',
            transition: 'all 0.2s ease',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = '0 3px 8px rgba(239, 68, 68, 0.4)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(239, 68, 68, 0.3)'
          }}
        >
          ✕ CANCEL
        </div>
      )}
    </>
  )
}

export default OrderDetails

import { formatNumber } from '../../../../../shared/helper'
import { PosSide } from '../../../../../shared/types'

const PositionDetails = ({
  position,
  exitPrice,
  positionColor,
  hovered
}: {
  position: any
  exitPrice: number
  positionColor: string
  hovered: boolean
}): React.JSX.Element => {
  const { entryPrice, leverage, posSide, size, entryFee, symbol } = position

  const isLong = posSide === PosSide.LONG
  const assignedPosBalance = (size * entryPrice) / leverage
  const positionValue = Math.abs(Number(assignedPosBalance) * Number(leverage))

  // Calculate PnL
  let pnl = 0
  if (isLong) {
    pnl = (exitPrice - entryPrice) * size - entryFee
  } else {
    pnl = (entryPrice - exitPrice) * size - entryFee
  }

  const pnlColor = pnl > 0 ? '#10b981' : '#ef4444'

  if (hovered) {
    return (
      <>
        {/* Entry Price and Direction */}
        <div
          style={{
            color: positionColor,
            paddingBottom: '6px',
            fontWeight: 700,
            fontSize: '11px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span
            style={{
              fontSize: '8px',
              fontWeight: 600,
              color: '#94a3b8',
              background: 'rgba(30, 41, 59, 0.8)',
              padding: '1px 4px',
              borderRadius: '3px'
            }}
          >
            {isLong ? 'LONG' : 'SHORT'}
          </span>
          {formatNumber(entryPrice)}
        </div>

        {/* Current Price and PnL */}
        <div
          style={{
            marginTop: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontSize: '9px',
                fontWeight: 700,
                color: '#f8fafc'
              }}
            >
              {formatNumber(exitPrice)}
            </div>
            <div
              style={{
                fontSize: '7px',
                color: '#94a3b8',
                marginTop: '1px'
              }}
            >
              Current
            </div>
          </div>
          <div
            style={{
              fontSize: '9px',
              fontWeight: 700,
              color: pnlColor,
              background: `rgba(${pnl > 0 ? '16, 185, 129' : '239, 68, 68'}, 0.1)`,
              padding: '2px 6px',
              borderRadius: '3px'
            }}
          >
            {formatNumber(pnl)}
          </div>
        </div>

        {/* Size and Value */}
        <div
          style={{
            marginTop: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '6px',
            gap: '5px'
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div
              style={{
                fontSize: '9px',
                fontWeight: 700,
                color: '#f8fafc'
              }}
            >
              {formatNumber(size)}
            </div>
            <div
              style={{
                fontSize: '7px',
                color: '#94a3b8',
                marginTop: '1px'
              }}
            >
              Size
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: '9px',
                fontWeight: 700,
                color: '#f8fafc'
              }}
            >
              ${formatNumber(positionValue)}
            </div>
            <div
              style={{
                fontSize: '7px',
                color: '#94a3b8',
                marginTop: '1px'
              }}
            >
              Value
            </div>
          </div>
        </div>

        {/* Leverage and Symbol */}
        <div
          style={{
            marginTop: '6px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.2)',
              padding: '1px 4px',
              borderRadius: '3px',
              fontSize: '7px',
              fontWeight: 700,
              color: '#3b82f6'
            }}
          >
            {leverage}x
          </div>
          <div
            style={{
              fontSize: '7px',
              color: '#64748b',
              fontWeight: 600
            }}
          >
            {symbol}
          </div>
        </div>

        {/* Close Button */}
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
          ✕ CLOSE
        </div>
      </>
    )
  }

  // Default (dimmed) state
  return (
    <>
      {/* Compact Entry Price and Direction */}
      <div
        style={{
          color: positionColor + 'CC',
          paddingBottom: '4px',
          fontWeight: 700,
          fontSize: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <span
          style={{
            fontSize: '8px',
            fontWeight: 600,
            color: 'rgba(148, 163, 184, 0.6)',
            background: 'rgba(30, 41, 59, 0.5)',
            padding: '1px 4px',
            borderRadius: '3px'
          }}
        >
          {isLong ? 'LONG' : 'SHORT'}
        </span>
        {formatNumber(entryPrice)}
      </div>

      {/* Compact PnL and Size */}
      <div
        style={{
          marginTop: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <div style={{ textAlign: 'left', flex: 1 }}>
          <div
            style={{
              fontSize: '8px',
              fontWeight: 700,
              color: pnlColor + 'CC'
            }}
          >
            {formatNumber(pnl)}
          </div>
          <div
            style={{
              fontSize: '7px',
              color: 'rgba(148, 163, 184, 0.5)',
              marginTop: '1px'
            }}
          >
            PnL
          </div>
        </div>

        <div style={{ textAlign: 'right', flex: 1 }}>
          <div
            style={{
              fontSize: '8px',
              fontWeight: 700,
              color: 'rgba(248, 250, 252, 0.7)'
            }}
          >
            {formatNumber(size)}
          </div>
          <div
            style={{
              fontSize: '7px',
              color: 'rgba(148, 163, 184, 0.5)',
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
          marginTop: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '1px 4px',
            borderRadius: '3px',
            fontSize: '7px',
            fontWeight: 700,
            color: 'rgba(59, 130, 246, 0.7)'
          }}
        >
          {leverage}x
        </div>
        <div
          style={{
            fontSize: '7px',
            color: 'rgba(100, 116, 139, 0.5)',
            fontWeight: 600
          }}
        >
          {symbol}
        </div>
      </div>
    </>
  )
}

export default PositionDetails

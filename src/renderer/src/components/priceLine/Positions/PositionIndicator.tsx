import { PosSide } from '../../../../../shared/types'
import { useState } from 'react'
import PositionTooltip from './PositionTooltip'

export default function PositionIndicator({
  position,
  getTopPercentage
}: {
  position: any
  getTopPercentage: (price: number) => number
}): React.JSX.Element {
  const isLong = position.posSide === PosSide.LONG
  const color = isLong ? '#10b981' : '#ef4444'
  const [clicked, setClicked] = useState(false)
  const [hover, setHover] = useState(false)

  const { entryPrice, unrealizedPnl } = position

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
        top: `${getTopPercentage(entryPrice)}%`,
        zIndex: 100,
        right: '-10px',
        backgroundColor: color,
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 12px ${color}80, 0 8px 32px rgba(0, 0, 0, 0.2)`,
        border: `2px solid ${isLong ? '#22c55e' : '#ef4444'}`,
        opacity: clicked ? 1 : hover ? 0.8 : 0.5,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: hover ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%) scale(1)'
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={handleClicked}
    >
      <div
        style={{
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold',
          transform: isLong ? 'none' : 'rotate(180deg)'
        }}
      >
        ▲
      </div>

      {/* Enhanced price tooltip */}
      <div
        style={{
          position: 'absolute',
          right: '30px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '6px 10px',
          borderRadius: '5px',
          fontSize: '11px',
          fontWeight: '600',
          whiteSpace: 'nowrap',
          opacity: 0,
          transition: 'all 0.3s ease',
          pointerEvents: 'none',
          borderLeft: `3px solid ${color}`,
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(10px)'
        }}
        className="position-tooltip"
      >
        <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '2px' }}>Entry Price</div>
        <div style={{ fontWeight: 'bold' }}>${entryPrice}</div>
        {unrealizedPnl !== undefined && (
          <div
            style={{
              fontSize: '9px',
              color: unrealizedPnl >= 0 ? '#10b981' : '#ef4444',
              marginTop: '2px'
            }}
          >
            PnL: ${unrealizedPnl}
          </div>
        )}
      </div>

      {clicked && <PositionTooltip position={position} getTopPercentage={getTopPercentage} />}

      {/* Click instruction tooltip */}
      {hover && !clicked && (
        <div
          style={{
            position: 'absolute',
            left: '-90px',
            top: '-40px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
            color: '#f1f5f9',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            border: `1px solid ${color}40`,
            boxShadow: `
              0 4px 20px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.05)
            `,
            backdropFilter: 'blur(12px)',
            zIndex: 101,
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
                background: color
              }}
            />
            Click to view position details
          </div>
        </div>
      )}

      <style>
        {`
          .position-tooltip {
            opacity: 0;
            transform: translateY(-50%) translateX(-10px);
          }
          div:hover .position-tooltip {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
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

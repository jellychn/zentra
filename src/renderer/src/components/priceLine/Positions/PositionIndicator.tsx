import { PosSide } from '../../../../../shared/types'
import React, { useState } from 'react'
import PositionTooltip from './PositionTooltip'
import { Trade } from 'src/main/db/dbTrades'

export default function PositionIndicator({
  position,
  getTopPercentage
}: {
  position: Trade
  getTopPercentage: (price: number) => number
}): React.JSX.Element {
  const [clicked, setClicked] = useState(false)
  const [hover, setHover] = useState(false)

  const { entryPrice, posSide } = position

  const isLong = posSide === PosSide.LONG
  const color = isLong ? '#10b981' : '#ef4444'

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
        borderRadius: '50%',
        width: '20px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: color,
        boxShadow: `0 0 12px ${color}80, 0 8px 32px rgba(0, 0, 0, 0.2)`,
        border: `2px solid ${isLong ? '#22c55e' : '#ef4444'}`,
        opacity: clicked ? 1 : hover ? 0.8 : 0.5,
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

      <PositionTooltip position={position} clicked={clicked} getTopPercentage={getTopPercentage} />
      <Instruction hover={hover} clicked={clicked} color={color} />

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

const Instruction = ({
  hover,
  clicked,
  color
}: {
  hover: boolean
  clicked: boolean
  color: string
}): React.JSX.Element => {
  if (!hover || clicked) {
    return <></>
  }

  return (
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
  )
}

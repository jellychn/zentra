import { Trade } from 'src/main/db/dbTrades'
import { PosSide } from '../../../../../shared/types'

export default function PositionLine({
  position,
  getTopPercentage
}: {
  position: Trade
  getTopPercentage: (price: number) => number
}): React.JSX.Element {
  let color = ''
  let isLong = false

  if (position.posSide) {
    isLong = position.posSide === PosSide.LONG
    color = isLong ? '#10b981' : '#ef4444'
  }

  const gradientColor = isLong
    ? 'linear-gradient(90deg, transparent, #10b981, transparent)'
    : 'linear-gradient(90deg, transparent, #ef4444, transparent)'

  const glowColor = isLong ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'

  const positionPercentage = getTopPercentage(position.entryPrice)

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: `${positionPercentage}%`,
          left: 0,
          width: '100%',
          height: '2px',
          background: gradientColor,
          zIndex: 100,
          transform: 'translateY(-50%)'
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: `${positionPercentage}%`,
          left: '20%',
          width: '60%',
          height: '4px',
          background: glowColor,
          zIndex: 99,
          transform: 'translateY(-50%)',
          filter: 'blur(3px)',
          opacity: 0.6
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: `${positionPercentage}%`,
          left: '50%',
          width: '6px',
          height: '6px',
          background: color,
          borderRadius: '50%',
          zIndex: 101,
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 8px ${color}`
        }}
      />
    </>
  )
}

PositionLine.displayName = 'PositionLine'

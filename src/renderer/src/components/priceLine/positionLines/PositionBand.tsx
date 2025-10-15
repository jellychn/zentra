import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { formatNumber } from '../../../../../shared/helper'
import { PosSide } from '../../../../../shared/types'
import { usePositionColors } from '@renderer/hooks/usePositionColors'

export default function PositionBand({
  position,
  getTopPercentage
}: {
  position: Record<string, any>
  getTopPercentage: (price: number) => number
}): React.JSX.Element {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { lastPrice = 0 } = exchangeData || {}

  const positionPercentage = getTopPercentage(position.entryPrice)
  const lastPricePercentage = getTopPercentage(lastPrice)

  const topPosition = Math.min(lastPricePercentage, positionPercentage)
  const bottomPosition = Math.max(lastPricePercentage, positionPercentage)
  const bandHeight = bottomPosition - topPosition

  let pnl = 0

  if (position.posSide === PosSide.LONG) {
    pnl = (lastPrice - position.entryPrice) * position.size - position.entryFee
  } else {
    pnl = (position.entryPrice - lastPrice) * position.size - position.entryFee
  }

  const { gradient, borderColor, color } = usePositionColors(position)
  const isLong = position.posSide === PosSide.LONG

  const directionalGradient = `linear-gradient(to ${isLong ? 'bottom' : 'top'},
    ${gradient} 0%,
    ${gradient.replace('0.15', '0.05')} 70%,
    transparent 100%)`

  const getPatternColor = (): string => {
    if (color === '#10b981') return 'rgba(16, 185, 129, 0.03)' // Green
    if (color === '#65a30d') return 'rgba(101, 163, 13, 0.03)' // Olive Green
    if (color === '#eab308') return 'rgba(234, 179, 8, 0.03)' // Amber Yellow
    if (color === '#fb923c') return 'rgba(251, 146, 60, 0.03)' // Bright Orange
    if (color === '#f59e0b') return 'rgba(245, 158, 11, 0.03)' // Orange
    return 'rgba(239, 68, 68, 0.03)' // Red
  }

  const patternColor = getPatternColor()

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: `${topPosition}%`,
          bottom: `${100 - bottomPosition}%`,
          right: '50%',
          left: 0,
          background: directionalGradient,
          borderRight: `2px solid ${borderColor}`,
          zIndex: 5
        }}
      />

      {/* Cross-cross pattern */}
      <div
        style={{
          position: 'absolute',
          top: `${topPosition}%`,
          bottom: `${100 - bottomPosition}%`,
          right: '50%',
          left: 0,
          background: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              ${patternColor} 2px,
              ${patternColor} 4px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 2px,
              ${patternColor} 2px,
              ${patternColor} 4px
            )
          `,
          zIndex: 6,
          pointerEvents: 'none',
          opacity: 0.6
        }}
      />

      {/* Glow effect */}
      <div
        style={{
          position: 'absolute',
          top: `${topPosition}%`,
          bottom: `${100 - bottomPosition}%`,
          right: '50%',
          left: '-2px',
          background: `linear-gradient(90deg, transparent, ${color}20, transparent)`,
          zIndex: 4,
          opacity: 0.3
        }}
      />

      {/* Direction arrow */}
      {bandHeight > 8 && (
        <div
          style={{
            position: 'absolute',
            top: `${(topPosition + bottomPosition) / 2}%`,
            left: '8px',
            width: '12px',
            height: '12px',
            borderRadius: '2px',
            zIndex: 7,
            transform: `translateY(-50%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '8px',
            color: color,
            fontWeight: 'bold'
          }}
        >
          {isLong ? '▲' : '▼'}
        </div>
      )}

      {/* PnL indicator for larger bands */}
      {bandHeight > 15 && (
        <div
          style={{
            position: 'absolute',
            top: `${(topPosition + bottomPosition) / 2}%`,
            left: '25px',
            background: 'rgba(15, 23, 42, 0.9)',
            color: color,
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '8px',
            fontWeight: '700',
            fontFamily: 'monospace',
            zIndex: 7,
            transform: 'translateY(-50%)',
            border: `1px solid ${borderColor}`,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)'
          }}
        >
          {pnl > 0 ? '+' : ''}
          {formatNumber(pnl)}
        </div>
      )}
    </>
  )
}

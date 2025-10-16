import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { PosSide } from '../../../../../shared/types'
import { COLORS } from './colors'
import { formatNumber } from '../../../../../shared/helper'
import { Trade } from 'src/main/db/dbTrades'

const calculatePnL = (position: Trade, currentPrice: number): number => {
  const { entryPrice, size, posSide, entryFee } = position
  const isLong = posSide === PosSide.LONG

  let pnl = 0
  if (isLong) {
    pnl = (currentPrice - entryPrice) * size - entryFee
  } else {
    pnl = (entryPrice - currentPrice) * size - entryFee
  }
  return pnl
}

const getIsProfit = (position: Trade, currentPrice: number): boolean => {
  const pnl = calculatePnL(position, currentPrice)
  return pnl >= 0
}

const PositionLine = ({
  position,
  getPositionPercentage
}: {
  position: Trade
  getPositionPercentage: (price: number) => number
}): React.JSX.Element => {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { lastPrice = 0 } = exchangeData || {}

  const pnl = calculatePnL(position, lastPrice)
  const isProfit = getIsProfit(position, lastPrice)

  const positionPercentage = getPositionPercentage(position.entryPrice)
  const constrainedPosition = Math.max(0, Math.min(100, positionPercentage))

  const isLong = position.posSide === PosSide.LONG

  const finalColor = isLong ? COLORS.success : COLORS.danger
  const finalGlowColor = isLong ? COLORS.glow.success : COLORS.glow.danger

  const formattedPnL =
    pnl === 0 ? '-$0.00' : `${pnl >= 0 ? '+' : '-'}$${formatNumber(Math.abs(pnl))}`
  const pnlColor = pnl === 0 ? '#94a3b8' : isProfit ? COLORS.success : COLORS.danger

  return (
    <div
      style={{
        position: 'absolute',
        top: `${constrainedPosition}%`,
        left: 0,
        right: 0,
        transform: 'translateY(-50%)',
        zIndex: 35
      }}
    >
      {/* Main position line */}
      <div
        style={{
          height: '2px',
          background: `linear-gradient(90deg,
                transparent 0%,
                ${finalColor} 50%,
                transparent 100%)`,
          position: 'relative',
          boxShadow: `0 0 15px ${finalGlowColor}`
        }}
      />

      {/* Position info badge */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `rgba(30, 41, 59, 0.95)`,
          padding: '6px 10px',
          borderRadius: '6px',
          fontSize: '10px',
          fontWeight: '700',
          color: 'white',
          fontFamily: 'Inter, monospace',
          boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3)`,
          border: `1px solid ${finalColor}40`,
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          minWidth: '90px'
        }}
      >
        {/* Direction indicator */}
        <div
          style={{
            color: finalColor,
            flexShrink: 0
          }}
        >
          {isLong ? '▲' : '▼'}
        </div>

        {/* PnL Display */}
        <span style={{ color: pnlColor, fontWeight: '800', fontSize: '9px' }}>{formattedPnL}</span>

        {/* Right-hand dot indicator using dynamic colors */}
        <div
          style={{
            right: '10px',
            top: '50%',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: finalColor,
            boxShadow: `0 0 8px ${finalColor}80, 0 0 4px ${finalColor}`,
            border: '1px solid rgba(255, 255, 255, 0.3)',
            zIndex: 31
          }}
        />
      </div>

      {/* Connection line to current price */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: '1px',
          height: Math.abs(getPositionPercentage(lastPrice) - constrainedPosition) + '%',
          background: `linear-gradient(${
            constrainedPosition > getPositionPercentage(lastPrice) ? 'to bottom' : 'to top'
          },
              ${finalColor}40, transparent)`,
          transform: 'translateX(-50%)',
          transformOrigin: 'top',
          zIndex: 1
        }}
      />
    </div>
  )
}

export default PositionLine

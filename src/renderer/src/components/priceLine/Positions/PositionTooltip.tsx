import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { useState } from 'react'
import { PosSide } from '../../../../../shared/types'
import PositionDetails from './PositionDetails'

export default function PositionTooltip({
  position,
  getTopPercentage
}: {
  position: any
  getTopPercentage: (price: number) => number
}): React.JSX.Element {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { lastPrice = 0 } = exchangeData || {}

  const [hovered, setHovered] = useState(false)

  const { posSide, entryPrice } = position

  const closePosition = () => {}

  const isLong = posSide === PosSide.LONG
  const positionColor = isLong ? '#10b981' : '#ef4444'
  const positionColorLight = isLong ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)'

  return (
    <div
      onClick={closePosition}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: `${getTopPercentage(entryPrice)}%`,
        transform: 'translateY(-50%)',
        left: '40px',
        padding: hovered ? '10px 12px' : '6px 8px',
        fontWeight: 600,
        textAlign: 'right',
        zIndex: hovered ? 30 : 5,
        fontSize: hovered ? '10px' : '9px',
        color: hovered ? '#f8fafc' : 'rgba(248, 250, 252, 0.6)',
        background: hovered
          ? `linear-gradient(135deg, ${positionColorLight}, rgba(30, 41, 59, 1))` // Solid on hover
          : 'rgba(15, 23, 42, 0.6)', // Transparent when not hovered
        borderRadius: '6px',
        boxShadow: hovered
          ? `0 6px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px ${positionColor}40`
          : '0 2px 8px rgba(0, 0, 0, 0.2)',
        cursor: 'pointer',
        border: hovered
          ? `1px solid ${isLong ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
          : `1px solid ${isLong ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`,
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(8px)',
        minWidth: hovered ? '130px' : '100px',
        borderLeft: `3px solid ${hovered ? positionColor : positionColor + '80'}`,
        scale: hovered ? '1' : '0.95'
      }}
    >
      <PositionDetails
        position={position}
        exitPrice={lastPrice}
        positionColor={positionColor}
        hovered={hovered}
      />
    </div>
  )
}

PositionTooltip.displayName = 'PositionTooltip'

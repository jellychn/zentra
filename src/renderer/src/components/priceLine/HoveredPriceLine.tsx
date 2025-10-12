import { memo } from 'react'
import { formatNumber } from '../../../../shared/helper'
import { usePriceLine } from '@renderer/contexts/PriceLineContext'

const HoveredPriceLine = memo(({ max, priceRange }: { max: number; priceRange: number }) => {
  const { hoverPrice } = usePriceLine()

  if (hoverPrice == null) {
    return null
  }

  const position = ((max - hoverPrice) / priceRange) * 100

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${position}%`,
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, #FF9800 20%, #FF9800 80%, transparent 100%)',
          zIndex: 85,
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '20%',
          right: '20%',
          top: `${position}%`,
          height: '3px',
          background: 'linear-gradient(90deg, transparent, rgba(255, 152, 0, 0.2), transparent)',
          zIndex: 84,
          pointerEvents: 'none',
          filter: 'blur(2px)'
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: `${position}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 95,
          background: 'linear-gradient(135deg, #FF9800, #FFB74D)',
          color: '#1a1a1a',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '10px',
          fontWeight: 700,
          fontFamily: 'monospace',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: `
              0 4px 16px rgba(255, 152, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.1) inset,
              0 1px 0 rgba(255, 255, 255, 0.2) inset
            `,
          backdropFilter: 'blur(10px)',
          animation: 'fadeInScale 0.15s ease-out'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textShadow: '0 1px 1px rgba(255, 255, 255, 0.3)'
          }}
        >
          {formatNumber(hoverPrice)}
        </div>
      </div>
      <style>
        {`
            @keyframes fadeInScale {
              from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.9);
              }
              to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
              }
            }
          `}
      </style>
    </>
  )
})

HoveredPriceLine.displayName = 'HoveredPriceLine'
export default HoveredPriceLine

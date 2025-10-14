import { memo, useMemo } from 'react'
import { formatNumber } from '../../../../shared/helper'
import { COLORS } from './colors'
import { useStateStore } from '@renderer/contexts/StateStoreContext'

const Footer = memo((): React.JSX.Element => {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { lastPrice = 0 } = exchangeData || {}

  const formattedPrice = useMemo(() => formatNumber(lastPrice), [lastPrice])

  const legendItems = useMemo(
    () => [
      { color: COLORS.chart.up, label: 'BULLISH' },
      { color: COLORS.chart.down, label: 'BEARISH' },
      { color: COLORS.primary, label: 'CURRENT PRICE', isLine: true }
    ],
    []
  )

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)',
        padding: '12px 20px',
        borderTop: `1px solid ${COLORS.border}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none',
        fontSize: '10px',
        color: COLORS.text.muted,
        fontWeight: '600',
        height: '60px',
        boxSizing: 'border-box'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {legendItems.map((item, index) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {index > 0 && <div style={{ width: '16px' }} />}
            <div
              style={{
                width: '8px',
                height: item.isLine ? '2px' : '8px',
                borderRadius: item.isLine ? '0' : '2px',
                background: item.color
              }}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            background: COLORS.surface,
            padding: '6px 12px',
            borderRadius: '6px',
            border: `1px solid ${COLORS.border}`,
            animation: lastPrice !== 0 ? 'pulse 0.5s ease-in-out' : 'none'
          }}
        >
          <div
            style={{
              fontSize: '12px',
              fontWeight: '700',
              color: COLORS.text.primary,
              fontFamily: 'monospace'
            }}
          >
            ${formattedPrice}
          </div>
        </div>
      </div>
    </div>
  )
})

Footer.displayName = 'Footer'

export default Footer

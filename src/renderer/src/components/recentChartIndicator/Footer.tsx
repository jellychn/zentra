import { formatNumber } from '../../../../shared/helper'
import { COLORS } from './colors'
import { useStateStore } from '@renderer/contexts/StateStoreContext'

const Footer = (): React.JSX.Element => {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { lastPrice = 0 } = exchangeData || {}

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
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '2px',
            background: COLORS.chart.up
          }}
        />
        <span>BULLISH</span>
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '2px',
            background: COLORS.chart.down,
            marginLeft: '8px'
          }}
        />
        <span>BEARISH</span>
        <div
          style={{
            width: '8px',
            height: '2px',
            background: COLORS.primary,
            marginLeft: '16px'
          }}
        />
        <span>CURRENT PRICE</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            background: COLORS.surface,
            padding: '6px 12px',
            borderRadius: '6px',
            border: `1px solid ${COLORS.border}`,
            animation: 'pulse 0.5s ease-in-out'
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
            {formatNumber(lastPrice)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer

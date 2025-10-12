import { useMemo, memo } from 'react'

const Header = memo(
  ({
    tradesCount,
    buyVolume,
    sellVolume
  }: {
    tradesCount: number
    buyVolume: number
    sellVolume: number
  }): React.JSX.Element => {
    const tradesRatio = buyVolume / sellVolume

    const { arrowSymbol, arrowColor, ratioText } = useMemo(() => {
      if (tradesRatio === 1) {
        return {
          arrowSymbol: '➖',
          arrowColor: '#94a3b8',
          ratioText: 'Neutral'
        }
      } else if (tradesRatio > 1) {
        return {
          arrowSymbol: '↗',
          arrowColor: '#10b981',
          ratioText: 'Bullish'
        }
      } else {
        return {
          arrowSymbol: '↘',
          arrowColor: '#ef4444',
          ratioText: 'Bearish'
        }
      }
    }, [tradesRatio])

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#f1f5f9',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
          >
            Recent Trades
          </div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 'bold',
              color: arrowColor,
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '4px 8px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>{arrowSymbol}</span>
            <span>{ratioText}</span>
          </div>
        </div>

        <div
          style={{
            fontSize: '10px',
            fontWeight: 'bold',
            color: '#94a3b8',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '4px 8px',
            borderRadius: '6px'
          }}
        >
          {tradesCount} TRADES
        </div>
      </div>
    )
  }
)

Header.displayName = 'Header'

export default Header

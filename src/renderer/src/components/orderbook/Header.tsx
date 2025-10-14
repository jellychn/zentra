import { memo, useMemo } from 'react'

const Header = memo(
  ({
    bidVolume,
    askVolume,
    selectedSymbol
  }: {
    bidVolume: number
    askVolume: number
    selectedSymbol?: string
  }): React.JSX.Element => {
    const orderbookRatio = bidVolume / askVolume

    const { arrowSymbol, arrowColor, ratioText } = useMemo(() => {
      if (orderbookRatio === 1) {
        return {
          arrowSymbol: '➖',
          arrowColor: '#94a3b8',
          ratioText: 'Neutral'
        }
      } else if (orderbookRatio > 1) {
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
    }, [orderbookRatio])

    if (!selectedSymbol) {
      return <></>
    }

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          paddingBottom: '16px',
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
            Order Book
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
            fontSize: '11px',
            color: '#94a3b8',
            fontWeight: '600',
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '6px 12px',
            borderRadius: '8px'
          }}
        >
          {selectedSymbol}
        </div>
      </div>
    )
  }
)

Header.displayName = 'Header'

export default Header

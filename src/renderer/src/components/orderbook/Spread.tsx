import { useCallback, useMemo } from 'react'
import { formatNumber } from '../../../../shared/helper'

const Spread = ({
  lastPrice,
  bids,
  asks,
  bidVolume,
  askVolume,
  showFullOrderBook,
  setShowFullOrderBook
}: {
  lastPrice: number
  bids: { [price: number]: number }
  asks: { [price: number]: number }
  bidVolume: number
  askVolume: number
  showFullOrderBook: boolean
  setShowFullOrderBook: (show: boolean) => void
}): React.JSX.Element => {
  const hasUserOrdersInAsks = false
  const hasUserOrdersInBids = false
  const orderBookRatio = bidVolume / askVolume

  const { spread } = useMemo(() => {
    const bid = Math.max(...Object.keys(bids).map(Number))
    const ask = Math.min(...Object.keys(asks).map(Number))

    const spreadValue = ask != null && bid != null ? ask - bid : 0

    return { spread: spreadValue }
  }, [bids, asks])

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
    e.currentTarget.style.transform = 'translateY(-1px)'
  }, [])

  const handleMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
    e.currentTarget.style.transform = 'translateY(0)'
  }, [])

  if (Object.keys(bids).length === 0 || Object.keys(asks).length === 0) {
    return <></>
  }
  return (
    <div
      style={{
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        textAlign: 'center',
        fontSize: '12px',
        fontWeight: '600',
        color: '#e2e8f0',
        marginBottom: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
      onClick={() => setShowFullOrderBook(!showFullOrderBook)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span
          style={{
            color: '#f1f5f9',
            fontWeight: '700',
            fontFamily: "'IBM Plex Mono', monospace"
          }}
        >
          {formatNumber(lastPrice)}
        </span>
        <span
          style={{
            color: orderBookRatio === 1 ? '#94a3b8' : orderBookRatio > 1 ? '#10b981' : '#ef4444',
            fontWeight: '600'
          }}
        >
          Spread: {formatNumber(spread)}
        </span>
        <span
          style={{
            fontSize: '12px',
            marginLeft: '8px',
            color: orderBookRatio === 1 ? '#94a3b8' : orderBookRatio > 1 ? '#10b981' : '#ef4444'
          }}
        >
          {orderBookRatio > 1 ? '↗' : orderBookRatio < 1 ? '↘' : '➖'}
        </span>
        <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
          {hasUserOrdersInBids && (
            <div
              style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}
            />
          )}
          {hasUserOrdersInAsks && (
            <div
              style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}
            />
          )}
        </div>
      </div>
      <span
        style={{
          color: '#cbd5e1',
          fontSize: '10px',
          textDecoration: 'underline',
          fontWeight: '600'
        }}
      >
        {showFullOrderBook ? 'SHOW LESS' : 'SHOW MORE'}
      </span>
    </div>
  )
}

export default Spread

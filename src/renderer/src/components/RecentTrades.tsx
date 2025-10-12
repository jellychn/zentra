import { useStateStore } from '@renderer/contexts/StateStoreContext'
import TradeRow from './recentTrades/TradeRow'
import RatioBar from '@renderer/elements/RatioBar'
import Header from './recentTrades/Header'
import { SymbolMetrics } from 'src/main/data/dataStore'
import { ProcessedTrade } from 'src/main/data/types'
import React, { useMemo } from 'react'

export default function RecentTrades(): React.JSX.Element {
  const { state } = useStateStore()
  const { exchangeData, metrics } = state || {}
  const { trades = [] } = (exchangeData as { trades?: ProcessedTrade[] }) || {}
  const { buyVolume = 0, sellVolume = 0 } = (metrics as SymbolMetrics) || {}

  const recentTrades = useMemo(() => {
    const now = Date.now()
    const minutesAgo = now - 30 * 60 * 1000 // 30min

    return trades.filter((trade) => {
      const tradeTime = trade.timestamp > 1e12 ? trade.timestamp / 1e6 : trade.timestamp
      return tradeTime >= minutesAgo
    })
  }, [trades])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 3,
        minHeight: 0
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(30, 33, 48, 0.8)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '16px',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          height: '100%',
          minHeight: 0
        }}
      >
        <Header tradesCount={recentTrades.length} buyVolume={buyVolume} sellVolume={sellVolume} />
        <RatioBar leftLabel="BUY" leftValue={buyVolume} rightLabel="SELL" rightValue={sellVolume} />

        <div
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              paddingRight: '4px',
              minHeight: 0
            }}
          >
            <Content trades={recentTrades} />
          </div>
        </div>
      </div>
    </div>
  )
}

const Content = ({ trades }: { trades: ProcessedTrade[] }): React.JSX.Element => {
  if (trades.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          padding: '40px 20px',
          textAlign: 'center',
          flex: 1,
          minHeight: '120px'
        }}
      >
        <div
          style={{
            fontSize: '32px',
            marginBottom: '8px',
            opacity: 0.5
          }}
        >
          ⚡
        </div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '4px'
          }}
        >
          NO RECENT TRADES
        </div>
        <div
          style={{
            fontSize: '10px',
            color: '#64748b'
          }}
        >
          Market trades will appear here
        </div>
      </div>
    )
  }

  return (
    <>
      {trades.map((trade: ProcessedTrade, index: number) => (
        <TradeRow key={`trade-${index}-${trade.timestamp}`} trade={trade} />
      ))}
    </>
  )
}

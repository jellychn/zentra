import React from 'react'
import Header from './tradingDashboard/Header'
import RecentChartIndicator from './RecentChartIndicator'
import TradePanel from './TradePanel'
import MyActiveTrades from './MyActiveTrades'

export default function TradingDashboard(): React.JSX.Element {
  return (
    <div
      style={{
        flex: 1,
        background: 'rgba(255, 255, 255, 0.1)',
        borderBottom: '1px solid #333',
        height: '100%',
        minWidth: 0,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(22, 25, 41, 0.95), rgba(30, 33, 48, 0.98))',
          padding: '24px',
          color: '#ffffff',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          flex: 1,
          height: '100%',
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          borderRight: '2px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }}
      >
        <Header />

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            gap: '20px'
          }}
        >
          <div
            style={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <RecentChartIndicator />
          </div>

          <MyActiveTrades />
        </div>

        <TradePanel />
      </div>
    </div>
  )
}

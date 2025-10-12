import LiquidityPool from '@renderer/components/LiqudityPool'
import MainHeader from '@renderer/components/MainHeader'
import OrderBook from '@renderer/components/OrderBook'
import PriceLine from '@renderer/components/PriceLine'
import RecentTrades from '@renderer/components/RecentTrades'
import TradePanel from '@renderer/components/TradePanel'
import TradingDashboard from '@renderer/components/TradingDashboard'

export default function Trade(): React.JSX.Element {
  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <MainHeader />
      <div style={{ display: 'flex', width: '100%', flex: 1, minHeight: 0 }}>
        <PriceLine />
        <LiquidityPool />
        <div
          style={{
            flex: 1,
            display: 'flex',
            minHeight: 0,
            minWidth: 0,
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              background: 'rgba(22, 25, 41, 0.9)',
              minHeight: 0,
              minWidth: 0,
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                display: 'flex',
                flex: 1,
                minHeight: 0,
                minWidth: 0
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '20px',
                  flex: 1,
                  minHeight: 0,
                  gap: '12px',
                  minWidth: '380px',
                  maxWidth: '380px'
                }}
              >
                <OrderBook />
                <RecentTrades />
              </div>
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  overflow: 'hidden'
                }}
              >
                <TradingDashboard />
              </div>
            </div>
            <TradePanel />
          </div>
        </div>
      </div>
    </div>
  )
}

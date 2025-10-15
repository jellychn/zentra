import { useStateStore } from '@renderer/contexts/StateStoreContext'
import Header from './orderbook/Header'
import Spread from './orderbook/Spread'
import { ProcessedOrderBook } from 'src/main/data/types'
import RatioBar from '@renderer/elements/RatioBar'
import React, { useMemo, useState } from 'react'
import ColumnHeader from './orderbook/ColumnHeader'
import OrderRow from './orderbook/OrderRow'
import { formatNumber } from '../../../shared/helper'
import { useOrderBookData } from './orderbook/hooks/useOrderBookData'
import { useAutoScroll } from './orderbook/hooks/useAutoScroll'

export default function OrderBook(): React.JSX.Element {
  const { state } = useStateStore()
  const { settings, exchangeData, metrics } = state || {}

  const selectedSymbol = settings?.selectedSymbol
  const lastPrice = exchangeData?.lastPrice ?? 0
  const orderbook = exchangeData?.orderbook as ProcessedOrderBook
  const askVolume = metrics?.askVolume ?? 0
  const bidVolume = metrics?.bidVolume ?? 0

  const { bids = {}, asks = {} } = orderbook || {}

  const [showFullOrderBook, setShowFullOrderBook] = useState(false)

  const { maxBidTotal, maxAskTotal, processedBids, processedAsks } = useOrderBookData(
    bids,
    asks,
    showFullOrderBook
  )

  const currentPriceRef = useAutoScroll(showFullOrderBook)

  const containerStyle = useMemo(
    () => ({
      background: 'rgba(30, 33, 48, 0.8)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '20px',
      color: 'white',
      fontFamily: "'Inter', sans-serif",
      flex: 4,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      marginBottom: '12px'
    }),
    []
  )

  const scrollContainerStyle = useMemo(
    () => ({
      flex: 1,
      overflowY: 'auto',
      minHeight: 0,
      paddingRight: '4px'
    }),
    []
  )

  const currentPriceStyle = useMemo(
    () => ({
      padding: '12px 16px',
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      textAlign: 'center',
      fontSize: '12px',
      fontWeight: '600',
      color: '#e2e8f0',
      transition: 'all 0.2s ease',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }),
    []
  )

  const reversedAsks = useMemo(() => processedAsks.slice().reverse(), [processedAsks])

  return (
    <div style={containerStyle}>
      <Header selectedSymbol={selectedSymbol} askVolume={askVolume} bidVolume={bidVolume} />
      <RatioBar leftLabel="BIDS" leftValue={bidVolume} rightLabel="ASKS" rightValue={askVolume} />
      <Spread
        bids={bids}
        asks={asks}
        showFullOrderBook={showFullOrderBook}
        setShowFullOrderBook={setShowFullOrderBook}
      />
      <ColumnHeader />

      <div style={scrollContainerStyle}>
        <div style={{ marginBottom: '8px' }}>
          {reversedAsks.map((ask, index) => (
            <OrderRow
              key={`ask-${ask.price}-${index}`}
              price={ask.price}
              size={ask.size}
              isBid={false}
              maxTotal={maxAskTotal}
              total={ask.total}
            />
          ))}
        </div>

        <div ref={currentPriceRef} style={currentPriceStyle}>
          {formatNumber(lastPrice)}
        </div>

        <div style={{ marginTop: '8px' }}>
          {processedBids.map((bid) => (
            <OrderRow
              key={`bid-${bid.price}-${bid.size}`}
              price={bid.price}
              size={bid.size}
              isBid={true}
              maxTotal={maxBidTotal}
              total={bid.total}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

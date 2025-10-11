import { useStateStore } from '@renderer/contexts/StateStoreContext'
import Header from './orderbook/Header'
import Spread from './orderbook/Spread'
import { SymbolMetrics } from 'src/main/data/dataStore'
import { ProcessedOrderBook } from 'src/main/data/types'
import RatioBar from '@renderer/elements/RatioBar'
import React, { useMemo, useState, useRef, useEffect } from 'react'
import ColumnHeader from './orderbook/ColumnHeader'
import OrderRow from './orderbook/OrderRow'

export default function OrderBook(): React.JSX.Element {
  const { state } = useStateStore()
  const { settings, exchangeData, metrics } = state || {}
  const { selectedSymbol } = settings || {}
  const { lastPrice = 0, orderbook } = exchangeData || {}

  const { bids = {}, asks = {} } = (orderbook as ProcessedOrderBook) || {}
  const { askVolume = 0, bidVolume = 0 } = (metrics as SymbolMetrics) || {}

  const [showFullOrderBook, setShowFullOrderBook] = useState(false)
  const currentPriceRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentPriceRef.current) {
      currentPriceRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, [showFullOrderBook])

  const { maxBidTotal, maxAskTotal, processedBids, processedAsks } = useMemo(() => {
    // Process bids (highest to lowest)
    let bidEntries = Object.entries(bids)
      .map(([price, size]) => ({
        price: parseFloat(price),
        size: size as number
      }))
      .sort((a, b) => b.price - a.price)

    // Process asks (lowest to highest)
    let askEntries = Object.entries(asks)
      .map(([price, size]) => ({
        price: parseFloat(price),
        size: size as number
      }))
      .sort((a, b) => a.price - b.price)

    if (!showFullOrderBook) {
      bidEntries = bidEntries.slice(0, 2)
      askEntries = askEntries.slice(0, 2)
    }

    let bidRunningTotal = 0
    const processedBids = bidEntries.map((entry) => {
      bidRunningTotal += entry.size
      return { ...entry, total: bidRunningTotal }
    })
    const maxBidTotal = bidRunningTotal

    let askRunningTotal = 0
    const processedAsks = askEntries.map((entry) => {
      askRunningTotal += entry.size
      return { ...entry, total: askRunningTotal }
    })
    const maxAskTotal = askRunningTotal

    return {
      maxBidTotal,
      maxAskTotal,
      processedBids,
      processedAsks
    }
  }, [bids, asks, showFullOrderBook])

  return (
    <div
      style={{
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
      }}
    >
      <Header selectedSymbol={selectedSymbol} />
      <RatioBar leftLabel="BIDS" leftValue={bidVolume} rightLabel="ASKS" rightValue={askVolume} />
      <Spread
        lastPrice={lastPrice}
        bids={bids}
        asks={asks}
        askVolume={askVolume}
        bidVolume={bidVolume}
        showFullOrderBook={showFullOrderBook}
        setShowFullOrderBook={setShowFullOrderBook}
      />
      <ColumnHeader />

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
          paddingRight: '4px',
          maxHeight: '300px'
        }}
      >
        <div style={{ marginBottom: '8px' }}>
          {processedAsks
            .slice()
            .reverse()
            .map((ask) => (
              <OrderRow
                key={`ask-${ask.price}-${ask.size}`}
                price={ask.price}
                size={ask.size}
                isBid={false}
                maxTotal={maxAskTotal}
                total={ask.total}
              />
            ))}
        </div>

        {/* Current Price with ref for scrolling */}
        <div
          ref={currentPriceRef}
          style={{
            padding: '12px 16px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            textAlign: 'center' as const,
            fontSize: '12px',
            fontWeight: '600' as const,
            color: '#e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {lastPrice}
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

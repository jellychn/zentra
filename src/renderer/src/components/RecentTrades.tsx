import { useStateStore } from '@renderer/contexts/StateStoreContext'
import TradeRow from './recentTrades/TradeRow'
import RatioBar from '@renderer/elements/RatioBar'
import Header from './recentTrades/Header'
import { SymbolMetrics } from 'src/main/data/dataStore'
import { ProcessedTrade } from 'src/main/data/types'
import React, { useMemo, useRef, useState, useEffect } from 'react'
import { formatNumber } from '../../../shared/helper'

export default function RecentTrades(): React.JSX.Element {
  const { state } = useStateStore()
  const { metrics } = state || {}
  const {
    buyVolume = 0,
    sellVolume = 0,
    avgTradeVolume = 0,
    recentTrades = []
  } = (metrics as SymbolMetrics) || {}

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
          <VirtualizedTradeList trades={recentTrades} />
        </div>
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.15)',
            backdropFilter: 'blur(10px)',
            border: `1px solid rgba(245, 158, 11, 0.3)`,
            borderRadius: '8px',
            padding: '8px 12px',
            marginTop: '10px',
            fontSize: '10px',
            color: '#f59e0b',
            zIndex: 5,
            fontWeight: '700',
            textAlign: 'center',
            maxWidth: '100%'
          }}
        >
          ABOVE AVERAGE TRADE: ≥ {formatNumber(avgTradeVolume)}
        </div>
      </div>
    </div>
  )
}

const VirtualizedTradeList = ({ trades }: { trades: ProcessedTrade[] }): React.JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 0 })
  const [containerHeight, setContainerHeight] = useState(0)

  // Estimate row height (adjust based on your TradeRow height)
  const ROW_HEIGHT = 60 // px - approximate height of TradeRow + margin
  const BUFFER_ROWS = 5 // Number of extra rows to render above/below viewport

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateContainerHeight = () => {
      setContainerHeight(container.clientHeight)
    }

    updateContainerHeight()
    window.addEventListener('resize', updateContainerHeight)

    return () => {
      window.removeEventListener('resize', updateContainerHeight)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_ROWS)
      const endIndex = Math.min(
        trades.length - 1,
        Math.floor((scrollTop + containerHeight) / ROW_HEIGHT) + BUFFER_ROWS
      )

      setVisibleRange({ start: startIndex, end: endIndex })
    }

    container.addEventListener('scroll', handleScroll)
    // Initial calculation
    handleScroll()

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [trades.length, containerHeight])

  const visibleTrades = useMemo(() => {
    return trades.slice(visibleRange.start, visibleRange.end + 1)
  }, [trades, visibleRange.start, visibleRange.end])

  const totalHeight = trades.length * ROW_HEIGHT
  const offsetTop = visibleRange.start * ROW_HEIGHT

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
    <div
      ref={containerRef}
      style={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        position: 'relative'
      }}
    >
      {/* Container with total height to maintain scroll */}
      <div
        style={{
          height: totalHeight,
          position: 'relative'
        }}
      >
        {/* Visible trades container positioned at correct offset */}
        <div
          style={{
            position: 'absolute',
            top: offsetTop,
            left: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            paddingRight: '4px'
          }}
        >
          {visibleTrades.map((trade, index) => (
            <TradeRow
              key={`trade-${visibleRange.start + index}-${trade.timestamp}`}
              trade={trade}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

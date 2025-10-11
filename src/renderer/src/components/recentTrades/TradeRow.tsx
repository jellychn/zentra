import React, { useCallback, useMemo } from 'react'
import { formatDuration, formatNumber } from '../../../../shared/helper'
import { Side } from '../../../../shared/types'
import { ProcessedTrade } from 'src/main/data/types'

const TradeRow = ({ trade }: { trade: ProcessedTrade }): React.JSX.Element => {
  const timestampNow = Date.now() / 1000
  const timestamp = Math.floor(Number(trade.timestamp) / 1000000000)

  const { side, price, quantity } = trade

  const { tradeColor, textColor, hoverColor, isBuy } = useMemo(() => {
    const isBuySide = side === Side.BUY
    const baseTradeColor = isBuySide ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'

    const baseTextColor = isBuySide ? '#10b981' : '#ef4444'

    const baseHoverColor = isBuySide ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'

    return {
      tradeColor: baseTradeColor,
      textColor: baseTextColor,
      hoverColor: baseHoverColor,
      isBuy: isBuySide
    }
  }, [side])

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.backgroundColor = hoverColor
      e.currentTarget.style.transform = 'translateX(4px)'
    },
    [hoverColor]
  )

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.backgroundColor = tradeColor
      e.currentTarget.style.transform = 'translateX(0)'
    },
    [tradeColor]
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr 1fr',
        gap: '16px',
        padding: '12px 16px',
        fontSize: '10px',
        fontWeight: '600',
        backgroundColor: tradeColor,
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        marginBottom: '6px',
        transition: 'all 0.2s ease',
        alignItems: 'center',
        backdropFilter: 'blur(10px)'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Time */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: isBuy ? '#10b981' : '#ef4444'
          }}
        />
        <div style={{ color: '#cbd5e1', fontSize: '9px' }}>
          {formatDuration(timestampNow - timestamp)}
        </div>
      </div>

      {/* Side */}
      <div>
        <div
          style={{
            color: textColor,
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            fontSize: '10px'
          }}
        >
          {side.toUpperCase()}
        </div>
      </div>

      {/* Price */}
      <div>
        <div style={{ color: '#f1f5f9', fontWeight: '600', fontSize: '10px' }}>
          ${formatNumber(price)}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <div style={{ color: '#f1f5f9', fontWeight: '600', fontSize: '10px' }}>
          {formatNumber(quantity)}
        </div>
      </div>
    </div>
  )
}

export default TradeRow

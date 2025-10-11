import React, { useCallback } from 'react'
import { formatNumber } from '../../../../shared/helper'

const OrderRow = ({
  price,
  size,
  isBid,
  maxTotal,
  total
}: {
  price: number
  size: number
  isBid: boolean
  maxTotal: number
  total?: number
}): React.JSX.Element => {
  const displayTotal = total !== undefined ? total : size
  const percentage = maxTotal > 0 ? (displayTotal / maxTotal) * 100 : 0

  const isUserOrder = false
  const priceDiff = 0
  const displayPriceDiff = 0

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.transform = 'translateX(4px)'
      e.currentTarget.style.background = isUserOrder
        ? isBid
          ? 'rgba(16, 185, 129, 0.25)'
          : 'rgba(239, 68, 68, 0.25)'
        : 'rgba(255, 255, 255, 0.05)'
    },
    [isBid, isUserOrder]
  )

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.transform = 'translateX(0)'
      e.currentTarget.style.background = isUserOrder
        ? isBid
          ? 'rgba(16, 185, 129, 0.15)'
          : 'rgba(239, 68, 68, 0.15)'
        : 'transparent'
    },
    [isBid, isUserOrder]
  )

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '16px',
        padding: '10px 16px',
        position: 'relative',
        fontSize: '11px',
        fontWeight: '600',
        backgroundColor: isUserOrder
          ? isBid
            ? 'rgba(16, 185, 129, 0.15)'
            : 'rgba(239, 68, 68, 0.15)'
          : 'transparent',
        border: isUserOrder ? '1px solid' : 'none',
        borderColor: isBid ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)',
        borderRadius: '8px',
        margin: '2px 0',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: `${percentage}%`,
          background: isBid
            ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.05))'
            : 'linear-gradient(90deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.05))',
          borderRadius: '8px',
          zIndex: 1
        }}
      />
      <span
        style={{
          color: isUserOrder ? '#ffffff' : isBid ? '#10b981' : '#ef4444',
          fontFamily: "'IBM Plex Mono', monospace",
          zIndex: 2,
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        {isUserOrder && (
          <div
            style={{
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              background: isBid ? '#10b981' : '#ef4444',
              flexShrink: 0
            }}
          />
        )}
        {formatNumber(price)}
        {isUserOrder && (
          <span
            style={{
              fontSize: '9px',
              padding: '2px 6px',
              background: isBid ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
              borderRadius: '4px',
              fontWeight: '600'
            }}
          >
            {priceDiff > 0 ? '+' : ''}
            {formatNumber(displayPriceDiff)}
          </span>
        )}
      </span>
      <span
        style={{
          color: isUserOrder ? '#ffffff' : '#e2e8f0',
          textAlign: 'right',
          fontFamily: "'IBM Plex Mono', monospace",
          zIndex: 2,
          fontWeight: '600'
        }}
      >
        {formatNumber(size)}
      </span>
      <span
        style={{
          color: isUserOrder ? '#ffffff' : '#94a3b8',
          textAlign: 'right',
          fontFamily: "'IBM Plex Mono', monospace",
          zIndex: 2,
          fontWeight: '600'
        }}
      >
        {formatNumber(displayTotal)}
      </span>
    </div>
  )
}

export default OrderRow

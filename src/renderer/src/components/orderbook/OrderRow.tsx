import React, { useCallback, memo, useMemo } from 'react'
import { formatNumber } from '../../../../shared/helper'

const OrderRow = memo(
  ({
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
    // Memoize expensive calculations
    const { displayTotal, percentage } = useMemo(() => {
      const calculatedTotal = total !== undefined ? total : size
      const calculatedPercentage = maxTotal > 0 ? (calculatedTotal / maxTotal) * 100 : 0
      return {
        displayTotal: calculatedTotal,
        percentage: calculatedPercentage
      }
    }, [total, size, maxTotal])

    // Memoize static values that don't change
    const isUserOrder = false
    const priceDiff = 0
    const displayPriceDiff = 0

    // Memoize styles that depend on props
    const { baseStyles, backgroundGradient, userOrderStyles } = useMemo(() => {
      const baseBg = isUserOrder
        ? isBid
          ? 'rgba(16, 185, 129, 0.15)'
          : 'rgba(239, 68, 68, 0.15)'
        : 'transparent'

      const border = isUserOrder
        ? `1px solid ${isBid ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`
        : 'none'

      const gradient = isBid
        ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.1), rgba(34, 197, 94, 0.05))'
        : 'linear-gradient(90deg, rgba(239, 68, 68, 0.1), rgba(248, 113, 113, 0.05))'

      const hoverBg = isUserOrder
        ? isBid
          ? 'rgba(16, 185, 129, 0.25)'
          : 'rgba(239, 68, 68, 0.25)'
        : 'rgba(255, 255, 255, 0.05)'

      return {
        baseStyles: {
          backgroundColor: baseBg,
          border
        },
        backgroundGradient: gradient,
        userOrderStyles: {
          hoverBackground: hoverBg,
          priceColor: isUserOrder ? '#ffffff' : isBid ? '#10b981' : '#ef4444',
          sizeColor: isUserOrder ? '#ffffff' : '#e2e8f0',
          totalColor: isUserOrder ? '#ffffff' : '#94a3b8'
        }
      }
    }, [isBid, isUserOrder])

    // Optimized event handlers with direct style manipulation
    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.currentTarget
        target.style.transform = 'translateX(4px)'
        target.style.background = userOrderStyles.hoverBackground
      },
      [userOrderStyles.hoverBackground]
    )

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.currentTarget
        target.style.transform = 'translateX(0)'
        target.style.background = baseStyles.backgroundColor || 'transparent'
      },
      [baseStyles.backgroundColor]
    )

    // Memoize formatted numbers to avoid repeated formatting
    const formattedNumbers = useMemo(
      () => ({
        price: formatNumber(price),
        size: formatNumber(size),
        displayTotal: formatNumber(displayTotal),
        priceDiff:
          priceDiff > 0 ? `+${formatNumber(displayPriceDiff)}` : formatNumber(displayPriceDiff)
      }),
      [price, size, displayTotal, priceDiff, displayPriceDiff]
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
          backgroundColor: baseStyles.backgroundColor,
          border: baseStyles.border,
          borderRadius: '8px',
          margin: '2px 0',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
          willChange: 'transform, background-color' // Hint for browser optimization
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background bar */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '100%',
            width: `${percentage}%`,
            background: backgroundGradient,
            borderRadius: '8px',
            zIndex: 1
          }}
        />

        {/* Price column */}
        <span
          style={{
            color: userOrderStyles.priceColor,
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
          {formattedNumbers.price}
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
              {formattedNumbers.priceDiff}
            </span>
          )}
        </span>

        {/* Size column */}
        <span
          style={{
            color: userOrderStyles.sizeColor,
            textAlign: 'right',
            fontFamily: "'IBM Plex Mono', monospace",
            zIndex: 2,
            fontWeight: '600'
          }}
        >
          {formattedNumbers.size}
        </span>

        {/* Total column */}
        <span
          style={{
            color: userOrderStyles.totalColor,
            textAlign: 'right',
            fontFamily: "'IBM Plex Mono', monospace",
            zIndex: 2,
            fontWeight: '600'
          }}
        >
          {formattedNumbers.displayTotal}
        </span>
      </div>
    )
  }
)

OrderRow.displayName = 'OrderRow'

export default OrderRow

import React from 'react'
import { formatNumber } from '../../../../../shared/helper'
import { COLORS } from './colors'
import { PosSide } from '../../../../../shared/types'
import { useStateStore } from '@renderer/contexts/StateStoreContext'

const PositionBand = ({
  position,
  getPositionPercentage
}: {
  position: any
  getPositionPercentage: (price: number) => number
}): React.JSX.Element => {
  const { state } = useStateStore()
  const { exchangeData, userSettings } = state || {}
  const { makerFee = 0, takerFee = 0 } = userSettings || {}
  const { lastPrice = 0 } = exchangeData || {}

  const calculatePnL = (position: any): number => {
    const entryPrice = position.entryPrice
    const positionSize = position.size
    const isLong = position.posSide === PosSide.LONG

    let pnl = 0
    if (isLong) {
      pnl = (lastPrice - entryPrice) * positionSize
    } else {
      pnl = (entryPrice - lastPrice) * positionSize
    }
    return pnl
  }

  const getPositionStatus = (position: any) => {
    const pnl = calculatePnL(position)
    const positionEntryFee = position.entryFee

    const size = position.size

    const exitFeeMaker = lastPrice * size * makerFee
    const exitFeeTaker = lastPrice * size * takerFee

    const isLong = position.posSide === PosSide.LONG

    const isPriceFavorable = pnl > 0 && pnl < positionEntryFee
    const isMakerProfitable = pnl > positionEntryFee && pnl < positionEntryFee + exitFeeMaker
    const isTakerProfitable =
      pnl > positionEntryFee + exitFeeMaker && pnl < positionEntryFee + exitFeeTaker
    const isProfit = pnl > positionEntryFee + exitFeeTaker

    return {
      pnl,
      isLong,
      isProfit,
      isPriceFavorable,
      isMakerProfitable,
      isTakerProfitable
    }
  }

  const { pnl, isLong, isProfit, isPriceFavorable, isMakerProfitable, isTakerProfitable } =
    getPositionStatus(position)

  const positionPrice = position.entryPrice

  const positionPercentage = getPositionPercentage(positionPrice)
  const currentPricePercentage = getPositionPercentage(lastPrice)

  // Determine band position and dimensions
  const bandTop = Math.min(positionPercentage, currentPricePercentage)
  const bandBottom = Math.max(positionPercentage, currentPricePercentage)
  const bandHeight = bandBottom - bandTop

  // Determine color based on profit/loss and price favorability
  let borderColor = COLORS.border.danger
  let gradient = `linear-gradient(to ${isLong ? 'bottom' : 'top'},
    ${COLORS.danger} 0%,
    rgba(239, 68, 68, 0.05) 70%,
    transparent 100%)`

  if (isProfit) {
    // Fully profitable (past all fees)
    borderColor = COLORS.border.success
    gradient = `linear-gradient(to ${isLong ? 'bottom' : 'top'},
    ${COLORS.success} 0%,
    rgba(16, 185, 129, 0.05) 70%,
    transparent 100%)`
  } else if (isTakerProfitable) {
    // Profitable after taker fees (but not quite break-even due to other costs)
    borderColor = COLORS.border.takerProfitable
    gradient = `linear-gradient(to ${isLong ? 'bottom' : 'top'},
    ${COLORS.takerProfitable} 0%,
    rgba(133, 77, 14, 0.05) 70%,
    transparent 100%)`
  } else if (isMakerProfitable) {
    // Profitable after maker fees
    borderColor = COLORS.border.makerProfitable
    gradient = `linear-gradient(to ${isLong ? 'bottom' : 'top'},
    ${COLORS.makerProfitable} 0%,
    rgba(161, 98, 7, 0.05) 70%,
    transparent 100%)`
  } else if (isPriceFavorable) {
    // Price is favorable but hasn't recovered entry fees
    borderColor = COLORS.border.warning
    gradient = `linear-gradient(to ${isLong ? 'bottom' : 'top'},
    ${COLORS.warning} 0%,
    rgba(245, 158, 11, 0.05) 70%,
    transparent 100%)`
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: `${bandTop}%`,
        left: '40px',
        right: '40px',
        height: `${bandHeight}%`,
        background: gradient,
        borderLeft: `2px solid ${borderColor}`,
        borderRight: `2px solid ${borderColor}`,
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      {/* Optional: Add subtle pattern for better visibility */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: isProfit
            ? `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(16, 185, 129, 0.03) 2px, rgba(16, 185, 129, 0.03) 4px)`
            : isPriceFavorable
              ? `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(245, 158, 11, 0.03) 2px, rgba(245, 158, 11, 0.03) 4px)`
              : `repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(239, 68, 68, 0.03) 2px, rgba(239, 68, 68, 0.03) 4px)`
        }}
      />

      {/* Band edges for better definition */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${borderColor}, transparent)`
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${borderColor}, transparent)`
        }}
      />

      {/* Direction arrow */}
      {bandHeight > 8 && (
        <div
          style={{
            position: 'absolute',
            top: `${(bandTop + bandBottom) / 2}%`,
            left: '50%',
            width: '12px',
            height: '12px',
            color: borderColor,
            borderRadius: '2px',
            zIndex: 11,
            transform: `translate(-50%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '8px',
            fontWeight: 'bold'
          }}
        >
          {isLong ? '▲' : '▼'}
        </div>
      )}

      {bandHeight > 15 && (
        <div
          style={{
            position: 'absolute',
            top: `${(bandTop + bandBottom + 10) / 2}%`,
            left: '50%',
            background: 'rgba(15, 23, 42, 0.9)',
            color: borderColor,
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '700',
            fontFamily: 'monospace',
            zIndex: 7,
            transform: 'translateX(-50%)',
            border: `1px solid ${borderColor}`,
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(8px)'
          }}
        >
          {pnl > 0 ? '+' : ''}
          {formatNumber(pnl)}
        </div>
      )}
    </div>
  )
}

export default PositionBand

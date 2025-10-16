import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { useMemo } from 'react'
import { PosSide } from '../../../shared/types'

const COLORS = {
  success: 'rgba(16, 185, 129, 0.15)',
  danger: 'rgba(239, 68, 68, 0.15)',
  warning: 'rgba(245, 158, 11, 0.15)',
  entryRecovered: 'rgba(251, 146, 60, 0.15)', // Bright Orange
  makerProfitable: 'rgba(234, 179, 8, 0.15)', // Amber Yellow
  takerProfitable: 'rgba(101, 163, 13, 0.15)', // Olive Green
  border: {
    success: 'rgba(16, 185, 129, 0.3)',
    danger: 'rgba(239, 68, 68, 0.3)',
    warning: 'rgba(245, 158, 11, 0.3)',
    entryRecovered: 'rgba(251, 146, 60, 0.3)', // Bright Orange
    makerProfitable: 'rgba(234, 179, 8, 0.3)', // Amber Yellow
    takerProfitable: 'rgba(101, 163, 13, 0.3)' // Olive Green
  }
}

export const usePositionColors = (
  position: any
): {
  gradient
  borderColor
  color
  breakEvenColor
  makerColor
  takerColor
} => {
  const { state } = useStateStore()
  const { exchangeData, userSettings } = state || {}
  const { lastPrice = 0 } = exchangeData || {}
  const { makerFee = 0, takerFee = 0 } = userSettings || {}

  const { posSide, entryPrice, size, entryFee } = position

  return useMemo(() => {
    // Calculate PnL
    let pnl = 0
    let isPriceFavorable = false

    if (posSide === PosSide.LONG) {
      pnl = (lastPrice - entryPrice) * size - entryFee
      isPriceFavorable = lastPrice > entryPrice
    } else {
      pnl = (entryPrice - lastPrice) * size - entryFee
      isPriceFavorable = lastPrice < entryPrice
    }

    // Calculate position status with fee thresholds
    const exitFeeMaker = lastPrice * size * makerFee
    const exitFeeTaker = lastPrice * size * takerFee

    const isMakerProfitable = pnl > entryFee && pnl < entryFee + exitFeeMaker
    const isTakerProfitable = pnl > entryFee + exitFeeMaker && pnl < entryFee + exitFeeTaker
    const isProfit = pnl > entryFee + exitFeeTaker

    // Determine colors based on status
    let gradient = COLORS.danger
    let borderColor = COLORS.border.danger
    let color = '#ef4444'
    let breakEvenColor = 'rgba(255, 255, 255, 0.6)'
    let makerColor = 'rgba(251, 146, 60, 0.8)' // Bright Orange
    let takerColor = 'rgba(234, 179, 8, 0.8)' // Amber Yellow

    if (isProfit) {
      // Fully profitable
      gradient = COLORS.success
      borderColor = COLORS.border.success
      color = '#10b981'
      breakEvenColor = 'rgba(16, 185, 129, 0.8)'
      makerColor = 'rgba(16, 185, 129, 0.8)'
      takerColor = 'rgba(16, 185, 129, 0.8)'
    } else if (isTakerProfitable) {
      // Taker profitable - closest to green
      gradient = COLORS.takerProfitable
      borderColor = COLORS.border.takerProfitable
      color = '#65a30d' // Olive Green
      breakEvenColor = 'rgba(251, 146, 60, 0.8)' // Orange
      makerColor = 'rgba(234, 179, 8, 0.8)' // Yellow
      takerColor = 'rgba(101, 163, 13, 0.8)' // Olive Green
    } else if (isMakerProfitable) {
      // Maker profitable - yellow
      gradient = COLORS.makerProfitable
      borderColor = COLORS.border.makerProfitable
      color = '#eab308' // Amber Yellow
      breakEvenColor = 'rgba(251, 146, 60, 0.8)' // Orange
      makerColor = 'rgba(234, 179, 8, 0.8)' // Yellow
      takerColor = 'rgba(101, 163, 13, 0.8)' // Olive Green
    } else if (isPriceFavorable) {
      // Price favorable - orange
      gradient = COLORS.warning
      borderColor = COLORS.border.warning
      color = '#f59e0b'
      breakEvenColor = 'rgba(251, 146, 60, 0.8)' // Orange
      makerColor = 'rgba(251, 146, 60, 0.8)' // Orange
      takerColor = 'rgba(251, 146, 60, 0.8)' // Orange
    } else {
      // Losing position - red
      gradient = COLORS.danger
      borderColor = COLORS.border.danger
      color = '#ef4444'
      breakEvenColor = 'rgba(239, 68, 68, 0.8)'
      makerColor = 'rgba(239, 68, 68, 0.8)'
      takerColor = 'rgba(239, 68, 68, 0.8)'
    }

    return {
      gradient,
      borderColor,
      color,
      breakEvenColor,
      makerColor,
      takerColor
    }
  }, [posSide, entryFee, size, entryPrice, lastPrice, makerFee, takerFee])
}

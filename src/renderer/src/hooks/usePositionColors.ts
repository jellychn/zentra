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
  gradient: string
  borderColor: string
  color: string
  breakEvenColor: string
  makerColor: string
  takerColor: string
} => {
  const { state } = useStateStore()
  const { exchangeData, userSettings } = state || {}
  const { lastPrice = 0 } = exchangeData || {}
  const { makerFee = 0, takerFee = 0 } = userSettings || {}

  const { posSide, entryPrice, size, entryFee } = position

  return useMemo(() => {
    const breakEvenPrice =
      posSide === PosSide.LONG ? entryPrice + entryFee / size : entryPrice - entryFee / size

    const makerBreakEvenPrice =
      posSide === PosSide.LONG
        ? entryPrice + (entryFee + lastPrice * size * makerFee) / size
        : entryPrice - (entryFee + lastPrice * size * makerFee) / size

    const takerBreakEvenPrice =
      posSide === PosSide.LONG
        ? entryPrice + (entryFee + lastPrice * size * takerFee) / size
        : entryPrice - (entryFee + lastPrice * size * takerFee) / size

    const hasPassedBreakEven =
      posSide === PosSide.LONG ? lastPrice >= breakEvenPrice : lastPrice <= breakEvenPrice

    const hasPassedMakerBreakEven =
      posSide === PosSide.LONG ? lastPrice >= makerBreakEvenPrice : lastPrice <= makerBreakEvenPrice

    const hasPassedTakerBreakEven =
      posSide === PosSide.LONG ? lastPrice >= takerBreakEvenPrice : lastPrice <= takerBreakEvenPrice

    let gradient = COLORS.danger
    let borderColor = COLORS.border.danger
    let color = '#ef4444'
    let breakEvenColor = 'rgba(255, 255, 255, 0.6)'
    let makerColor = 'rgba(251, 146, 60, 0.8)'
    let takerColor = 'rgba(234, 179, 8, 0.8)'

    if (hasPassedBreakEven) {
      breakEvenColor = 'rgba(16, 185, 129, 0.8)'
      gradient = COLORS.warning
      borderColor = COLORS.border.warning
      color = '#f59e0b'
    }

    if (hasPassedMakerBreakEven) {
      makerColor = 'rgba(16, 185, 129, 0.8)'
      gradient = COLORS.makerProfitable
      borderColor = COLORS.border.makerProfitable
      color = '#eab308'
    }

    if (hasPassedTakerBreakEven) {
      takerColor = 'rgba(16, 185, 129, 0.8)'
      gradient = COLORS.takerProfitable
      borderColor = COLORS.border.takerProfitable
      color = '#65a30d'
    }

    if (hasPassedBreakEven && hasPassedMakerBreakEven && hasPassedTakerBreakEven) {
      gradient = COLORS.success
      borderColor = COLORS.border.success
      color = '#10b981'
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

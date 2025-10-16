import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { useMemo } from 'react'
import { PosSide } from '../../../shared/types'

export const usePriceLines = (position: any) => {
  const { state } = useStateStore()
  const { userSettings } = state || {}
  const { makerFee = 0, takerFee = 0 } = userSettings || {}

  const { entryPrice, entryFee, size, posSide } = position

  return useMemo(() => {
    const isLong = posSide === PosSide.LONG

    const breakEvenPriceDiff = entryFee / size
    const exitMakerFeePriceDifference = entryPrice * makerFee
    const exitTakerFeePriceDifference = entryPrice * takerFee

    const breakEvenPriceLine = isLong
      ? entryPrice + breakEvenPriceDiff
      : entryPrice - breakEvenPriceDiff

    const profitableMakerPriceLine = isLong
      ? entryPrice + breakEvenPriceDiff + exitMakerFeePriceDifference
      : entryPrice - breakEvenPriceDiff - exitMakerFeePriceDifference

    const profitableTakerPriceLine = isLong
      ? entryPrice + breakEvenPriceDiff + exitTakerFeePriceDifference
      : entryPrice - breakEvenPriceDiff - exitTakerFeePriceDifference

    return {
      isLong,
      breakEvenPriceLine,
      profitableMakerPriceLine,
      profitableTakerPriceLine
    }
  }, [entryFee, entryPrice, makerFee, posSide, size, takerFee])
}

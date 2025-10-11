import { useMemo } from 'react'

import { usePriceLine } from '../contexts/PriceLineContext'
import { useStateStore } from '../contexts/StateStoreContext'
import { Direction, MAKER_FEE, PosSide, TAKER_FEE, TradingMode } from '../shared/shared'

// Helper function to handle large numbers safely
const safeMultiply = (a: number, b: number): number => {
  return Number((a * b).toFixed(8))
}

// Helper function to handle division safely
const safeDivide = (a: number, b: number): number => {
  if (b === 0) return 0
  return Number((a / b).toFixed(8))
}

export const usePotentialGains = (targetPrice?: number) => {
  const { hoverPrice } = usePriceLine()
  const { stateStore } = useStateStore()

  const {
    current_price,
    show_trading_mode,
    positions,
    paper_positions,
    current_leverage_paper,
    current_leverage_real,
    account_balance,
    paper_account_balance
  } = stateStore

  const price = targetPrice ?? hoverPrice ?? 0

  return useMemo(() => {
    if (!current_price || current_price <= 0 || price <= 0) {
      return {
        hasPosition: false,
        potentialLongGain: 0,
        potentialShortGain: 0,
        potentialLongGainMaker: 0,
        potentialShortGainMaker: 0,
        potentialLongGainTaker: 0,
        potentialShortGainTaker: 0,
        longROIMaker: 0,
        shortROIMaker: 0,
        longROITaker: 0,
        shortROITaker: 0,
        priceDifference: 0,
        positionSize: 0,
        leverageUsed: 1,
        isAboveCurrent: false,
        isBelowCurrent: false,
        makerFee: 0,
        takerFee: 0,
        positionNotional: 0
      }
    }

    let accountBalance = 0
    let openedPosition: any = null
    let positionDirection: any = PosSide.LONG
    let positionSizeInBaseCurrency: any = null
    let positionSizeInQuoteCurrency: any = null
    let positionLeverage: any = null
    let positionEntryPrice: any = null
    let positionPn: any = 0

    // Determine account balance and position based on trading mode
    if (show_trading_mode === TradingMode.PAPER) {
      accountBalance = paper_account_balance
      if (paper_positions.length > 0) {
        openedPosition = paper_positions[0]
        const { entry_price, leverage, direction, size, entry_fee } = openedPosition

        let pnl = 0
        if (direction === Direction.LONG) {
          pnl = safeMultiply(current_price - entry_price, size) - (entry_fee || 0)
        } else {
          pnl = safeMultiply(entry_price - current_price, size) - (entry_fee || 0)
        }

        positionDirection = direction
        positionEntryPrice = entry_price
        positionSizeInBaseCurrency = size
        positionSizeInQuoteCurrency = safeMultiply(size, entry_price)
        positionPn = pnl
        positionLeverage = leverage
      } else {
        positionLeverage = current_leverage_paper
      }
    }

    if (show_trading_mode === TradingMode.REAL) {
      accountBalance = account_balance
      if (positions.length > 0) {
        openedPosition = positions[0]
        const { avgEntryPriceRp, leverageRr, posSide, sizeRq, size, rlPnl, unPnl } = openedPosition

        positionDirection = posSide
        positionEntryPrice = Number(avgEntryPriceRp)

        positionSizeInBaseCurrency = Number(size || 0)
        positionSizeInQuoteCurrency = Number(
          sizeRq || safeMultiply(positionSizeInBaseCurrency, positionEntryPrice)
        )

        positionPn = Number(rlPnl || 0) + Number(unPnl || 0)
        positionLeverage = leverageRr
      } else {
        positionLeverage = current_leverage_real
      }
    }

    const calculatePositionNotional = (): number => {
      if (openedPosition) {
        if (positionSizeInQuoteCurrency && positionSizeInQuoteCurrency > 0) {
          return positionSizeInQuoteCurrency
        } else {
          return safeMultiply(positionSizeInBaseCurrency, current_price)
        }
      } else {
        // For new positions, calculate based on account balance and leverage
        return safeMultiply(accountBalance, positionLeverage)
      }
    }

    const calculatePositionSizeInBaseCurrency = (): number => {
      if (openedPosition) {
        // For existing positions, use the actual position size
        if (positionSizeInBaseCurrency && positionSizeInBaseCurrency > 0) {
          return positionSizeInBaseCurrency
        } else if (positionSizeInQuoteCurrency && positionSizeInQuoteCurrency > 0) {
          // Convert quote currency to base currency
          return safeDivide(positionSizeInQuoteCurrency, positionEntryPrice || current_price)
        } else {
          return safeDivide(calculatePositionNotional(), current_price)
        }
      } else {
        // For new positions, calculate how much base currency we can buy with our leveraged balance
        return safeDivide(safeMultiply(accountBalance, positionLeverage), current_price)
      }
    }

    const positionNotional = calculatePositionNotional()
    const positionSizeBase = calculatePositionSizeInBaseCurrency()
    const priceDifference = price - current_price
    const priceMovePercent = safeDivide(priceDifference, current_price)

    if (!openedPosition) {
      // Calculate potential gains in base currency first, then convert to quote currency
      const gainInBaseCurrency = safeMultiply(positionSizeBase, priceMovePercent)

      // Convert gains to quote currency at target price
      const potentialLongGain = safeMultiply(gainInBaseCurrency, price)
      const potentialShortGain = -potentialLongGain

      // Calculate fees based on position notional (entry + exit)
      const entryFeeMaker = safeMultiply(positionNotional, MAKER_FEE)
      const exitFeeMaker = safeMultiply(safeMultiply(positionSizeBase, price), MAKER_FEE)
      const totalFeeMaker = entryFeeMaker + exitFeeMaker

      const entryFeeTaker = safeMultiply(positionNotional, TAKER_FEE)
      const exitFeeTaker = safeMultiply(safeMultiply(positionSizeBase, price), TAKER_FEE)
      const totalFeeTaker = entryFeeTaker + exitFeeTaker

      const potentialLongGainMaker = potentialLongGain - totalFeeMaker
      const potentialShortGainMaker = potentialShortGain - totalFeeMaker

      const potentialLongGainTaker = potentialLongGain - totalFeeTaker
      const potentialShortGainTaker = potentialShortGain - totalFeeTaker

      // Calculate ROI based on actual margin used (account balance), not position notional
      const marginUsed = accountBalance
      const longROIMaker = marginUsed > 0 ? (potentialLongGainMaker / marginUsed) * 100 : 0
      const shortROIMaker = marginUsed > 0 ? (potentialShortGainMaker / marginUsed) * 100 : 0
      const longROITaker = marginUsed > 0 ? (potentialLongGainTaker / marginUsed) * 100 : 0
      const shortROITaker = marginUsed > 0 ? (potentialShortGainTaker / marginUsed) * 100 : 0

      return {
        hasPosition: false,
        potentialLongGain,
        potentialShortGain,
        potentialLongGainMaker,
        potentialShortGainMaker,
        potentialLongGainTaker,
        potentialShortGainTaker,
        longROIMaker,
        shortROIMaker,
        longROITaker,
        shortROITaker,
        priceDifference,
        positionSize: positionNotional,
        leverageUsed: positionLeverage,
        isAboveCurrent: price > current_price,
        isBelowCurrent: price < current_price,
        makerFee: totalFeeMaker,
        takerFee: totalFeeTaker,
        positionNotional,
        marginUsed,
        positionSizeBase // For debugging
      }
    } else {
      // For existing positions
      const actualPositionSize = positionSizeBase

      let grossPnL = 0
      if (positionDirection === PosSide.LONG) {
        grossPnL = safeMultiply(price - positionEntryPrice, actualPositionSize)
      } else {
        grossPnL = safeMultiply(positionEntryPrice - price, actualPositionSize)
      }

      const exitFeeMaker = safeMultiply(safeMultiply(actualPositionSize, price), MAKER_FEE)
      const exitFeeTaker = safeMultiply(safeMultiply(actualPositionSize, price), TAKER_FEE)

      const potentialPnLMaker = grossPnL - exitFeeMaker
      const potentialPnLTaker = grossPnL - exitFeeTaker

      // Calculate ROI based on actual margin used
      const marginUsed = safeDivide(positionNotional, positionLeverage)
      const potentialROIMaker = marginUsed > 0 ? (potentialPnLMaker / marginUsed) * 100 : 0
      const potentialROITaker = marginUsed > 0 ? (potentialPnLTaker / marginUsed) * 100 : 0
      const currentROI = marginUsed > 0 ? ((positionPn || 0) / marginUsed) * 100 : 0

      return {
        hasPosition: true,
        potentialPnLMaker,
        potentialPnLTaker,
        potentialROIMaker,
        potentialROITaker,
        currentPositionPnL: positionPn || 0,
        currentROI,
        wouldCloseAtProfit: grossPnL > (positionPn || 0),
        profitImprovementMaker: potentialPnLMaker - (positionPn || 0),
        profitImprovementTaker: potentialPnLTaker - (positionPn || 0),
        isAboveEntry: price > (positionEntryPrice || 0),
        isBelowEntry: price < (positionEntryPrice || 0),
        positionSize: positionNotional,
        leverageUsed: positionLeverage || 1,
        exitFeeMaker,
        exitFeeTaker,
        positionNotional,
        marginUsed,
        _debug: {
          actualPositionSize,
          positionSizeInBaseCurrency,
          positionSizeInQuoteCurrency,
          grossPnLBeforeFees: grossPnL,
          marginUsed
        }
      }
    }
  }, [
    price,
    current_price,
    show_trading_mode,
    positions,
    paper_positions,
    current_leverage_paper,
    current_leverage_real,
    account_balance,
    paper_account_balance
  ])
}

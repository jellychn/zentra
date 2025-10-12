import { OrderType } from '../../../shared/types'
import { mainStateStore } from '../../state/stateStore'
import { dbStore } from '../dbStore'
import { EnterTrade } from '../dbTrades'

export const createTrade = (trade: EnterTrade): void => {
  const isMaker = trade.type === OrderType.LIMIT
  const entryFee = calculateEntryFee(trade, isMaker)
  dbStore.tradeStore.enterTrade({ entryFee, ...trade })
}

function calculateEntryFee(tradeData: EnterTrade, isMaker: boolean = false): number {
  const state = mainStateStore.getState()
  const makerFee = state.userSettings.makerFee
  const takerFee = state.userSettings.takerFee

  const { entryPrice, size } = tradeData

  const notionalValue = entryPrice * size
  const feeRate = isMaker ? makerFee : takerFee
  const entryFee = notionalValue * feeRate

  return entryFee
}

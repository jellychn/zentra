import { dbStore } from '../../db/dbStore'
import { mainStateStore, StateType } from '../../state/stateStore'

export const processGetOpenTrades = async (data: { userId: string }): Promise<void> => {
  const { userId } = data
  const openPositions = await dbStore.tradeStore.getOpenTrades(userId)

  mainStateStore.update(StateType.USER_TRADES, { positions: openPositions })
}

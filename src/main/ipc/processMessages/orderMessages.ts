import { PosSide, Side, OrderType } from '../../../shared/types'
import { cancelOrder, createOrder } from '../../db/orders/ordersOperations'
import { mainStateStore, StateType } from '../../state/stateStore'

export const processCreateOrder = (data: {
  orderType: OrderType
  side: Side
  posSide: PosSide
}): void => {
  const { orderType, side, posSide } = data
  createOrder({ orderType: orderType, side: side, posSide: posSide })
}

export const processCancelOrder = (data: { orderId: string }): void => {
  const state = mainStateStore.getState()
  const userId = state[StateType.USER].id

  const { orderId } = data
  cancelOrder({ userId, orderId })
}

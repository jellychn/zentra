import { PosSide, Side, OrderType } from '../../../shared/types'
import { createOrder } from '../../db/orders/ordersOperations'

export const processCreateOrder = (data: {
  orderType: OrderType
  side: Side
  posSide: PosSide
}): void => {
  const { orderType, side, posSide } = data
  createOrder({ orderType: orderType, side: side, posSide: posSide })
}

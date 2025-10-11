import { PosSide, Side } from '../../../shared/types'
import { OrderType } from '../../db/db_orders'
import { create_order } from '../../db/orders/orders_operations'

export const processCreateOrder = (): void => {
  const order = {
    order_id: '1',
    order_type: OrderType.LIMIT,
    side: Side.BUY,
    pos_side: PosSide.LONG,
    size: 1,
    price: 1,
    symbol: 'S'
  }
  create_order(order)
}

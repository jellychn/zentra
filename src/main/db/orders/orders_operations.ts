import { Order } from '../db_orders'
import { dbStore } from '../db_store'

export const create_order = (data: Order): void => {
  dbStore.orderStore.putOrder(data)
}

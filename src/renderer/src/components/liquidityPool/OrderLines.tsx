import { memo } from 'react'

import { useStateStore } from '../../contexts/StateStoreContext'
import OrderLine from './orderLines/OrderLine'
import { Order } from 'src/main/db/dbOrders'

const OrderLines = memo(
  ({ getPositionPercentage }: { getPositionPercentage: (price: number) => number }) => {
    const { state } = useStateStore()
    const { userTrades, settings } = state || {}
    const { selectedSymbol } = settings || {}
    const { orders = [] } = userTrades || {}

    const filteredOrders = orders.filter((order) => order.symbol === selectedSymbol)

    return (
      <div>
        {filteredOrders.map((order: Order, index: number) => (
          <OrderLine
            key={`order-${order.price}-${index}`}
            order={order}
            getPositionPercentage={getPositionPercentage}
          />
        ))}
      </div>
    )
  }
)

OrderLines.displayName = 'OrderLines'
export default OrderLines

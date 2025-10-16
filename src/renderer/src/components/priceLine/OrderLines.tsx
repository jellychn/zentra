import { useStateStore } from '@renderer/contexts/StateStoreContext'
import OrderLine from './orderLines/OrderLine'

export default function OrderLines({
  getTopPercentage
}: {
  getTopPercentage: (price: number) => number
}): React.JSX.Element {
  const { state } = useStateStore()
  const { userTrades, settings } = state || {}
  const { selectedSymbol } = settings || {}
  const { orders = [] } = userTrades || {}

  const filteredOrders = orders.filter((position) => position.symbol === selectedSymbol)

  return (
    <>
      {filteredOrders?.map((order) => (
        <OrderLine key={order.createdAt} order={order} getTopPercentage={getTopPercentage} />
      ))}
    </>
  )
}

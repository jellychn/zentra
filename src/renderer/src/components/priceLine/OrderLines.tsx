import { useStateStore } from '@renderer/contexts/StateStoreContext'
import OrderLine from './orderLines/OrderLine'

export default function OrderLines({
  getTopPercentage
}: {
  getTopPercentage: (price: number) => number
}): React.JSX.Element {
  const { state } = useStateStore()
  const { userTrades } = state || {}
  const { orders } = userTrades || {}

  return (
    <>
      {orders?.map((order) => (
        <>
          <OrderLine key={order.createdAt} order={order} getTopPercentage={getTopPercentage} />
        </>
      ))}
    </>
  )
}

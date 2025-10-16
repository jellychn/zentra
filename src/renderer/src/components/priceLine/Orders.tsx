import { useStateStore } from '@renderer/contexts/StateStoreContext'

import OrderIndicator from './orders/OrderIndicator'

export default function Orders({
  getTopPercentage
}: {
  getTopPercentage: (price: number) => number
}): React.JSX.Element {
  const { state } = useStateStore()
  const { userTrades } = state || {}
  const { orders = [] } = userTrades || {}

  return (
    <div>
      {orders.map((order) => (
        <OrderIndicator key={order.createdAt} order={order} getTopPercentage={getTopPercentage} />
      ))}
      <style>
        {`
          .position-tooltip {
            opacity: 0;
            transition: opacity 0.2s;
          }
          div:hover .position-tooltip {
            opacity: 1;
          }
        `}
      </style>
    </div>
  )
}

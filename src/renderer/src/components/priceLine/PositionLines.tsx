import { useStateStore } from '@renderer/contexts/StateStoreContext'
import PositionLine from './positionLines/PositionLine'
import PositionBand from './positionLines/PositionBand'

export default function PositionLines({
  getTopPercentage
}: {
  getTopPercentage: (price: number) => number
}): React.JSX.Element {
  const { state } = useStateStore()
  const { userTrades } = state || {}
  const { positions } = userTrades || {}

  return (
    <>
      {positions?.map((position) => (
        <>
          <PositionLine position={position} getTopPercentage={getTopPercentage} />
          <PositionBand position={position} getTopPercentage={getTopPercentage} />
        </>
      ))}
    </>
  )
}

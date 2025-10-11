import { useStateStore } from '@renderer/contexts/StateStoreContext'
import React, { memo } from 'react'

interface CurrentPriceProps {
  getTopPercentage: (price: number) => number
}

const CurrentPrice = memo(({ getTopPercentage }: CurrentPriceProps): React.JSX.Element => {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { lastPrice = 0 } = exchangeData || {}

  const positionPercentage = getTopPercentage(lastPrice)

  return (
    <div
      style={{
        position: 'absolute',
        top: `${positionPercentage}%`,
        left: 0,
        right: 0,
        transform: 'translateY(-50%)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          pointerEvents: 'auto'
        }}
      >
        <div
          style={{
            height: '2px',
            background:
              'linear-gradient(90deg, transparent 0%, #3f51b5 20%, #3f51b5 80%, transparent 100%)',
            width: '100%',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            position: 'relative'
          }}
        />
      </div>
    </div>
  )
})

CurrentPrice.displayName = 'CurrentPrice'
export default CurrentPrice

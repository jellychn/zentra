import { useStateStore } from '@renderer/contexts/StateStoreContext'
import React, { memo } from 'react'
import { formatNumber } from '../../../../shared/helper'

interface CurrentPriceProps {
  showHoverPrice: boolean
  getTopPercentage: (price: number) => number
}

const CurrentPrice = memo(
  ({ showHoverPrice, getTopPercentage }: CurrentPriceProps): React.JSX.Element => {
    const { state } = useStateStore()
    const { exchangeData } = state || {}
    const { lastPrice = 0 } = exchangeData || {}

    const positionPercentage = getTopPercentage(lastPrice)

    if (!showHoverPrice) {
      return <></>
    }

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
          {/* Main line with stronger gradient */}
          <div
            style={{
              height: '3px',
              background:
                'linear-gradient(90deg, transparent 0%, #ff6b6b 20%, #ff6b6b 80%, transparent 100%)',
              width: '100%',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              boxShadow: '0 0 10px rgba(255, 107, 107, 0.8), 0 0 20px rgba(255, 107, 107, 0.4)',
              borderRadius: '2px'
            }}
          />

          {/* Price label */}
          <div
            style={{
              position: 'absolute',
              top: '-25px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(255, 107, 107, 0.9)',
              color: 'white',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '10px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            ${formatNumber(lastPrice)}
          </div>
        </div>
      </div>
    )
  }
)

CurrentPrice.displayName = 'CurrentPrice'
export default CurrentPrice

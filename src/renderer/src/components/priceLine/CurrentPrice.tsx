import { useStateStore } from '@renderer/contexts/StateStoreContext'
import React, { memo } from 'react'
import { COLORS } from './colors'

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

    const glow = COLORS.glow

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
              background: `linear-gradient(90deg,
                              transparent 0%,
                              ${COLORS.primary} 50%,
                              transparent 100%)`,
              width: '100%',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              boxShadow: `0 0 20px ${glow.primary}`,
              borderRadius: '2px'
            }}
          />
        </div>
      </div>
    )
  }
)

CurrentPrice.displayName = 'CurrentPrice'
export default CurrentPrice

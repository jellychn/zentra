import { memo, useMemo } from 'react'
import { OrderType } from '../../../../shared/types'
import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { COLORS } from './colors'
import { formatNumber } from '../../../../shared/helper'

const PlaceOrder = memo(
  ({
    price,
    side,
    setClicked,
    setHoverPrice
  }: {
    price: number
    side: string
    setClicked: (clicked: boolean) => void
    setHoverPrice: (price: number | null) => void
  }) => {
    const { state } = useStateStore()
    const { exchangeData } = state || {}
    const { lastPrice = 0 } = exchangeData || {}

    const { orderDirection, orderDescription } = useMemo(() => {
      const isAboveCurrent = price > lastPrice

      if (isAboveCurrent) {
        return {
          orderDirection: 'SHORT',
          orderType: OrderType.LIMIT,
          orderDescription: 'Sell at this price level'
        }
      } else {
        return {
          orderDirection: 'LONG',
          orderType: OrderType.LIMIT,
          orderDescription: 'Buy at this price level'
        }
      }
    }, [price, lastPrice])

    const { orderDirection: touchedDirection, orderDescription: touchedDescription } =
      useMemo(() => {
        const isAboveCurrent = price > lastPrice

        if (isAboveCurrent) {
          return {
            orderDirection: 'LONG',
            orderType: OrderType.LIMIT_IF_TOUCHED,
            orderDescription: 'Buy if price drops to this level'
          }
        } else {
          return {
            orderDirection: 'SHORT',
            orderType: OrderType.LIMIT_IF_TOUCHED,
            orderDescription: 'Sell if price rises to this level'
          }
        }
      }, [price, lastPrice])

    const popupPosition = useMemo(() => {
      const verticalOffset = 12

      return {
        bottom: `calc(100% + ${verticalOffset}px)`,
        left: side === 'left' ? '-10px' : 'auto',
        right: side === 'right' ? '-10px' : 'auto',
        transform: 'translateX(0)'
      }
    }, [side])

    const getButtonColor = (direction: string): string => {
      return direction === 'LONG' ? COLORS.success : COLORS.danger
    }

    const getDirectionIcon = (direction: string): string => {
      return direction === 'LONG' ? '↗' : '↘'
    }

    return (
      <div
        style={{
          position: 'absolute',
          ...popupPosition,
          background: 'rgba(15, 23, 42, 0.98)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${COLORS.border}`,
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
          zIndex: 150,
          minWidth: '200px',
          animation: 'fadeInUp 0.25s ease-out'
        }}
        onMouseEnter={() => setHoverPrice(price)}
        onMouseLeave={() => setHoverPrice(null)}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px',
            paddingBottom: '8px',
            borderBottom: `1px solid ${COLORS.border}`
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: '700',
              color: COLORS.text.primary,
              letterSpacing: '0.5px'
            }}
          >
            PLACE ORDER
          </div>
          <div
            style={{
              fontSize: '12px',
              fontWeight: '600',
              color: COLORS.primary,
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            ${formatNumber(price)}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              padding: '12px',
              border: `1px solid ${getButtonColor(orderDirection)}20`
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '6px'
              }}
            >
              <div
                style={{
                  fontSize: '8px',
                  fontWeight: '700',
                  color: getButtonColor(orderDirection),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginRight: '3px'
                }}
              >
                <span>{getDirectionIcon(orderDirection)}</span>
                {orderDirection} LIMIT
              </div>
              <div
                style={{
                  fontSize: '6px',
                  fontWeight: '600',
                  color: COLORS.text.muted,
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '3px'
                }}
              >
                IMMEDIATE
              </div>
            </div>
            <div
              style={{
                fontSize: '10px',
                color: COLORS.text.secondary,
                marginBottom: '10px',
                lineHeight: '1.3'
              }}
            >
              {orderDescription}
            </div>
            <button
              onClick={() => setClicked(false)}
              style={{
                width: '100%',
                background: getButtonColor(orderDirection),
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '8px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: `0 2px 8px ${getButtonColor(orderDirection)}40`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = orderDirection === 'LONG' ? '#059669' : '#dc2626'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = `0 4px 12px ${getButtonColor(orderDirection)}60`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = getButtonColor(orderDirection)
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = `0 2px 8px ${getButtonColor(orderDirection)}40`
              }}
            >
              PLACE {orderDirection} ORDER
            </button>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              padding: '12px',
              border: `1px solid ${getButtonColor(touchedDirection)}20`
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '6px'
              }}
            >
              <div
                style={{
                  fontSize: '8px',
                  fontWeight: '700',
                  color: getButtonColor(touchedDirection),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginRight: '3px'
                }}
              >
                <span>{getDirectionIcon(touchedDirection)}</span>
                {touchedDirection} LIMIT
              </div>
              <div
                style={{
                  fontSize: '6px',
                  fontWeight: '600',
                  color: COLORS.text.muted,
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '3px'
                }}
              >
                CONDITIONAL
              </div>
            </div>
            <div
              style={{
                fontSize: '10px',
                color: COLORS.text.secondary,
                marginBottom: '10px',
                lineHeight: '1.3'
              }}
            >
              {touchedDescription}
            </div>
            <button
              onClick={() => setClicked(false)}
              style={{
                width: '100%',
                background: getButtonColor(touchedDirection),
                color: 'white',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '6px',
                fontSize: '8px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: `0 2px 8px ${getButtonColor(touchedDirection)}40`,
                opacity: 0.95
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  touchedDirection === 'LONG' ? '#059669' : '#dc2626'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = `0 4px 12px ${getButtonColor(touchedDirection)}60`
                e.currentTarget.style.opacity = '1'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = getButtonColor(touchedDirection)
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = `0 2px 8px ${getButtonColor(touchedDirection)}40`
                e.currentTarget.style.opacity = '0.95'
              }}
            >
              PLACE {touchedDirection} ORDER
            </button>
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            top: '100%',
            [side === 'left' ? 'left' : 'right']: '20px',
            width: '0',
            height: '0',
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: `8px solid rgba(15, 23, 42, 0.98)`,
            filter: 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3))'
          }}
        />
      </div>
    )
  }
)

const styles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-8px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}

PlaceOrder.displayName = 'PlaceOrder'
export default PlaceOrder

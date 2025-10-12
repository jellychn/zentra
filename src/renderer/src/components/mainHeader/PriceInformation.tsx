import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { formatNumber } from '../../../..//shared/helper'

const PriceInformation = (): React.JSX.Element => {
  const { state } = useStateStore()
  const { exchangeData } = state || {}
  const { lastPrice = 0 } = exchangeData || {}

  const priceChange = 10
  const priceChangePercentage = 10

  const isPricePositive = true
  const isPriceNegative = false

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        flexShrink: 0
      }}
    >
      <div>
        <div
          style={{
            fontSize: '18px',
            fontWeight: '700',
            color: '#f1f5f9',
            marginBottom: '2px'
          }}
        >
          ${lastPrice ? formatNumber(lastPrice) : '0.00'}
        </div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: isPricePositive ? '#10b981' : isPriceNegative ? '#ef4444' : '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {isPricePositive ? '↗' : isPriceNegative ? '↘' : '→'}{' '}
          {priceChange ? Math.abs(priceChange).toFixed(2) : '0.00'} (
          {priceChangePercentage ? Math.abs(priceChangePercentage).toFixed(2) : '0.00'}
          %) (5M)
        </div>
      </div>
    </div>
  )
}

export default PriceInformation

import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { formatNumber } from '../../../../shared/helper'

const PriceInformation = (): React.JSX.Element => {
  const { state } = useStateStore()
  const { exchangeData, metrics } = state || {}
  const { lastPrice = 0 } = exchangeData || {}
  const { agoPrice = 0 } = metrics || {}

  const priceChange = lastPrice - agoPrice
  const priceChangePercentage = agoPrice !== 0 ? (priceChange / agoPrice) * 100 : 0

  const isPricePositive = priceChange > 0
  const isPriceNegative = priceChange < 0

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginLeft: '20px',
        flexShrink: 0
      }}
    >
      <div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: '700',
            color: '#f1f5f9',
            marginBottom: '2px'
          }}
        >
          ${lastPrice ? formatNumber(lastPrice) : '0.00'}
        </div>
        <div
          style={{
            fontSize: '10px',
            fontWeight: '600',
            color: isPricePositive ? '#10b981' : isPriceNegative ? '#ef4444' : '#94a3b8',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {isPricePositive ? '↗' : isPriceNegative ? '↘' : '→'} {formatNumber(priceChange)} (
          {Math.abs(priceChangePercentage).toFixed(2)}%) (5M)
        </div>
      </div>
    </div>
  )
}

export default PriceInformation

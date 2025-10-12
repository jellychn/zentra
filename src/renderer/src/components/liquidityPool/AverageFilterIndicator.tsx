import { memo } from 'react'
import { formatNumber } from '../../../../shared/helper'
import { COLORS } from './colors'

const AverageFilterIndicator = memo(
  ({
    hasLiquidityPool,
    hasOrderBook,
    leftAvgLiquidity,
    rightAvgLiquidity
  }: {
    hasLiquidityPool: boolean
    hasOrderBook: boolean
    leftAvgLiquidity: number
    rightAvgLiquidity: number
  }): React.JSX.Element => {
    return (
      <div
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '20px',
          background: 'rgba(245, 158, 11, 0.15)',
          backdropFilter: 'blur(10px)',
          border: `1px solid rgba(245, 158, 11, 0.3)`,
          borderRadius: '8px',
          padding: '8px 12px',
          fontSize: '10px',
          color: COLORS.warning,
          zIndex: 5,
          fontWeight: '700',
          textAlign: 'center',
          maxWidth: '100%'
        }}
      >
        {hasLiquidityPool && hasOrderBook ? (
          <div>
            {`ABOVE AVERAGE: POOL ≥ ${formatNumber(leftAvgLiquidity)} • ORDERS ≥ ${formatNumber(rightAvgLiquidity)}`}
          </div>
        ) : hasLiquidityPool ? (
          <div>ABOVE AVERAGE LIQUIDITY: ≥ {formatNumber(leftAvgLiquidity)}</div>
        ) : (
          <div>ABOVE AVERAGE ORDERS: ≥ {formatNumber(rightAvgLiquidity)}</div>
        )}
      </div>
    )
  }
)

AverageFilterIndicator.displayName = 'AverageFilterIndicator'

export default AverageFilterIndicator

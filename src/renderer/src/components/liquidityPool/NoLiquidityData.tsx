import { formatNumber } from '../../../../shared/helper'
import { COLORS } from './colors'

const NoLiquidityData = ({
  message = 'No Liquidity Data Available',
  showAverageWarning = false,
  leftAvgLiquidity = 0,
  rightAvgLiquidity = 0,
  hasLiquidityPool = false,
  hasOrderBook = false
}: {
  message?: string
  showAverageWarning?: boolean
  leftAvgLiquidity?: number
  rightAvgLiquidity?: number
  hasLiquidityPool?: boolean
  hasOrderBook?: boolean
}): React.JSX.Element => {
  return (
    <div
      style={{
        position: 'relative',
        background: COLORS.background,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        color: COLORS.text.secondary,
        fontFamily: 'Inter, sans-serif',
        padding: '40px 20px'
      }}
    >
      <div
        style={{
          fontSize: '48px',
          marginBottom: '16px',
          opacity: 0.5,
          filter: 'grayscale(1)'
        }}
      >
        💧
      </div>
      <div
        style={{
          fontSize: '14px',
          textAlign: 'center',
          marginBottom: showAverageWarning ? '12px' : '0',
          color: COLORS.text.primary,
          fontWeight: '600'
        }}
      >
        {message}
      </div>
      {showAverageWarning && (
        <div
          style={{
            fontSize: '11px',
            color: COLORS.warning,
            textAlign: 'center',
            background: 'rgba(245, 158, 11, 0.1)',
            padding: '8px 12px',
            borderRadius: '6px',
            border: `1px solid rgba(245, 158, 11, 0.2)`
          }}
        >
          {hasLiquidityPool && hasOrderBook ? (
            <div>
              <div>Pool Average: ${formatNumber(leftAvgLiquidity)}</div>
              <div>Orders Average: ${formatNumber(rightAvgLiquidity)}</div>
            </div>
          ) : hasLiquidityPool ? (
            <div>Average Liquidity: ${formatNumber(leftAvgLiquidity)}</div>
          ) : (
            <div>Average Orders: ${formatNumber(rightAvgLiquidity)}</div>
          )}
        </div>
      )}
    </div>
  )
}

export default NoLiquidityData

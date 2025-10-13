import { memo } from 'react'
import { COLORS } from './colors'
import { formatNumber } from '../../../../shared/helper'
import StrengthMeter from './StrengthMeter'
import { useLiquidityPool } from '@renderer/contexts/LiquidityPoolContext'

const BarTooltip = memo(() => {
  const { tooltipInfo } = useLiquidityPool()

  if (!tooltipInfo) {
    return <></>
  }

  const { tooltipData, side, position, maxLiquidity, type, isNegative, age, avgLiquidity } =
    tooltipInfo
  const { absLiquidity, relativeStrength, ageColor, formatAge, ageDescription } = tooltipData

  return (
    <div
      id="myDiv"
      style={{
        position: 'absolute',
        left: side === 'left' ? '160px' : 'auto',
        right: side === 'right' ? '160px' : 'auto',
        top: `${position}%`,
        transform: 'translateY(-50%)',
        background: COLORS.surface,
        backdropFilter: 'blur(20px)',
        padding: '16px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        color: COLORS.text.primary,
        whiteSpace: 'nowrap',
        zIndex: 100,
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
        minWidth: '280px',
        maxWidth: '320px',
        pointerEvents: 'none',
        border: `1px solid ${COLORS.border}`
      }}
    >
      {/* Arrow pointing to the bar */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          [side === 'left' ? 'left' : 'right']: '-6px',
          transform: 'translateY(-50%)',
          width: '0',
          height: '0',
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          [side === 'left' ? 'borderRight' : 'borderLeft']: `6px solid ${COLORS.border}`
        }}
      />

      <div style={{ marginBottom: '10px', color: COLORS.primary }}>CLICK TO PLACE ORDER</div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}
      >
        <span style={{ color: COLORS.text.secondary }}>Size:</span>
        <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>
          {formatNumber(absLiquidity)}
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}
      >
        <span style={{ color: COLORS.text.secondary }}>Strength:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontFamily: 'monospace' }}>
            {Math.round((tooltipData.absLiquidity / maxLiquidity) * 100)}%
          </span>
          <StrengthMeter intensity={relativeStrength} />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}
      >
        <span style={{ color: COLORS.text.secondary }}>Type:</span>
        <span
          style={{
            color:
              type === 'bid' || (type === 'pool' && !isNegative) ? COLORS.success : COLORS.danger,
            fontWeight: '700'
          }}
        >
          {type === 'bid' && 'BID'}
          {type === 'ask' && 'ASK'}
          {type === 'pool' && (isNegative ? 'SELL' : 'BUY')}
        </span>
      </div>

      {type === 'pool' && age !== undefined && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px'
          }}
        >
          <span style={{ color: COLORS.text.secondary }}>Age:</span>
          <span style={{ color: ageColor, fontWeight: '700' }}>
            {formatAge} ({ageDescription})
          </span>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0'
        }}
      >
        <span style={{ color: COLORS.text.secondary }}>Average:</span>
        <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>
          {formatNumber(avgLiquidity)}
        </span>
      </div>
    </div>
  )
})

BarTooltip.displayName = 'BarTooltip'
export default BarTooltip

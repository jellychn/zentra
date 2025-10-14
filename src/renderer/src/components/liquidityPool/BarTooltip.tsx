import { memo } from 'react'
import { COLORS } from './colors'
import { formatNumber } from '../../../../shared/helper'
import StrengthMeter from './StrengthMeter'

const BarTooltip = memo(
  ({
    hovered,
    tooltipData,
    side,
    position,
    maxLiquidity,
    type,
    isNegative,
    age,
    avgLiquidity
  }: {
    hovered
    tooltipData
    side
    position
    maxLiquidity
    type
    isNegative
    age
    avgLiquidity
  }) => {
    const { absLiquidity, relativeStrength, ageColor, formatAge, ageDescription } = tooltipData

    if (!hovered) {
      return <></>
    }

    // Get type color
    const getTypeColor = (): string => {
      if (type === 'bid' || (type === 'pool' && !isNegative)) {
        return COLORS.success
      } else if (type === 'ask' || (type === 'pool' && isNegative)) {
        return COLORS.danger
      }
      return COLORS.primary
    }

    const typeColor = getTypeColor()

    return (
      <div
        id="myDiv"
        style={{
          position: 'absolute',
          left: side === 'left' ? '140px' : 'auto',
          right: side === 'right' ? '140px' : 'auto',
          top: `${position}%`,
          transform: 'translateY(-50%)',
          background: 'rgba(15, 23, 42, 0.98)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${COLORS.border}`,
          borderRadius: '12px',
          padding: '16px',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)',
          zIndex: 100,
          minWidth: '200px',
          maxWidth: '280px',
          pointerEvents: 'none'
        }}
      >
        {/* Header */}
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
            LIQUIDITY INFO
          </div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: '600',
              color: typeColor,
              background: `${typeColor}20`,
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            {type === 'bid' && 'BID'}
            {type === 'ask' && 'ASK'}
            {type === 'pool' && (isNegative ? 'SELL' : 'BUY')}
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Size */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              padding: '12px',
              border: `1px solid ${typeColor}20`
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
                  color: typeColor,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                SIZE
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
                VOLUME
              </div>
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: COLORS.text.primary,
                fontFamily: "'IBM Plex Mono', monospace"
              }}
            >
              {formatNumber(absLiquidity)}
            </div>
          </div>

          {/* Strength */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              padding: '12px',
              border: `1px solid ${COLORS.primary}20`
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
                  color: COLORS.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                STRENGTH
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
                RELATIVE
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: '700',
                  color: COLORS.text.primary,
                  fontFamily: "'IBM Plex Mono', monospace"
                }}
              >
                {Math.round((tooltipData.absLiquidity / maxLiquidity) * 100)}%
              </div>
              <StrengthMeter intensity={relativeStrength} />
            </div>
          </div>

          {/* Age (if available) */}
          {type === 'pool' && age !== undefined && (
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                padding: '12px',
                border: `1px solid ${ageColor}20`
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
                    color: ageColor,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  AGE
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
                  ACTIVITY
                </div>
              </div>
              <div
                style={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: ageColor
                }}
              >
                {formatAge} <span style={{ color: COLORS.text.secondary }}>({ageDescription})</span>
              </div>
            </div>
          )}

          {/* Average */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '8px',
              padding: '12px',
              border: `1px solid ${COLORS.warning}20`
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
                  color: COLORS.warning,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                AVERAGE
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
                COMPARISON
              </div>
            </div>
            <div
              style={{
                fontSize: '10px',
                fontWeight: '700',
                color: COLORS.text.primary,
                fontFamily: "'IBM Plex Mono', monospace"
              }}
            >
              {formatNumber(avgLiquidity)}
            </div>
          </div>
        </div>
      </div>
    )
  }
)

BarTooltip.displayName = 'BarTooltip'
export default BarTooltip

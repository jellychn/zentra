import { memo } from 'react'
import { formatNumber } from '../../../../shared/helper'
import { COLORS } from './colors'

const NoLiquidityData = memo(
  ({
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
          background: `linear-gradient(135deg, ${COLORS.background} 0%, ${darkenColor(COLORS.background, 0.02)} 100%)`,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: `1px solid ${COLORS.border}`,
          borderRadius: '16px',
          color: COLORS.text.secondary,
          fontFamily: 'Inter, sans-serif',
          padding: '48px 24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(10px)'
        }}
      >
        {/* Animated water droplet icon */}
        <div
          style={{
            fontSize: '64px',
            marginBottom: '20px',
            opacity: 0.6,
            filter: 'grayscale(0.8)',
            transform: 'translateY(0)',
            animation: 'float 3s ease-in-out infinite'
          }}
        >
          💧
        </div>

        {/* Main message */}
        <div
          style={{
            fontSize: '16px',
            textAlign: 'center',
            marginBottom: showAverageWarning ? '20px' : '0',
            color: COLORS.text.primary,
            fontWeight: '600',
            lineHeight: '1.5',
            maxWidth: '280px'
          }}
        >
          {message}
        </div>

        {/* Optional description */}
        <div
          style={{
            fontSize: '13px',
            textAlign: 'center',
            color: COLORS.text.secondary,
            opacity: 0.7,
            marginTop: '8px',
            lineHeight: '1.4',
            maxWidth: '240px'
          }}
        >
          Liquidity data will appear here when available
        </div>

        {showAverageWarning && (
          <div
            style={{
              fontSize: '12px',
              color: COLORS.warning,
              textAlign: 'center',
              background:
                'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
              padding: '16px',
              borderRadius: '12px',
              border: `1px solid rgba(245, 158, 11, 0.3)`,
              marginTop: '24px',
              width: '100%',
              maxWidth: '280px',
              boxShadow: '0 2px 12px rgba(245, 158, 11, 0.1)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px'
              }}
            >
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: COLORS.warning,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '8px',
                  fontSize: '10px',
                  color: 'white'
                }}
              >
                ⚠️
              </div>
              <span style={{ fontWeight: '600', fontSize: '13px' }}>Average Values</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
              {hasLiquidityPool && hasOrderBook ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ opacity: 0.8 }}>Pool Average:</span>
                    <span style={{ fontWeight: '600', color: COLORS.text.primary }}>
                      ${formatNumber(leftAvgLiquidity)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ opacity: 0.8 }}>Orders Average:</span>
                    <span style={{ fontWeight: '600', color: COLORS.text.primary }}>
                      ${formatNumber(rightAvgLiquidity)}
                    </span>
                  </div>
                </>
              ) : hasLiquidityPool ? (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ opacity: 0.8 }}>Average Liquidity:</span>
                  <span style={{ fontWeight: '600', color: COLORS.text.primary }}>
                    ${formatNumber(leftAvgLiquidity)}
                  </span>
                </div>
              ) : (
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span style={{ opacity: 0.8 }}>Average Orders:</span>
                  <span style={{ fontWeight: '600', color: COLORS.text.primary }}>
                    ${formatNumber(rightAvgLiquidity)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add CSS for animation */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
          `}
        </style>
      </div>
    )
  }
)

// Helper function to darken colors for gradients
function darkenColor(color: string, factor: number): string {
  // Simple color darkening - you might want to use a proper color library
  return color // Implement proper color manipulation based on your needs
}

NoLiquidityData.displayName = 'NoLiquidityData'

export default NoLiquidityData

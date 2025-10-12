import { TradingMode } from '../../../../shared/types'
import { formatNumber } from '../../../../shared/helper'

const AccountBalance = () => {
  const usagePercentage = 12
  const isProfit = false
  const mode = TradingMode.PAPER

  const currentBalance = 10000
  const totalPnL = 10
  const availableBalance = 900

  const getBalanceColor = (): string => {
    if (usagePercentage > 90) return '#ef4444'
    if (usagePercentage > 70) return '#f59e0b'
    return '#10b981'
  }

  const getPnLColor = (): string => {
    return isProfit ? '#10b981' : '#ef4444'
  }

  const getModeColor = (): string => {
    switch (mode) {
      case TradingMode.PAPER:
        return '#3b82f6'
      case TradingMode.REAL:
        return '#10b981'
      default:
        return '#6b7280'
    }
  }

  const getModeIcon = (): string => {
    switch (mode) {
      case TradingMode.PAPER:
        return '📄'
      case TradingMode.REAL:
        return '💸'
      default:
        return '💰'
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        boxShadow: `
              0 8px 32px rgba(0, 0, 0, 0.4),
              0 0 60px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.05)
            `,
        flexShrink: 0
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderTopRightRadius: '10px',
          borderBottomRightRadius: '10px',
          padding: '8px 16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minWidth: '240px'
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: `linear-gradient(135deg, ${getModeColor()}, ${getModeColor()}80)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'white',
            flexShrink: 0
          }}
        >
          {getModeIcon()}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2px'
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#f1f5f9',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}
            >
              {mode}
            </div>
            <div
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: getBalanceColor()
              }}
            >
              {formatNumber(currentBalance)} USDT
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '4px'
            }}
          >
            <div
              style={{
                fontSize: '10px',
                fontWeight: '600',
                color: '#94a3b8'
              }}
            >
              P&L
            </div>
            <div
              style={{
                fontSize: '10px',
                fontWeight: '700',
                color: getPnLColor()
              }}
            >
              {isProfit ? '+' : ''}
              {formatNumber(totalPnL)} USDT
            </div>
          </div>

          <div
            style={{
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
              overflow: 'hidden',
              marginBottom: '4px'
            }}
          >
            <div
              style={{
                height: '100%',
                background: getBalanceColor(),
                borderRadius: '2px',
                width: `${Math.min(usagePercentage, 100)}%`,
                transition: 'width 0.3s ease'
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                fontSize: '10px',
                fontWeight: '600',
                color: '#94a3b8'
              }}
            >
              Available
            </div>
            <div
              style={{
                fontSize: '10px',
                fontWeight: '700',
                color: '#60a5fa'
              }}
            >
              {formatNumber(availableBalance)} USDT
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountBalance

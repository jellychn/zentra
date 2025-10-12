import React from 'react'
import { TradingMode } from '../../../../shared/types'
import { useStateStore } from '@renderer/contexts/StateStoreContext'
import { getTradingModeColor, getTradingModeLabel } from '../recentChartIndicator/colors'

const Header = (): React.JSX.Element => {
  const { state } = useStateStore()
  const { settings } = state || {}
  const tradingMode = settings?.tradingMode ?? TradingMode.PAPER

  return (
    <div
      style={{
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div
        style={{
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          textTransform: 'uppercase',
          letterSpacing: '1.5px',
          fontWeight: '600',
          marginBottom: '4px'
        }}
      >
        Trading Dashboard
      </div>
      <div
        style={{
          fontSize: '14px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: getTradingModeColor(tradingMode),
            boxShadow: `0 0 8px ${getTradingModeColor(tradingMode)}80`
          }}
        />
        {getTradingModeLabel(tradingMode)} Positions
      </div>
    </div>
  )
}

export default Header

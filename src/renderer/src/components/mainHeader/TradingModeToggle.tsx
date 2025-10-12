import React from 'react'
import { TradingMode } from '../../../../shared/types'

const TradingModeToggle = (): React.JSX.Element => {
  const tradingMode = TradingMode.PAPER
  const onChangeTradingMode = (tradingMode: TradingMode): void => {}

  const getTradingModeColor = (mode: TradingMode): string => {
    return tradingMode === mode ? '#7E57C2' : '#2d3251'
  }

  const getTradingModeHoverColor = (mode: TradingMode): string => {
    return tradingMode === mode ? '#9575CD' : '#484E70'
  }

  return (
    <div
      style={{
        background: 'rgba(45, 50, 81, 0.6)',
        borderRadius: '10px',
        padding: '4px',
        display: 'flex',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginRight: '10px'
      }}
    >
      {[TradingMode.PAPER, TradingMode.REAL].map((mode) => (
        <button
          key={mode}
          onClick={() => onChangeTradingMode(mode)}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: getTradingModeColor(mode),
            color: 'white',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            minWidth: '70px',
            margin: '0 5px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = getTradingModeHoverColor(mode)
            e.currentTarget.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = getTradingModeColor(mode)
            e.currentTarget.style.transform = 'scale(1)'
          }}
        >
          {mode === TradingMode.PAPER && '📄 '}
          {mode === TradingMode.REAL && '💸 '}
          {mode}
        </button>
      ))}
    </div>
  )
}

export default TradingModeToggle

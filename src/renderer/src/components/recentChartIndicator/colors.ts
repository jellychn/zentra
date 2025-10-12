import { TradingMode } from '../../../../shared/types'

export const COLORS = {
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  surface: 'rgba(30, 41, 59, 0.8)',
  primary: '#3b82f6',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
  text: {
    primary: '#f8fafc',
    secondary: '#94a3b8',
    muted: '#64748b'
  },
  border: 'rgba(255, 255, 255, 0.1)',
  glow: {
    success: 'rgba(16, 185, 129, 0.4)',
    danger: 'rgba(239, 68, 68, 0.4)',
    primary: 'rgba(59, 130, 246, 0.4)'
  },
  chart: {
    up: '#10b981',
    down: '#ef4444',
    grid: '#2a2e39',
    background: '#1e222d'
  }
}

export const getTradingModeColor = (mode: TradingMode): string => {
  switch (mode) {
    case TradingMode.REAL:
      return '#ef4444'
    case TradingMode.PAPER:
      return '#3b82f6'
    default:
      return '#6b7280'
  }
}

export const getTradingModeLabel = (mode: TradingMode): string => {
  switch (mode) {
    case TradingMode.REAL:
      return 'LIVE'
    case TradingMode.PAPER:
      return 'PAPER'
    default:
      return 'TRADING'
  }
}

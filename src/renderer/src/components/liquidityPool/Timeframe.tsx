import { useState } from 'react'
import { COLORS } from './colors'

const TIMEFRAME_OPTIONS = ['1M', '15M', '30M', '1H']

const Timeframe: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M')

  // TODO
  const handleTimeframeChange = (timeframe: string): void => {
    setSelectedTimeframe(timeframe)
    setIsDropdownOpen(false)
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: '10px',
        padding: '0 10px',
        position: 'relative'
      }}
    >
      {/* Timeframe indicator */}
      <div
        style={{
          fontSize: '10px',
          color: COLORS.text.muted,
          fontWeight: '600',
          background: 'rgba(59, 130, 246, 0.1)',
          padding: '2px 6px',
          borderRadius: '4px',
          border: `1px solid rgba(59, 130, 246, 0.3)`
        }}
      >
        {selectedTimeframe} LIQUIDITY VIEW
      </div>

      <div style={{ position: 'relative' }} data-liquidity-dropdown-container>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            color: COLORS.text.primary,
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '60px',
            justifyContent: 'space-between',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(30, 41, 59, 1)'
            e.currentTarget.style.borderColor = COLORS.primary
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = COLORS.surface
            e.currentTarget.style.borderColor = COLORS.border
          }}
        >
          {selectedTimeframe}
          <span style={{ fontSize: '10px', opacity: 0.7 }}>{isDropdownOpen ? '▲' : '▼'}</span>
        </button>

        {isDropdownOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              background: COLORS.surface,
              border: `1px solid ${COLORS.border}`,
              borderRadius: '6px',
              padding: '4px',
              marginTop: '4px',
              minWidth: '60px',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(20px)',
              zIndex: 50
            }}
          >
            {TIMEFRAME_OPTIONS.map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => handleTimeframeChange(timeframe)}
                style={{
                  background:
                    timeframe === selectedTimeframe ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                  border: 'none',
                  color: timeframe === selectedTimeframe ? COLORS.primary : COLORS.text.primary,
                  padding: '8px 12px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  width: '100%',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (timeframe !== selectedTimeframe) {
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (timeframe !== selectedTimeframe) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {timeframe}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Timeframe

import React from 'react'

const RatioBar = React.memo(
  ({
    leftLabel,
    leftValue,
    rightLabel,
    rightValue
  }: {
    leftLabel: string
    leftValue: number
    rightLabel: string
    rightValue: number
  }): React.JSX.Element => {
    const total = leftValue + rightValue
    const leftPercentage = total > 0 ? (leftValue / total) * 100 : 50
    const rightPercentage = total > 0 ? (rightValue / total) * 100 : 50

    return (
      <div
        style={{
          marginBottom: '16px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          flexShrink: 0
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
            fontSize: '10px'
          }}
        >
          <span style={{ color: '#10b981', fontWeight: 'bold' }}>
            {leftLabel}: {leftPercentage.toFixed(1)}%
          </span>
          <span style={{ color: '#ef4444', fontWeight: 'bold' }}>
            {rightLabel}: {rightPercentage.toFixed(1)}%
          </span>
        </div>
        <div
          style={{
            height: '4px',
            background: '#ef4444',
            borderRadius: '2px'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${leftPercentage}%`,
              background: `linear-gradient(90deg, #10b981, #34d399)`,
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>
    )
  }
)

RatioBar.displayName = 'RatioBar'

export default RatioBar

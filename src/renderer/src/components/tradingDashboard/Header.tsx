import React from 'react'

const Header = (): React.JSX.Element => {
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
        CANDLES CHART
      </div>
    </div>
  )
}

export default Header

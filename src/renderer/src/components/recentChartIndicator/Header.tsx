import React, { memo, useMemo } from 'react'
import { COLORS } from './colors'
import { formatNumber } from '../../../../shared/helper'
import Timeframe from './header/Timeframe'

const Header = memo(
  ({
    highPrice,
    lowPrice,
    selectedTimeframe,
    isDropdownOpen,
    setIsDropdownOpen,
    setSelectedTimeframe
  }: {
    highPrice: number
    lowPrice: number
    selectedTimeframe: string
    isDropdownOpen: boolean
    setIsDropdownOpen: (isOpen: boolean) => void
    setSelectedTimeframe: (timeframe: string) => void
  }): React.JSX.Element => {
    const formattedPrices = useMemo(
      () => ({
        high: formatNumber(highPrice),
        low: formatNumber(lowPrice)
      }),
      [highPrice, lowPrice]
    )

    const priceDisplays = useMemo(
      () => [
        {
          color: COLORS.chart.up,
          label: 'HIGH:',
          value: formattedPrices.high
        },
        {
          color: COLORS.chart.down,
          label: 'LOW:',
          value: formattedPrices.low
        }
      ],
      [formattedPrices.high, formattedPrices.low]
    )

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          padding: '16px 20px',
          borderBottom: `1px solid ${COLORS.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'none',
          height: '60px',
          boxSizing: 'border-box'
        }}
      >
        <Timeframe
          selectedTimeframe={selectedTimeframe}
          isDropdownOpen={isDropdownOpen}
          setSelectedTimeframe={setSelectedTimeframe}
          setIsDropdownOpen={setIsDropdownOpen}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '11px',
              fontWeight: '600'
            }}
          >
            {priceDisplays.map((item) => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: item.color
                  }}
                />
                <span style={{ color: COLORS.text.secondary }}>{item.label}</span>
                <span style={{ color: COLORS.text.primary, fontFamily: 'monospace' }}>
                  {item.value}
                </span>
              </div>
            ))}

            <div
              style={{
                padding: '2px 6px',
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '4px',
                border: `1px solid rgba(59, 130, 246, 0.3)`,
                color: COLORS.primary,
                fontSize: '9px',
                fontWeight: '700',
                marginLeft: '20px'
              }}
            >
              LIVE
            </div>
          </div>
        </div>
      </div>
    )
  }
)

Header.displayName = 'Header'

export default Header

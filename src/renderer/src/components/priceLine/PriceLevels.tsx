import { memo, useCallback, useMemo } from 'react'

import { formatNumber } from '../../../../shared/helper'

const PriceLevels = memo(
  ({
    max,
    min,
    priceRange,
    getTopPercentage
  }: {
    max: number
    min: number
    priceRange: number
    getTopPercentage: (price: number) => number
  }) => {
    const roundToNiceInterval = useCallback((value: number): number => {
      const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
      const normalized = value / magnitude

      if (normalized <= 1.2) return 1 * magnitude
      if (normalized <= 2.5) return 2 * magnitude
      if (normalized <= 4) return 2.5 * magnitude
      if (normalized <= 7) return 5 * magnitude
      if (normalized <= 12) return 10 * magnitude
      if (normalized <= 25) return 20 * magnitude
      if (normalized <= 45) return 25 * magnitude
      if (normalized <= 75) return 50 * magnitude
      return 100 * magnitude
    }, [])

    const calculateStep = useCallback(
      ({
        priceRange,
        containerHeight = 800
      }: {
        priceRange: number
        containerHeight?: number
      }): number => {
        const targetLevels = 20
        const baseStep = priceRange / targetLevels

        const magnitude = Math.pow(10, Math.floor(Math.log10(baseStep)))
        const normalized = baseStep / magnitude

        let step: number

        if (normalized <= 1.5) step = 1 * magnitude
        else if (normalized <= 3) step = 2 * magnitude
        else if (normalized <= 7) step = 5 * magnitude
        else step = 10 * magnitude

        const levels = priceRange / step
        const maxLevels = Math.floor(containerHeight / 30)
        const minLevels = 8

        if (levels > maxLevels) {
          const adjustedStep = priceRange / maxLevels
          return roundToNiceInterval(adjustedStep)
        } else if (levels < minLevels) {
          const adjustedStep = priceRange / minLevels
          return roundToNiceInterval(adjustedStep)
        }

        return step
      },
      [roundToNiceInterval]
    )

    const step = useMemo(
      () => calculateStep({ priceRange: priceRange }),
      [priceRange, calculateStep]
    )

    const priceLevels = useMemo(() => {
      const start = Math.floor(min / step) * step
      const end = Math.ceil(max / step) * step
      const levels: number[] = []
      for (let price = start; price <= end; price += step) {
        levels.push(price)
      }
      return levels
    }, [min, max, step])

    return (
      <>
        {priceLevels.map((price) => (
          <div
            key={price}
            style={{
              position: 'absolute',
              top: `${getTopPercentage(price)}%`,
              left: '8px',
              color: '#e2e8f0',
              fontSize: '9px',
              transform: 'translateY(-50%)',
              fontFamily: 'monospace',
              fontWeight: '600',
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              zIndex: 5,
              transition: 'all 0.2s ease',
              opacity: 0.4,
              letterSpacing: '0.3px'
            }}
          >
            {formatNumber(price)}
          </div>
        ))}
      </>
    )
  }
)

PriceLevels.displayName = 'PriceLevels'
export default PriceLevels

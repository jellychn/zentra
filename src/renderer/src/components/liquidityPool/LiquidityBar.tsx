import React, { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react'
import { COLORS } from './colors'
import { ProcessedLiquidityItem } from '../LiqudityPool'
import { usePriceLine } from '@renderer/contexts/PriceLineContext'
import PlaceOrder from './PlaceOrder'
import BarTooltip from './BarTooltip'

// Pre-calculate age colors to avoid function calls
const AGE_COLORS = {
  fresh: '#10b981',
  recent: '#22c55e',
  aging: '#f59e0b',
  old: '#f97316',
  veryOld: '#dc2626'
} as const

const getAgeColor = (ageInSeconds: number): string => {
  if (ageInSeconds < 60) return AGE_COLORS.fresh
  if (ageInSeconds < 300) return AGE_COLORS.recent
  if (ageInSeconds < 900) return AGE_COLORS.aging
  if (ageInSeconds < 3600) return AGE_COLORS.old
  return AGE_COLORS.veryOld
}

// Pre-defined style objects to avoid recreation
const BASE_CONTAINER_STYLE: React.CSSProperties = {
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  width: 'calc(50% - 70px)',
  willChange: 'transform, opacity'
} as const

// Static styles that don't change
const BAND_EDGE_STYLE: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  height: '1px'
} as const

const LiquidityBar = memo(
  ({
    price,
    liquidity,
    position,
    barWidth,
    maxLiquidity,
    avgLiquidity,
    isCurrentPrice,
    side,
    type,
    age,
    getAgeBasedOpacity,
    currentPricePosition,
    setHoveredSide
  }: {
    price: number
    liquidity: number
    position: number
    barWidth: number
    maxLiquidity: number
    avgLiquidity: number
    isCurrentPrice: boolean
    side: 'left' | 'right'
    type: 'pool' | 'bid' | 'ask'
    age?: number
    getAgeBasedOpacity: (item: ProcessedLiquidityItem) => number
    currentPricePosition: number
    setHoveredSide: (side: string) => void
  }): React.JSX.Element => {
    const { setHoverPrice } = usePriceLine()

    const [hovered, setHovered] = useState(false)
    const [clicked, setClicked] = useState(false)
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const barRef = useRef<HTMLDivElement>(null)

    // Memoize expensive calculations
    const { barStyles, tooltipData } = useMemo(() => {
      const isNegative = liquidity < 0
      const absLiquidity = Math.abs(liquidity)
      const relativeStrength = maxLiquidity > 0 ? absLiquidity / maxLiquidity : 0

      // Determine colors based on type
      let borderColor, gradient
      if (type === 'pool') {
        borderColor = isNegative ? '#dc2626' : '#059669'
        gradient = isNegative
          ? `linear-gradient(135deg, ${COLORS.danger} 0%, #dc2626 100%)`
          : `linear-gradient(135deg, ${COLORS.success} 0%, #059669 100%)`
      } else if (type === 'bid') {
        borderColor = '#059669'
        gradient = `linear-gradient(135deg, ${COLORS.success} 0%, #059669 100%)`
      } else {
        borderColor = '#dc2626'
        gradient = `linear-gradient(135deg, ${COLORS.danger} 0%, #dc2626 100%)`
      }

      const finalOpacity =
        type === 'pool' ? getAgeBasedOpacity({ type, age } as ProcessedLiquidityItem) : 1

      // Simplified sizing calculations
      const glowIntensity = Math.min(relativeStrength * 4, 2)
      const height = 10 + relativeStrength * 20
      const borderRadius = 4 + relativeStrength * 8

      // Format age for tooltip
      const formatAge = (ageInSeconds?: number): string => {
        if (!ageInSeconds) return 'N/A'
        if (ageInSeconds < 60) return `${Math.floor(ageInSeconds)}s`
        if (ageInSeconds < 3600) return `${Math.floor(ageInSeconds / 60)}m`
        if (ageInSeconds < 86400) return `${Math.floor(ageInSeconds / 3600)}h`
        return `${Math.floor(ageInSeconds / 86400)}d`
      }

      const getAgeDescription = (ageInSeconds?: number): string => {
        if (!ageInSeconds) return 'No time data'
        if (ageInSeconds < 60) return 'Fresh'
        if (ageInSeconds < 300) return 'Recent'
        if (ageInSeconds < 900) return 'Aging'
        if (ageInSeconds < 3600) return 'Old'
        return 'Very Old'
      }

      return {
        barStyles: {
          gradient,
          borderColor,
          glowIntensity,
          height,
          borderRadius,
          finalOpacity,
          isNegative
        },
        tooltipData: {
          absLiquidity,
          relativeStrength,
          formatAge: formatAge(age),
          ageDescription: getAgeDescription(age),
          ageColor: age ? getAgeColor(age) : COLORS.text.primary
        }
      }
    }, [liquidity, maxLiquidity, type, age, getAgeBasedOpacity])

    // Optimized band style calculations
    const bandStyles = useMemo(() => {
      if (!hovered || clicked) return null

      const currentPos = currentPricePosition
      const barPos = position
      const top = Math.min(currentPos, barPos)
      const bottom = Math.max(currentPos, barPos)
      const height = bottom - top
      const isBarAtTop = barPos === top
      const fadeDirection = isBarAtTop ? 'to bottom' : 'to top'

      const connectionBandStyle: React.CSSProperties = {
        ...BASE_CONTAINER_STYLE,
        left: side === 'left' ? '50px' : 'auto',
        right: side === 'right' ? '50px' : 'auto',
        top: `${top}%`,
        height: `${height}%`,
        background: `linear-gradient(${fadeDirection},
        ${COLORS.primary}20 0%,
        ${COLORS.primary}20 60%,
        ${COLORS.primary}10 80%,
        ${COLORS.primary}00 100%)`,
        borderLeft: `2px solid ${COLORS.primary}`,
        borderRight: `2px solid ${COLORS.primary}`,
        pointerEvents: 'none',
        zIndex: 5
      }

      const bandPatternStyle: React.CSSProperties = {
        ...BASE_CONTAINER_STYLE,
        left: side === 'left' ? '50px' : 'auto',
        right: side === 'right' ? '50px' : 'auto',
        top: `${top}%`,
        height: `${height}%`,
        background: `linear-gradient(${fadeDirection},
        ${COLORS.primary}15 0%,
        ${COLORS.primary}08 60%,
        ${COLORS.primary}04 80%,
        transparent 100%),
      repeating-linear-gradient(45deg, transparent, transparent 2px, ${COLORS.primary}08 2px, ${COLORS.primary}08 4px)`,
        pointerEvents: 'none',
        zIndex: 6
      }

      return { connectionBandStyle, bandPatternStyle, top, bottom, isBarAtTop }
    }, [hovered, clicked, currentPricePosition, position, side])

    // Event handlers with proper cleanup
    const handleMouseEnter = useCallback(() => {
      hoverTimeoutRef.current = setTimeout(() => {
        if (!clicked) {
          setHovered(true)
          setHoverPrice(price)
          setHoveredSide(side)
        }
      }, 50) // Small delay to prevent flickering
    }, [clicked, setHoverPrice, price, setHoveredSide, side])

    const handleMouseLeave = useCallback(() => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      if (!clicked) {
        setHovered(false)
        setHoverPrice(null)
        setHoveredSide('left')
      }
    }, [clicked, setHoverPrice, setHoveredSide])

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        setHovered(false)
        setHoverPrice(null)
        setHoveredSide('left')
        setClicked(true)
      },
      [setHoverPrice, setHoveredSide]
    )

    // Single cleanup effect
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent): void => {
        if (barRef.current && !barRef.current.contains(event.target as Node)) {
          setClicked(false)
          setHovered(false)
          setHoverPrice(null)
          setHoveredSide('left')
        }
      }

      document.addEventListener('mousedown', handleClickOutside)

      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
        if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
      }
    }, [setHoverPrice, setHoveredSide])

    // Auto-close popup
    useEffect(() => {
      if (clicked) {
        clickTimeoutRef.current = setTimeout(() => {
          setClicked(false)
        }, 5000)
      }
      return () => {
        if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current)
      }
    }, [clicked])

    // Optimized style calculations
    const containerStyle = useMemo(
      () => ({
        ...BASE_CONTAINER_STYLE,
        top: `${Math.max(0, Math.min(100, position))}%`,
        left: side === 'left' ? '50px' : 'auto',
        right: side === 'right' ? '50px' : 'auto',
        flexDirection: side === 'left' ? 'row' : 'row-reverse',
        transform: 'translateY(-50%)',
        zIndex:
          hovered || clicked
            ? 50
            : isCurrentPrice
              ? 30
              : 10 + Math.floor(tooltipData.relativeStrength * 10)
      }),
      [position, side, hovered, clicked, isCurrentPrice, tooltipData.relativeStrength]
    )

    const barElementStyle = useMemo(
      () => ({
        width: `${barWidth}%`,
        height: `${barStyles.height}px`,
        background: barStyles.gradient,
        border: `2px solid ${barStyles.borderColor}`,
        borderRadius: `${barStyles.borderRadius}px`,
        boxShadow:
          hovered || clicked
            ? `0 0 25px ${barStyles.borderColor}, 0 0 45px ${barStyles.borderColor}`
            : `0 0 ${10 + barStyles.glowIntensity * 20}px ${barStyles.borderColor},
        0 6px 20px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
        position: 'relative' as const,
        transition: 'all 0.3s ease',
        minWidth: '35px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px',
        flexShrink: 0,
        maxWidth: '100%',
        opacity: barStyles.finalOpacity,
        transform: hovered || clicked ? 'scale(1.05)' : 'scale(1)',
        cursor: 'pointer'
      }),
      [barWidth, barStyles, hovered, clicked]
    )

    return (
      <>
        {/* Connection Bands */}
        {bandStyles && (
          <>
            <div style={bandStyles.connectionBandStyle} />
            <div style={bandStyles.bandPatternStyle} />
            <div
              style={{
                ...BASE_CONTAINER_STYLE,
                left: side === 'left' ? '50px' : 'auto',
                right: side === 'right' ? '50px' : 'auto',
                top: `${bandStyles.top}%`,
                height: `${bandStyles.bottom - bandStyles.top}%`,
                pointerEvents: 'none',
                zIndex: 7
              }}
            >
              <div
                style={{
                  ...BAND_EDGE_STYLE,
                  top: 0,
                  background: `linear-gradient(90deg, transparent, ${COLORS.primary}, ${COLORS.primary} 70%, transparent 100%)`
                }}
              />
              <div
                style={{
                  ...BAND_EDGE_STYLE,
                  bottom: 0,
                  background: `linear-gradient(90deg, transparent, ${COLORS.primary}, ${COLORS.primary} 70%, transparent 100%)`
                }}
              />
            </div>
          </>
        )}

        {/* Bar Container */}
        <div
          ref={barRef}
          style={containerStyle}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
        >
          <div style={barElementStyle}>
            {tooltipData.relativeStrength > 0.2 && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    barStyles.isNegative || type === 'ask'
                      ? 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.2) 4px, rgba(0,0,0,0.2) 8px)'
                      : 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 8px)',
                  borderRadius: `${barStyles.borderRadius - 1}px`,
                  opacity: barStyles.finalOpacity
                }}
              />
            )}
          </div>

          {hovered && (
            <BarTooltip
              tooltipData={tooltipData}
              side={side}
              position={position}
              maxLiquidity={maxLiquidity}
              type={type}
              isNegative={liquidity < 0}
              age={age}
              avgLiquidity={avgLiquidity}
            />
          )}

          {clicked && (
            <PlaceOrder
              price={price}
              side={side}
              setClicked={setClicked}
              setHoverPrice={setHoverPrice}
            />
          )}
        </div>
      </>
    )
  }
)

LiquidityBar.displayName = 'LiquidityBar'

export default LiquidityBar

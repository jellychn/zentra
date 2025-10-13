import React, { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react'
import { COLORS } from './colors'
import { ProcessedLiquidityItem } from '../LiqudityPool'
import { usePriceLine } from '@renderer/contexts/PriceLineContext'

// Enhanced age color function
const getAgeColor = (ageInSeconds: number): string => {
  if (ageInSeconds < 60) return '#10b981'
  if (ageInSeconds < 300) return '#22c55e'
  if (ageInSeconds < 900) return '#f59e0b'
  if (ageInSeconds < 3600) return '#f97316'
  return '#dc2626'
}

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

    const { barStyles, tooltipData } = useMemo(() => {
      const isNegative = liquidity < 0
      const absLiquidity = Math.abs(liquidity)
      const relativeStrength = absLiquidity / maxLiquidity

      // Enhanced color system
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

      const finalOpacity = getAgeBasedOpacity({ type, age })
      const barColor = gradient

      // Enhanced sizing with better proportions
      const glowIntensity = Math.min(relativeStrength * 4, 2)
      const height = 10 + relativeStrength * 20
      const borderRadius = 4 + relativeStrength * 8

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
          barColor,
          borderColor,
          glowIntensity,
          height,
          borderRadius,
          finalOpacity,
          gradient
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

    // Calculate band position and style with gradual fade
    const connectionBandStyle = useMemo(() => {
      if (!hovered || clicked) return { display: 'none' }

      const currentPos = currentPricePosition
      const barPos = position

      // Determine which is top and bottom
      const top = Math.min(currentPos, barPos)
      const bottom = Math.max(currentPos, barPos)
      const height = bottom - top

      // Determine band color based on price relationship
      const bandColor = COLORS.primary
      const borderColor = COLORS.primary

      // Calculate fade direction based on which end is the bar
      const isBarAtTop = barPos === top
      const fadeDirection = isBarAtTop ? 'to bottom' : 'to top'

      return {
        position: 'absolute' as const,
        left: side === 'left' ? '50px' : 'auto',
        right: side === 'right' ? '50px' : 'auto',
        top: `${top}%`,
        height: `${height}%`,
        width: 'calc(50% - 70px)',
        background: `linear-gradient(${fadeDirection},
          ${bandColor}20 0%,
          ${bandColor}20 60%,
          ${bandColor}10 80%,
          ${bandColor}00 100%)`,
        borderLeft: `2px solid ${borderColor}`,
        borderRight: `2px solid ${borderColor}`,
        pointerEvents: 'none' as const,
        zIndex: 5,
        transition: 'all 0.3s ease'
      }
    }, [hovered, clicked, currentPricePosition, position, side])

    // Add pattern overlay for the band with gradual fade
    const bandPatternStyle = useMemo(() => {
      if (!hovered || clicked) return { display: 'none' }

      const currentPos = currentPricePosition
      const barPos = position
      const top = Math.min(currentPos, barPos)
      const bottom = Math.max(currentPos, barPos)
      const height = bottom - top
      const patternColor = COLORS.primary

      // Calculate fade direction based on which end is the bar
      const isBarAtTop = barPos === top
      const fadeDirection = isBarAtTop ? 'to bottom' : 'to top'

      return {
        position: 'absolute' as const,
        left: side === 'left' ? '50px' : 'auto',
        right: side === 'right' ? '50px' : 'auto',
        top: `${top}%`,
        height: `${height}%`,
        width: 'calc(50% - 70px)',
        background: `linear-gradient(${fadeDirection},
          ${patternColor}15 0%,
          ${patternColor}08 60%,
          ${patternColor}04 80%,
          transparent 100%),
        repeating-linear-gradient(45deg, transparent, transparent 2px, ${patternColor}08 2px, ${patternColor}08 4px)`,
        pointerEvents: 'none' as const,
        zIndex: 6
      }
    }, [hovered, clicked, currentPricePosition, position, side])

    // Add band edges for better definition with fade
    const bandEdgesStyle = useMemo(() => {
      if (!hovered || clicked) return { display: 'none' }

      const currentPos = currentPricePosition
      const barPos = position
      const top = Math.min(currentPos, barPos)
      const bottom = Math.max(currentPos, barPos)

      return {
        position: 'absolute' as const,
        left: side === 'left' ? '50px' : 'auto',
        right: side === 'right' ? '50px' : 'auto',
        top: `${top}%`,
        height: `${bottom - top}%`,
        width: 'calc(50% - 70px)',
        pointerEvents: 'none' as const,
        zIndex: 7
      }
    }, [hovered, clicked, currentPricePosition, position, side])

    // Add border fade effect
    const borderFadeStyle = useMemo(() => {
      if (!hovered || clicked) return { display: 'none' }

      const currentPos = currentPricePosition
      const barPos = position
      const top = Math.min(currentPos, barPos)
      const bottom = Math.max(currentPos, barPos)
      const isBarAtTop = barPos === top

      return {
        position: 'absolute' as const,
        left: side === 'left' ? '50px' : 'auto',
        right: side === 'right' ? '50px' : 'auto',
        top: `${top}%`,
        height: `${bottom - top}%`,
        width: 'calc(50% - 70px)',
        pointerEvents: 'none' as const,
        zIndex: 8,
        maskImage: `linear-gradient(${isBarAtTop ? 'to bottom' : 'to top'},
          black 0%,
          black 70%,
          transparent 100%)`,
        WebkitMaskImage: `linear-gradient(${isBarAtTop ? 'to bottom' : 'to top'},
          black 0%,
          black 70%,
          transparent 100%)`
      }
    }, [hovered, clicked, currentPricePosition, position, side])

    const handleMouseEnter = useCallback(() => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
      // Don't show hover tooltip if popup is open
      if (!clicked) {
        setHovered(true)
        setHoverPrice(price)
        setHoveredSide(side)
      }
    }, [price, setHoverPrice, setHoveredSide, clicked])

    const handleMouseLeave = useCallback(() => {
      // Only hide hover if popup is not open
      if (!clicked) {
        setHovered(false)
        setHoverPrice(null)
      }
    }, [setHoverPrice, clicked])

    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()

        // Close any hover tooltip when clicking
        setHovered(false)
        setHoverPrice(null)

        setClicked(true)

        // Clear any existing timeout
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current)
        }
      },
      [setHoverPrice]
    )

    // Close popup when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent): void => {
        if (barRef.current && !barRef.current.contains(event.target as Node)) {
          setClicked(false)
          // Also reset hover state when clicking outside
          setHovered(false)
          setHoverPrice(null)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [setHoverPrice])

    // Auto-close popup after 5 seconds
    useEffect(() => {
      if (clicked) {
        clickTimeoutRef.current = setTimeout(() => {
          setClicked(false)
        }, 5000)
      }

      return () => {
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current)
        }
      }
    }, [clicked])

    // Reset hover when clicked state changes
    useEffect(() => {
      if (clicked) {
        setHovered(false)
        setHoverPrice(null)
      }
    }, [clicked, setHoverPrice])

    useEffect(() => {
      return () => {
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current)
        }
        if (clickTimeoutRef.current) {
          clearTimeout(clickTimeoutRef.current)
        }
      }
    }, [])

    const isNegative = liquidity < 0

    const containerStyle = useMemo(
      () => ({
        position: 'absolute' as const,
        top: `${Math.max(0, Math.min(100, position))}%`,
        left: side === 'left' ? '50px' : 'auto',
        right: side === 'right' ? '50px' : 'auto',
        flexDirection: (side === 'left' ? 'row' : 'row-reverse') as 'row' | 'row-reverse',
        transform: 'translateY(-50%)',
        zIndex:
          hovered || clicked
            ? 50
            : isCurrentPrice
              ? 30
              : 10 + Math.floor(tooltipData.relativeStrength * 10),
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        width: 'calc(50% - 70px)',
        willChange: 'transform, opacity'
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
        opacity: type === 'pool' ? barStyles.finalOpacity : 1,
        transform: hovered || clicked ? 'scale(1.05)' : 'scale(1)',
        cursor: 'pointer'
      }),
      [barWidth, barStyles, hovered, clicked, type]
    )

    return (
      <>
        {/* Connection Band - rendered separately to span the full height */}
        <div style={connectionBandStyle} />
        <div style={bandPatternStyle} />
        <div style={bandEdgesStyle}>
          {/* Top edge - fades out near the bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(90deg,
                transparent,
                ${COLORS.primary},
                ${COLORS.primary} 70%,
                transparent 100%)`
            }}
          />
          {/* Bottom edge - fades out near the bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '1px',
              background: `linear-gradient(90deg,
                transparent,
                ${COLORS.primary},
                ${COLORS.primary} 70%,
                transparent 100%)`
            }}
          />
        </div>

        {/* Border fade overlay */}
        <div style={borderFadeStyle}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              borderLeft: `2px solid ${COLORS.primary}`,
              borderRight: `2px solid ${COLORS.primary}`
            }}
          />
        </div>

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
                    type === 'ask' || (type === 'pool' && isNegative)
                      ? 'repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.2) 4px, rgba(0,0,0,0.2) 8px)'
                      : 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 8px)',
                  borderRadius: `${barStyles.borderRadius - 1}px`,
                  opacity: type === 'pool' ? barStyles.finalOpacity : 1
                }}
              />
            )}
          </div>

          {/* TODO: {hovered && !clicked && (
          <BarTooltip
            price={price}
            side={side}
            position={position}
            tooltipData={tooltipData}
            type={type}
            maxLiquidity={maxLiquidity}
            isNegative={isNegative}
            age={age}
            avgLiquidity={avgLiquidity}
          />
        )}

        {clicked && (
          <PlaceOrder
            price={price}
            side={side}
            COLORS={COLORS}
            setClicked={setClicked}
            setHoveredBarPrice={setHoveredBarPrice}
          />
        )} */}
        </div>
      </>
    )
  }
)

LiquidityBar.displayName = 'LiquidityBar'

// Add CSS animation
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.9) translateY(-10px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
`

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style')
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}

export default LiquidityBar

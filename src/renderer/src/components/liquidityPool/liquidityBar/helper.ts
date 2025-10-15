import { useMemo } from 'react'
import { COLORS } from '../colors'

export const BASE_CONTAINER_STYLE: React.CSSProperties = {
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.3s ease',
  width: 'calc(50% - 70px)',
  willChange: 'transform, opacity'
} as const

export const BAND_EDGE_STYLE: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  height: '1px'
} as const

const AGE_COLORS = {
  fresh: '#10b981',
  recent: '#22c55e',
  aging: '#f59e0b',
  old: '#f97316',
  veryOld: '#dc2626'
} as const

const AGE_THRESHOLDS = {
  fresh: 60,
  recent: 300,
  aging: 900,
  old: 3600
} as const

export const getAgeColor = (ageInSeconds: number): string => {
  if (ageInSeconds < AGE_THRESHOLDS.fresh) return AGE_COLORS.fresh
  if (ageInSeconds < AGE_THRESHOLDS.recent) return AGE_COLORS.recent
  if (ageInSeconds < AGE_THRESHOLDS.aging) return AGE_COLORS.aging
  if (ageInSeconds < AGE_THRESHOLDS.old) return AGE_COLORS.old
  return AGE_COLORS.veryOld
}

export const formatAge = (ageInSeconds?: number): string => {
  if (!ageInSeconds) return 'N/A'
  if (ageInSeconds < 60) return `${Math.floor(ageInSeconds)}s`
  if (ageInSeconds < 3600) return `${Math.floor(ageInSeconds / 60)}m`
  if (ageInSeconds < 86400) return `${Math.floor(ageInSeconds / 3600)}h`
  return `${Math.floor(ageInSeconds / 86400)}d`
}

export const getAgeDescription = (ageInSeconds?: number): string => {
  if (!ageInSeconds) return 'No time data'
  if (ageInSeconds < 60) return 'Fresh'
  if (ageInSeconds < 300) return 'Recent'
  if (ageInSeconds < 900) return 'Aging'
  if (ageInSeconds < 3600) return 'Old'
  return 'Very Old'
}

export const getTooltipData = ({
  liquidity,
  maxLiquidity,
  age
}): {
  absLiquidity
  relativeStrength
  formatAge
  ageDescription
  ageColor
} => {
  const absLiquidity = Math.abs(liquidity)
  const relativeStrength = maxLiquidity > 0 ? absLiquidity / maxLiquidity : 0

  return {
    absLiquidity,
    relativeStrength,
    formatAge: formatAge(age),
    ageDescription: getAgeDescription(age),
    ageColor: age ? getAgeColor(age) : COLORS.text.primary
  }
}

export const getBarStyles = ({ liquidity, maxLiquidity, type, age, getAgeBasedOpacity }) => {
  const isNegative = liquidity < 0
  const absLiquidity = Math.abs(liquidity)
  const relativeStrength = maxLiquidity > 0 ? absLiquidity / maxLiquidity : 0

  // Use lookup tables for styles
  const TYPE_STYLES = {
    pool: {
      borderColor: isNegative ? '#dc2626' : '#059669',
      gradient: isNegative
        ? `linear-gradient(135deg, ${COLORS.danger} 0%, #dc2626 100%)`
        : `linear-gradient(135deg, ${COLORS.success} 0%, #059669 100%)`
    },
    bid: {
      borderColor: '#059669',
      gradient: `linear-gradient(135deg, ${COLORS.success} 0%, #059669 100%)`
    },
    ask: {
      borderColor: '#dc2626',
      gradient: `linear-gradient(135deg, ${COLORS.danger} 0%, #dc2626 100%)`
    }
  }

  const styles = TYPE_STYLES[type] || TYPE_STYLES.pool

  return {
    ...styles,
    glowIntensity: Math.min(relativeStrength * 4, 2),
    height: 10 + relativeStrength * 20,
    borderRadius: 4 + relativeStrength * 8,
    finalOpacity: type === 'pool' ? getAgeBasedOpacity({ type, age }) : 1,
    isNegative
  }
}

export const BandStyles = ({
  hovered,
  clicked,
  currentPricePosition,
  position,
  side
}: {
  hovered
  clicked
  currentPricePosition
  position
  side
}) =>
  useMemo(() => {
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

export const ContainerStyle = ({
  position,
  side,
  hovered,
  clicked,
  isCurrentPrice,
  tooltipData
}) => {
  const zIndex = useMemo(
    () =>
      hovered || clicked
        ? 50
        : isCurrentPrice
          ? 30
          : 10 + Math.floor(tooltipData.relativeStrength * 10),
    [hovered, clicked, isCurrentPrice, tooltipData.relativeStrength]
  )

  return useMemo(
    () => ({
      ...BASE_CONTAINER_STYLE,
      top: `${Math.max(0, Math.min(100, position))}%`,
      left: side === 'left' ? '50px' : 'auto',
      right: side === 'right' ? '50px' : 'auto',
      flexDirection: side === 'left' ? 'row' : 'row-reverse',
      transform: 'translateY(-50%)',
      zIndex
    }),
    [position, side, zIndex]
  )
}

export const BarElementStyle = ({
  barWidth,
  barStyles,
  hovered,
  clicked
}: {
  barWidth
  barStyles
  hovered
  clicked
}) =>
  useMemo(
    () => ({
      width: `${barWidth}%`,
      height: `${barStyles.height}px`,
      background: barStyles.gradient,
      border: `2px solid ${barStyles.borderColor}`,
      borderRadius: `${barStyles.borderRadius}px`,
      position: 'relative' as const,
      transition: 'all 0.3s ease',
      minWidth: '35px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow:
        hovered || clicked
          ? `0 0 25px ${barStyles.borderColor}, 0 0 45px ${barStyles.borderColor}`
          : ``,
      padding: '0 12px',
      flexShrink: 0,
      maxWidth: '100%',
      opacity: barStyles.finalOpacity,
      transform: hovered || clicked ? 'scale(1.05)' : 'scale(1)',
      cursor: 'pointer'
    }),
    [barWidth, barStyles, hovered, clicked]
  )

export const PatternStyle = ({ tooltipData, barStyles, type }: { tooltipData; barStyles; type }) =>
  useMemo(() => {
    if (tooltipData.relativeStrength <= 0.2) return null

    return {
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
    }
  }, [
    tooltipData.relativeStrength,
    barStyles.isNegative,
    type,
    barStyles.borderRadius,
    barStyles.finalOpacity
  ])

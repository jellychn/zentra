import { useEffect, useRef, useState, memo } from 'react'

const ActionIcon = memo(function ActionIcon({
  icon,
  position,
  label,
  color,
  active,
  onClick,
  compact = false,
  style = {},
  amount,
  maxAmount = 99
}: {
  icon: any
  position: 'top' | 'mid' | 'bottom' | 'alone' | 'left' | 'right'
  label?: string
  color?: string
  active?: boolean
  onClick?: () => void
  compact?: boolean
  style?: React.CSSProperties
  amount?: number
  maxAmount?: number
}): React.ReactElement {
  const [isHovered, setIsHovered] = useState(false)
  const [labelWidth, setLabelWidth] = useState(0)
  const labelRef = useRef<HTMLDivElement>(null)

  // Measure label width when it becomes visible
  useEffect(() => {
    if (isHovered && labelRef.current) {
      setLabelWidth(labelRef.current.offsetWidth)
    }
  }, [isHovered, label])

  const getBorderRadius = (): string => {
    if (compact) {
      return '8px'
    }

    switch (position) {
      case 'top':
        return '10px 0px 0px 0px'
      case 'mid':
        return '0px'
      case 'bottom':
        return '0px 0px 0px 10px'
      case 'right':
        return '0px 10px 10px 0px'
      case 'left':
        return '10px 0px 0px 10px'
      case 'alone':
        return '10px'
      default:
        return '0px'
    }
  }

  const getDimensions = () => {
    if (compact) {
      return {
        width: '36px',
        height: '36px',
        padding: '8px',
        iconSize: '16px',
        badgeSize: '16px',
        badgeFontSize: '9px'
      }
    }

    return {
      width: '40px',
      height: '40px',
      padding: '10px',
      iconSize: '18px',
      badgeSize: '18px',
      badgeFontSize: '10px'
    }
  }

  const { width, height, padding, iconSize, badgeSize, badgeFontSize } = getDimensions()

  let bgColor = 'rgba(45, 50, 81, 0.6)'

  if (color) {
    bgColor = color
  } else {
    if (active || (onClick && isHovered)) {
      bgColor = '#7E57C2'
    }
  }

  const labelLeftPosition = compact ? `-${labelWidth + 8}px` : `-${labelWidth + 16}px`

  const getAmountDisplay = (): string => {
    if (amount === undefined || amount === null || amount <= 0) return ''
    if (amount > maxAmount) return `${maxAmount}+`
    return amount.toString()
  }

  const amountDisplay = getAmountDisplay()
  const hasAmount = amount !== undefined && amount !== null && amount > 0

  return (
    <div
      style={{
        position: 'relative',
        width: width,
        height: height,
        padding: padding,
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: getBorderRadius(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bgColor,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: compact ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        transition: 'all 0.2s ease',
        transform: isHovered && onClick ? 'scale(1.05)' : 'scale(1)',
        ...style
      }}
      onClick={() => onClick && onClick()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Main Icon */}
      <img
        src={icon}
        alt={label || 'Icon'}
        style={{
          width: iconSize,
          height: iconSize,
          objectFit: 'contain',
          filter: 'brightness(0) invert(1)',
          opacity: hasAmount ? 0.9 : 1
        }}
      />

      {/* Amount Badge */}
      {hasAmount && (
        <div
          style={{
            position: 'absolute',
            top: compact ? '-2px' : '-4px',
            right: compact ? '-2px' : '-4px',
            width: badgeSize,
            height: badgeSize,
            backgroundColor: '#ef4444',
            color: 'white',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: badgeFontSize,
            fontWeight: '800',
            fontFamily: "'Segoe UI', sans-serif",
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
            border: compact
              ? '1.5px solid rgba(22, 25, 41, 0.9)'
              : '2px solid rgba(22, 25, 41, 0.9)',
            zIndex: 10,
            animation: amount > 0 ? 'pulse 2s infinite' : 'none',
            minWidth: badgeSize,
            minHeight: badgeSize,
            lineHeight: 1
          }}
        >
          {amountDisplay}
        </div>
      )}

      {/* Hidden label for measurement */}
      {label && (
        <div
          ref={labelRef}
          style={{
            position: 'absolute',
            visibility: 'hidden',
            whiteSpace: 'nowrap',
            fontSize: compact ? '11px' : '12px',
            fontWeight: '600',
            fontFamily: "'Segoe UI', sans-serif",
            padding: compact ? '4px 8px' : '6px 12px'
          }}
        >
          {label}
        </div>
      )}

      {/* Hover Label */}
      {label && isHovered && (
        <div
          style={{
            position: 'absolute',
            left: labelLeftPosition,
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'rgba(22, 25, 41, 0.95)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#ffffff',
            padding: compact ? '4px 8px' : '6px 12px',
            borderRadius: '6px',
            fontSize: compact ? '11px' : '12px',
            fontWeight: '600',
            fontFamily: "'Segoe UI', sans-serif",
            whiteSpace: 'nowrap',
            zIndex: 1000,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            pointerEvents: 'none',
            minWidth: 'max-content'
          }}
        >
          {label}
          {hasAmount && (
            <span
              style={{
                marginLeft: '6px',
                color: '#ef4444',
                fontWeight: '700'
              }}
            >
              ({amount})
            </span>
          )}
        </div>
      )}

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
            }
            50% {
              transform: scale(1.1);
              box-shadow: 0 2px 12px rgba(239, 68, 68, 0.6);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
            }
          }
        `}
      </style>
    </div>
  )
})

ActionIcon.displayName = 'ActionIcon'

export default ActionIcon

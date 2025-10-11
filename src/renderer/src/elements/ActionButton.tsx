import React, { useState } from 'react'

export default function ActionButton({
  color,
  hoverColor,
  style,
  fill,
  children,
  disabled,
  loading,
  onClick,
  tooltip,
  tooltipDelay = 300,
  glass = false,
  size = 'medium'
}: {
  color: string
  hoverColor: string
  fill?: boolean
  style?: React.CSSProperties
  children: React.ReactNode
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  tooltip?: string
  tooltipDelay?: number
  glass?: boolean
  size?: 'small' | 'medium' | 'large'
}): React.JSX.Element {
  const [hovered, setHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipTimeout, setTooltipTimeout] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (): void => {
    if (disabled || loading) return
    setHovered(true)
    if (tooltip) {
      const timeout = setTimeout(() => {
        setShowTooltip(true)
      }, tooltipDelay)
      setTooltipTimeout(timeout)
    }
  }

  const handleMouseLeave = (): void => {
    setHovered(false)
    if (tooltip) {
      if (tooltipTimeout) {
        clearTimeout(tooltipTimeout)
        setTooltipTimeout(null)
      }
      setShowTooltip(false)
    }
  }

  // Size configurations
  const sizeConfig = {
    small: {
      padding: '10px 12px',
      fontSize: '10px',
      spinnerSize: '12px'
    },
    medium: {
      padding: '12px 16px',
      fontSize: '11px',
      spinnerSize: '14px'
    },
    large: {
      padding: '14px 20px',
      fontSize: '12px',
      spinnerSize: '16px'
    }
  }

  const currentSize = sizeConfig[size]

  const isInteractive = !disabled && !loading

  // Base styles that apply to all states
  const baseStyle: React.CSSProperties = {
    width: fill ? '100%' : 'auto',
    color: '#ffffff',
    border: 'none',
    borderRadius: '3px',
    padding: currentSize.padding,
    fontWeight: '700',
    cursor: isInteractive ? 'pointer' : 'not-allowed',
    transition: 'all 0.3s ease',
    position: 'relative',
    fontSize: currentSize.fontSize,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    fontFamily: "'Inter', sans-serif",
    ...style
  }

  // Glass morphism styles
  const glassStyle: React.CSSProperties = glass
    ? {
        backdropFilter: 'blur(10px)',
        border: `1px solid ${
          isInteractive ? `rgba(${hexToRgb(color)}, 0.4)` : 'rgba(148, 163, 184, 0.3)'
        }`,
        boxShadow: isInteractive
          ? `0 4px 12px 0 rgba(0, 0, 0, 0.15), 0 1px 2px 0 rgba(255, 255, 255, 0.1) inset`
          : '0 2px 4px 0 rgba(0, 0, 0, 0.05)'
      }
    : {}

  // Background colors for different states
  const backgroundStyle: React.CSSProperties = {}
  if (glass) {
    backgroundStyle.background = isInteractive
      ? `rgba(${hexToRgb(color)}, ${hovered ? '0.3' : '0.2'})`
      : 'rgba(148, 163, 184, 0.15)'
  } else {
    backgroundStyle.background = isInteractive ? (hovered ? hoverColor : color) : '#94a3b8'
  }

  // Hover effects only for interactive buttons
  const hoverEffect: React.CSSProperties =
    hovered && isInteractive
      ? {
          transform: 'translateY(-2px)',
          boxShadow: glass
            ? `0 8px 25px 0 rgba(0, 0, 0, 0.25), 0 2px 4px 0 rgba(255, 255, 255, 0.1) inset`
            : `0 8px 25px 0 ${color}60`
        }
      : {}

  // Disabled state enhancements
  const disabledStyle: React.CSSProperties = !isInteractive
    ? {
        opacity: 0.6,
        filter: 'grayscale(0.3)',
        color: '#cbd5e1'
      }
    : {}

  // Interactive indicator - only for clickable buttons
  const interactiveIndicator: React.CSSProperties = isInteractive
    ? {
        position: 'relative',
        overflow: 'hidden'
      }
    : {}

  const interactiveGlow: React.CSSProperties =
    isInteractive && !glass
      ? {
          boxShadow: `0 0 0 1px ${color}30, 0 4px 12px 0 ${color}20`
        }
      : {}

  return (
    <>
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={isInteractive ? onClick : undefined}
        disabled={!isInteractive}
        style={{
          ...baseStyle,
          ...glassStyle,
          ...backgroundStyle,
          ...hoverEffect,
          ...disabledStyle,
          ...interactiveIndicator,
          ...interactiveGlow
        }}
      >
        {/* Interactive glow effect for clickable buttons */}
        {isInteractive && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg,
                transparent,
                rgba(255, 255, 255, ${glass ? 0.1 : 0.2}),
                transparent)`,
              transition: 'left 0.6s ease',
              pointerEvents: 'none'
            }}
            className="shimmer-effect"
          />
        )}

        {/* Loading spinner */}
        {loading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2
            }}
          >
            <div
              style={{
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '50%',
                borderTop: '2px solid white',
                width: currentSize.spinnerSize,
                height: currentSize.spinnerSize,
                animation: 'spin 1s linear infinite'
              }}
            />
          </div>
        )}

        {/* Button content */}
        <span
          style={{
            visibility: loading ? 'hidden' : 'visible',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            position: 'relative',
            zIndex: 1,
            opacity: isInteractive ? 1 : 0.7
          }}
        >
          {children}
        </span>

        {/* Disabled overlay pattern */}
        {!isInteractive && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 2px,
                rgba(0, 0, 0, 0.05) 2px,
                rgba(0, 0, 0, 0.05) 4px
              )`,
              borderRadius: '3px',
              pointerEvents: 'none'
            }}
          />
        )}
      </button>

      {/* Enhanced tooltip with state indication */}
      {tooltip && showTooltip && (
        <div
          style={{
            position: 'fixed',
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(10px)',
            color: isInteractive ? 'white' : '#cbd5e1',
            padding: '8px 12px',
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: '600',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            border: `1px solid ${
              isInteractive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(148, 163, 184, 0.3)'
            }`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          {tooltip}
          {!isInteractive && (
            <div style={{ fontSize: '9px', color: '#ef4444', marginTop: '2px' }}>
              (Currently disabled)
            </div>
          )}
        </div>
      )}

      {/* Add the animations to the global styles */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .shimmer-effect {
          left: -100%;
        }
        button:hover .shimmer-effect {
          left: 100%;
          transition: left 0.6s ease;
        }
      `}</style>
    </>
  )
}

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): string {
  hex = hex.replace(/^#/, '')
  let r, g, b

  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16)
    g = parseInt(hex[1] + hex[1], 16)
    b = parseInt(hex[2] + hex[2], 16)
  } else if (hex.length === 6) {
    r = parseInt(hex.slice(0, 2), 16)
    g = parseInt(hex.slice(2, 4), 16)
    b = parseInt(hex.slice(4, 6), 16)
  } else {
    return '255, 255, 255'
  }

  return `${r}, ${g}, ${b}`
}

ActionButton.displayName = 'ActionButton'

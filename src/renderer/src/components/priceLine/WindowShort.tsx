import { memo, useMemo, useState } from 'react'
import { formatNumber } from '../../../../shared/helper'

const WindowShort = memo(
  ({
    value,
    label,
    isMax,
    getTopPercentage
  }: {
    value: number
    label: string
    isMax: boolean
    getTopPercentage: (price: number) => number
  }) => {
    const [hovered, setHovered] = useState(false)
    const position = getTopPercentage(value)

    const styles = useMemo(
      () => ({
        container: {
          position: 'absolute' as const,
          top: `${position}%`,
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          opacity: 0.8
        },
        containerHovered: {
          opacity: 1
        },
        line: {
          flexGrow: 1,
          height: '1px',
          background: isMax
            ? 'linear-gradient(90deg, transparent, rgba(239, 83, 80, 0.4), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.4), transparent)',
          borderRadius: '1px',
          boxShadow: 'none',
          position: 'relative' as const,
          transition: 'all 0.2s ease'
        },
        lineHovered: {
          height: '2px',
          background: isMax
            ? 'linear-gradient(90deg, transparent, #EF5350, #FF8A80, transparent)'
            : 'linear-gradient(90deg, transparent, #4CAF50, #81C784, transparent)',
          boxShadow: isMax ? '0 0 8px rgba(239, 83, 80, 0.5)' : '0 0 8px rgba(76, 175, 80, 0.5)'
        },
        startCap: {
          position: 'absolute' as const,
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '4px',
          height: '4px',
          background: isMax ? 'rgba(239, 83, 80, 0.4)' : 'rgba(76, 175, 80, 0.4)',
          borderRadius: '50%',
          boxShadow: 'none',
          transition: 'all 0.2s ease'
        },
        startCapHovered: {
          width: '6px',
          height: '6px',
          background: isMax ? '#EF5350' : '#4CAF50',
          boxShadow: `0 0 6px ${isMax ? '#EF5350' : '#4CAF50'}`
        },
        endCap: {
          position: 'absolute' as const,
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '4px',
          height: '4px',
          background: isMax ? 'rgba(239, 83, 80, 0.4)' : 'rgba(76, 175, 80, 0.4)',
          borderRadius: '50%',
          boxShadow: 'none',
          transition: 'all 0.2s ease'
        },
        endCapHovered: {
          width: '6px',
          height: '6px',
          background: isMax ? '#EF5350' : '#4CAF50',
          boxShadow: `0 0 6px ${isMax ? '#EF5350' : '#4CAF50'}`
        },
        label: {
          marginLeft: '12px',
          marginRight: '12px',
          padding: '3px 8px',
          background: isMax ? 'rgba(239, 83, 80, 0.3)' : 'rgba(76, 175, 80, 0.3)',
          borderRadius: '6px',
          fontSize: '8px',
          fontWeight: '600',
          color: 'rgba(255, 255, 255, 0.7)',
          fontFamily: 'monospace',
          whiteSpace: 'nowrap' as const,
          boxShadow: 'none',
          border: `1px solid ${isMax ? 'rgba(239, 83, 80, 0.2)' : 'rgba(76, 175, 80, 0.2)'}`,
          backdropFilter: 'none',
          transition: 'all 0.2s ease',
          minWidth: '45px',
          textAlign: 'center' as const,
          letterSpacing: '0.2px'
        },
        labelHovered: {
          padding: '4px 10px',
          background: isMax
            ? 'linear-gradient(135deg, #EF5350, #E57373)'
            : 'linear-gradient(135deg, #4CAF50, #66BB6A)',
          color: 'white',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.1) inset',
          backdropFilter: 'blur(8px)',
          minWidth: '55px',
          transform: 'scale(1.05)'
        },
        valueBadge: {
          position: 'absolute' as const,
          top: '-18px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(15, 23, 42, 0.9)',
          color: isMax ? '#EF5350' : '#4CAF50',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '8px',
          fontWeight: '600',
          fontFamily: 'monospace',
          border: `1px solid ${isMax ? 'rgba(239, 83, 80, 0.3)' : 'rgba(76, 175, 80, 0.3)'}`,
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(6px)',
          whiteSpace: 'nowrap' as const,
          animation: 'fadeInDown 0.2s ease-out',
          zIndex: 15
        }
      }),
      [position, isMax]
    )

    return (
      <div
        style={{
          ...styles.container,
          ...(hovered ? styles.containerHovered : {})
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            ...styles.line,
            ...(hovered ? styles.lineHovered : {})
          }}
        >
          <div
            style={{
              ...styles.startCap,
              ...(hovered ? styles.startCapHovered : {})
            }}
          />
          <div
            style={{
              ...styles.endCap,
              ...(hovered ? styles.endCapHovered : {})
            }}
          />
        </div>

        <div
          style={{
            ...styles.label,
            ...(hovered ? styles.labelHovered : {})
          }}
        >
          {hovered ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              {formatNumber(value)}
            </div>
          ) : (
            <span style={{ opacity: 1 }}>{label}</span>
          )}
        </div>

        {hovered && <div style={styles.valueBadge}>{isMax ? 'MAX' : 'MIN'}</div>}

        <style>
          {`
            @keyframes fadeInDown {
              from {
                opacity: 0;
                transform: translateX(-50%) translateY(-8px);
              }
              to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
              }
            }
          `}
        </style>
      </div>
    )
  }
)

WindowShort.displayName = 'WindowShort'

export default WindowShort

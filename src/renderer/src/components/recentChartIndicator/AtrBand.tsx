import { memo, useMemo, useState } from 'react'
import { formatNumber } from '../../../../shared/helper'
import { useStateStore } from '@renderer/contexts/StateStoreContext'

const AtrBand = memo(({ getTopPercentage }: { getTopPercentage: (price: number) => number }) => {
  const { state } = useStateStore()
  const { exchangeData, metrics } = state || {}
  const { atr = 0 } = metrics || {}
  const { lastPrice = 0 } = exchangeData || {}

  const [hovered, setHovered] = useState(false)

  const atrPlusValue = lastPrice + atr
  const atrMinusValue = lastPrice - atr

  const atrPlusPosition = getTopPercentage(atrPlusValue)
  const atrMinusPosition = getTopPercentage(atrMinusValue)

  const styles = useMemo(
    () => ({
      band: {
        position: 'absolute' as const,
        top: `${atrPlusPosition}%`,
        bottom: `${100 - atrMinusPosition}%`,
        left: '50%',
        right: 0,
        background:
          'linear-gradient(90deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 152, 0, 0.05) 100%)',
        borderRight: '2px solid rgba(255, 152, 0, 0.8)',
        borderLeft: '1px dashed rgba(255, 152, 0, 0.3)',
        zIndex: 5,
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        boxShadow: 'inset 2px 0 8px rgba(255, 152, 0, 0.1)'
      },
      bandHovered: {
        background:
          'linear-gradient(90deg, rgba(255, 152, 0, 0.25) 0%, rgba(255, 152, 0, 0.1) 100%)',
        borderRight: '2px solid #FF9800',
        boxShadow: 'inset 2px 0 12px rgba(255, 152, 0, 0.2), 0 0 20px rgba(255, 152, 0, 0.15)'
      },
      label: {
        position: 'absolute' as const,
        right: '6px',
        fontSize: '8px',
        color: '#1a1a1a',
        background: 'linear-gradient(135deg, #FF9800, #FFB74D)',
        padding: '3px 6px',
        fontWeight: '700',
        textAlign: 'right' as const,
        borderRadius: '3px',
        boxShadow: '0 1px 4px rgba(255, 152, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(8px)',
        zIndex: 10,
        minWidth: '65px',
        fontFamily: 'monospace',
        letterSpacing: '0.3px',
        cursor: 'pointer'
      },
      plusLabel: {
        top: `${atrPlusPosition}%`,
        transform: 'translateY(-50%)'
      },
      minusLabel: {
        bottom: `${100 - atrMinusPosition}%`,
        transform: 'translateY(50%)'
      },
      connectorLine: {
        position: 'absolute' as const,
        right: '0px',
        width: '4px',
        height: '1px',
        background: '#FF9800',
        opacity: 0.6
      },
      topConnector: {
        top: `${atrPlusPosition}%`
      },
      bottomConnector: {
        bottom: `${100 - atrMinusPosition}%`
      }
    }),
    [atrPlusPosition, atrMinusPosition]
  )

  return (
    <>
      <div
        style={{
          ...styles.band,
          ...(hovered ? styles.bandHovered : {})
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />

      {hovered && (
        <>
          {/* Top label for +ATR */}
          <div style={{ ...styles.connectorLine, ...styles.topConnector }} />
          <div
            style={{ ...styles.label, ...styles.plusLabel }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            ↗ +ATR: {formatNumber(atrPlusValue)}
          </div>

          {/* Bottom label for -ATR */}
          <div style={{ ...styles.connectorLine, ...styles.bottomConnector }} />
          <div
            style={{ ...styles.label, ...styles.minusLabel }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            ↘ -ATR: {formatNumber(atrMinusValue)}
          </div>
        </>
      )}
    </>
  )
})

AtrBand.displayName = 'AtrBand'

export default AtrBand

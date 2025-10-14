import { COLORS } from '../colors'
import { BAND_EDGE_STYLE, BASE_CONTAINER_STYLE } from './helper'

const ConnectionBands = ({ bandStyles, side }: { bandStyles; side }): React.JSX.Element => {
  if (!bandStyles) {
    return <></>
  }

  return (
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
  )
}

export default ConnectionBands

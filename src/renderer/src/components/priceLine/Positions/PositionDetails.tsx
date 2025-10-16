import { PosSide } from '../../../../../shared/types'

export default function PositionDetails({
  position,
  getTopPercentage
}: {
  position
  getTopPercentage
}): React.JSX.Element {
  const isLong = position.posSide === PosSide.LONG
  const color = isLong ? '#10b981' : '#ef4444'

  const { entryPrice } = position

  return (
    <div
      style={{
        position: 'absolute',
        top: `${getTopPercentage(entryPrice)}%`,
        transform: 'translateY(-50%)',
        zIndex: 100,
        right: '-10px',
        backgroundColor: color,
        borderRadius: '3px',
        width: '18px',
        height: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 0 8px ${color}80`,
        border: `1px solid ${color}`
      }}
    >
      <div
        style={{
          color: 'white',
          fontSize: '10px',
          fontWeight: 'bold',
          transform: isLong ? 'none' : 'rotate(180deg)'
        }}
      >
        ▲
      </div>

      <div
        style={{
          position: 'absolute',
          right: '25px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '3px',
          fontSize: '10px',
          whiteSpace: 'nowrap',
          opacity: 0,
          transition: 'opacity 0.2s',
          pointerEvents: 'none'
        }}
        className="position-tooltip"
      >
        {entryPrice}
      </div>
      <style>
        {`
          .position-tooltip {
            opacity: 0;
            transition: opacity 0.2s;
          }
          div:hover .position-tooltip {
            opacity: 1;
          }
        `}
      </style>
    </div>
  )
}

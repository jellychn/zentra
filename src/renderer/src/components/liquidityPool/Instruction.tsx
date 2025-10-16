import { COLORS } from './colors'

const Instruction = (): React.JSX.Element => {
  return (
    <div
      style={{
        fontSize: '10px',
        color: COLORS.text.muted,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: '8px',
        letterSpacing: '0.3px',
        lineHeight: '1.4'
      }}
    >
      <div>SHIFT: HIDE VALUES • HOVER BARS FOR DETAILS</div>
      <div
        style={{
          marginTop: '2px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div
            style={{ width: '8px', height: '2px', background: '#8b5cf6', borderRadius: '1px' }}
          />
          <span>PRICE FREQ</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <div
            style={{ width: '8px', height: '2px', background: '#ef4444', borderRadius: '1px' }}
          />
          <div
            style={{ width: '8px', height: '2px', background: '#10b981', borderRadius: '1px' }}
          />
          <span>VOLUME</span>
        </div>
      </div>
    </div>
  )
}

export default Instruction

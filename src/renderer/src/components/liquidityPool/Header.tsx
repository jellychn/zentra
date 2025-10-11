import { COLORS } from './colors'

const Header = ({
  hasLiquidityPool,
  hasOrderBook
}: {
  hasLiquidityPool: boolean
  hasOrderBook: boolean
}): React.JSX.Element => {
  return (
    <div
      style={{
        padding: '24px 20px 24px 20px',
        borderBottom: `1px solid ${COLORS.border}`,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(20px)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: COLORS.primary,
              boxShadow: `0 0 10px ${COLORS.primary}`
            }}
          />
          <div
            style={{
              fontSize: '14px',
              fontWeight: '800',
              color: COLORS.text.primary,
              letterSpacing: '0.5px'
            }}
          >
            {hasLiquidityPool ? 'LIQUIDITY POOL' : 'ORDER BOOK'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              fontSize: '14px',
              fontWeight: '800',
              color: COLORS.text.primary,
              letterSpacing: '0.5px'
            }}
          >
            {hasOrderBook ? 'ORDER BOOK' : ''}
          </div>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: hasOrderBook ? COLORS.success : 'transparent',
              boxShadow: hasOrderBook ? `0 0 10px ${COLORS.success}` : 'none'
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Header

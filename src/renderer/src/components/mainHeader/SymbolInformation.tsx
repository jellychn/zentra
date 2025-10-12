import { useStateStore } from '@renderer/contexts/StateStoreContext'

const SymbolInformation = (): React.JSX.Element => {
  const { state } = useStateStore()
  const { settings } = state || {}
  const { selectedSymbol } = settings || {}

  return (
    <>
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #7E57C2 0%, #673AB7 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          color: 'white',
          boxShadow: '0 4px 12px rgba(126, 87, 194, 0.3)',
          flexShrink: 0,
          margin: '0 10px 0 20px'
        }}
      >
        {selectedSymbol?.charAt(0) || 'B'}
      </div>
      <div style={{ flexShrink: 0 }}>
        <div
          style={{
            fontSize: '16px',
            fontWeight: '700',
            color: '#f1f5f9',
            marginBottom: '2px'
          }}
        >
          {selectedSymbol || 'BTC/USDT'}
        </div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#94a3b8'
          }}
        >
          Bitcoin / Tether
        </div>
      </div>
    </>
  )
}

export default SymbolInformation

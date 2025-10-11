const Header = ({ selectedSymbol }: { selectedSymbol?: string }): React.JSX.Element => {
  if (!selectedSymbol) {
    return <></>
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        flexShrink: 0
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: 'bold',
          color: '#f1f5f9',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}
      >
        Order Book
      </div>
      <div
        style={{
          fontSize: '11px',
          color: '#94a3b8',
          fontWeight: '600',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '6px 12px',
          borderRadius: '8px'
        }}
      >
        {selectedSymbol}
      </div>
    </div>
  )
}
export default Header

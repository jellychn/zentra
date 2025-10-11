const ColumnHeader = (): React.JSX.Element => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '16px',
        padding: '0 16px 12px 16px',
        marginBottom: '8px',
        color: '#94a3b8',
        fontSize: '10px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        flexShrink: 0
      }}
    >
      <span>Price</span>
      <span style={{ textAlign: 'right' }}>Size</span>
      <span style={{ textAlign: 'right' }}>Total</span>
    </div>
  )
}

export default ColumnHeader

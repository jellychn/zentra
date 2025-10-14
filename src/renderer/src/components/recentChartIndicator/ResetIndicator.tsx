const ResetIndicator = ({
  showResetIndicator,
  handleManualReset
}: {
  showResetIndicator: boolean
  handleManualReset: () => void
}): React.JSX.Element => {
  if (!showResetIndicator) {
    return <></>
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '70px',
        left: '20px',
        zIndex: 5,
        pointerEvents: 'auto'
      }}
    >
      <button
        onClick={handleManualReset}
        style={{
          background: 'rgba(30, 41, 59, 0.8)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '10px',
          fontWeight: '700',
          cursor: 'pointer',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(30, 41, 59, 0.8)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        RESET VIEW
      </button>
    </div>
  )
}

export default ResetIndicator

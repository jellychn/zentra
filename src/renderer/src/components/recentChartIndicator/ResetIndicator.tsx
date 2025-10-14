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
          background: 'rgba(59, 130, 246, 0.9)',
          color: 'white',
          border: 'none',
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
          e.currentTarget.style.background = 'rgba(59, 130, 246, 1)'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.9)'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        RESET VIEW
      </button>
    </div>
  )
}

export default ResetIndicator

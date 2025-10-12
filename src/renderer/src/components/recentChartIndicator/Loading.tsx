import { COLORS } from './colors'

const Loading = ({ loading }: { loading: boolean }): React.JSX.Element => {
  if (!loading) {
    return <></>
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '60px',
        left: '0',
        right: '0',
        bottom: '60px',
        zIndex: 5,
        background: 'rgba(15, 23, 42, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: `3px solid ${COLORS.primary}20`,
            borderTop: `3px solid ${COLORS.primary}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
        <div
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: COLORS.text.primary,
            textAlign: 'center'
          }}
        >
          Loading Market Data...
        </div>
        <div
          style={{
            fontSize: '10px',
            color: COLORS.text.secondary,
            textAlign: 'center',
            maxWidth: '200px'
          }}
        >
          Connecting to real-time price feed
        </div>
      </div>
    </div>
  )
}

export default Loading

import logo from '../assets/icons/logo.svg'

export default function Spinner({ message }: { message?: string }): React.ReactElement {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100vw',
    transform: 'translate(-50%, -50%)',
    height: '100vh',
    textAlign: 'center',
    padding: '2rem',
    backdropFilter: 'blur(20px)',
    background: 'linear-gradient(135deg, rgba(22, 25, 41, 0.95), rgba(30, 33, 48, 0.98))',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 80px rgba(255, 255, 255, 0.1)',
    minWidth: '200px',
    minHeight: '160px'
  }

  const logoStyle: React.CSSProperties = {
    width: '120px',
    height: '120px',
    filter: 'brightness(0) invert(1)',
    opacity: 0.9
  }

  const spinnerContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    height: '20px'
  }

  const dotStyle: React.CSSProperties = {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    animation: 'dotPulse 1.4s ease-in-out infinite both'
  }

  const messageStyle: React.CSSProperties = {
    color: '#f8fafc',
    fontSize: '0.875rem',
    fontWeight: '500',
    fontFamily: 'Inter, sans-serif',
    letterSpacing: '0.025em',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    maxWidth: '220px',
    lineHeight: '1.5',
    opacity: 0.8
  }

  const dotsStyle: React.CSSProperties = {
    display: 'inline-flex',
    gap: '3px',
    marginLeft: '4px'
  }

  const messageDotStyle: React.CSSProperties = {
    width: '4px',
    height: '4px',
    borderRadius: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    transform: 'rotate(45deg)',
    animation: 'geometricDots 1.4s ease-in-out infinite both'
  }

  return (
    <div style={containerStyle}>
      {/* Logo */}
      <img src={logo} alt="Logo" style={logoStyle} />

      {/* 4 Dot Spinner */}
      <div style={spinnerContainerStyle}>
        <div style={{ ...dotStyle, animationDelay: '0s' }} />
        <div style={{ ...dotStyle, animationDelay: '0.2s' }} />
        <div style={{ ...dotStyle, animationDelay: '0.4s' }} />
        <div style={{ ...dotStyle, animationDelay: '0.6s' }} />
      </div>

      {message && (
        <div style={messageStyle}>
          {message}
          <div style={dotsStyle}>
            <div style={messageDotStyle} />
            <div style={{ ...messageDotStyle, animationDelay: '0.2s' }} />
            <div style={{ ...messageDotStyle, animationDelay: '0.4s' }} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes dotPulse {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes geometricDots {
          0%, 80%, 100% {
            transform: rotate(45deg) scale(0.3);
            opacity: 0.3;
          }
          40% {
            transform: rotate(45deg) scale(1);
            opacity: 0.8;
          }
        }

        /* Smooth animations */
        * {
          animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  )
}

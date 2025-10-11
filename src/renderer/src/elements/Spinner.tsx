export default function Spinner({ message }: { message?: string }): React.ReactElement {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.5rem',
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
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 80px rgba(59, 130, 246, 0.1)',
    minWidth: '200px',
    minHeight: '160px'
  }

  const spinnerContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '60px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const orbitStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    border: '2px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '50%',
    animation: 'orbitSpin 3s linear infinite'
  }

  const coreStyle: React.CSSProperties = {
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)',
    animation: 'corePulse 2s ease-in-out infinite',
    position: 'relative',
    zIndex: 2
  }

  const particleStyle: React.CSSProperties = {
    position: 'absolute',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    boxShadow: '0 0 12px rgba(59, 130, 246, 0.8)'
  }

  const messageStyle: React.CSSProperties = {
    color: '#f8fafc',
    fontSize: '0.875rem',
    fontWeight: '600',
    fontFamily: 'Inter, sans-serif',
    letterSpacing: '0.025em',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
    maxWidth: '220px',
    lineHeight: '1.5'
  }

  const dotsStyle: React.CSSProperties = {
    display: 'inline-flex',
    gap: '2px',
    marginLeft: '4px'
  }

  const dotStyle: React.CSSProperties = {
    width: '3px',
    height: '3px',
    borderRadius: '50%',
    backgroundColor: '#3b82f6',
    animation: 'dotsBounce 1.4s ease-in-out infinite both'
  }

  return (
    <div style={containerStyle}>
      <div style={spinnerContainerStyle}>
        {/* Orbital Rings */}
        <div style={orbitStyle} />
        <div
          style={{
            ...orbitStyle,
            width: '80%',
            height: '80%',
            animation: 'orbitSpin 2s linear infinite reverse'
          }}
        />

        {/* Core Sphere */}
        <div style={coreStyle}>
          {/* Inner Glow */}
          <div
            style={{
              position: 'absolute',
              top: '3px',
              left: '3px',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
              opacity: 0.6
            }}
          />
        </div>

        {/* Orbiting Particles */}
        <div
          style={{
            ...particleStyle,
            top: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'particleOrbit 2s linear infinite'
          }}
        />
        <div
          style={{
            ...particleStyle,
            bottom: '4px',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'particleOrbit 2s linear infinite 0.5s'
          }}
        />
        <div
          style={{
            ...particleStyle,
            left: '4px',
            top: '50%',
            transform: 'translateY(-50%)',
            animation: 'particleOrbit 2s linear infinite 1s'
          }}
        />
        <div
          style={{
            ...particleStyle,
            right: '4px',
            top: '50%',
            transform: 'translateY(-50%)',
            animation: 'particleOrbit 2s linear infinite 1.5s'
          }}
        />
      </div>

      {message && (
        <div style={messageStyle}>
          {message}
          <div style={dotsStyle}>
            <div style={dotStyle} />
            <div style={{ ...dotStyle, animationDelay: '0.2s' }} />
            <div style={{ ...dotStyle, animationDelay: '0.4s' }} />
          </div>
        </div>
      )}

      <style>{`
        @keyframes orbitSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes corePulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4);
          }
        }

        @keyframes particleOrbit {
          0% {
            transform: translateX(-50%) rotate(0deg) translateY(-28px) rotate(0deg);
          }
          100% {
            transform: translateX(-50%) rotate(360deg) translateY(-28px) rotate(-360deg);
          }
        }

        @keyframes dotsBounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        /* Enhanced particle orbit for different positions */
        @keyframes particleOrbitBottom {
          0% {
            transform: translateX(-50%) rotate(0deg) translateY(28px) rotate(0deg);
          }
          100% {
            transform: translateX(-50%) rotate(360deg) translateY(28px) rotate(-360deg);
          }
        }

        @keyframes particleOrbitLeft {
          0% {
            transform: translateY(-50%) rotate(0deg) translateX(-28px) rotate(0deg);
          }
          100% {
            transform: translateY(-50%) rotate(360deg) translateX(-28px) rotate(-360deg);
          }
        }

        @keyframes particleOrbitRight {
          0% {
            transform: translateY(-50%) rotate(0deg) translateX(28px) rotate(0deg);
          }
          100% {
            transform: translateY(-50%) rotate(360deg) translateX(28px) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  )
}

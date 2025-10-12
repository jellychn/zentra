import { useEffect, useState, useCallback } from 'react'

interface Notification {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  timestamp: number
  id?: string
  duration?: number
}

declare global {
  interface Window {
    notification?: {
      onNotification: (callback: (notification: Notification) => void) => void
      removeNotificationListener: (callback: (notification: Notification) => void) => void
    }
  }
}

export default function Notification(): React.JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isHovered, setIsHovered] = useState<Record<string, boolean>>({})

  const removeNotification = useCallback((id: string): void => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  useEffect(() => {
    if (!window.notification) {
      console.warn('Notification API not available')
      return
    }

    const handleNotification = (notification: Notification): void => {
      const notificationWithId: Notification = {
        ...notification,
        id: `${notification.timestamp}-${Math.random().toString(36).substr(2, 9)}`
      }

      setNotifications((prev) => [notificationWithId, ...prev.slice(0, 4)])

      const duration = notification.duration || 5000
      setTimeout(() => {
        removeNotification(notificationWithId.id!)
      }, duration)
    }

    window.notification.onNotification(handleNotification)

    return () => {
      if (window.notification) {
        window.notification.removeNotificationListener(handleNotification)
      }
    }
  }, [notifications, removeNotification])

  if (notifications.length === 0) {
    return <></>
  }

  const getNotificationColor = (type: string): string => {
    switch (type) {
      case 'success':
        return 'rgba(34, 197, 94, 0.3)'
      case 'error':
        return 'rgba(239, 68, 68, 0.3)'
      case 'warning':
        return 'rgba(245, 158, 11, 0.3)'
      case 'info':
        return 'rgba(59, 130, 246, 0.3)'
      default:
        return 'rgba(59, 130, 246, 0.3)'
    }
  }

  const getGradientColor = (type: string): string => {
    switch (type) {
      case 'success':
        return 'linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(16, 185, 129, 0.3))'
      case 'error':
        return 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.3))'
      case 'warning':
        return 'linear-gradient(135deg, rgba(245, 158, 11, 0.95), rgba(217, 119, 6, 0.3))'
      case 'info':
        return 'linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(37, 99, 235, 0.3))'
      default:
        return 'linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(37, 99, 235, 0.3))'
    }
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {notifications.map((notification) => (
          <div
            key={notification.id}
            style={{
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              background: isHovered[notification.id!]
                ? getGradientColor(notification.type)
                : getNotificationColor(notification.type),
              padding: '20px',
              color: '#ffffff',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              minWidth: '320px',
              maxWidth: '400px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: isHovered[notification.id!]
                ? '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                : '0 15px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              animation: 'slideInRight 0.3s ease-out',
              transform: isHovered[notification.id!] ? 'translateX(-4px)' : 'translateX(0)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => removeNotification(notification.id!)}
            onMouseEnter={() => setIsHovered((prev) => ({ ...prev, [notification.id!]: true }))}
            onMouseLeave={() => setIsHovered((prev) => ({ ...prev, [notification.id!]: false }))}
          >
            {/* Subtle gradient overlay */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%)',
                pointerEvents: 'none'
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                position: 'relative',
                zIndex: 1
              }}
            >
              {/* Notification icon */}
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                {notification.type === 'success' && '✓'}
                {notification.type === 'error' && '✕'}
                {notification.type === 'warning' && '⚠'}
                {notification.type === 'info' && 'ℹ'}
              </div>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '6px'
                  }}
                >
                  <div
                    style={{
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      fontSize: '12px',
                      letterSpacing: '1px',
                      background: 'linear-gradient(135deg, #ffffff, rgba(255, 255, 255, 0.8))',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    {notification.type}
                  </div>

                  {/* Close button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeNotification(notification.id!)
                    }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '16px',
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s ease',
                      backdropFilter: 'blur(10px)',
                      minWidth: '28px',
                      minHeight: '28px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)'
                      e.currentTarget.style.transform = 'scale(1.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    ×
                  </button>
                </div>

                <div
                  style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    fontWeight: '500',
                    color: 'rgba(255, 255, 255, 0.95)'
                  }}
                >
                  {notification.message}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </>
  )
}

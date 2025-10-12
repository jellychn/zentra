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

  const removeNotification = useCallback((id: string): void => {
    setNotifications((prev) => {
      const filtered = prev.filter((n) => n.id !== id)
      console.log(`❌ Notification manually removed: ${id}, remaining: ${filtered.length}`)
      return filtered
    })
  }, [])

  useEffect(() => {
    console.log('🔔 Notification component mounted')

    if (!window.notification) {
      console.warn('Notification API not available')
      return
    }

    const handleNotification = (notification: Notification): void => {
      console.log('📨 Notification received in React:', notification.message)

      // Check if this exact notification was already received
      const isDuplicate = notifications.some(
        (n) => n.message === notification.message && n.timestamp === notification.timestamp
      )

      if (isDuplicate) {
        console.log('🚫 Duplicate notification blocked in React')
        return
      }

      const notificationWithId: Notification = {
        ...notification,
        id: `${notification.timestamp}-${Math.random().toString(36).substr(2, 9)}`
      }

      setNotifications((prev) => [notificationWithId, ...prev.slice(0, 4)])
      console.log(`📊 Notifications updated: ${notifications.length + 1} total`)

      // Set up auto-removal
      const duration = notification.duration || 5000
      setTimeout(() => {
        removeNotification(notificationWithId.id!)
      }, duration)
    }

    // Set up the listener
    window.notification.onNotification(handleNotification)
    console.log('✅ Notification listener set up')

    return () => {
      console.log('🔔 Notification component unmounted')
      if (window.notification) {
        window.notification.removeNotificationListener(handleNotification)
      }
    }
  }, [notifications, removeNotification])

  if (notifications.length === 0) {
    return <></>
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 1000
      }}
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            padding: '12px 16px',
            borderRadius: '4px',
            color: 'white',
            minWidth: '300px',
            marginBottom: '10px',
            backgroundColor:
              notification.type === 'success'
                ? '#10B981'
                : notification.type === 'error'
                  ? '#EF4444'
                  : notification.type === 'warning'
                    ? '#F59E0B'
                    : '#3B82F6'
          }}
          onClick={() => removeNotification(notification.id!)}
        >
          <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{notification.type}</div>
          <div>{notification.message}</div>
          <div style={{ fontSize: '12px', opacity: 0.8 }}>
            ID: {notification.id?.substring(0, 8)}...
          </div>
        </div>
      ))}
    </div>
  )
}

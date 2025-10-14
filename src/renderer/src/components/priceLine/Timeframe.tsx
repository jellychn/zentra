import { memo, useEffect, useRef, useState } from 'react'
import { COLORS } from './colors'
import { sendIpcMessage } from '@renderer/ipcMain/message'
import { MessageSenderType } from '../../../../shared/types'

const Timeframe = memo(
  ({
    selectedTimeframe,
    setSelectedTimeframe
  }: {
    selectedTimeframe: string
    setSelectedTimeframe: (timeframe: string) => void
  }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const TIMEFRAME_OPTIONS = ['ZOOM', '1 DAY', '1 MONTH']

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent): void => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleTimeframeChange = (timeframe: string): void => {
      setSelectedTimeframe(timeframe)
      sendIpcMessage({
        message: MessageSenderType.CHANGE_PRICE_LINE_TIMEFRAME,
        data: { timeframe }
      })
      setIsOpen(false)
    }

    return (
      <div
        style={{
          padding: '12px',
          background: 'rgba(15, 23, 42, 0.8)',
          borderBottom: `1px solid ${COLORS.border}`,
          borderRight: `1px solid ${COLORS.border}`,
          backdropFilter: 'blur(20px)',
          zIndex: 100
        }}
      >
        <div
          ref={dropdownRef}
          style={{
            position: 'relative',
            width: '100%',
            zIndex: 100
          }}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'rgba(30, 41, 59, 0.9)',
              border: `1px solid ${COLORS.border}`,
              borderRadius: '6px',
              color: COLORS.text.primary,
              fontSize: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.95)'
              e.currentTarget.style.borderColor = COLORS.primary
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(30, 41, 59, 0.9)'
              e.currentTarget.style.borderColor = COLORS.border
            }}
          >
            <span>{selectedTimeframe}</span>
            <span
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
                fontSize: '10px'
              }}
            >
              ▼
            </span>
          </button>

          {isOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'rgba(15, 23, 42, 0.95)',
                border: `1px solid ${COLORS.border}`,
                borderRadius: '6px',
                marginTop: '4px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                zIndex: 1000,
                overflow: 'hidden'
              }}
            >
              {TIMEFRAME_OPTIONS.map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => handleTimeframeChange(timeframe)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background:
                      selectedTimeframe === timeframe ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                    border: 'none',
                    color: selectedTimeframe === timeframe ? COLORS.primary : COLORS.text.secondary,
                    fontSize: '10px',
                    fontWeight: selectedTimeframe === timeframe ? '600' : '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedTimeframe !== timeframe) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                      e.currentTarget.style.color = COLORS.text.primary
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedTimeframe !== timeframe) {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = COLORS.text.secondary
                    }
                  }}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
)

Timeframe.displayName = 'Timeframe'
export default Timeframe

import React from 'react'

const StatCard = ({
  label,
  value,
  color,
  prefix = '',
  postfix = ''
}: {
  label: string
  value: string
  color: string
  prefix?: string
  postfix?: string
}): React.JSX.Element => (
  <div
    style={{
      padding: '8px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '6px',
      border: '1px solid rgba(255, 255, 255, 0.08)'
    }}
  >
    <div
      style={{
        fontSize: '9px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: '4px'
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: '12px',
        fontWeight: 'bold',
        color: color
      }}
    >
      {prefix}
      {value}
      {postfix}
    </div>
  </div>
)

export default StatCard

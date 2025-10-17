import { formatNumber } from '../../../../shared/helper'

const ItemInfo = ({
  label,
  value,
  color,
  prefix = '',
  postfix = ''
}: {
  label: string | number
  value: string | number
  color: string
  prefix?: string
  postfix?: string
}): React.JSX.Element => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: '9px',
          color: '#94a3b8',
          fontWeight: '600',
          marginBottom: '4px'
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '11px',
          fontWeight: 'bold',
          color: color
        }}
      >
        {prefix}
        {typeof value === 'number' ? formatNumber(value) : value}
        {postfix}
      </div>
    </div>
  )
}

export default ItemInfo

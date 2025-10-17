const DetailItem = ({
  label,
  value,
  color = '#cbd5e1'
}: {
  label: string
  value: string
  color?: string
}): React.JSX.Element => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <span style={{ color: '#94a3b8', fontWeight: '600' }}>{label}</span>
      <span style={{ color, fontWeight: 'bold' }}>{value}</span>
    </div>
  )
}

export default DetailItem

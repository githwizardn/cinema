export function SeatLegend() {
  const items = [
    { label: 'Available', bg: 'transparent', border: '#2A2C3D' },
    { label: 'Selected', bg: '#EC3013', border: '#EC3013' },
    { label: 'Sold', bg: '#1F2937', border: '#1F2937' },
    { label: 'Held by another user', bg: '#374151', border: '#374151' },
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 text-body-sm text-txt-secondary">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: item.bg, border: `1px solid ${item.border}` }}
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
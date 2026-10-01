import type { SeatMap as SeatMapType, Seat } from '../../api/types'
import { useBookingStore } from '../../features/booking/bookingStore'

interface SeatMapProps {
  seatMap: SeatMapType
}

export function SeatMap({ seatMap }: SeatMapProps) {
  const { selectedSeats, toggleSeat } = useBookingStore()
  const selectedIds = new Set(selectedSeats.map((s) => s.seatId))

  const getStyle = (seat: Seat, isSelected: boolean): React.CSSProperties | null => {
    if (isSelected || seat.isMine) {
      return { backgroundColor: '#EC3013', color: '#FFFFFF', border: '1px solid #EC3013' }
    }
    if (seat.state === 'available') {
      return {
        backgroundColor: 'transparent',
        color: '#A9A9A9',
        border: '1px solid #2A2C3D',
      }
    }
    if (seat.state === 'sold') {
      return { backgroundColor: '#1F2937', color: '#505261', border: '1px solid #1F2937' }
    }
    if (seat.state === 'held') {
      return { backgroundColor: '#374151', color: '#505261', border: '1px solid #374151' }
    }
    return null // unavailable
  }

  return (
    <div className="space-y-8">
      {/* Screen */}
      <div className="text-center">
        <div className="inline-block px-16 py-1.5 border-b-2 border-txt-muted/40 text-badge text-txt-muted uppercase tracking-widest">
          Screen
        </div>
      </div>

      {seatMap.sections.map((section) => (
        <div key={section.name}>
          <h4 className="text-badge font-bold text-txt-muted uppercase tracking-widest mb-3">
            {section.name} · Rows {section.rows[0]?.label}–{section.rows[section.rows.length - 1]?.label}
          </h4>

          <div className="space-y-1.5 overflow-x-auto">
            {section.rows.map((row) => (
              <div key={row.label} className="flex items-center gap-2 min-w-max">
                <span className="w-5 text-body-sm text-txt-muted font-mono text-right shrink-0">
                  {row.label}
                </span>
                <div className="flex gap-1 items-center">
                  {row.seats.map((seat) => {
                    const isSelected = selectedIds.has(seat.id)
                    const style = getStyle(seat, isSelected)
                    const isClickable =
                      seat.state === 'available' || seat.isMine || isSelected

                    return (
                      <div key={seat.id} className="flex items-center">
                        {style ? (
                          <button
                            type="button"
                            disabled={!isClickable}
                            onClick={() =>
                              isClickable &&
                              toggleSeat({ seatId: seat.id, code: seat.code })
                            }
                            className={`w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition-all ${
                              isClickable
                                ? 'cursor-pointer hover:ring-2 hover:ring-primary/50'
                                : 'cursor-not-allowed'
                            }`}
                            style={style}
                            title={seat.code}
                          >
                            {seat.label}
                          </button>
                        ) : (
                          <div className="w-7 h-7" />
                        )}
                        {seat.aisleAfter && <div className="w-3" />}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
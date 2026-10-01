import { useBookingStore } from '../../features/booking/bookingStore'
import { useFilterOptions } from '../../hooks/useFilterOptions'
import { useHoldSeats } from '../../hooks/useBooking'
import type { Session } from '../../api/types'
import { isConflictError, isBookingRuleError } from '../../api/client'
import type { ApiError } from '../../api/types'

interface BookingSidebarProps {
  session: Session
}

export function BookingSidebar({ session }: BookingSidebarProps) {
  const { selectedSeats, setSeatTicketType, toggleSeat } = useBookingStore()
  const { data: filterOptions } = useFilterOptions()
  const holdMutation = useHoldSeats()

  const maxSeats = filterOptions?.maxSeatsPerOrder ?? 3
  const ticketTypes = filterOptions?.ticketTypes ?? []

  // Child is blocked on 16+/18+
  const isChildBlocked = session.movie.ageRating.minAge >= 16

  // Compute prices
  const getPrice = (ticketTypeSlug: string) => {
    const type = ticketTypes.find((t) => t.slug === ticketTypeSlug)
    const ratio = type?.priceRatio ?? 1
    return session.price * ratio
  }

  const subtotal = selectedSeats.reduce((sum, s) => sum + getPrice(s.ticketType), 0)

  const handleNext = () => {
    holdMutation.mutate()
  }

  const error = holdMutation.error as ApiError | null
  const contestedError = error && isConflictError(error) ? error : null
  const ruleError = error && isBookingRuleError(error) ? error : null

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-h3 font-extrabold text-txt-primary mb-1">
          Your seats · Max: {maxSeats}
        </h3>
        <p className="text-body-sm text-txt-secondary">
          Pick up to {maxSeats} seats from the map. Each seat can carry its own ticket type.
        </p>
      </div>

      {/* Error banners */}
      {contestedError && (
        <div className="mb-4 px-3 py-2 rounded-input border border-error bg-error-tint">
          <p className="text-body-sm text-error font-semibold mb-1">
            Some seats were taken:
          </p>
          <p className="text-body-sm text-error">
            {contestedError.contested?.join(', ')}
          </p>
          <p className="text-body-sm text-error mt-1">Please re-select.</p>
        </div>
      )}

      {ruleError && (
        <div className="mb-4 px-3 py-2 rounded-input border border-error bg-error-tint">
          <p className="text-body-sm text-error">{ruleError.message}</p>
        </div>
      )}

      {/* Selected seats list */}
      <div className="flex-1 space-y-2 overflow-y-auto">
        {selectedSeats.length === 0 ? (
          <p className="text-body-sm text-txt-muted text-center py-8">
            No seats selected yet.
          </p>
        ) : (
          selectedSeats.map((seat) => (
            <div
              key={seat.seatId}
              className="flex items-center gap-2 px-3 py-2 bg-bg-base rounded-input border border-bg-elevated"
            >
              <span className="text-body font-bold text-txt-primary w-8">{seat.code}</span>

              <select
                value={seat.ticketType}
                onChange={(e) => setSeatTicketType(seat.seatId, e.target.value)}
                className="flex-1 bg-bg-elevated border border-bg-elevated rounded-input px-2 py-1 text-body-sm text-txt-primary focus:outline-none focus:border-primary cursor-pointer"
              >
                {ticketTypes
                  .filter((t) => !(t.slug === 'child' && isChildBlocked))
                  .map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.name}
                    </option>
                  ))}
              </select>

              <span className="text-body-sm font-bold text-txt-primary w-12 text-right">
                ₾{getPrice(seat.ticketType).toFixed(2)}
              </span>

              <button
                type="button"
                onClick={() => toggleSeat({ seatId: seat.seatId, code: seat.code })}
                className="text-txt-muted hover:text-error transition-colors"
                aria-label={`Remove ${seat.code}`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Subtotal + button */}
      <div className="border-t border-bg-elevated pt-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-body-sm text-txt-secondary uppercase tracking-wider font-semibold">
            Subtotal
          </span>
          <span className="text-h3 font-extrabold text-txt-primary">
            ₾{subtotal.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={selectedSeats.length === 0 || holdMutation.isPending}
          className="w-full py-3 rounded-input bg-primary hover:bg-primary-hover text-white font-bold text-btn transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {holdMutation.isPending ? 'Holding seats...' : 'Next: Checkout'}
        </button>
      </div>
    </div>
  )
}
import type { Order } from '../../api/types'

interface TicketCardProps {
  order: Order
  onRefund?: (order: Order) => void
}

export function TicketCard({ order, onRefund }: TicketCardProps) {
  const { session, tickets } = order
  const movie = session.movie

  // Refund button state
  const canRefund = order.isUpcoming && order.isRefundable

  // Tooltip text for disabled refund
  const refundDisabledReason = !order.isUpcoming
    ? 'This ticket is in the past'
    : !order.isRefundable
    ? 'Refundable up to 2 hours before the session starts'
    : ''

  return (
    <div className="bg-bg-surface border border-bg-elevated rounded-card overflow-hidden">
      <div className="flex gap-4 p-4">
        {/* Poster */}
        <div className="w-24 shrink-0">
          <div className="aspect-2/3 rounded-input overflow-hidden bg-bg-base">
            <img
              src={movie.posterUrl ?? ''}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-card font-extrabold text-txt-primary truncate">
                {movie.title}
              </h3>
              <div className="flex items-center gap-2 text-body-sm text-txt-secondary mt-1">
                <span className="px-1.5 py-0.5 border border-txt-muted rounded text-badge">
                  {movie.ageRating.code}
                </span>
                <span>{movie.runtimeMinutes} min</span>
              </div>
            </div>

            {/* Order reference */}
            <div className="text-right shrink-0">
              <p className="text-badge text-txt-muted uppercase tracking-wider">Order</p>
              <p className="text-body-sm text-txt-secondary font-mono">
                {order.reference}
              </p>
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-4 gap-3 mt-3 text-body-sm">
            <div>
              <p className="text-txt-muted text-badge uppercase tracking-wider mb-0.5">Date</p>
              <p className="text-txt-primary font-semibold">{session.date}</p>
            </div>
            <div>
              <p className="text-txt-muted text-badge uppercase tracking-wider mb-0.5">Time</p>
              <p className="text-txt-primary font-semibold">{session.time}</p>
            </div>
            <div>
              <p className="text-txt-muted text-badge uppercase tracking-wider mb-0.5">Venue</p>
              <p className="text-txt-primary font-semibold truncate">
                {session.venue.name} · {session.hall.name}
              </p>
            </div>
            <div>
              <p className="text-txt-muted text-badge uppercase tracking-wider mb-0.5">Format</p>
              <p className="text-txt-primary font-semibold">
                {session.format.name} · {session.language.name}
              </p>
            </div>
          </div>

          {/* Seats row */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-bg-elevated">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-txt-muted text-badge uppercase tracking-wider mb-0.5">Seats</p>
                <p className="text-body-sm text-txt-primary font-semibold">
                  {tickets.map((t) => t.seatCode).join(', ')}
                </p>
              </div>
              <div>
                <p className="text-txt-muted text-badge uppercase tracking-wider mb-0.5">
                  Tickets
                </p>
                <p className="text-body-sm text-txt-primary font-semibold">
                  {tickets.map((t) => t.ticketType.name).join(', ')}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-txt-muted text-badge uppercase tracking-wider mb-0.5">
                Total paid
              </p>
              <p className="text-h3 font-extrabold text-txt-primary">
                ₾{order.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Refund button (only for upcoming) */}
      {order.isUpcoming && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between pt-3 border-t border-bg-elevated">
            {!order.isRefundable && refundDisabledReason && (
              <p className="text-body-sm text-txt-muted italic">
                {order.refundedAt
                  ? 'Refunded'
                  : `Refundable up to 2h before · ${session.date} ${session.time}`}
              </p>
            )}
            {order.isRefundable && <div />}

            <button
              type="button"
              disabled={!canRefund}
              onClick={() => canRefund && onRefund?.(order)}
              className="px-4 py-2 rounded-input border text-body-sm font-bold transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-bg-elevated hover:border-primary hover:text-primary text-txt-primary"
              title={!canRefund ? refundDisabledReason : 'Refund this order'}
            >
              Refund
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
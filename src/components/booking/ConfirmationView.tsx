import type { Order } from '../../api/types'

interface ConfirmationViewProps {
  order: Order
  onClose: () => void
}

export function ConfirmationView({ order, onClose }: ConfirmationViewProps) {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="3">
          <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h2 className="text-h2 font-extrabold text-txt-primary mb-2">
        Booking confirmed!
      </h2>
      <p className="text-body text-txt-secondary mb-2">
        Your tickets are ready. We sent the confirmation to your email.
      </p>
      <p className="text-body-sm text-txt-muted mb-8">
        Order reference: <span className="text-primary font-bold">{order.reference}</span>
      </p>

      {/* Order details */}
      <div className="max-w-md mx-auto bg-bg-base rounded-card border border-bg-elevated p-4 text-left mb-6">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={order.session.movie.posterUrl ?? ''}
            alt={order.session.movie.title}
            className="w-12 h-16 object-cover rounded"
          />
          <div>
            <h3 className="text-card font-extrabold text-txt-primary">
              {order.session.movie.title}
            </h3>
            <p className="text-body-sm text-txt-secondary">
              {order.session.venue.name} · {order.session.hall.name} · {order.session.date}{' '}
              {order.session.time}
            </p>
          </div>
        </div>

        <div className="space-y-2 text-body-sm">
          <div className="flex justify-between">
            <span className="text-txt-secondary">Seats</span>
            <span className="text-txt-primary font-semibold">
              {order.tickets.map((t) => t.seatCode).join(', ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-txt-secondary">Tickets</span>
            <span className="text-txt-primary font-semibold">
              {order.tickets.map((t) => t.ticketType.name).join(', ')}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-bg-elevated">
            <span className="text-txt-secondary font-semibold">Total Paid</span>
            <span className="text-txt-primary font-extrabold">
              ₾{order.totalPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 rounded-input bg-primary hover:bg-primary-hover text-white font-bold text-btn transition-colors"
        >
          My Tickets
        </button>
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 rounded-input border border-bg-elevated hover:border-txt-secondary text-txt-primary font-bold text-btn transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  )
}
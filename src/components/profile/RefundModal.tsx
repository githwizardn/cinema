import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { useRefundOrder } from '../../hooks/useTickets'
import type { Order, ApiError } from '../../api/types'

interface RefundModalProps {
  order: Order | null
  onClose: () => void
}

export function RefundModal({ order, onClose }: RefundModalProps) {
  const refundMutation = useRefundOrder()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleConfirm = async () => {
    if (!order) return
    setErrorMessage(null)
    try {
      await refundMutation.mutateAsync(order.reference)
      onClose()
    } catch (err) {
      const error = err as ApiError
      setErrorMessage(error.message)
    }
  }

  return (
    <Modal
      isOpen={!!order}
      onClose={onClose}
      title="Confirm refund"
      subtitle="This action cannot be undone"
      maxWidth="max-w-md"
    >
      {order && (
        <div className="space-y-4">
          <div className="px-4 py-3 rounded-input bg-bg-base border border-bg-elevated">
            <p className="text-body-sm text-txt-secondary mb-1">You are about to refund:</p>
            <p className="text-body text-txt-primary font-bold">{order.session.movie.title}</p>
            <p className="text-body-sm text-txt-secondary mt-1">
              {order.session.date} · {order.session.time} · {order.session.venue.name}
            </p>
            <p className="text-body-sm text-txt-secondary mt-1">
              Seats: {order.tickets.map((t) => t.seatCode).join(', ')}
            </p>
            <p className="text-h3 font-extrabold text-primary mt-3">
              ₾{order.totalPrice.toFixed(2)}
            </p>
          </div>

          {errorMessage && (
            <div className="px-3 py-2 rounded-input border border-error bg-error-tint text-body-sm text-error">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={refundMutation.isPending}
              className="flex-1 py-3 rounded-input border border-bg-elevated hover:border-txt-secondary text-txt-primary font-bold text-btn transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={refundMutation.isPending}
              className="flex-1 py-3 rounded-input bg-primary hover:bg-primary-hover text-white font-bold text-btn transition-colors disabled:opacity-50"
            >
              {refundMutation.isPending ? 'Refunding...' : 'Confirm Refund'}
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
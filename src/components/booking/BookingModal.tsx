import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useBookingStore } from '../../features/booking/bookingStore'
import { useSession, useSessionSeats, useReleaseHold, usePayOrder } from '../../hooks/useBooking'
import { useHoldTimer } from '../../hooks/useHoldTimer'
import { SeatMap } from './SeatMap'
import { SeatLegend } from './SeatLegend'
import { BookingSidebar } from './BookingSidebar'
import { CheckoutForm } from './CheckoutForm'
import { ConfirmationView } from './ConfirmationView'
import type { Order } from '../../api/types'

export function BookingModal() {
  const {
    isOpen,
    sessionId,
    step,
    holdId,
    expiresAt,
    close,
    setStep,
    clearSeats,
    reset,
  } = useBookingStore()

  const [order, setOrder] = useState<Order | null>(null)
  const [expiredWarning, setExpiredWarning] = useState(false)

  const { data: session } = useSession(sessionId)
  const { data: seatMap } = useSessionSeats(sessionId)
  const releaseHold = useReleaseHold()
  const payMutation = usePayOrder()

  // 🎯 ALL HOOKS FIRST — before any return
  const { display: timerDisplay, secondsLeft } = useHoldTimer(expiresAt, () => {
    setExpiredWarning(true)
    clearSeats()
    setStep(1)
    if (holdId) releaseHold.mutate(holdId)
  })

  // Capture order on success
  useEffect(() => {
    if (payMutation.data) setOrder(payMutation.data)
  }, [payMutation.data])

  // ESC + body scroll lock
  useEffect(() => {
    if (!isOpen) return
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Inline close logic to avoid dependency on handleClose
        if (holdId && step < 3) {
          releaseHold.mutate(holdId)
        }
        close()
      }
    }
    document.addEventListener('keydown', onEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, holdId, step, close, releaseHold])

  // 🎯 Conditional render AFTER all hooks
  if (!isOpen) return null

  const handleClose = () => {
    if (holdId && step < 3) {
      releaseHold.mutate(holdId)
    }
    close()
  }

  const handleFinalClose = () => {
    setOrder(null)
    setExpiredWarning(false)
    reset()
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[92vh] bg-bg-surface rounded-modal border border-bg-elevated shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — session info */}
        {session && (
          <div className="px-6 py-4 border-b border-bg-elevated flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="text-h3 font-extrabold text-txt-primary truncate">
                {session.movie.title}
              </h2>
              <p className="text-body-sm text-txt-secondary mt-1 truncate">
                {session.venue.name} · Hall {session.hall.name} · {session.date} {session.time} ·{' '}
                {session.format.name} · {session.language.name}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {step === 2 && expiresAt && (
                <div
                  className={`px-3 py-1.5 rounded-input border flex items-center gap-2 ${
                    secondsLeft < 60
                      ? 'border-error bg-error-tint'
                      : 'border-bg-elevated bg-bg-base'
                  }`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={secondsLeft < 60 ? '#EF4444' : '#A9A9A9'}
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" strokeLinecap="round" />
                  </svg>
                  <span
                    className={`text-body-sm font-bold tabular-nums ${
                      secondsLeft < 60 ? 'text-error' : 'text-txt-primary'
                    }`}
                  >
                    Seats Held: {timerDisplay}
                  </span>
                </div>
              )}

              <button
                onClick={handleClose}
                className="text-txt-secondary hover:text-txt-primary transition-colors p-1"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Step indicator */}
        {step < 3 && (
          <div className="px-6 pt-4 flex gap-2">
            <button
              onClick={() => step === 2 && setStep(1)}
              className={`flex-1 py-2 rounded-input text-btn font-bold transition-colors ${
                step === 1
                  ? 'bg-primary text-white'
                  : 'bg-bg-elevated text-txt-secondary hover:text-txt-primary'
              }`}
            >
              SEATS
            </button>
            <div
              className={`flex-1 py-2 rounded-input text-btn font-bold text-center ${
                step === 2 ? 'bg-primary text-white' : 'bg-bg-elevated text-txt-secondary'
              }`}
            >
              CHECKOUT
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Expired warning */}
          {expiredWarning && step === 1 && (
            <div className="mb-4 px-4 py-3 rounded-input border border-error bg-error-tint">
              <p className="text-body-sm text-error font-semibold">
                Your hold time expired. Please re-select your seats.
              </p>
            </div>
          )}

          {/* STEP 1: Seats */}
          {step === 1 && (
            <>
              {seatMap && session ? (
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <SeatMap seatMap={seatMap} />
                    <div className="mt-8">
                      <SeatLegend />
                    </div>
                  </div>
                  <div className="border-l border-bg-elevated pl-6">
                    <BookingSidebar session={session} />
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-txt-secondary">Loading seat map...</p>
                </div>
              )}
            </>
          )}

          {/* STEP 2: Checkout */}
          {step === 2 && holdId && expiresAt && !order && (
            <div className="grid grid-cols-2 gap-8">
              <CheckoutForm
                hold={{
                  holdId,
                  sessionId: sessionId!,
                  expiresAt,
                  secondsRemaining: secondsLeft,
                  isLive: true,
                  subtotal: 0,
                  seats: [],
                }}
              />
              <div>
                <h3 className="text-h3 font-extrabold text-txt-primary mb-4">Summary</h3>
                <div className="bg-bg-base rounded-card border border-bg-elevated p-4 text-body-sm">
                  <div className="flex justify-between py-2">
                    <span className="text-txt-secondary">Session</span>
                    <span className="text-txt-primary font-semibold">
                      {session?.movie.title}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-bg-elevated">
                    <span className="text-txt-secondary">Hold</span>
                    <span className="text-txt-primary font-semibold tabular-nums">
                      {timerDisplay}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Confirmation */}
          {step === 3 && order && (
            <ConfirmationView order={order} onClose={handleFinalClose} />
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
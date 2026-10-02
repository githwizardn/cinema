import { useAuthStore, useAuthModal, usePendingAction } from '../../features/auth/authStore'
import { useBookingStore } from '../../features/booking/bookingStore'
import type { Session } from '../../api/types'

interface SessionCardProps {
  session: Session
}

export function SessionCard({ session }: SessionCardProps) {
  const { isAuthenticated } = useAuthStore()
  const { openLogin } = useAuthModal()
  const { setPendingAction } = usePendingAction()
  const { open } = useBookingStore()

  const handleClick = () => {
    if (!isAuthenticated) {
      // 🎯 Store pending action — replay after login
      setPendingAction(() => () => open(session.id))
      openLogin()
      return
    }
    open(session.id)
  }

  const isDisabled = session.isSoldOut

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`text-left p-4 rounded-card border transition-colors ${
        isDisabled
          ? 'bg-bg-surface border-bg-elevated opacity-40 cursor-not-allowed'
          : 'bg-bg-surface border-bg-elevated hover:border-primary cursor-pointer'
      }`}
    >
      <div className="text-h3 font-extrabold text-txt-primary mb-2">
        {session.time}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="px-1.5 py-0.5 bg-bg-elevated rounded text-badge font-semibold text-txt-secondary uppercase tracking-wider">
          {session.format.name}
        </span>
        <span className="px-1.5 py-0.5 bg-bg-elevated rounded text-badge font-semibold text-txt-secondary">
          {session.language.name}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-body-sm font-bold text-txt-primary">
          ₾{session.price}
        </span>
        <span
          className={`text-body-sm ${
            session.isSoldOut
              ? 'text-error font-semibold'
              : session.seatsLeft < 10
              ? 'text-warning'
              : 'text-txt-muted'
          }`}
        >
          {session.isSoldOut ? 'Sold out' : `${session.seatsLeft} seats`}
        </span>
      </div>

      <div className="text-body-sm text-txt-muted mt-2 truncate">
        {session.hall.name} · {session.venue.name}
      </div>
    </button>
  )
}
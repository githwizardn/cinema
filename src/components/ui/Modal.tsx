import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  subtitle?: string
  maxWidth?: string
}

export function Modal({
  isOpen,
  onClose,
  children,
  title,
  subtitle,
  maxWidth = 'max-w-md',
}: ModalProps) {
  // ESC + body scroll lock
  useEffect(() => {
    if (!isOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidth} bg-bg-surface rounded-modal shadow-2xl border border-bg-elevated`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || subtitle) && (
          <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4">
            <div>
              {title && (
                <h2 className="text-h3 font-extrabold text-txt-primary">{title}</h2>
              )}
              {subtitle && (
                <p className="text-body-sm text-txt-secondary mt-1">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-txt-secondary hover:text-txt-primary transition-colors p-1 -mr-1 shrink-0"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}

        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>,
    document.body
  )
}
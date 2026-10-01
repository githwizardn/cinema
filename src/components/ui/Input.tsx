import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  isValid?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, isValid, className = '', id, name, ...props }, ref) => {
    const inputId = id || name

    const stateStyles = error
      ? 'border-error focus:border-error'
      : isValid
      ? 'border-success focus:border-success'
      : 'border-bg-elevated focus:border-primary'

    return (
      <div className="flex flex-col">
        {label && (
          <label htmlFor={inputId} className="text-label text-txt-primary mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            name={name}
            className={`w-full bg-bg-base border rounded-input px-4 py-3 text-body text-txt-primary placeholder:text-txt-muted focus:outline-none transition-colors ${stateStyles} ${
              isValid || error ? 'pr-10' : ''
            } ${className}`}
            {...props}
          />

          {isValid && !error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-success pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          )}

          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-error pointer-events-none">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>

        {error && <p className="text-body-sm text-error mt-1.5">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
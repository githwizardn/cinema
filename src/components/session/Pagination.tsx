interface PaginationProps {
  currentPage: number
  lastPage: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null

  // Build page numbers with ellipsis
  const pages: (number | '...')[] = []
  const show = (n: number) => {
    if (n < 1 || n > lastPage) return
    if (pages.includes(n)) return
    pages.push(n)
  }

  const range = 1 // pages around current
  show(1)
  if (currentPage - range > 2) pages.push('...')
  for (let i = currentPage - range; i <= currentPage + range; i++) show(i)
  if (currentPage + range < lastPage - 1) pages.push('...')
  show(lastPage)

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {/* Previous */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-9 h-9 rounded-full bg-bg-surface hover:bg-bg-elevated text-txt-secondary hover:text-txt-primary flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Page numbers */}
      {pages.map((p, i) => (
        <div key={i}>
          {p === '...' ? (
            <span className="w-9 h-9 flex items-center justify-center text-txt-muted text-body-sm">
              …
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onPageChange(p)}
              className={`w-9 h-9 rounded-full font-bold text-body-sm transition-colors ${
                p === currentPage
                  ? 'bg-primary text-white'
                  : 'bg-bg-surface hover:bg-bg-elevated text-txt-secondary hover:text-txt-primary'
              }`}
            >
              {p}
            </button>
          )}
        </div>
      ))}

      {/* Next */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="w-9 h-9 rounded-full bg-bg-surface hover:bg-bg-elevated text-txt-secondary hover:text-txt-primary flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
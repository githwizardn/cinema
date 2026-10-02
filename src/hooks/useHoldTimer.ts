import { useEffect, useRef, useState } from 'react'

function computeSeconds(expiresAt: string | null): number {
  if (!expiresAt) return 0
  const ms = new Date(expiresAt).getTime() - Date.now()
  return Math.max(0, Math.floor(ms / 1000))
}

export function useHoldTimer(expiresAt: string | null, onExpire: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(() => computeSeconds(expiresAt))
  const onExpireRef = useRef(onExpire)
  const firedRef = useRef(false)

  useEffect(() => {
    onExpireRef.current = onExpire
  })

  useEffect(() => {
    if (!expiresAt) return
    firedRef.current = false

    const tick = () => {
      const remaining = computeSeconds(expiresAt)
      setSecondsLeft(remaining)
      if (remaining === 0 && !firedRef.current) {
        firedRef.current = true
        onExpireRef.current()
      }
    }

    // Defer first tick to avoid synchronous setState inside effect body
    const initial = setTimeout(tick, 0)
    const interval = setInterval(tick, 1000)

    return () => {
      clearTimeout(initial)
      clearInterval(interval)
    }
  }, [expiresAt])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60

  return {
    secondsLeft,
    display: `${minutes}:${seconds.toString().padStart(2, '0')}`,
  }
}
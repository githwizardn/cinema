import { useEffect, useRef, useState } from 'react'

export function useHoldTimer(expiresAt: string | null, onExpire: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(0)
  const onExpireRef = useRef(onExpire)
  const firedRef = useRef(false)

  useEffect(() => {
    onExpireRef.current = onExpire
  })

  useEffect(() => {
    if (!expiresAt) {
      setSecondsLeft(0)
      return
    }

    firedRef.current = false

    const tick = () => {
      const ms = new Date(expiresAt).getTime() - Date.now()
      const remaining = Math.max(0, Math.floor(ms / 1000))
      setSecondsLeft(remaining)

      if (remaining === 0 && !firedRef.current) {
        firedRef.current = true
        onExpireRef.current()
      }
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  return {
    secondsLeft,
    display: `${minutes}:${seconds.toString().padStart(2, '0')}`,
  }
}
import { useMutation } from '@tanstack/react-query'
import { notifyMe } from '../api/catalogue'

export function useNotify() {
  return useMutation({
    mutationFn: notifyMe,
  })
}
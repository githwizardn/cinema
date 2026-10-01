import { QueryClient } from '@tanstack/react-query'
import type { ApiError } from '../api/types'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 1 წუთი — მონაცემი "fresh" არის
      staleTime: 60 * 1000,
      // 5 წუთი — cache-ში ინახება გამოყენების შემდეგ
      gcTime: 5 * 60 * 1000,
      // 1 retry — თუ პირველი ცდა ჩავარდა
      retry: (failureCount, error) => {
        const apiError = error as ApiError
        // 401, 403, 404, 422 არ უნდა retry-ს
        if (apiError.status && [401, 403, 404, 422].includes(apiError.status)) {
          return false
        }
        // სხვა შემთხვევაში — 1 retry
        return failureCount < 1
      },
      // Refetch on window focus (default)
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Mutation-ები retry-ს არ საჭიროებენ
      retry: false,
    },
  },
})
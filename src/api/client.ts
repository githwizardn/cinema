import axios, { AxiosError } from 'axios'
import { tokenStorage } from '../lib/storage'
import type { ApiError, ValidationError } from './types'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: 'application/json',
  },
})

// ============ REQUEST INTERCEPTOR ============
// ყოველ request-ზე ავტომატურად ვამატებთ Bearer token-ს (თუ არსებობს)
api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ============ RESPONSE INTERCEPTOR ============
// ყოველ error-ს ვაქცევთ ერთიან ფორმატად (ApiError)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const normalized = normalizeError(error)
    return Promise.reject(normalized)
  }
)

// ============ ERROR NORMALIZER ============
// API-ს სხვადასხვა error-ის ფორმატს ერთ ტიპად ვაქცევთ:
// - 401 → session expired
// - 409 → contested seats
// - 422 with errors → field validation
// - 422 with message only → booking rule
// - 500 → server error
function normalizeError(error: AxiosError): ApiError {
  // Network error (server unreachable)
  if (!error.response) {
    return {
      message: 'Network error. Please check your connection.',
      status: 0,
    }
  }

  const { status, data } = error.response
  const body = data as Partial<ValidationError> & {
    contested?: string[]
    message?: string
  }

  // 401 — session expired (login modal + replay)
  if (status === 401) {
    tokenStorage.clear()
    return {
      message: body.message ?? 'Session expired. Please log in again.',
      status: 401,
    }
  }

  // 409 — resource conflict (seats taken, slot busy)
  if (status === 409) {
    return {
      message: body.message ?? 'This resource is no longer available.',
      status: 409,
      contested: body.contested,
    }
  }

  // 422 — two shapes:
  //   - with `errors` → field validation
  //   - with only `message` → booking rule
  if (status === 422) {
    return {
      message: body.message ?? 'Validation failed.',
      status: 422,
      errors: body.errors,
    }
  }

  // 403 — record belongs to another account
  if (status === 403) {
    return {
      message: body.message ?? 'You do not have permission for this action.',
      status: 403,
    }
  }

  // 404 — not found
  if (status === 404) {
    return {
      message: body.message ?? 'Not found.',
      status: 404,
    }
  }

  // 500+ — server fault
  if (status >= 500) {
    return {
      message: 'Something went wrong on our end. Please try again.',
      status,
    }
  }

  // Fallback
  return {
    message: body.message ?? 'An unexpected error occurred.',
    status,
  }
}

// ============ HELPER: 422-ის ორი სახის გარჩევა ============
export function isFieldError(error: ApiError): error is ApiError & {
  errors: Record<string, string[]>
} {
  return error.status === 422 && !!error.errors
}

export function isBookingRuleError(error: ApiError): boolean {
  return error.status === 422 && !error.errors
}

export function isConflictError(error: ApiError): error is ApiError & {
  contested: string[]
} {
  return error.status === 409 && !!error.contested
}

export function isUnauthorizedError(error: ApiError): boolean {
  return error.status === 401
}
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '../../components/ui/Input'
import { login } from '../../api/auth'
import { useAuthStore, useAuthModal, usePendingAction } from './authStore'
import type { ApiError } from '../../api/types'

interface LoginFormValues {
  email: string
  password: string
}

export function LoginForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setAuth } = useAuthStore()
  const { closeModal, switchModal } = useAuthModal()
  const { runPendingAction } = usePendingAction()

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<LoginFormValues>({
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true)
    setServerError(null)
    try {
      const { user, token } = await login(values.email, values.password)
      setAuth(user, token)
      closeModal()
      // 🔑 Interrupted action — თუ user-ს ჰქონდა დაცული მოქმედება
      runPendingAction()
    } catch (err) {
      const error = err as ApiError
      setServerError(error.message)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="px-3 py-2 rounded-input border border-error bg-error-tint text-body-sm text-error">
          {serverError}
        </div>
      )}

      <Input
        label="Email"
        type="email"
        placeholder="example@gmail.com"
        autoComplete="email"
        error={errors.email?.message}
        isValid={touchedFields.email && !errors.email}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email',
          },
        })}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        error={errors.password?.message}
        isValid={touchedFields.password && !errors.password}
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 3, message: 'Password must be at least 3 characters' },
        })}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-input bg-primary hover:bg-primary-hover text-white font-bold text-btn transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Logging in...' : 'Log In'}
      </button>

      <p className="text-center text-body-sm text-txt-secondary pt-2">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={switchModal}
          className="text-primary hover:underline font-semibold"
        >
          Sign Up
        </button>
      </p>
    </form>
  )
}
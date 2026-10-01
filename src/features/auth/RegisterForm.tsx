import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '../../components/ui/Input'
import { register as registerApi } from '../../api/auth'
import { useAuthStore, useAuthModal } from './authStore'
import type { ApiError } from '../../api/types'

interface RegisterFormValues {
  username: string
  email: string
  password: string
  password_confirmation: string
}

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setAuth } = useAuthStore()
  const { closeModal, switchModal } = useAuthModal()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<RegisterFormValues>({
    mode: 'onBlur',
    defaultValues: {
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
    },
  })

  const password = watch('password')

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setServerError('Avatar must be JPG, PNG or WebP')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setServerError('Avatar must be less than 2MB')
      return
    }

    setAvatarFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
    setServerError(null)
  }

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true)
    setServerError(null)
    setFieldErrors({})
    try {
      const formData = new FormData()
      formData.append('username', values.username)
      formData.append('email', values.email)
      formData.append('password', values.password)
      formData.append('password_confirmation', values.password_confirmation)
      if (avatarFile) formData.append('avatar', avatarFile)

      const { user, token } = await registerApi(formData)
      setAuth(user, token)
      closeModal()
    } catch (err) {
      const error = err as ApiError
      if (error.errors) {
        setFieldErrors(error.errors)
      } else {
        setServerError(error.message)
      }
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Avatar upload */}
      <div>
        <label className="text-label text-txt-primary mb-2 block">
          Upload avatar (optional)
        </label>
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center overflow-hidden border border-bg-elevated shrink-0">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#505261" strokeWidth="1.5">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            )}
          </div>
          <div className="flex-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 border border-bg-elevated hover:border-txt-secondary rounded-input text-body-sm font-semibold text-txt-primary transition-colors"
            >
              Choose file
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <p className="text-body-sm text-txt-muted mt-1">JPG, PNG or WEBP</p>
          </div>
        </div>
      </div>

      {serverError && (
        <div className="px-3 py-2 rounded-input border border-error bg-error-tint text-body-sm text-error">
          {serverError}
        </div>
      )}

      <Input
        label="Username"
        type="text"
        placeholder="User"
        autoComplete="username"
        error={errors.username?.message || fieldErrors.username?.[0]}
        isValid={touchedFields.username && !errors.username && !fieldErrors.username}
        {...register('username', {
          required: 'Username is required',
          minLength: { value: 3, message: 'Username must be at least 3 characters' },
        })}
      />

      <Input
        label="Email"
        type="email"
        placeholder="example@gmail.com"
        autoComplete="email"
        error={errors.email?.message || fieldErrors.email?.[0]}
        isValid={touchedFields.email && !errors.email && !fieldErrors.email}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email',
          },
        })}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.password?.message}
          isValid={touchedFields.password && !errors.password}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 3, message: 'Password must be at least 3 characters' },
          })}
        />

        <Input
          label="Confirm password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.password_confirmation?.message}
          isValid={touchedFields.password_confirmation && !errors.password_confirmation}
          {...register('password_confirmation', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 rounded-input bg-primary hover:bg-primary-hover text-white font-bold text-btn transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Signing up...' : 'Sign Up'}
      </button>

      <p className="text-center text-body-sm text-txt-secondary pt-2">
        Already have an account?{' '}
        <button
          type="button"
          onClick={switchModal}
          className="text-primary hover:underline font-semibold"
        >
          Log In
        </button>
      </p>
    </form>
  )
}
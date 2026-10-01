import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '../components/ui/Input'
import { useAuthStore } from '../features/auth/authStore'
import { useFilterOptions } from '../hooks/useFilterOptions'
import { useUpdateProfile } from '../hooks/useProfile'
import { isFieldError } from '../api/client'
import type { ApiError } from '../api/types'

interface ProfileFormValues {
  fullName: string
  email: string
  mobileNumber: string
  dateOfBirth: string
  preferredVenueId: string
}

type Tab = 'upcoming' | 'past'

export function ProfilePage() {
  const { user } = useAuthStore()
  const { data: filterOptions } = useFilterOptions()
  const updateMutation = useUpdateProfile()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setActiveTab] = useState<Tab>('upcoming')
  const [serverError, setServerError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, touchedFields, isDirty, isValid },
  } = useForm<ProfileFormValues>({
    mode: 'onBlur',
    defaultValues: {
      fullName: '',
      email: '',
      mobileNumber: '',
      dateOfBirth: '',
      preferredVenueId: '',
    },
  })

  // Populate form when user loads
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName ?? '',
        email: user.email,
        mobileNumber: user.mobileNumber ?? '',
        dateOfBirth: user.dateOfBirth ?? '',
        preferredVenueId: user.preferredVenue?.id ? String(user.preferredVenue.id) : '',
      })
    }
  }, [user, reset])

  // Clear success message on new edit
  useEffect(() => {
    if (isDirty) setSuccessMessage(null)
  }, [isDirty])

  const onSubmit = async (values: ProfileFormValues) => {
    setServerError(null)
    setFieldErrors({})
    setSuccessMessage(null)

    try {
      await updateMutation.mutateAsync({
        fullName: values.fullName,
        mobileNumber: values.mobileNumber,
        dateOfBirth: values.dateOfBirth,
        preferredVenueId: values.preferredVenueId ? Number(values.preferredVenueId) : null,
      })
      setSuccessMessage('Profile saved successfully!')
      reset(values) // reset isDirty
    } catch (err) {
      const error = err as ApiError
      if (isFieldError(error)) {
        setFieldErrors(error.errors)
      } else {
        setServerError(error.message)
      }
    }
  }

  // Compute min date for DOB (12 years ago)
  const today = new Date()
  const maxDob = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0]

  // Eligibility message
  const age = user?.age
  const isComplete = user?.profileComplete
  const canBuyAll = age !== null && age !== undefined && age >= 18

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-hero font-extrabold text-txt-primary mb-4">My Profile</h1>

        {/* Status banner */}
        {user && !isComplete && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-input bg-warning/10 border border-warning/30 max-w-2xl">
            <span className="w-2 h-2 rounded-full bg-warning mt-2 shrink-0" />
            <div>
              <p className="text-body font-bold text-warning">Profile Incomplete</p>
              <p className="text-body-sm text-txt-secondary mt-0.5">
                Please complete your profile to enable booking.
              </p>
            </div>
          </div>
        )}

        {user && isComplete && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-input bg-success/10 border border-success/30 max-w-2xl">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ADE80" strokeWidth="3">
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-body font-bold text-success">Profile Complete ✓</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-bg-elevated mb-8">
        <button
          className="text-h3 font-extrabold text-txt-primary pb-3 border-b-2 border-primary -mb-px"
        >
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className="text-h3 font-extrabold text-txt-secondary pb-3 hover:text-txt-primary transition-colors"
        >
          My Tickets
        </button>
      </div>

      {/* Personal Info form */}
      <div className="max-w-2xl">
        {/* Eligibility note */}
        {age !== null && age !== undefined && (
          <div className="mb-6 px-4 py-3 rounded-input bg-bg-surface border border-bg-elevated">
            <p className="text-body-sm text-txt-secondary">
              You are <span className="text-txt-primary font-bold">{age}</span>, you can buy
              tickets for{' '}
              {canBuyAll ? (
                <span className="text-success font-semibold">all age ratings</span>
              ) : (
                <span className="text-warning font-semibold">
                  ratings up to {age >= 16 ? '16+' : age >= 12 ? '12+' : 'G/PG'}
                </span>
              )}
              . You cannot buy tickets for 16+ or 18+ titles.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {serverError && (
            <div className="px-3 py-2 rounded-input border border-error bg-error-tint text-body-sm text-error">
              {serverError}
            </div>
          )}

          {successMessage && (
            <div className="px-3 py-2 rounded-input border border-success bg-success/10 text-body-sm text-success">
              {successMessage}
            </div>
          )}

          <Input
            label="Full Name"
            type="text"
            placeholder="Jane Dolidze"
            error={errors.fullName?.message || fieldErrors.fullName?.[0]}
            isValid={touchedFields.fullName && !errors.fullName && !fieldErrors.fullName}
            {...register('fullName', {
              required: 'Name is required',
              minLength: { value: 3, message: 'Name must be at least 3 characters' },
              maxLength: { value: 50, message: 'Name must not exceed 50 characters' },
            })}
          />

          <Input
            label="Email"
            type="email"
            disabled
            className="opacity-60 cursor-not-allowed"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Mobile Number"
            type="tel"
            placeholder="5XX XXX XXX"
            error={errors.mobileNumber?.message || fieldErrors.mobileNumber?.[0]}
            isValid={touchedFields.mobileNumber && !errors.mobileNumber && !fieldErrors.mobileNumber}
            {...register('mobileNumber', {
              required: 'Mobile number is required',
              pattern: {
                value: /^5\d{8}$/,
                message: 'Please enter a valid Georgian mobile number (9 digits starting with 5)',
              },
            })}
          />

          <Input
            label="Date of Birth"
            type="date"
            max={maxDob}
            error={errors.dateOfBirth?.message || fieldErrors.dateOfBirth?.[0]}
            isValid={touchedFields.dateOfBirth && !errors.dateOfBirth && !fieldErrors.dateOfBirth}
            {...register('dateOfBirth', {
              required: 'Date of birth is required',
              validate: (value) => {
                if (!value) return true
                const dob = new Date(value)
                if (dob > new Date()) return 'Please enter a valid date of birth'
                const age = Math.floor(
                  (Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
                )
                if (age < 12) return 'You must be at least 12 years old to create an account'
                return true
              },
            })}
          />

          {/* Preferred Venue */}
          <div className="flex flex-col">
            <label htmlFor="preferredVenueId" className="text-label text-txt-primary mb-2">
              Preferred Venue
            </label>
            <select
              id="preferredVenueId"
              {...register('preferredVenueId')}
              className="w-full bg-bg-base border border-bg-elevated rounded-input px-4 py-3 text-body text-txt-primary focus:outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="">Select a venue</option>
              {filterOptions?.venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name} — {venue.city}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!isDirty || !isValid || updateMutation.isPending}
              className="px-6 py-3 rounded-input bg-primary hover:bg-primary-hover text-white font-bold text-btn transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
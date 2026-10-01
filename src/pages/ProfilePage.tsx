import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Input } from '../components/ui/Input'
import { TicketCard } from '../components/profile/TicketCard'
import { RefundModal } from '../components/profile/RefundModal'
import { useAuthStore } from '../features/auth/authStore'
import { useFilterOptions } from '../hooks/useFilterOptions'
import { useUpdateProfile } from '../hooks/useProfile'
import { useTickets } from '../hooks/useTickets'
import { isFieldError } from '../api/client'
import type { ApiError, Order } from '../api/types'

interface ProfileFormValues {
  fullName: string
  email: string
  mobileNumber: string
  dateOfBirth: string
  preferredVenueId: string
}

type Tab = 'personal' | 'tickets'
type TicketsTab = 'upcoming' | 'past'

export function ProfilePage() {
  const { user } = useAuthStore()
  const { data: filterOptions } = useFilterOptions()
  const updateMutation = useUpdateProfile()

  // 🎯 Read/write tab from URL
  const [searchParams, setSearchParams] = useSearchParams()
  const tabParam = searchParams.get('tab')
  const activeTab: Tab = tabParam === 'tickets' || tabParam === 'upcoming' || tabParam === 'past'
    ? 'tickets'
    : 'personal'
  const ticketsTab: TicketsTab = tabParam === 'past' ? 'past' : 'upcoming'

  const setActiveTab = (tab: Tab) => {
    if (tab === 'personal') {
      setSearchParams({})
    } else {
      setSearchParams({ tab: ticketsTab })
    }
  }
  const setTicketsTab = (tab: TicketsTab) => {
    setSearchParams({ tab })
  }

  const [refundOrder, setRefundOrder] = useState<Order | null>(null)

  const [serverError, setServerError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { data: tickets, isLoading: ticketsLoading } = useTickets(ticketsTab)

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
      reset(values)
    } catch (err) {
      const error = err as ApiError
      if (isFieldError(error)) {
        setFieldErrors(error.errors)
      } else {
        setServerError(error.message)
      }
    }
  }

  const today = new Date()
  const maxDob = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate())
    .toISOString()
    .split('T')[0]

  const age = user?.age
  const isComplete = user?.profileComplete
  const canBuyAll = age !== null && age !== undefined && age >= 18

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-hero font-extrabold text-txt-primary mb-4">My Profile</h1>

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

      {/* Top-level tabs */}
      <div className="flex gap-6 border-b border-bg-elevated mb-8">
        <button
          onClick={() => setActiveTab('personal')}
          className={`text-h3 font-extrabold pb-3 -mb-px transition-colors border-b-2 ${
            activeTab === 'personal'
              ? 'text-txt-primary border-primary'
              : 'text-txt-secondary border-transparent hover:text-txt-primary'
          }`}
        >
          Personal Information
        </button>
        <button
          onClick={() => setActiveTab('tickets')}
          className={`text-h3 font-extrabold pb-3 -mb-px transition-colors border-b-2 ${
            activeTab === 'tickets'
              ? 'text-txt-primary border-primary'
              : 'text-txt-secondary border-transparent hover:text-txt-primary'
          }`}
        >
          My Tickets
        </button>
      </div>

      {/* PERSONAL INFORMATION */}
      {activeTab === 'personal' && (
        <div className="max-w-2xl">
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
      )}

      {/* MY TICKETS */}
      {activeTab === 'tickets' && (
        <div>
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setTicketsTab('upcoming')}
              className={`px-4 py-2 rounded-input text-body-sm font-bold transition-colors ${
                ticketsTab === 'upcoming'
                  ? 'bg-primary text-white'
                  : 'bg-bg-surface text-txt-secondary hover:text-txt-primary'
              }`}
            >
              Upcoming {tickets && ticketsTab === 'upcoming' && `(${tickets.length})`}
            </button>
            <button
              onClick={() => setTicketsTab('past')}
              className={`px-4 py-2 rounded-input text-body-sm font-bold transition-colors ${
                ticketsTab === 'past'
                  ? 'bg-primary text-white'
                  : 'bg-bg-surface text-txt-secondary hover:text-txt-primary'
              }`}
            >
              Past {tickets && ticketsTab === 'past' && `(${tickets.length})`}
            </button>
          </div>

          {ticketsLoading && (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-bg-surface rounded-card border border-bg-elevated animate-pulse"
                />
              ))}
            </div>
          )}

          {!ticketsLoading && tickets && tickets.length === 0 && (
            <div className="text-center py-16 bg-bg-surface rounded-card border border-bg-elevated">
              <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#505261" strokeWidth="1.5">
                  <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1a2 2 0 0 0 0 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1a2 2 0 0 0 0-4z" />
                </svg>
              </div>
              <p className="text-h3 font-bold text-txt-primary mb-2">
                {ticketsTab === 'upcoming' ? 'No upcoming tickets' : 'No past tickets'}
              </p>
              <p className="text-body text-txt-secondary mb-6">
                {ticketsTab === 'upcoming'
                  ? 'Browse movies and book your first ticket.'
                  : 'Your past purchases will appear here.'}
              </p>
              {ticketsTab === 'upcoming' && (
                <a
                  href="/sessions"
                  className="inline-block px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-input transition-colors"
                >
                  Browse sessions
                </a>
              )}
            </div>
          )}

          {!ticketsLoading && tickets && tickets.length > 0 && (
            <div className="space-y-4">
              {tickets.map((order) => (
                <TicketCard key={order.id} order={order} onRefund={setRefundOrder} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Refund Modal */}
      <RefundModal order={refundOrder} onClose={() => setRefundOrder(null)} />
    </div>
  )
}
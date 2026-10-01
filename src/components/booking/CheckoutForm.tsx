import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/Input'
import { useBookingStore } from '../../features/booking/bookingStore'
import { usePayOrder } from '../../hooks/useBooking'
import { useAuthStore } from '../../features/auth/authStore'
import { isFieldError } from '../../api/client'
import type { ApiError } from '../../api/types'
import type { SeatHold } from '../../api/types'

interface CheckoutFormValues {
  fullName: string
  email: string
  mobileNumber: string
  cardNumber: string
  expiry: string
  cvv: string
}

interface CheckoutFormProps {
  hold: SeatHold
}

export function CheckoutForm({ hold }: CheckoutFormProps) {
  const { user } = useAuthStore()
  const { setStep } = useBookingStore()
  const payMutation = usePayOrder()
  const [serverError, setServerError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<CheckoutFormValues>({
    mode: 'onBlur',
    defaultValues: {
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
      mobileNumber: user?.mobileNumber ?? '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    },
  })

  const onSubmit = async (values: CheckoutFormValues) => {
    setServerError(null)
    setFieldErrors({})
    try {
      await payMutation.mutateAsync({
        holdId: hold.holdId,
        ...values,
      })
    } catch (err) {
      const error = err as ApiError
      if (isFieldError(error)) {
        setFieldErrors(error.errors)
      } else {
        setServerError(error.message)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="text-h3 font-extrabold text-txt-primary mb-2">Checkout</h3>

      {serverError && (
        <div className="px-3 py-2 rounded-input border border-error bg-error-tint text-body-sm text-error">
          {serverError}
        </div>
      )}

      <Input
        label="Full Name"
        placeholder="Jane Doe"
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
        placeholder="example@gmail.com"
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

      <Input
        label="Mobile Number"
        placeholder="555 123 456"
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
        label="Card Number"
        placeholder="4242 4242 4242 4242"
        error={errors.cardNumber?.message || fieldErrors.cardNumber?.[0]}
        isValid={touchedFields.cardNumber && !errors.cardNumber && !fieldErrors.cardNumber}
        {...register('cardNumber', {
          required: 'Card number is required',
          pattern: {
            value: /^\d{16}$/,
            message: 'Card number must be 16 digits',
          },
        })}
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Expiry"
          placeholder="MM/YY"
          error={errors.expiry?.message || fieldErrors.expiry?.[0]}
          isValid={touchedFields.expiry && !errors.expiry && !fieldErrors.expiry}
          {...register('expiry', {
            required: 'Expiry is required',
            pattern: {
              value: /^(0[1-9]|1[0-2])\/\d{2}$/,
              message: 'Use MM/YY format',
            },
          })}
        />

        <Input
          label="CVV"
          placeholder="123"
          maxLength={3}
          error={errors.cvv?.message || fieldErrors.cvv?.[0]}
          isValid={touchedFields.cvv && !errors.cvv && !fieldErrors.cvv}
          {...register('cvv', {
            required: 'CVV is required',
            pattern: { value: /^\d{3}$/, message: 'CVV must be 3 digits' },
          })}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="px-6 py-3 rounded-input border border-bg-elevated hover:border-txt-secondary text-txt-primary font-bold text-btn transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={payMutation.isPending}
          className="flex-1 py-3 rounded-input bg-primary hover:bg-primary-hover text-white font-bold text-btn transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {payMutation.isPending ? 'Processing...' : `Pay & Complete Order · ₾${hold.subtotal.toFixed(2)}`}
        </button>
      </div>
    </form>
  )
}
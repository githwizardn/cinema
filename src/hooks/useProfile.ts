import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile, type UpdateProfilePayload } from '../api/profile'
import { useAuthStore } from '../features/auth/authStore'

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { setUser } = useAuthStore()

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: (user) => {
      // Update auth store with the fresh user from server
      setUser(user)
      // Invalidate any related queries
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}
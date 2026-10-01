import { useQuery } from '@tanstack/react-query'
import { getFilterOptions } from '../api/catalogue'

export function useFilterOptions() {
  return useQuery({
    queryKey: ['filter-options'],
    queryFn: getFilterOptions,
    // ⚡ INFINITY — არასოდეს არ refetch-ებს
    // Boot-ზე ერთხელ ჩამოიტვირთება და მთელი სესიის განმავლობაში cache-ში რჩება
    staleTime: Infinity,
  })
}
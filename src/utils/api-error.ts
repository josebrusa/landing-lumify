import type { AxiosError } from 'axios'
import type { HttpErrorBody } from '@/types/api'

export function getApiErrorMessage(error: unknown): string {
  const ax = error as AxiosError<HttpErrorBody>
  const data = ax.response?.data
  if (!data?.message) {
    if (ax.response?.status === 429) {
      return 'Too many attempts. Please wait and try again.'
    }
    return ax.message || 'Something went wrong.'
  }
  if (Array.isArray(data.message)) {
    return data.message.join(', ')
  }
  return data.message
}

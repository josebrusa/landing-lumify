import axios, { type AxiosError } from 'axios'
import {
  getAccessToken,
  setAccessToken,
  triggerUnauthorized,
} from './auth-token'

function resolveBaseURL(): string {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim()
  if (!raw) {
    console.warn(
      'VITE_API_BASE_URL is not set; API requests may fail. Use .env with VITE_API_BASE_URL=http://localhost:3000',
    )
    return '/api'
  }
  const base = raw.replace(/\/$/, '')
  return `${base}/api`
}

export const apiClient = axios.create({
  baseURL: resolveBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    const status = error.response?.status
    const url = error.config?.url ?? ''
    const isPublicAuth =
      url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/verify-otp')
    if (status === 401 && !isPublicAuth && getAccessToken()) {
      setAccessToken(null)
      triggerUnauthorized()
    }
    return Promise.reject(error)
  },
)

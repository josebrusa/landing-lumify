import axios from 'axios'

/** URL base del API (Nest). Incluye prefijo global si existe (p. ej. `http://localhost:3000/api`). */
export function getApiBaseUrl(): string {
  return (import.meta.env.VITE_API_BASE_URL?.trim() ?? '').replace(/\/$/, '')
}

/**
 * Cliente Axios compartido: JSON por defecto y rutas relativas al `baseURL`.
 * Registro/login/OTP usan siempre `apiClient.post(...)` (POST), no GET.
 */
export const apiClient = axios.create({
  baseURL: getApiBaseUrl() || undefined,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

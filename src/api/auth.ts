/** Cliente HTTP para endpoints /auth del backend NestJS (Axios). */

import { isAxiosError } from 'axios'
import { apiClient, getApiBaseUrl } from './client'

export interface AuthUser {
  id: string
  email: string
}

export interface RegisterResponse {
  id: string
  email: string
}

export interface LoginResponse {
  challengeId: string
  message: string
}

export interface VerifyOtpResponse {
  access_token: string
}

export class ApiError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

function assertBase(): void {
  if (!getApiBaseUrl()) {
    throw new ApiError('Configura VITE_API_BASE_URL en el archivo .env', 0)
  }
}

function nestMessage(body: unknown): string {
  if (!body || typeof body !== 'object') return ''
  const m = (body as { message?: unknown }).message
  if (typeof m === 'string') return m
  if (Array.isArray(m) && m.every((x) => typeof x === 'string')) return m.join('. ')
  return ''
}

function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err
  if (isAxiosError(err)) {
    const status = err.response?.status ?? 0
    const msg =
      nestMessage(err.response?.data) ||
      err.message ||
      (err.code === 'ERR_NETWORK' ? 'No se pudo conectar con el servidor. Revisa VITE_API_BASE_URL y CORS.' : '') ||
      'Error desconocido'
    return new ApiError(msg, status)
  }
  if (err instanceof Error) return new ApiError(err.message, 0)
  return new ApiError('Ha ocurrido un error', 0)
}

export async function register(email: string, password: string): Promise<RegisterResponse> {
  assertBase()
  try {
    const { data } = await apiClient.post<RegisterResponse>('/auth/register', {
      email: email.trim(),
      password,
    })
    return data
  } catch (e) {
    throw toApiError(e)
  }
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  assertBase()
  try {
    const { data } = await apiClient.post<LoginResponse>('/auth/login', {
      email: email.trim(),
      password,
    })
    return data
  } catch (e) {
    throw toApiError(e)
  }
}

export async function verifyOtp(challengeId: string, code: string): Promise<VerifyOtpResponse> {
  assertBase()
  try {
    const { data } = await apiClient.post<VerifyOtpResponse>('/auth/verify-otp', {
      challengeId,
      code,
    })
    return data
  } catch (e) {
    throw toApiError(e)
  }
}

export async function getMe(accessToken: string): Promise<AuthUser> {
  assertBase()
  try {
    const { data } = await apiClient.get<AuthUser>('/auth/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    return data
  } catch (e) {
    throw toApiError(e)
  }
}

/** Mensaje en español para mostrar en formularios según el endpoint y el código HTTP. */
export function messageForAuthError(
  err: unknown,
  context: 'register' | 'login' | 'verifyOtp' | 'me',
): string {
  if (err instanceof ApiError) {
    const { statusCode, message } = err
    if (context === 'login' && statusCode === 401) {
      return 'Credenciales incorrectas.'
    }
    if (context === 'verifyOtp' && statusCode === 401) {
      return 'Código incorrecto o expirado. Vuelve al inicio de sesión para solicitar uno nuevo.'
    }
    if (context === 'register' && statusCode === 409) {
      return 'Este correo ya está registrado.'
    }
    if (context === 'me' && statusCode === 401) {
      return 'Sesión no válida o expirada.'
    }
    if (message && statusCode !== 0) return message
  }
  if (err instanceof Error && err.message) return err.message
  return 'Ha ocurrido un error. Inténtalo de nuevo.'
}

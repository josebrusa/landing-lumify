import { apiClient } from '@/api/client'
import type {
  LoginBody,
  LoginResponse,
  MeResponse,
  RegisterBody,
  UpdateTwoFactorBody,
  UpdateTwoFactorResponse,
  VerifyOtpBody,
  VerifyOtpResponse,
} from '@/types/api'

export async function login(body: LoginBody): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/login', body)
  return data
}

export async function register(body: RegisterBody): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/auth/register', body)
  return data
}

export async function verifyOtp(body: VerifyOtpBody): Promise<VerifyOtpResponse> {
  const { data } = await apiClient.post<VerifyOtpResponse>('/auth/verify-otp', body)
  return data
}

export async function getMe(): Promise<MeResponse> {
  const { data } = await apiClient.get<MeResponse>('/auth/me')
  return data
}

export async function updateTwoFactor(
  body: UpdateTwoFactorBody,
): Promise<UpdateTwoFactorResponse> {
  const { data } = await apiClient.patch<UpdateTwoFactorResponse>(
    '/auth/me/two-factor',
    body,
  )
  return data
}

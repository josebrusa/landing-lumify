/** Mirrors backend DTOs (NestJS /api). */

export type UserRole = 'admin' | 'user'

export type LoginChallengePurpose = 'signup' | 'login_2fa'

export type LoginResponse =
  | { access_token: string; challengeId?: undefined; message?: undefined; purpose?: undefined }
  | {
      access_token?: undefined
      challengeId: string
      message?: string
      purpose?: LoginChallengePurpose
    }

export interface VerifyOtpResponse {
  access_token: string
}

export interface VerifyOtpBody {
  challengeId: string
  code: string
}

export interface LoginBody {
  email: string
  password: string
}

export interface RegisterBody {
  email: string
  password: string
}

export interface MeResponse {
  id: string
  email: string
  role: UserRole
  twoFactorLoginEnabled: boolean
  emailVerified: boolean
}

export interface UpdateTwoFactorBody {
  enabled: boolean
}

export interface UpdateTwoFactorResponse {
  twoFactorLoginEnabled: boolean
}

export interface InviteUserBody {
  email: string
}

export interface InviteUserResponse {
  id: string
  email: string
  temporaryPassword: string
  challengeId: string
  message: string
}

/** Typical NestJS validation / HTTP exception body */
export interface HttpErrorBody {
  statusCode: number
  message: string | string[]
  error?: string
}

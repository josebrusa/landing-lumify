import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as authApi from '../api/auth'
import type { AuthUser } from '../api/auth'

/** JWT en sessionStorage: se pierde al cerrar la pestaña; reduce persistencia accidental. */
const TOKEN_KEY = 'lumify_access_token'

export type OtpPurpose = 'signup' | 'login_2fa'

function readStoredToken(): string | null {
  if (typeof sessionStorage === 'undefined') return null
  return sessionStorage.getItem(TOKEN_KEY)
}

export type LoginResult = { kind: 'session' } | { kind: 'otp' }

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(readStoredToken())
  /** Solo en memoria: si recargas en OTP, vuelves a login. */
  const challengeId = ref<string | null>(null)
  const otpEmail = ref<string | null>(null)
  const otpPurpose = ref<OtpPurpose | null>(null)
  const user = ref<AuthUser | null>(null)

  const isAuthenticated = computed(() => Boolean(accessToken.value))

  function setAccessToken(token: string | null) {
    accessToken.value = token
    if (typeof sessionStorage === 'undefined') return
    if (token) sessionStorage.setItem(TOKEN_KEY, token)
    else sessionStorage.removeItem(TOKEN_KEY)
  }

  function clearOtpChallenge() {
    challengeId.value = null
    otpEmail.value = null
    otpPurpose.value = null
  }

  async function registerUser(email: string, password: string) {
    const res = await authApi.register(email, password)
    challengeId.value = res.challengeId
    otpEmail.value = email.trim()
    otpPurpose.value = 'signup'
    return res
  }

  async function loginCredentials(email: string, password: string): Promise<LoginResult> {
    const res = await authApi.login(email, password)
    if (authApi.isLoginWithToken(res)) {
      setAccessToken(res.access_token)
      clearOtpChallenge()
      await fetchMe()
      return { kind: 'session' }
    }
    challengeId.value = res.challengeId
    otpEmail.value = email.trim()
    otpPurpose.value = res.purpose === 'signup' ? 'signup' : 'login_2fa'
    return { kind: 'otp' }
  }

  async function verifyOtpCode(code: string) {
    const id = challengeId.value
    if (!id) throw new authApi.ApiError('No hay un reto de verificación activo.', 400)
    const res = await authApi.verifyOtp(id, code)
    setAccessToken(res.access_token)
    clearOtpChallenge()
    await fetchMe()
  }

  async function fetchMe() {
    const token = accessToken.value
    if (!token) {
      user.value = null
      return
    }
    user.value = await authApi.getMe(token)
  }

  async function updateTwoFactorLogin(enabled: boolean) {
    const token = accessToken.value
    if (!token) throw new authApi.ApiError('No hay sesión.', 401)
    const patch = await authApi.patchTwoFactorLogin(token, enabled)
    if (user.value) {
      user.value = { ...user.value, twoFactorLoginEnabled: patch.twoFactorLoginEnabled }
    } else {
      await fetchMe()
    }
  }

  function logout() {
    setAccessToken(null)
    clearOtpChallenge()
    user.value = null
  }

  return {
    accessToken,
    challengeId,
    otpEmail,
    otpPurpose,
    user,
    isAuthenticated,
    registerUser,
    loginCredentials,
    verifyOtpCode,
    fetchMe,
    updateTwoFactorLogin,
    clearOtpChallenge,
    logout,
  }
})

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as authApi from '../api/auth'
import type { AuthUser } from '../api/auth'

/** JWT en sessionStorage: se pierde al cerrar la pestaña; reduce persistencia accidental. */
const TOKEN_KEY = 'lumify_access_token'

function readStoredToken(): string | null {
  if (typeof sessionStorage === 'undefined') return null
  return sessionStorage.getItem(TOKEN_KEY)
}

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(readStoredToken())
  /** Solo en memoria: si recargas en OTP, vuelves a login. */
  const challengeId = ref<string | null>(null)
  const otpEmail = ref<string | null>(null)
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
  }

  async function registerUser(email: string, password: string) {
    await authApi.register(email, password)
  }

  async function loginCredentials(email: string, password: string) {
    const res = await authApi.login(email, password)
    challengeId.value = res.challengeId
    otpEmail.value = email.trim()
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

  function logout() {
    setAccessToken(null)
    clearOtpChallenge()
    user.value = null
  }

  return {
    accessToken,
    challengeId,
    otpEmail,
    user,
    isAuthenticated,
    registerUser,
    loginCredentials,
    verifyOtpCode,
    fetchMe,
    clearOtpChallenge,
    logout,
  }
})

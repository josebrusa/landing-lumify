import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getAccessToken, setAccessToken } from '@/api/auth-token'
import * as authService from '@/services/auth.service'
import type { LoginBody, MeResponse, RegisterBody, UserRole } from '@/types/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const user = ref<MeResponse | null>(null)
  const initialized = ref(false)

  const isAuthenticated = computed(() => Boolean(token.value && user.value))

  function setSession(accessToken: string, profile?: MeResponse | null) {
    token.value = accessToken
    setAccessToken(accessToken)
    if (profile) {
      user.value = profile
    }
  }

  function clearSession() {
    token.value = null
    user.value = null
    setAccessToken(null)
  }

  /** Clear storage only (e.g. 401 from API) */
  function logoutLocal() {
    clearSession()
  }

  async function fetchMe() {
    const me = await authService.getMe()
    user.value = me
    return me
  }

  async function hydrateFromStorage() {
    if (initialized.value) return
    const stored = getAccessToken()
    if (!stored) {
      initialized.value = true
      return
    }
    token.value = stored
    try {
      await fetchMe()
    } catch {
      clearSession()
    } finally {
      initialized.value = true
    }
  }

  async function login(body: LoginBody) {
    return authService.login(body)
  }

  async function register(body: RegisterBody) {
    return authService.register(body)
  }

  async function verifyOtp(challengeId: string, code: string) {
    const { access_token } = await authService.verifyOtp({ challengeId, code })
    setSession(access_token)
    await fetchMe()
  }

  async function logout() {
    clearSession()
  }

  async function setTwoFactorLogin(enabled: boolean) {
    const res = await authService.updateTwoFactor({ enabled })
    if (user.value) {
      user.value = {
        ...user.value,
        twoFactorLoginEnabled: res.twoFactorLoginEnabled,
      }
    }
    return res
  }

  function hasRole(role: UserRole) {
    return user.value?.role === role
  }

  return {
    token,
    user,
    initialized,
    isAuthenticated,
    setSession,
    clearSession,
    logoutLocal,
    hydrateFromStorage,
    login,
    register,
    verifyOtp,
    logout,
    fetchMe,
    setTwoFactorLogin,
    hasRole,
  }
})

const STORAGE_KEY = 'lumify_access_token'

let unauthorizedHandler: (() => void) | null = null

export function setUnauthorizedHandler(handler: () => void) {
  unauthorizedHandler = handler
}

export function triggerUnauthorized() {
  unauthorizedHandler?.()
}

export function getAccessToken(): string | null {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(STORAGE_KEY)
}

export function setAccessToken(token: string | null) {
  if (typeof localStorage === 'undefined') return
  if (token) {
    localStorage.setItem(STORAGE_KEY, token)
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

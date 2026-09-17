import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type CookieConsentValue = 'accepted' | 'declined'

const STORAGE_KEY = 'lumify_cookie_consent'

function readStored(): CookieConsentValue | null {
  if (typeof localStorage === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === 'accepted' || raw === 'declined') return raw
  return null
}

export const useConsentStore = defineStore('consent', () => {
  const status = ref<CookieConsentValue | null>(null)
  const hydrated = ref(false)

  const hasResponded = computed(() => status.value !== null)
  const isAccepted = computed(() => status.value === 'accepted')

  function hydrate() {
    if (hydrated.value) return
    status.value = readStored()
    hydrated.value = true
  }

  function persist(value: CookieConsentValue) {
    status.value = value
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, value)
    }
  }

  function accept() {
    persist('accepted')
  }

  function decline() {
    persist('declined')
  }

  return {
    status,
    hydrated,
    hasResponded,
    isAccepted,
    hydrate,
    accept,
    decline,
  }
})

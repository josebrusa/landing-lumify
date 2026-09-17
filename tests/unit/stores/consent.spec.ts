import { createPinia, setActivePinia } from 'pinia'
import { useConsentStore } from '@/stores/consent'

describe('useConsentStore', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('starts unanswered until hydrate', () => {
    const consent = useConsentStore()
    expect(consent.hasResponded).toBe(false)
    consent.hydrate()
    expect(consent.hasResponded).toBe(false)
  })

  it('persists accept and decline', () => {
    const consent = useConsentStore()
    consent.hydrate()
    consent.accept()
    expect(consent.status).toBe('accepted')
    expect(localStorage.getItem('lumify_cookie_consent')).toBe('accepted')

    consent.decline()
    expect(consent.status).toBe('declined')
    expect(localStorage.getItem('lumify_cookie_consent')).toBe('declined')
  })

  it('hydrates from storage', () => {
    localStorage.setItem('lumify_cookie_consent', 'accepted')
    const consent = useConsentStore()
    consent.hydrate()
    expect(consent.hasResponded).toBe(true)
    expect(consent.isAccepted).toBe(true)
  })
})

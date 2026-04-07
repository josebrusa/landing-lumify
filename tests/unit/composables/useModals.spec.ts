import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import { useModals } from '@/composables/useModals'

function withSetup<T>(composable: () => T): T {
  let result!: T
  const app = createApp({
    setup() {
      result = composable()
      return () => h('div')
    },
  })
  app.use(createPinia())
  app.mount(document.createElement('div'))
  return result
}

describe('useModals', () => {
  it('returns refs and modal functions', () => {
    const api = withSetup(useModals)
    expect(api.currentModalKey).toBeDefined()
    expect(api.isPricingOpen).toBeDefined()
    expect(typeof api.openModal).toBe('function')
    expect(typeof api.closeModal).toBe('function')
    expect(typeof api.openPricingModal).toBe('function')
    expect(typeof api.closePricingModal).toBe('function')
  })

  it('openModal sets currentModalKey', () => {
    const { currentModalKey, openModal, closeModal } = withSetup(useModals)
    expect(currentModalKey.value).toBeNull()
    openModal('assessment')
    expect(currentModalKey.value).toBe('assessment')
    openModal('modelo')
    expect(currentModalKey.value).toBe('modelo')
    closeModal()
    expect(currentModalKey.value).toBeNull()
  })

  it('closeModal clears currentModalKey', () => {
    const { currentModalKey, openModal, closeModal } = withSetup(useModals)
    openModal('pack-datos')
    expect(currentModalKey.value).toBe('pack-datos')
    closeModal()
    expect(currentModalKey.value).toBeNull()
  })

  it('openPricingModal and closePricingModal toggle isPricingOpen', () => {
    const { isPricingOpen, openPricingModal, closePricingModal } = withSetup(useModals)
    expect(isPricingOpen.value).toBe(false)
    openPricingModal()
    expect(isPricingOpen.value).toBe(true)
    closePricingModal()
    expect(isPricingOpen.value).toBe(false)
  })
})

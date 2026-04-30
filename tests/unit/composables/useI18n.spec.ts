import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import { useI18n } from '@/composables/useI18n'

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

describe('useI18n', () => {
  it('returns locale, t and setLocale', () => {
    const { locale, t, setLocale } = withSetup(useI18n)
    expect(locale).toBeDefined()
    expect(typeof t).toBe('function')
    expect(typeof setLocale).toBe('function')
  })

  it('t() returns translation for known key in default locale (es)', () => {
    const { t } = withSetup(useI18n)
    expect(t('nav.services')).toBe('Servicios')
    expect(t('reg.label')).toBe('Acceso a tarifas')
  })

  it('t() returns key when translation is missing', () => {
    const { t } = withSetup(useI18n)
    expect(t('unknown.key')).toBe('unknown.key')
  })

  it('t() replaces placeholders when params are passed', () => {
    const { t } = withSetup(useI18n)
    expect(t('auth.verify.subtitle_signup', { brand: 'Lumify' })).toContain('Lumify')
  })

  it('setLocale changes locale and t() returns correct language', () => {
    const { t, setLocale } = withSetup(useI18n)
    expect(t('nav.services')).toBe('Servicios')

    setLocale('en')
    expect(t('nav.services')).toBe('Services')

    setLocale('ca')
    expect(t('nav.services')).toBe('Serveis')
  })

  it('locale is a computed that reflects current lang', () => {
    const { locale, setLocale } = withSetup(useI18n)
    expect(locale.value).toBe('es')
    setLocale('en')
    expect(locale.value).toBe('en')
  })
})

import { storeToRefs } from 'pinia'
import { useLocaleStore } from '../stores/locale'
import { translations, type Lang } from '../data/translations'

export function useI18n() {
  const localeStore = useLocaleStore()
  const { lang: locale } = storeToRefs(localeStore)

  function t(key: string, params?: Record<string, string>): string {
    const lang = localeStore.lang
    const map = translations[lang]
    let s = map[key] ?? key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        s = s.replaceAll(`{${k}}`, v)
      }
    }
    return s
  }

  function setLocale(lang: Lang) {
    localeStore.setLang(lang)
  }

  return { locale, t, setLocale }
}

import { computed } from 'vue'
import { useLocaleStore } from '../stores/locale'
import { translations, type Lang } from '../data/translations'

export function useI18n() {
  const localeStore = useLocaleStore()

  const locale = computed(() => localeStore.lang)

  function t(key: string): string {
    const lang = localeStore.lang
    const map = translations[lang]
    return map[key] ?? key
  }

  function setLocale(lang: Lang) {
    localeStore.setLang(lang)
  }

  return { locale, t, setLocale }
}

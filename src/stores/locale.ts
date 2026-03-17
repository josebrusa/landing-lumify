import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Lang } from '../data/translations'

export const useLocaleStore = defineStore('locale', () => {
  const lang = ref<Lang>('es')

  function setLang(newLang: Lang) {
    lang.value = newLang
  }

  return { lang, setLang }
})

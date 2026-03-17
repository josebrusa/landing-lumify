<script setup lang="ts">
import { watch } from 'vue'
import { useLocaleStore } from './stores/locale'

const localeStore = useLocaleStore()

function syncHtmlLang(lang: string) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang
  }
}

syncHtmlLang(localeStore.lang)
watch(() => localeStore.lang, syncHtmlLang)
</script>

<template>
  <RouterView />
</template>

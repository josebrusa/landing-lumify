<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import Footer from './components/layout/Footer.vue'
import Modal from './components/modals/Modal.vue'
import PricingModal from './components/modals/PricingModal.vue'
import { useLocaleStore } from './stores/locale'

const localeStore = useLocaleStore()
const route = useRoute()
const showSiteFooter = computed(() => route.matched.some((r) => r.meta.siteFooter))

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
  <template v-if="showSiteFooter">
    <Footer />
    <Modal />
    <PricingModal />
  </template>
</template>

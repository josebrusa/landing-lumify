import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ModalKey } from '../data/modalData'

export const useModalStore = defineStore('modal', () => {
  const currentModalKey = ref<ModalKey | null>(null)
  const isPricingOpen = ref(false)

  function openModal(key: ModalKey) {
    currentModalKey.value = key
  }

  function closeModal() {
    currentModalKey.value = null
  }

  function openPricingModal() {
    isPricingOpen.value = true
  }

  function closePricingModal() {
    isPricingOpen.value = false
  }

  return {
    currentModalKey,
    isPricingOpen,
    openModal,
    closeModal,
    openPricingModal,
    closePricingModal,
  }
})

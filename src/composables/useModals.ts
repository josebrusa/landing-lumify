import { storeToRefs } from 'pinia'
import { useModalStore } from '../stores/modal'
import type { ModalKey } from '../data/modalData'

export function useModals() {
  const modalStore = useModalStore()
  const { currentModalKey, isPricingOpen } = storeToRefs(modalStore)

  function openModal(key: ModalKey) {
    modalStore.openModal(key)
  }

  function closeModal() {
    modalStore.closeModal()
  }

  function openPricingModal() {
    modalStore.openPricingModal()
  }

  function closePricingModal() {
    modalStore.closePricingModal()
  }

  return {
    currentModalKey,
    isPricingOpen,
    openModal,
    closeModal,
    openPricingModal,
    closePricingModal,
  }
}

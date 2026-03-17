<script setup lang="ts">
import { computed, ref } from 'vue'
import { PhX } from '@phosphor-icons/vue'
import { useModals } from '../../composables/useModals'
import { useI18n } from '../../composables/useI18n'
import { useFocusTrap } from '../../composables/useFocusTrap'
import { modalData } from '../../data/modalData'
import type { ModalKey } from '../../data/modalData'

const { currentModalKey, closeModal, openPricingModal } = useModals()
const { locale, t } = useI18n()

const modalRef = ref<HTMLElement | null>(null)
const isModalOpen = computed(() => !!currentModalKey.value)
useFocusTrap(modalRef, isModalOpen)

const entry = computed(() => {
  const key = currentModalKey.value
  if (!key) return null
  return modalData[key as ModalKey] ?? null
})

function handleOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList?.contains('modal-overlay')) closeModal()
}
</script>

<template>
  <div
    v-show="currentModalKey"
    class="modal-overlay fixed inset-0 z-500 bg-[rgba(6,14,20,0.2)] backdrop-blur-md overflow-y-auto flex justify-center items-start sm:items-center px-4 py-6 sm:px-5 sm:py-10"
    :class="{ open: !!currentModalKey }"
    @click="handleOverlayClick"
  >
    <div
      v-if="entry"
      ref="modalRef"
      class="modal w-full max-w-[700px] bg-white rounded-[24px] p-6 sm:p-10 md:p-[52px_48px] relative animate-[modalIn_0.35s_ease]"
      role="dialog"
      aria-modal="true"
      @click.stop
    >
      <button
        type="button"
        class="absolute top-5 right-5 min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-gray-light border-none cursor-pointer flex items-center justify-center text-lg text-text-muted transition-colors hover:bg-gray-dark hover:text-white"
        aria-label="Cerrar"
        @click="closeModal()"
      >
        <PhX :size="20" weight="bold" />
      </button>
      <span
        class="inline-block py-1.5 px-3.5 rounded-full bg-blue/10 text-blue text-xs font-bold uppercase tracking-wider mb-4"
      >
        {{ entry.tag[locale] }}
      </span>
      <h2 class="font-heading text-[1.9rem] font-extrabold text-deep leading-tight tracking-tight mb-4">
        {{ entry.title[locale] }}
      </h2>
      <p class="text-[1.05rem] text-text-muted leading-[1.7] mb-7 pb-7 border-b border-gray-light">
        {{ entry.lead[locale] }}
      </p>
      <div class="modal-deliverables">
        <h4 class="text-[0.85rem] font-bold tracking-wider uppercase text-deep mb-4">{{ t('modal.entregables') }}</h4>
        <ul class="list-none mb-7">
          <li
            v-for="(d, i) in entry.deliverables[locale]"
            :key="i"
            class="text-[0.95rem] text-text-muted py-2 border-b border-gray-light last:border-0"
          >
            {{ d }}
          </li>
        </ul>
      </div>
      <p class="text-[0.87rem] text-text-muted mb-7 flex items-center gap-2">
        <strong class="text-deep">{{ t('modal.duracion') }}:</strong> {{ entry.duration[locale] }}
      </p>
      <button
        type="button"
        class="modal-cta w-full min-h-[44px] flex items-center justify-center py-4 rounded-full bg-blue text-white border-none text-center font-bold text-base cursor-pointer transition-all hover:bg-[#5aaeff] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(60,157,255,0.35)]"
        @click="closeModal(); openPricingModal()"
      >
        {{ t('modal.pricingCta') }}
      </button>
    </div>
  </div>
</template>

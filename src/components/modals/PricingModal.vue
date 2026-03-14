<script setup lang="ts">
import { ref } from 'vue'
import { PhX, PhLock } from '@phosphor-icons/vue'
import { useModals } from '../../composables/useModals'
import { useI18n } from '../../composables/useI18n'

const { isPricingOpen, closePricingModal } = useModals()
const { t } = useI18n()

const company = ref('')
const email = ref('')
const submitted = ref(false)

function handleOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList?.contains('pricing-overlay')) closePricingModal()
}

function onSubmit() {
  submitted.value = true
  company.value = ''
  email.value = ''
  setTimeout(() => {
    closePricingModal()
    submitted.value = false
  }, 2500)
}
</script>

<template>
  <div
    v-show="isPricingOpen"
    class="pricing-overlay fixed inset-0 z-600 bg-[rgba(6,14,20,0.2)] backdrop-blur-xl flex items-center justify-center p-6"
    :class="{ open: isPricingOpen }"
    @click="handleOverlayClick"
  >
    <div
      class="pricing-modal w-full max-w-[500px] bg-white rounded-[24px] p-12 py-11 relative text-center animate-[modalIn_0.35s_ease]"
      role="dialog"
      aria-modal="true"
      @click.stop
    >
      <button
        type="button"
        class="pm-close absolute top-[18px] right-[18px] w-[34px] h-[34px] rounded-full bg-gray-light border-none cursor-pointer flex items-center justify-center text-base text-text-muted transition-colors hover:bg-gray-dark hover:text-white"
        aria-label="Cerrar"
        @click="closePricingModal()"
      >
        <PhX :size="18" weight="bold" />
      </button>
      <div class="flex justify-center mb-4 text-blue">
        <PhLock :size="40" weight="regular" />
      </div>
      <h3 class="font-heading text-[1.6rem] font-extrabold text-deep mb-2.5 tracking-tight">
        {{ t('pm.title') }}
      </h3>
      <p class="text-[0.97rem] text-text-muted leading-[1.6] mb-7">
        {{ t('pm.desc') }}
      </p>
      <div class="pm-perks flex flex-col gap-2 mb-7 text-left">
        <div class="pm-perk flex items-center gap-2.5 text-[0.9rem] text-text-muted before:content-['✓'] before:text-blue before:font-bold before:shrink-0">
          {{ t('pm.p1') }}
        </div>
        <div class="pm-perk flex items-center gap-2.5 text-[0.9rem] text-text-muted before:content-['✓'] before:text-blue before:font-bold before:shrink-0">
          {{ t('pm.p2') }}
        </div>
        <div class="pm-perk flex items-center gap-2.5 text-[0.9rem] text-text-muted before:content-['✓'] before:text-blue before:font-bold before:shrink-0">
          {{ t('pm.p3') }}
        </div>
      </div>
      <form v-if="!submitted" class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <input
          v-model="company"
          type="text"
          :placeholder="t('reg.company')"
          class="py-3.5 px-4 border-[1.5px] border-gray-light rounded-xl text-[0.95rem] outline-none transition-[border-color] focus:border-blue text-deep"
        />
        <input
          v-model="email"
          type="email"
          :placeholder="t('reg.email')"
          required
          class="py-3.5 px-4 border-[1.5px] border-gray-light rounded-xl text-[0.95rem] outline-none transition-[border-color] focus:border-blue text-deep"
        />
        <button
          type="submit"
          class="py-4 rounded-full bg-blue text-white border-none cursor-pointer font-bold text-base font-sans transition-all hover:bg-[#5aaeff] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(60,157,255,0.35)]"
        >
          {{ t('pm.submit') }}
        </button>
      </form>
      <p v-else class="text-green-600 font-medium">
        {{ t('pm.success') }}
      </p>
      <p v-if="!submitted" class="pm-note text-[0.75rem] text-text-muted mt-3">
        {{ t('pm.note') }}
      </p>
    </div>
  </div>
</template>

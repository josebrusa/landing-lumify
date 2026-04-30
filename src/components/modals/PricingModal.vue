<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { PhX, PhLock } from '@phosphor-icons/vue'
import { useModals } from '../../composables/useModals'
import { useI18n } from '../../composables/useI18n'
import { useFocusTrap } from '../../composables/useFocusTrap'
import { useLeadsStore, type LeadInterestType } from '../../stores/leads'

const { isPricingOpen, closePricingModal } = useModals()
const { t } = useI18n()
const leads = useLeadsStore()
const route = useRoute()

const pricingModalRef = ref<HTMLElement | null>(null)
const isOpen = computed(() => isPricingOpen.value)
useFocusTrap(pricingModalRef, isOpen)

const company = ref('')
const email = ref('')
const submitted = ref(false)
const errors = ref<{ email?: string }>({})
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function handleOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList?.contains('pricing-overlay')) closePricingModal()
}

function resolveFallbackInterest(): LeadInterestType {
  return route.path.startsWith('/training') ? 'pim_training' : 'pim_service'
}

function validate(): boolean {
  const next: { email?: string } = {}
  if (!email.value.trim()) {
    next.email = t('reg.error_required')
  } else if (!emailRegex.test(email.value.trim())) {
    next.email = t('reg.error_email_invalid')
  }
  errors.value = next
  return Object.keys(next).length === 0
}

function clearError(field: 'email') {
  if (errors.value[field]) {
    const next = { ...errors.value }
    delete next[field]
    errors.value = next
  }
}

async function onSubmit() {
  if (!validate()) return
  try {
    const fallbackInterest = resolveFallbackInterest()
    const isTraining = fallbackInterest === 'pim_training'
    await leads.createLead({
      company: company.value,
      email: email.value,
      fallbackInterest,
      fallbackContext: {
        sourcePage: isTraining ? 'training' : 'home',
        sourceSection: isTraining ? 'training_pricing_modal' : 'home_pricing_modal',
        sourceCardId: 'pricing_modal',
        sourceCta: 'pricing_modal_submit',
      },
    })
    submitted.value = true
    company.value = ''
    email.value = ''
    errors.value = {}
    setTimeout(() => {
      closePricingModal()
      submitted.value = false
    }, 2500)
  } catch {
    // leads.createLeadError is handled by store
  }
}
</script>

<template>
  <div
    v-show="isPricingOpen"
    class="pricing-overlay fixed inset-0 z-600 bg-[rgba(6,14,20,0.2)] backdrop-blur-xl flex justify-center items-start sm:items-center overflow-y-auto px-4 py-6 sm:p-6"
    :class="{ open: isPricingOpen }"
    @click="handleOverlayClick"
  >
    <div
      ref="pricingModalRef"
      class="pricing-modal w-full max-w-[500px] bg-white rounded-[24px] p-6 py-8 sm:p-10 sm:py-11 relative text-center animate-[modalIn_0.35s_ease]"
      role="dialog"
      aria-modal="true"
      @click.stop
    >
      <button
        type="button"
        class="pm-close absolute top-[18px] right-[18px] min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-gray-light border-none cursor-pointer flex items-center justify-center text-base text-text-muted transition-colors hover:bg-gray-dark hover:text-white"
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
      <p v-if="leads.createLeadError" class="mb-4 text-sm text-red-500" role="alert">
        {{ leads.createLeadError || t('reg.lead_submit_error') }}
      </p>
      <form v-if="!submitted" class="flex flex-col gap-3" @submit.prevent="onSubmit">
        <input
          v-model="company"
          type="text"
          :placeholder="t('reg.company')"
          class="min-h-[44px] py-3.5 px-4 border-[1.5px] border-gray-light rounded-xl text-[0.95rem] outline-none transition-[border-color] focus:border-blue text-deep"
        />
        <div class="flex flex-col gap-1">
          <input
            v-model="email"
            type="email"
            :placeholder="t('reg.email')"
            :aria-invalid="!!errors.email"
            :aria-describedby="errors.email ? 'pricing-email-error' : undefined"
            :aria-required="true"
            required
            class="min-h-[44px] py-3.5 px-4 border-[1.5px] border-gray-light rounded-xl text-[0.95rem] outline-none transition-[border-color] focus:border-blue text-deep"
            @input="clearError('email')"
          />
          <p
            v-if="errors.email"
            id="pricing-email-error"
            class="text-left text-sm text-red-500"
            role="alert"
          >
            {{ errors.email }}
          </p>
        </div>
        <button
          type="submit"
          :disabled="leads.createLeadSubmitting"
          class="min-h-[44px] flex items-center justify-center py-4 rounded-full bg-blue text-white border-none cursor-pointer font-bold text-base font-sans transition-all hover:bg-[#5aaeff] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(60,157,255,0.35)]"
        >
          {{ leads.createLeadSubmitting ? t('reg.submitting') : t('pm.submit') }}
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

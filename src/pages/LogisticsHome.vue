<script setup lang="ts">
import { ref } from 'vue'
import { PhX, PhEnvelopeSimple } from '@phosphor-icons/vue'
import AppNav from '../components/layout/AppNav.vue'
import { useI18n } from '../composables/useI18n'
import { useScrollReveal } from '../composables/useScrollReveal'
import { useFocusTrap } from '../composables/useFocusTrap'
import { useLeadsStore } from '../stores/leads'
import { logisticsAttribution } from '../data/leadAttribution'
import PrivacyFormNote from '../components/legal/PrivacyFormNote.vue'

useScrollReveal('.reveal')

const { t } = useI18n()
const leads = useLeadsStore()

const isContactOpen = ref(false)
const contactModalRef = ref<HTMLElement | null>(null)
useFocusTrap(contactModalRef, isContactOpen)

const company = ref('')
const email = ref('')
const submitted = ref(false)
const errors = ref<{ email?: string }>({})
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function openContactModal() {
  isContactOpen.value = true
  submitted.value = false
}

function closeContactModal() {
  isContactOpen.value = false
}

function handleOverlayClick(e: MouseEvent) {
  if ((e.target as HTMLElement).classList?.contains('logistics-contact-overlay')) {
    closeContactModal()
  }
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
    await leads.createLead({
      company: company.value,
      email: email.value,
      fallbackInterest: 'logistics_service',
      fallbackContext: {
        sourcePage: 'logistics',
        sourceSection: logisticsAttribution.sourceSection,
        sourceCardId: logisticsAttribution.sourceCardId,
        sourceCta: logisticsAttribution.sourceCta,
      },
    })
    submitted.value = true
    company.value = ''
    email.value = ''
    errors.value = {}
    setTimeout(() => {
      closeContactModal()
      submitted.value = false
    }, 2500)
  } catch {
    // createLeadError set in store
  }
}
</script>

<template>
  <div class="min-h-screen bg-deep text-white font-sans overflow-x-hidden">
    <AppNav />

    <!-- ── HERO ──────────────────────────────────────────────── -->
    <section class="min-h-screen bg-deep relative overflow-hidden flex flex-col justify-center items-center text-center px-[5%] pt-[120px] pb-20">
      <div class="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(60,157,255,0.14)_0%,transparent_65%)]" />
      <div class="absolute inset-0 z-0 opacity-[0.06] bg-size-[60px_60px] bg-[linear-gradient(rgba(60,157,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(60,157,255,0.5)_1px,transparent_1px)]" />
      <div class="relative z-10 max-w-[720px] mx-auto">
        <div class="inline-flex items-center gap-2 bg-blue/15 border border-blue/35 text-blue py-1.5 px-4 rounded-full text-xs font-semibold tracking-widest uppercase mb-7 animate-[fadeUp_0.8s_ease_both]">
          <span class="w-1.5 h-1.5 bg-blue rounded-full animate-[pulse_2s_infinite]" />
          {{ t('log.eyebrow') }}
        </div>
        <h1 class="font-heading text-[clamp(2.2rem,5.5vw,3.8rem)] font-extrabold text-white leading-[1.1] tracking-[-1.2px] mb-6 animate-[fadeUp_0.8s_0.1s_ease_both]">
          {{ t('log.hero.title') }}
        </h1>
        <p class="text-lg text-white/65 leading-[1.75] max-w-[560px] mx-auto mb-10 font-light animate-[fadeUp_0.8s_0.2s_ease_both]">
          {{ t('log.hero.desc') }}
        </p>
        <button
          type="button"
          class="inline-flex items-center gap-2 bg-blue text-white py-4 px-8 rounded-full font-semibold text-base border-none cursor-pointer font-sans transition-all duration-[0.25s] hover:bg-[#5aaeff] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(60,157,255,0.4)] animate-[fadeUp_0.8s_0.3s_ease_both]"
          @click="openContactModal"
        >
          {{ t('log.hero.cta') }}
        </button>
      </div>
    </section>

    <!-- ── SERVICES ──────────────────────────────────────────── -->
    <section id="servicios" class="py-[100px] px-[5%] bg-surface">
      <div class="max-w-[1000px] mx-auto">
        <div class="text-center mb-14 reveal">
          <div class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3">{{ t('log.servs.label') }}</div>
          <h2 class="font-heading text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-deep leading-[1.1] tracking-[-0.8px]">
            {{ t('log.servs.title') }}
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white border border-gray-light rounded-[18px] p-7 reveal">
            <div class="w-12 h-12 rounded-xl bg-blue/15 border border-blue/25 flex items-center justify-center mb-5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="text-blue">
                <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <h3 class="font-heading text-lg font-bold text-deep mb-2">{{ t('log.s1.title') }}</h3>
            <p class="text-sm text-text-muted leading-relaxed">{{ t('log.s1.desc') }}</p>
          </div>
          <div class="bg-white border border-gray-light rounded-[18px] p-7 reveal">
            <div class="w-12 h-12 rounded-xl bg-blue/15 border border-blue/25 flex items-center justify-center mb-5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="text-blue">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
            </div>
            <h3 class="font-heading text-lg font-bold text-deep mb-2">{{ t('log.s2.title') }}</h3>
            <p class="text-sm text-text-muted leading-relaxed">{{ t('log.s2.desc') }}</p>
          </div>
          <div class="bg-white border border-gray-light rounded-[18px] p-7 reveal">
            <div class="w-12 h-12 rounded-xl bg-blue/15 border border-blue/25 flex items-center justify-center mb-5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="text-blue">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <h3 class="font-heading text-lg font-bold text-deep mb-2">{{ t('log.s3.title') }}</h3>
            <p class="text-sm text-text-muted leading-relaxed">{{ t('log.s3.desc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CONTACT ────────────────────────────────────────────── -->
    <section id="contacto" class="py-[100px] px-[5%] bg-[linear-gradient(135deg,#0a3d62_0%,#0d4f7e_60%,#0a3558_100%)] relative overflow-hidden">
      <div class="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_70%_70%_at_80%_50%,rgba(60,157,255,0.15)_0%,transparent_70%)]" />
      <div class="relative z-10 max-w-[700px] mx-auto text-center">
        <div class="reveal">
          <div class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3">{{ t('log.contact.label') }}</div>
          <h2 class="font-heading text-[clamp(1.8rem,4vw,2.6rem)] font-extrabold text-white leading-[1.1] tracking-[-0.8px] mb-4">
            {{ t('log.contact.title') }}
          </h2>
          <p class="text-base text-white/70 leading-[1.75] mb-8">{{ t('log.contact.desc') }}</p>
          <button
            type="button"
            class="inline-flex items-center gap-2 bg-blue text-white py-4 px-8 rounded-full font-semibold text-base border-none cursor-pointer font-sans transition-all duration-[0.25s] hover:bg-[#5aaeff] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(60,157,255,0.4)] mb-10"
            @click="openContactModal"
          >
            {{ t('log.contact.formCta') }}
          </button>
        </div>
        <div class="flex flex-col sm:flex-row gap-5 justify-center reveal">
          <a
            href="tel:+34679818935"
            class="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-7 py-5 no-underline transition-all hover:bg-white/15 hover:border-blue/40"
          >
            <div class="w-10 h-10 rounded-xl bg-blue/20 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.65 4.4 2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div class="text-left">
              <div class="text-xs text-white/50 uppercase tracking-wider font-medium">{{ t('log.contact.phone') }}</div>
              <div class="text-white font-semibold text-lg">679 818 935</div>
            </div>
          </a>
          <a
            href="mailto:logistics@lumify.es"
            class="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-7 py-5 no-underline transition-all hover:bg-white/15 hover:border-blue/40"
          >
            <div class="w-10 h-10 rounded-xl bg-blue/20 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div class="text-left">
              <div class="text-xs text-white/50 uppercase tracking-wider font-medium">{{ t('log.contact.email') }}</div>
              <div class="text-white font-semibold text-base">logistics@lumify.es</div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- ── CONTACT MODAL ─────────────────────────────────────── -->
    <div
      v-show="isContactOpen"
      class="logistics-contact-overlay fixed inset-0 z-600 bg-[rgba(6,14,20,0.2)] backdrop-blur-xl flex justify-center items-start sm:items-center overflow-y-auto px-4 py-6 sm:p-6"
      @click="handleOverlayClick"
    >
      <div
        ref="contactModalRef"
        class="w-full max-w-[500px] bg-white rounded-[24px] p-6 py-8 sm:p-10 sm:py-11 relative text-center animate-[modalIn_0.35s_ease]"
        role="dialog"
        aria-modal="true"
        @click.stop
      >
        <button
          type="button"
          class="absolute top-[18px] right-[18px] min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-gray-light border-none cursor-pointer flex items-center justify-center text-base text-text-muted transition-colors hover:bg-gray-dark hover:text-white"
          aria-label="Close"
          @click="closeContactModal"
        >
          <PhX :size="18" weight="bold" />
        </button>
        <div class="flex justify-center mb-4 text-blue">
          <PhEnvelopeSimple :size="40" weight="regular" />
        </div>
        <h3 class="font-heading text-[1.6rem] font-extrabold text-deep mb-2.5 tracking-tight">
          {{ t('log.modal.title') }}
        </h3>
        <p class="text-[0.97rem] text-text-muted leading-[1.6] mb-7">
          {{ t('log.modal.desc') }}
        </p>
        <div class="flex flex-col gap-2 mb-7 text-left">
          <div class="flex items-center gap-2.5 text-[0.9rem] text-text-muted before:content-['✓'] before:text-blue before:font-bold before:shrink-0">
            {{ t('log.modal.perk1') }}
          </div>
          <div class="flex items-center gap-2.5 text-[0.9rem] text-text-muted before:content-['✓'] before:text-blue before:font-bold before:shrink-0">
            {{ t('log.modal.perk2') }}
          </div>
          <div class="flex items-center gap-2.5 text-[0.9rem] text-text-muted before:content-['✓'] before:text-blue before:font-bold before:shrink-0">
            {{ t('log.modal.perk3') }}
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
            autocomplete="organization"
            class="min-h-[44px] py-3.5 px-4 border-[1.5px] border-gray-light rounded-xl text-[0.95rem] outline-none transition-[border-color] focus:border-blue text-deep"
          />
          <div class="flex flex-col gap-1">
            <input
              v-model="email"
              type="email"
              :placeholder="t('reg.email')"
              :aria-invalid="!!errors.email"
              :aria-describedby="errors.email ? 'logistics-email-error' : undefined"
              :aria-required="true"
              required
              autocomplete="email"
              class="min-h-[44px] py-3.5 px-4 border-[1.5px] border-gray-light rounded-xl text-[0.95rem] outline-none transition-[border-color] focus:border-blue text-deep"
              @input="clearError('email')"
            />
            <p
              v-if="errors.email"
              id="logistics-email-error"
              class="text-left text-sm text-red-500"
              role="alert"
            >
              {{ errors.email }}
            </p>
          </div>
          <button
            type="submit"
            :disabled="leads.createLeadSubmitting"
            class="min-h-[44px] flex items-center justify-center py-4 rounded-full bg-blue text-white border-none cursor-pointer font-bold text-base font-sans transition-all hover:bg-[#5aaeff] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(60,157,255,0.35)] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ leads.createLeadSubmitting ? t('reg.submitting') : t('log.modal.submit') }}
          </button>
        </form>
        <p v-else class="text-green-600 font-medium">
          {{ t('log.modal.success') }}
        </p>
        <p v-if="!submitted" class="text-[0.75rem] text-text-muted mt-3">
          {{ t('log.modal.note') }}
        </p>
        <div v-if="!submitted" class="mt-2">
          <PrivacyFormNote tone="light" />
        </div>
      </div>
    </div>

  </div>
</template>

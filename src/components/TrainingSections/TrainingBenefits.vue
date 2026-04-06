<script setup lang="ts">
import { ref } from 'vue'
import { PhClipboard, PhChartBar, PhTarget } from '@phosphor-icons/vue'
import { useI18n } from '../../composables/useI18n'

const { t } = useI18n()

const items = [
  { titleKey: 'train.ben.b1t', descKey: 'train.ben.b1d' },
  { titleKey: 'train.ben.b2t', descKey: 'train.ben.b2d' },
  { titleKey: 'train.ben.b3t', descKey: 'train.ben.b3d' },
] as const

const perks = [
  { key: 'train.cta.p1', icon: PhClipboard },
  { key: 'train.cta.p2', icon: PhChartBar },
  { key: 'train.cta.p3', icon: PhTarget },
]

const company = ref('')
const email = ref('')
const submitted = ref(false)
const errors = ref<{ email?: string }>({})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

function onSubmit() {
  if (!validate()) return
  submitted.value = true
  company.value = ''
  email.value = ''
  errors.value = {}
}

function clearError(field: 'email') {
  if (errors.value[field]) {
    const next = { ...errors.value }
    delete next[field]
    errors.value = next
  }
}
</script>

<template>
  <section class="py-[72px] px-[5%] bg-surface">
    <div class="max-w-[1100px] mx-auto">
      <div class="mb-10 md:mb-12 text-center md:text-left reveal">
        <div class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">{{ t('train.ben.label') }}</div>
        <h2
          class="font-heading text-[clamp(1.5rem,3vw,2rem)] font-extrabold text-deep leading-tight mb-3 max-w-[640px] mx-auto md:mx-0"
        >
          {{ t('train.ben.title') }}
        </h2>
        <p class="text-base text-text-muted leading-[1.75] max-w-[560px] mx-auto md:mx-0">
          {{ t('train.ben.lead') }}
        </p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 reveal">
        <div
          v-for="item in items"
          :key="item.titleKey"
          class="rounded-radius bg-white border border-gray-light/80 p-7 shadow-[0_8px_40px_rgba(31,42,55,0.05)]"
        >
          <h3 class="text-[1.05rem] font-bold text-deep mb-2">{{ t(item.titleKey) }}</h3>
          <p class="text-[0.92rem] text-text-muted leading-[1.65]">{{ t(item.descKey) }}</p>
        </div>
      </div>
    </div>
  </section>

  <section
    id="cta-formacion"
    class="py-[100px] px-[5%] relative overflow-hidden bg-[linear-gradient(135deg,#0a3d62_0%,#0d4f7e_60%,#0a3558_100%)]"
  >
    <div
      class="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_70%_70%_at_80%_50%,rgba(60,157,255,0.15)_0%,transparent_70%)]"
    />
    <div class="relative z-10 max-w-[700px] mx-auto text-center">
      <div class="reveal">
        <div class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">{{ t('train.cta.label') }}</div>
        <h2
          class="font-heading text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold text-white leading-[1.1] tracking-[-0.8px]"
        >
          {{ t('train.cta.title') }}
        </h2>
        <p class="text-base text-white/70 leading-[1.75] mt-4 mb-12">
          {{ t('train.cta.desc') }}
        </p>
      </div>
      <div class="flex justify-center gap-8 flex-wrap mb-10 reveal">
        <div
          v-for="p in perks"
          :key="p.key"
          class="flex items-center gap-2 text-white/65 text-[0.87rem]"
        >
          <div class="w-7 h-7 rounded-full bg-blue/20 flex items-center justify-center shrink-0 text-blue">
            <component :is="p.icon" :size="16" weight="regular" />
          </div>
          {{ t(p.key) }}
        </div>
      </div>
      <form
        v-if="!submitted"
        class="flex gap-3 flex-wrap justify-center reveal"
        @submit.prevent="onSubmit"
      >
        <div class="flex-1 min-w-[240px] max-w-[340px] flex flex-col gap-1">
          <label for="training-cta-company" class="sr-only">{{ t('reg.company') }}</label>
          <input
            id="training-cta-company"
            v-model="company"
            type="text"
            :placeholder="t('reg.company')"
            autocomplete="organization"
            class="w-full py-4 px-5 rounded-full border-[1.5px] border-white/20 bg-white/10 text-white text-[0.95rem] outline-none transition-[border-color] focus:border-blue placeholder:text-white/40"
          />
        </div>
        <div class="flex-1 min-w-[240px] max-w-[340px] flex flex-col gap-1">
          <label for="training-cta-email" class="sr-only">{{ t('reg.email') }}</label>
          <input
            id="training-cta-email"
            v-model="email"
            type="email"
            :placeholder="t('reg.email')"
            :aria-invalid="!!errors.email"
            :aria-describedby="errors.email ? 'training-cta-email-error' : undefined"
            :aria-required="true"
            autocomplete="email"
            required
            class="w-full py-4 px-5 rounded-full border-[1.5px] border-white/20 bg-white/10 text-white text-[0.95rem] outline-none transition-[border-color] focus:border-blue placeholder:text-white/40"
            @input="clearError('email')"
          />
          <p
            v-if="errors.email"
            id="training-cta-email-error"
            class="text-sm text-red-300"
            role="alert"
          >
            {{ errors.email }}
          </p>
        </div>
        <button
          type="submit"
          class="min-h-[44px] inline-flex items-center justify-center py-4 px-8 rounded-full bg-blue text-white border-none cursor-pointer font-bold text-[0.95rem] font-sans transition-all hover:bg-[#5aaeff] hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(60,157,255,0.4)] whitespace-nowrap"
        >
          {{ t('train.cta.btn') }}
        </button>
      </form>
      <p v-else class="text-white/90 font-medium reveal">
        ✓ {{ t('train.cta.success') }}
      </p>
      <p v-if="!submitted" class="mt-4 text-[0.8rem] text-white/40 reveal">
        {{ t('train.cta.note') }}
      </p>
    </div>
  </section>
</template>

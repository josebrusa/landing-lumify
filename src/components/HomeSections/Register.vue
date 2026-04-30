<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from '../../composables/useI18n'
import { useLeadsStore } from '../../stores/leads'
import { PhClipboard, PhChartBar, PhTarget } from '@phosphor-icons/vue'

const { t } = useI18n()
const leads = useLeadsStore()

const company = ref('')
const email = ref('')
const submitted = ref(false)
const errors = ref<{ email?: string }>({})

const perks = [
  { key: 'reg.p1', icon: PhClipboard },
  { key: 'reg.p2', icon: PhChartBar },
  { key: 'reg.p3', icon: PhTarget },
]

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(): boolean {
  const next: { company?: string; email?: string } = {}
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
  leads.createLead({
    company: company.value,
    email: email.value,
    fallbackInterest: 'pim_service',
  })
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
  <section
    id="registro"
    class="py-[100px] px-[5%] relative overflow-hidden bg-[linear-gradient(135deg,#0a3d62_0%,#0d4f7e_60%,#0a3558_100%)]"
  >
    <div
      class="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_70%_70%_at_80%_50%,rgba(60,157,255,0.15)_0%,transparent_70%)]"
    />
    <div class="relative z-10 max-w-[700px] mx-auto text-center">
      <div class="reveal">
        <div class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">{{ t('reg.label') }}</div>
        <h2 class="font-heading text-[clamp(1.9rem,4vw,2.8rem)] font-extrabold text-white leading-[1.1] tracking-[-0.8px]">
          {{ t('reg.title') }}
        </h2>
        <p class="text-base text-white/70 leading-[1.75] mt-4 mb-12">
          {{ t('reg.desc') }}
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
          <label for="register-company" class="sr-only">{{ t('reg.company') }}</label>
          <input
            id="register-company"
            v-model="company"
            type="text"
            :placeholder="t('reg.company')"
            autocomplete="organization"
            class="w-full py-4 px-5 rounded-full border-[1.5px] border-white/20 bg-white/10 text-white text-[0.95rem] outline-none transition-[border-color] focus:border-blue placeholder:text-white/40"
          />
        </div>
        <div class="flex-1 min-w-[240px] max-w-[340px] flex flex-col gap-1">
          <label for="register-email" class="sr-only">{{ t('reg.email') }}</label>
          <input
            id="register-email"
            v-model="email"
            type="email"
            :placeholder="t('reg.email')"
            :aria-invalid="!!errors.email"
            :aria-describedby="errors.email ? 'register-email-error' : undefined"
            :aria-required="true"
            autocomplete="email"
            required
            class="w-full py-4 px-5 rounded-full border-[1.5px] border-white/20 bg-white/10 text-white text-[0.95rem] outline-none transition-[border-color] focus:border-blue placeholder:text-white/40"
            @input="clearError('email')"
          />
          <p
            v-if="errors.email"
            id="register-email-error"
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
          {{ t('reg.btn') }}
        </button>
      </form>
      <p v-else class="text-white/90 font-medium reveal">
        ✓ {{ t('reg.success') }}
      </p>
      <p v-if="!submitted" class="mt-4 text-[0.8rem] text-white/40 reveal">
        {{ t('reg.note') }}
      </p>
      <p v-if="!submitted" class="mt-3 text-[0.75rem] text-white/35 max-w-md mx-auto leading-relaxed reveal">
        {{ t('reg.lead_disclaimer', { brand: t('brand.name') }) }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { PhClipboardText } from '@phosphor-icons/vue'
import { RouterLink } from 'vue-router'
import type { ReviewType } from '../../data/assessmentContent'
import { useI18n } from '../../composables/useI18n'

defineProps<{
  reviewType: ReviewType | ''
  email: string
  name: string
  company: string
  phone: string
  gdprConsent: boolean
  honeypot: string
  contactValid: boolean
  emailError: boolean
  submitError: string | null
  submitting: boolean
}>()

const emit = defineEmits<{
  'update:email': [value: string]
  'update:name': [value: string]
  'update:company': [value: string]
  'update:phone': [value: string]
  'update:gdprConsent': [value: boolean]
  'update:honeypot': [value: string]
  submit: []
}>()

const { t } = useI18n()

const inputClass =
  'w-full min-h-[44px] px-4 py-3 bg-surface border-[1.5px] border-gray-light rounded-radius-sm text-sm text-deep outline-none transition-[border-color] focus:border-blue placeholder:text-text-muted/40'
</script>

<template>
  <div class="pt-8 pb-4 text-center">
    <p class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">
      {{ t('assess.email.label') }}
    </p>
    <h1
      class="font-heading text-[clamp(1.5rem,4vw,2.3rem)] font-extrabold text-deep leading-[1.1] tracking-[-0.8px] mb-3"
    >
      {{
        reviewType === 'detailed' ? t('assess.email.title_detailed') : t('assess.email.title')
      }}
    </h1>
    <p class="text-base text-text-muted leading-[1.75] max-w-[52ch] mx-auto">
      {{ t('assess.email.desc') }}
    </p>
  </div>

  <div class="bg-white border-[1.5px] border-gray-light rounded-radius p-6 my-6">
    <PhClipboardText :size="32" class="text-blue mx-auto mb-3 block" weight="duotone" />
    <h2 class="font-heading text-lg font-bold text-deep mb-2 text-center">
      {{ t('assess.email.gate_title') }}
    </h2>
    <p class="text-sm text-text-muted leading-[1.6] max-w-[44ch] mx-auto mb-5 text-center">
      {{ t('assess.email.gate_desc') }}
    </p>

    <!-- Honeypot -->
    <label class="absolute -left-[9999px] opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true">
      Website
      <input
        :value="honeypot"
        tabindex="-1"
        autocomplete="off"
        @input="emit('update:honeypot', ($event.target as HTMLInputElement).value)"
      />
    </label>

    <div class="flex flex-col gap-3">
      <template v-if="reviewType === 'detailed'">
        <input
          :value="name"
          type="text"
          autocomplete="name"
          :placeholder="t('assess.email.name_ph')"
          :class="inputClass"
          @input="emit('update:name', ($event.target as HTMLInputElement).value)"
        />
        <input
          :value="company"
          type="text"
          autocomplete="organization"
          :placeholder="t('assess.email.company_ph')"
          :class="inputClass"
          @input="emit('update:company', ($event.target as HTMLInputElement).value)"
        />
      </template>
      <input
        :value="email"
        type="email"
        autocomplete="email"
        :placeholder="t('assess.email.ph')"
        :class="inputClass"
        @input="emit('update:email', ($event.target as HTMLInputElement).value)"
      />
      <input
        v-if="reviewType === 'detailed'"
        :value="phone"
        type="tel"
        autocomplete="tel"
        :placeholder="t('assess.email.phone_ph')"
        :class="inputClass"
        @input="emit('update:phone', ($event.target as HTMLInputElement).value)"
      />

      <label class="flex items-start gap-2.5 text-left text-[0.8rem] text-text-muted leading-relaxed cursor-pointer">
        <input
          type="checkbox"
          class="mt-1 accent-deep shrink-0"
          :checked="gdprConsent"
          @change="emit('update:gdprConsent', ($event.target as HTMLInputElement).checked)"
        />
        <span>
          {{ t('assess.email.gdpr_prefix') }}
          <RouterLink to="/privacy" class="text-deep underline hover:opacity-80">{{
            t('assess.email.gdpr_link')
          }}</RouterLink
          >{{ t('assess.email.gdpr_suffix') }}
        </span>
      </label>

      <button
        type="button"
        class="inline-flex items-center justify-center py-3 px-5 rounded-full bg-blue text-white text-sm font-semibold transition-all hover:bg-[#5aaeff] disabled:opacity-45 disabled:cursor-not-allowed"
        :disabled="!contactValid || submitting"
        @click="emit('submit')"
      >
        {{ submitting ? t('assess.email.sending') : t('assess.email.cta') }}
      </button>
    </div>
    <p class="text-[11px] text-text-muted/70 mt-3 text-center">{{ t('assess.email.note') }}</p>
  </div>

  <p
    v-if="emailError"
    class="text-sm text-center text-red-600 bg-red-50 border border-red-200 rounded-radius-sm px-3 py-2.5"
    role="alert"
  >
    {{
      reviewType === 'detailed' ? t('assess.email.error_detailed') : t('assess.email.error')
    }}
  </p>
  <p
    v-if="submitError"
    class="mt-2 text-sm text-center text-red-600 bg-red-50 border border-red-200 rounded-radius-sm px-3 py-2.5"
    role="alert"
  >
    {{ submitError }}
  </p>
</template>

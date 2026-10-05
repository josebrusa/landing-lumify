<script setup lang="ts">
import { PhClipboardText } from '@phosphor-icons/vue'
import PrivacyFormNote from '../legal/PrivacyFormNote.vue'
import { useI18n } from '../../composables/useI18n'

defineProps<{
  email: string
  emailValid: boolean
  emailError: boolean
  submitting: boolean
}>()

const emit = defineEmits<{
  'update:email': [value: string]
  submit: []
}>()

const { t } = useI18n()
</script>

<template>
  <div class="pt-8 pb-4 text-center">
    <p class="text-xs font-bold tracking-[2px] uppercase text-blue mb-3.5">
      {{ t('assess.email.label') }}
    </p>
    <h1
      class="font-heading text-[clamp(1.5rem,4vw,2.3rem)] font-extrabold text-deep leading-[1.1] tracking-[-0.8px] mb-3"
    >
      {{ t('assess.email.title') }}
    </h1>
    <p class="text-base text-text-muted leading-[1.75] max-w-[52ch] mx-auto">
      {{ t('assess.email.desc') }}
    </p>
  </div>

  <div
    class="bg-white border-[1.5px] border-gray-light rounded-radius p-6 text-center my-6"
  >
    <PhClipboardText :size="32" class="text-blue mx-auto mb-3" weight="duotone" />
    <h2 class="font-heading text-lg font-bold text-deep mb-2">
      {{ t('assess.email.gate_title') }}
    </h2>
    <p class="text-sm text-text-muted leading-[1.6] max-w-[44ch] mx-auto mb-5">
      {{ t('assess.email.gate_desc') }}
    </p>
    <div class="flex flex-col sm:flex-row gap-2.5">
      <input
        :value="email"
        type="email"
        autocomplete="email"
        :placeholder="t('assess.email.ph')"
        class="flex-1 min-h-[44px] px-4 py-3 bg-surface border-[1.5px] border-gray-light rounded-radius-sm text-sm text-deep outline-none transition-[border-color] focus:border-blue placeholder:text-text-muted/40"
        @input="emit('update:email', ($event.target as HTMLInputElement).value)"
      />
      <button
        type="button"
        class="inline-flex items-center justify-center whitespace-nowrap py-2.5 px-5 rounded-full bg-blue text-white text-sm font-semibold transition-all hover:bg-[#5aaeff] disabled:opacity-45 disabled:cursor-not-allowed"
        :disabled="!emailValid || submitting"
        @click="emit('submit')"
      >
        {{ t('assess.email.cta') }}
      </button>
    </div>
    <p class="text-[11px] text-text-muted/70 mt-2.5">{{ t('assess.email.note') }}</p>
    <div class="mt-3 text-left">
      <PrivacyFormNote tone="light" />
    </div>
  </div>

  <p
    v-if="emailError"
    class="text-sm text-center text-red-600 bg-red-50 border border-red-200 rounded-radius-sm px-3 py-2.5"
    role="alert"
  >
    {{ t('assess.email.error') }}
  </p>

  <p
    v-if="submitting"
    class="text-center text-sm text-text-muted py-3.5 flex items-center justify-center gap-2"
  >
    <span
      class="inline-block w-3.5 h-3.5 border-2 border-gray-light border-t-blue rounded-full animate-spin"
    />
    {{ t('assess.email.sending') }}
  </p>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from '@/composables/useI18n'

defineProps<{
  /** Extra classes for light vs dark form sections */
  tone?: 'light' | 'dark'
}>()

const { t } = useI18n()
</script>

<template>
  <p
    class="text-[0.75rem] leading-relaxed"
    :class="tone === 'dark' ? 'text-white/35' : 'text-text-muted'"
  >
    {{ t('form.privacy_prefix') }}
    <RouterLink
      to="/privacy"
      class="underline"
      :class="tone === 'dark' ? 'text-white/55 hover:text-white/80' : 'text-deep hover:opacity-80'"
    >
      {{ t('form.privacy_link') }}
    </RouterLink>
    {{ t('form.privacy_suffix') }}
  </p>
</template>

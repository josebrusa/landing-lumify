<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'

const { t } = useI18n()

const rows = [
  { h: 'train.cmp.r1h', a: 'train.cmp.r1a', b: 'train.cmp.r1b' },
  { h: 'train.cmp.r2h', a: 'train.cmp.r2a', b: 'train.cmp.r2b' },
  { h: 'train.cmp.r3h', a: 'train.cmp.r3a', b: 'train.cmp.r3b' },
  { h: 'train.cmp.r4h', a: 'train.cmp.r4a', b: 'train.cmp.r4b' },
  { h: 'train.cmp.r5h', a: 'train.cmp.r5a', b: 'train.cmp.r5b' },
] as const
</script>

<template>
  <section class="py-[72px] px-[5%] bg-white border-y border-gray-light/80">
    <div class="max-w-[900px] mx-auto reveal">
      <h2
        class="font-heading text-[clamp(1.5rem,3vw,2rem)] font-extrabold text-deep leading-tight mb-8 text-center md:text-left"
      >
        {{ t('train.cmp.title') }}
      </h2>
      <div class="overflow-x-auto rounded-radius border border-gray-light/80 bg-surface">
        <table class="w-full min-w-[520px] text-left text-sm border-collapse">
          <thead>
            <tr class="bg-deep text-white">
              <th class="py-3 px-4 font-semibold w-[28%]" scope="col">{{ t('train.cmp.colCriterio') }}</th>
              <th class="py-3 px-4 font-semibold w-[36%]" scope="col">{{ t('train.cmp.colA') }}</th>
              <th class="py-3 px-4 font-semibold w-[36%]" scope="col">{{ t('train.cmp.colB') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in rows"
              :key="row.h"
              class="border-b border-gray-light/80 last:border-b-0 bg-white odd:bg-surface/80"
            >
              <th scope="row" class="py-3 px-4 font-bold text-deep align-top">{{ t(row.h) }}</th>
              <td class="py-3 px-4 text-text-muted align-top">{{ t(row.a) }}</td>
              <td class="py-3 px-4 text-text-muted align-top">{{ t(row.b) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>

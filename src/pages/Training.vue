<script setup lang="ts">
import { ref } from 'vue'
import AppNav from '../components/layout/AppNav.vue'
import TrainingHero from '../components/TrainingSections/TrainingHero.vue'
import TrainingPrograms from '../components/TrainingSections/TrainingPrograms.vue'
import TrainingSyllabus from '../components/TrainingSections/TrainingSyllabus.vue'
import TrainingComparison from '../components/TrainingSections/TrainingComparison.vue'
import TrainingBenefits from '../components/TrainingSections/TrainingBenefits.vue'
import { useScrollReveal } from '../composables/useScrollReveal'

const program = ref<'a' | 'b'>('a')

useScrollReveal('.reveal')
</script>

<template>
  <div class="min-h-screen">
    <AppNav />

    <main>
      <TrainingHero />
      <TrainingPrograms v-model:program="program" />
      <TrainingSyllabus :program="program" />
      <TrainingComparison />
      <TrainingBenefits />
    </main>
  </div>
</template>

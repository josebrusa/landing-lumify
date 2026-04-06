<script setup lang="ts">
import { ref } from 'vue'
import Nav from '../components/layout/Nav.vue'
import Footer from '../components/layout/Footer.vue'
import TrainingHero from '../components/TrainingSections/TrainingHero.vue'
import TrainingPrograms from '../components/TrainingSections/TrainingPrograms.vue'
import TrainingSyllabus from '../components/TrainingSections/TrainingSyllabus.vue'
import TrainingComparison from '../components/TrainingSections/TrainingComparison.vue'
import TrainingBenefits from '../components/TrainingSections/TrainingBenefits.vue'
import Modal from '../components/modals/Modal.vue'
import PricingModal from '../components/modals/PricingModal.vue'
import { useScrollReveal } from '../composables/useScrollReveal'

const program = ref<'a' | 'b'>('a')

useScrollReveal('.reveal')
</script>

<template>
  <div class="min-h-screen">
    <Nav />

    <main>
      <TrainingHero />
      <TrainingPrograms v-model:program="program" />
      <TrainingSyllabus :program="program" />
      <TrainingComparison />
      <TrainingBenefits />
    </main>

    <Footer />
    <Modal />
    <PricingModal />
  </div>
</template>

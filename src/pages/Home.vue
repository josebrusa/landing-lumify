<script setup lang="ts">
import Nav from '../components/layout/Nav.vue'
import Footer from '../components/layout/Footer.vue'
import Hero from '../components/HomeSections/Hero.vue'
import Services from '../components/HomeSections/Services.vue'
import Packs from '../components/HomeSections/Packs.vue'
import Retainers from '../components/HomeSections/Retainers.vue'
import Methodology from '../components/HomeSections/Methodology.vue'
import About from '../components/HomeSections/About.vue'
import Register from '../components/HomeSections/Register.vue'
import Modal from '../components/modals/Modal.vue'
import PricingModal from '../components/modals/PricingModal.vue'
import { useScrollReveal } from '../composables/useScrollReveal'

useScrollReveal('.reveal')
</script>

<template>
  <div class="min-h-screen">
    <Nav />

    <main>
      <Hero />
      <Services />
      <Packs />
      <Retainers />
      <Methodology />
      <About />
      <Register />
    </main>

    <Footer />
    <Modal />
    <PricingModal />
  </div>
</template>

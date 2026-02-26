<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MainLayout from './layouts/MainLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

const route = useRoute()

// Determine layout dynamically. Defaults to MainLayout if not specified
const layoutComponent = computed(() => {
  if (route.meta.layout === 'auth') {
    return AuthLayout
  }
  // We can add more layouts later if needed
  return MainLayout
})
</script>

<template>
  <component :is="layoutComponent" />
</template>

<style>
/* Global styles are imported via main.js/style.css */
</style>

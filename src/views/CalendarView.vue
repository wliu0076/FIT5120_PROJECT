<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Banner Section -->
    <div class="relative bg-gray-800 text-white py-16">
      <div class="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-90"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-wider">What's On</p>
        <h1 class="mt-2 text-4xl font-bold sm:text-5xl">Event Calendar</h1>
        <p class="mt-3 text-gray-300">vv</p>
      </div>
    </div>

    <!-- Calendar Section -->
    <div class="py-8 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EventsCalendar />
      </div>
    </div>
  </div>
</template>

<script setup>
import EventsCalendar from '../components/EventsCalendar.vue'
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 
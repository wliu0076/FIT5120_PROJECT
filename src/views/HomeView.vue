<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Banner Section -->
    <div class="relative bg-gray-800 text-white py-16">
      <div class="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-90"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="mt-2 text-4xl font-bold sm:text-5xl">Welcome to TE13</h1>
        <p class="mt-4 text-xl text-gray-300">Your Guide to Local Events and Activities</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Events Calendar Card -->
        <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900">Events Calendar</h2>
            <router-link to="/events" class="text-blue-600 hover:text-blue-800">View All</router-link>
          </div>
          <p class="text-gray-600 mb-4">Browse and discover upcoming events in your area.</p>
          <router-link to="/events" class="inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Explore Events
          </router-link>
        </div>

        <!-- Navigation Features Card -->
        <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900">Easy Navigation</h2>
          </div>
          <p class="text-gray-600 mb-4">Get step-by-step directions to any event location.</p>
          <router-link to="/events" class="inline-block bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Find Events
          </router-link>
        </div>

        <!-- Community Card -->
        <div class="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold text-gray-900">Community</h2>
          </div>
          <p class="text-gray-600 mb-4">Join our community and stay updated with local happenings.</p>
          <button class="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Component logic can be added here if needed
</script>

<style scoped>
/* Component specific styles can be added here */
</style> 
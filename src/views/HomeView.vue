<template>
  <div class="min-h-screen bg-white">
    <!-- Header Search Bar -->
    <div class="bg-white border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <div class="relative">
              <input type="text" 
                     placeholder="Search events" 
                     class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <span class="absolute left-3 top-2.5 text-gray-400">
                <i class="mdi mdi-magnify text-xl"></i>
              </span>
            </div>
          </div>
          <div class="relative">
            <button class="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <i class="mdi mdi-map-marker text-gray-600"></i>
              <span class="text-gray-700">Melbourne</span>
              <i class="mdi mdi-chevron-down text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero Banner -->
    <div class="relative bg-gradient-to-r from-purple-600 to-blue-500 overflow-hidden">
      <div class="absolute inset-0 bg-black opacity-40"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="text-white mb-8 md:mb-0 md:w-1/2">
            <h1 class="text-5xl font-bold mb-6">Discover Melbourne's Best Events</h1>
            <p class="text-xl mb-8 text-gray-100">Find and join amazing events happening in your community</p>
            <div class="flex space-x-4">
              <button class="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Browse Events
              </button>
              <button class="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                Create Event
              </button>
            </div>
          </div>
          <div class="md:w-1/2 flex justify-end">
            <img src="/events/hero-image.jpg" alt="Events" class="rounded-lg shadow-2xl max-w-md object-cover">
          </div>
        </div>
      </div>
    </div>

    <!-- Category Navigation -->
    <div class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-8">Popular Categories</h2>
        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
          <div v-for="category in categories" :key="category.id" 
               class="flex flex-col items-center group cursor-pointer">
            <div class="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-3 group-hover:bg-purple-50 group-hover:shadow-lg transition-all duration-300">
              <i :class="[category.icon, 'text-2xl text-purple-600']"></i>
            </div>
            <span class="text-sm text-gray-700 text-center group-hover:text-purple-600 transition-colors">{{ category.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Events Section -->
    <div class="py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-bold text-gray-900">Featured Events</h2>
          <router-link to="/events" class="text-purple-600 hover:text-purple-700 font-semibold flex items-center">
            View all <i class="mdi mdi-arrow-right ml-2"></i>
          </router-link>
        </div>
        <div v-if="isLoading" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
        <div v-else-if="error" class="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {{ error }}
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div v-for="event in upcomingEvents" :key="event.id" 
               class="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <img :src="event.image" :alt="event.name" class="w-full h-48 object-cover">
            <div class="p-4">
              <div class="text-sm text-purple-600 font-semibold mb-2">{{ formatDate(event.datetime) }}</div>
              <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ event.name }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ event.location }}</p>
              <div class="flex items-center justify-between">
                <span :class="['text-xs px-2 py-1 rounded-full', getCategoryColor(event.category)]">
                  {{ event.category }}
                </span>
                <router-link :to="`/events/${event.id}`" class="text-sm text-blue-600 hover:text-blue-800">
                  View details
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Call to Action Section -->
    <div class="bg-gray-900 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold mb-4">Ready to Create Your Own Event?</h2>
          <p class="text-gray-300 mb-8 max-w-2xl mx-auto">Join thousands of event organizers who trust our platform to host their events</p>
          <button class="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { getUpcomingEvents } from '../services/eventService'
import { formatEventDate, getEventCategoryColor } from '../utils/eventUtils'

// Category data
const categories = [
  { id: 'concerts', name: 'Concerts & Gigs', icon: 'mdi mdi-guitar-electric' },
  { id: 'performing-arts', name: 'Performing Arts', icon: 'mdi mdi-theater' },
  { id: 'sports', name: 'Sports & Outdoors', icon: 'mdi mdi-basketball' },
  { id: 'festivals', name: 'Festivals', icon: 'mdi mdi-party-popper' },
  { id: 'music-festivals', name: 'Music Festivals', icon: 'mdi mdi-music-circle' },
  { id: 'exhibitions', name: 'Exhibitions', icon: 'mdi mdi-image-multiple' },
  { id: 'workshops', name: 'Workshops', icon: 'mdi mdi-school' },
  { id: 'food-drink', name: 'Food & Drink', icon: 'mdi mdi-food-fork-drink' }
]

// Events state
const upcomingEvents = ref([])
const isLoading = ref(false)
const error = ref(null)

// i18n
const { locale } = useI18n()

// Fetch upcoming events
onMounted(async () => {
  try {
    isLoading.value = true
    upcomingEvents.value = await getUpcomingEvents(8)
  } catch (err) {
    error.value = 'Failed to load events. Please try again later.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
})

// Format date for display
const formatDate = (dateString) => {
  return formatEventDate(dateString, locale.value)
}

// Get category color
const getCategoryColor = (category) => {
  const baseColor = getEventCategoryColor(category)
  return `${baseColor.replace('bg-', 'bg-')} text-white`
}
</script>

<style scoped>
.sticky {
  position: sticky;
  top: 0;
  z-index: 50;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Hover effects */
.hover\:shadow-lg:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

/* Custom gradients */
.bg-gradient-custom {
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style> 
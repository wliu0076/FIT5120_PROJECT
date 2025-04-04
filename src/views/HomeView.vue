<template>
  <div class="min-h-screen bg-white">
    <!-- Header Search Bar -->
    <div class="bg-white border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <label for="search-events" class="block text-lg font-medium text-gray-700 mb-2">{{ $t('home.search.label') }}</label>
            <div class="relative">
              <input type="text" 
                     id="search-events"
                     :placeholder="$t('home.search.placeholder')"
                     class="w-full pl-12 pr-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <span class="absolute left-4 top-3.5 text-gray-400">
                <i class="mdi mdi-magnify text-2xl"></i>
              </span>
            </div>
          </div>
          <div class="relative">
            <label class="block text-lg font-medium text-gray-700 mb-2">{{ $t('home.location.label') }}</label>
            <button class="w-full md:w-auto flex items-center justify-center space-x-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 text-lg">
              <i class="mdi mdi-map-marker text-gray-600 text-2xl"></i>
              <span class="text-gray-700">Melbourne</span>
              <i class="mdi mdi-chevron-down text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Hero Banner with enhanced animation -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0">
        <img src="/background.png" alt="Melbourne Background" class="w-full h-full object-cover transform scale-105 transition-transform duration-10000">
        <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50"></div>
      </div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div class="hero-content flex flex-col md:flex-row items-center justify-between">
          <div class="text-white mb-8 md:mb-0 md:w-1/2">
            <h1 class="font-bold mb-8">{{ $t('home.hero.title') }}</h1>
            <p class="text-2xl mb-12 text-gray-100 leading-relaxed">{{ $t('home.hero.subtitle') }}</p>
            <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <button class="primary-button bg-blue-600 text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all flex items-center justify-center">
                <i class="mdi mdi-calendar-search text-2xl mr-3"></i>
                {{ $t('home.hero.browseEvents') }}
              </button>
              <button class="primary-button border-2 border-white text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center">
                <i class="mdi mdi-map-marker-path text-2xl mr-3"></i>
                {{ $t('home.hero.findGuide') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Language Accessibility Banner -->
    <div class="bg-blue-50 py-4">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
          <span class="text-lg flex items-center">
            <i class="mdi mdi-translate text-2xl text-blue-600 mr-2"></i>
            {{ $t('home.language.viewIn') }}
          </span>
          <div class="flex space-x-4">
            <button class="px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-2">
              <span class="text-xl">🇨🇳</span>
              <span>中文</span>
            </button>
            <button class="px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-2">
              <span class="text-xl">🇮🇳</span>
              <span>हिन्दी</span>
            </button>
            <button class="px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-2">
              <span class="text-xl">🇻🇳</span>
              <span>Tiếng Việt</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">{{ $t('home.howItWorks.title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <i class="mdi mdi-calendar-search text-4xl text-blue-600"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ $t('home.howItWorks.step1.title') }}</h3>
            <p class="text-gray-600">{{ $t('home.howItWorks.step1.description') }}</p>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <i class="mdi mdi-map-marker-path text-4xl text-green-600"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ $t('home.howItWorks.step2.title') }}</h3>
            <p class="text-gray-600">{{ $t('home.howItWorks.step2.description') }}</p>
          </div>
          <div class="flex flex-col items-center text-center">
            <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <i class="mdi mdi-walk text-4xl text-purple-600"></i>
            </div>
            <h3 class="text-xl font-semibold mb-2">{{ $t('home.howItWorks.step3.title') }}</h3>
            <p class="text-gray-600">{{ $t('home.howItWorks.step3.description') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Navigation with enhanced design -->
    <div class="py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-gray-900 mb-12 text-center">{{ $t('home.categories.title') }}</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          <div v-for="category in categories" :key="category.id" 
               class="category-card flex flex-col items-center group cursor-pointer bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-500">
            <div class="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-all duration-500">
              <i :class="[category.icon, 'category-icon text-4xl text-blue-600']"></i>
            </div>
            <span class="text-lg font-medium text-gray-800 text-center group-hover:text-blue-600 transition-colors">{{ $t(category.name) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Events Section with enhanced cards -->
    <div class="py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-12">
          <h2 class="text-4xl font-bold text-gray-900">{{ $t('home.events.title') }}</h2>
          <router-link to="/events" class="text-blue-600 hover:text-blue-700 font-semibold text-xl flex items-center group">
            {{ $t('home.events.viewAll') }}
            <i class="mdi mdi-arrow-right ml-2 transform group-hover:translate-x-2 transition-transform"></i>
          </router-link>
        </div>
        <div v-if="isLoading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
        </div>
        <div v-else-if="error" class="bg-red-50 border-2 border-red-200 text-red-600 p-8 rounded-xl text-center text-xl">
          {{ error }}
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div v-for="event in upcomingEvents" :key="event.id" 
               class="event-card bg-white rounded-xl overflow-hidden shadow-sm">
            <div class="overflow-hidden">
              <img :src="event.image" :alt="event.name" class="event-image w-full h-64 object-cover">
            </div>
            <div class="p-8">
              <div class="text-lg text-blue-600 font-semibold mb-3">{{ formatDate(event.datetime) }}</div>
              <h3 class="text-2xl font-bold text-gray-900 mb-3">{{ event.name }}</h3>
              <p class="text-gray-600 text-lg mb-6 flex items-center">
                <i class="mdi mdi-map-marker text-gray-400 mr-2"></i>
                {{ event.location }}
              </p>
              <div class="flex items-center justify-between">
                <span :class="['px-6 py-2 rounded-full text-base font-medium', getCategoryColor(event.category)]">
                  {{ event.category }}
                </span>
                <router-link :to="`/events/${event.id}`" 
                           class="flex items-center text-lg text-blue-600 hover:text-blue-800 font-medium group">
                  {{ $t('home.events.moreInfo') }}
                  <i class="mdi mdi-arrow-right ml-2 transform group-hover:translate-x-2 transition-transform"></i>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Support Section -->
    <div class="bg-blue-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-3xl font-bold mb-4">{{ $t('home.support.title') }}</h2>
          <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">{{ $t('home.support.description') }}</p>
          <div class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button class="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-colors flex items-center">
              <i class="mdi mdi-phone text-2xl mr-2"></i>
              {{ $t('home.support.callUs') }}
            </button>
            <button class="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center">
              <i class="mdi mdi-help-circle text-2xl mr-2"></i>
              {{ $t('home.support.getHelp') }}
            </button>
          </div>
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

// Updated categories for elderly-focused events
const categories = [
  { id: 'cultural', name: 'home.categories.cultural', icon: 'mdi mdi-account-group' },
  { id: 'religious', name: 'home.categories.religious', icon: 'mdi mdi-church' },
  { id: 'health', name: 'home.categories.health', icon: 'mdi mdi-heart-pulse' },
  { id: 'social', name: 'home.categories.social', icon: 'mdi mdi-account-multiple' },
  { id: 'workshops', name: 'home.categories.workshops', icon: 'mdi mdi-school' },
  { id: 'markets', name: 'home.categories.markets', icon: 'mdi mdi-store' }
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
    upcomingEvents.value = await getUpcomingEvents(6) // Reduced to 6 events for better visibility
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

// Get category color with updated styling
const getCategoryColor = (category) => {
  const baseColor = getEventCategoryColor(category)
  return `${baseColor.replace('bg-', 'bg-')} text-white`
}
</script>

<style scoped>
/* Enhanced Typography */
h1 {
  font-size: 4.5rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* Smooth Animations */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-content {
  animation: fadeUp 0.8s ease-out forwards;
}

/* Enhanced Card Hover Effects */
.event-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.event-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Category Icon Animation */
.category-icon {
  transition: transform 0.3s ease;
}

.category-card:hover .category-icon {
  transform: scale(1.1);
}

/* Improved Button Hover Effects */
.primary-button {
  position: relative;
  overflow: hidden;
}

.primary-button::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.primary-button:hover::after {
  transform: translateX(0);
}

/* Image Hover Effect */
.event-image {
  transition: transform 0.5s ease;
}

.event-card:hover .event-image {
  transform: scale(1.05);
}

/* Smooth Scrolling */
html {
  scroll-behavior: smooth;
}

/* High contrast and accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}

@media (prefers-contrast: high) {
  .text-gray-600 {
    color: #000000;
  }
  .text-gray-100 {
    color: #ffffff;
  }
  .bg-blue-600 {
    background-color: #0040FF;
  }
}
</style> 
<template>
  <div class="min-h-screen bg-white">
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
              <router-link to="/events" class="primary-button bg-blue-600 text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all flex items-center justify-center">
                <i class="mdi mdi-calendar-search text-2xl mr-3"></i>
                {{ $t('home.hero.browseEvents') }}
              </router-link>
              <router-link to="/travel" class="primary-button border-2 border-white text-white px-10 py-5 rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center">
                <i class="mdi mdi-map-marker-path text-2xl mr-3"></i>
                {{ $t('home.hero.findGuide') }}
              </router-link>
            </div>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

// i18n
const { locale } = useI18n()
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
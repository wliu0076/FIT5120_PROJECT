<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <!-- Main Introduction -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">{{ $t('about.title') }}</h1>
        <div class="prose max-w-none text-gray-600">
          <p class="mb-4">{{ $t('about.description') }}</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="bg-blue-50 p-6 rounded-lg">
              <h3 class="text-xl font-semibold text-blue-800 mb-3">{{ $t('about.features.title') }}</h3>
              <ul class="space-y-2">
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {{ $t('about.features.multicultural') }}
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {{ $t('about.features.navigation') }}
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {{ $t('about.features.views') }}
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {{ $t('about.features.language') }}
                </li>
              </ul>
            </div>
            <div class="bg-green-50 p-6 rounded-lg">
              <h3 class="text-xl font-semibold text-green-800 mb-3">{{ $t('about.guide.title') }}</h3>
              <ul class="space-y-2">
                <li class="flex items-start">
                  <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-200 text-green-800 font-semibold mr-2">1</span>
                  <span>{{ $t('about.guide.step1') }}</span>
                </li>
                <li class="flex items-start">
                  <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-200 text-green-800 font-semibold mr-2">2</span>
                  <span>{{ $t('about.guide.step2') }}</span>
                </li>
                <li class="flex items-start">
                  <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-200 text-green-800 font-semibold mr-2">3</span>
                  <span>{{ $t('about.guide.step3') }}</span>
                </li>
                <li class="flex items-start">
                  <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-200 text-green-800 font-semibold mr-2">4</span>
                  <span>{{ $t('about.guide.step4') }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Cultural Features -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('about.culture.title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-red-800">{{ $t('about.culture.chinese.title') }}</h3>
            <p class="text-gray-600">{{ $t('about.culture.chinese.description') }}</p>
            <ul class="list-disc list-inside text-gray-600 space-y-2">
              <li v-for="feature in chineseFeatures" :key="feature">{{ feature }}</li>
            </ul>
          </div>
          <div class="space-y-4">
            <h3 class="text-xl font-semibold text-orange-800">{{ $t('about.culture.indian.title') }}</h3>
            <p class="text-gray-600">{{ $t('about.culture.indian.description') }}</p>
            <ul class="list-disc list-inside text-gray-600 space-y-2">
              <li v-for="feature in indianFeatures" :key="feature">{{ feature }}</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Contact Information -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ $t('about.contact.title') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span class="text-gray-600">{{ $t('about.contact.email') }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            <span class="text-gray-600">{{ $t('about.contact.phone') }}</span>
          </div>
          <div class="flex items-center space-x-3">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span class="text-gray-600">{{ $t('about.contact.address') }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()

const chineseFeatures = computed(() => [
  'Traditional Cuisine & Tea Culture',
  'Festivals & Temple Fairs',
  'Cultural Art Exhibitions',
  'Traditional Medicine & Health'
])

const indianFeatures = computed(() => [
  'Traditional Festivals',
  'Yoga & Meditation Centers',
  'Specialty Food Markets',
  'Classical Music & Dance'
])
</script>

<style scoped>
.prose {
  max-width: none;
}
</style> 
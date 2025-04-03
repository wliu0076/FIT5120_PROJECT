<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="relative bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block">{{ $t('hero.title') }}</span>
                <span class="block text-indigo-600">{{ $t('hero.subtitle') }}</span>
              </h1>
              <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                {{ $t('hero.description') }}
              </p>
              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div class="rounded-md shadow">
                  <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                    {{ $t('hero.browseEvents') }}
                  </a>
                </div>
                <div class="mt-3 sm:mt-0 sm:ml-3">
                  <a href="#" class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10">
                    {{ $t('hero.findRoute') }}
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>

    <!-- Core Features Section -->
    <div class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">{{ $t('features.title') }}</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {{ $t('features.subtitle') }}
          </p>
        </div>

        <div class="mt-10">
          <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <!-- Feature 1 -->
            <div class="relative">
              <div class="text-4xl mb-4">🗓️</div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">{{ $t('features.events.title') }}</h3>
              <p class="mt-2 text-base text-gray-500">
                {{ $t('features.events.description') }}
              </p>
            </div>

            <!-- Feature 2 -->
            <div class="relative">
              <div class="text-4xl mb-4">🧭</div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">{{ $t('features.travel.title') }}</h3>
              <p class="mt-2 text-base text-gray-500">
                {{ $t('features.travel.description') }}
              </p>
            </div>

            <!-- Feature 3 -->
            <div class="relative">
              <div class="text-4xl mb-4">📄</div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">{{ $t('features.pdf.title') }}</h3>
              <p class="mt-2 text-base text-gray-500">
                {{ $t('features.pdf.description') }}
              </p>
            </div>

            <!-- Feature 4 -->
            <div class="relative">
              <div class="text-4xl mb-4">🔊</div>
              <h3 class="text-lg leading-6 font-medium text-gray-900">{{ $t('features.audio.title') }}</h3>
              <p class="mt-2 text-base text-gray-500">
                {{ $t('features.audio.description') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- How It Works Section -->
    <div class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">{{ $t('howItWorks.title') }}</h2>
          <p class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {{ $t('howItWorks.subtitle') }}
          </p>
        </div>

        <div class="mt-10">
          <div class="grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div class="text-center">
              <div class="text-4xl mb-4">1️⃣</div>
              <h3 class="text-lg font-medium text-gray-900">{{ $t('howItWorks.step1.title') }}</h3>
              <p class="mt-2 text-base text-gray-500">{{ $t('howItWorks.step1.description') }}</p>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-4">2️⃣</div>
              <h3 class="text-lg font-medium text-gray-900">{{ $t('howItWorks.step2.title') }}</h3>
              <p class="mt-2 text-base text-gray-500">{{ $t('howItWorks.step2.description') }}</p>
            </div>
            <div class="text-center">
              <div class="text-4xl mb-4">3️⃣</div>
              <h3 class="text-lg font-medium text-gray-900">{{ $t('howItWorks.step3.title') }}</h3>
              <p class="mt-2 text-base text-gray-500">{{ $t('howItWorks.step3.description') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonial Section -->
    <div class="bg-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:text-center">
          <h2 class="text-base text-indigo-600 font-semibold tracking-wide uppercase">{{ $t('testimonials.title') }}</h2>
        </div>
        <div class="mt-10">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="px-4 py-5 sm:p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <img class="h-12 w-12 rounded-full" :src="avatarUrl" alt="Li Mei" />
                </div>
                <div class="ml-5">
                  <h3 class="text-lg font-medium text-gray-900">Li Mei</h3>
                  <p class="mt-1 text-base text-gray-500">
                    {{ $t('testimonials.liMei.quote') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-800">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-white text-lg font-semibold mb-4">{{ $t('footer.quickLinks') }}</h3>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-300 hover:text-white">{{ $t('footer.privacy') }}</a></li>
              <li><a href="#" class="text-gray-300 hover:text-white">{{ $t('footer.contact') }}</a></li>
              <li><a href="#" class="text-gray-300 hover:text-white">{{ $t('footer.help') }}</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-white text-lg font-semibold mb-4">{{ $t('footer.support') }}</h3>
            <ul class="space-y-2">
              <li class="text-gray-300">{{ $t('footer.hotline') }}</li>
              <li class="text-gray-300">{{ $t('footer.email') }}</li>
            </ul>
          </div>
          <div>
            <h3 class="text-white text-lg font-semibold mb-4">{{ $t('footer.accessibility') }}</h3>
            <div class="space-y-2">
              <button class="text-gray-300 hover:text-white">{{ $t('footer.increaseText') }}</button>
              <button class="text-gray-300 hover:text-white">{{ $t('footer.highContrast') }}</button>
            </div>
          </div>
        </div>
        <div class="mt-8 border-t border-gray-700 pt-8">
          <p class="text-center text-gray-400">{{ $t('footer.copyright') }}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import logoUrl from '@/assets/logo.png'
import avatarUrl from '@/assets/avatar.jpg'

const { locale } = useI18n()
const currentLocale = ref(locale.value)

watch(currentLocale, (newLocale) => {
  locale.value = newLocale
})
</script>

<style scoped>
/* Add any component-specific styles here */
</style> 
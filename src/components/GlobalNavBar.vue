<template>
  <!-- Navigation Bar -->
  <nav class="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition duration-500 ease-in-out transform hover:scale-105">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <router-link to="/" class="flex items-center">
              <img class="h-12 w-auto" :src="logoUrl" alt="Logo" />
            </router-link>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link to="/" class="border-transparent text-white hover:border-white hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" :class="{ 'border-white text-white': $route.path === '/' }">
              {{ $t('nav.home') }}
            </router-link>
            <router-link to="/events" class="border-transparent text-white hover:border-white hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" :class="{ 'border-white text-white': $route.path === '/events' }">
              {{ $t('nav.events') }}
            </router-link>
            <router-link to="/help" class="border-transparent text-white hover:border-white hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" :class="{ 'border-white text-white': $route.path === '/help' }">
              {{ $t('nav.help') }}
            </router-link>
            <router-link to="/about" class="border-transparent text-white hover:border-white hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium" :class="{ 'border-white text-white': $route.path === '/about' }">
              {{ $t('nav.about') }}
            </router-link>
          </div>
        </div>
        <div class="flex items-center">
          <select v-model="currentLocale" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="vi">Tiếng Việt</option>
            <option value="hi">हिन्दी</option>
          </select>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import logoUrl from '@/assets/logo.png'

const { locale } = useI18n()
const currentLocale = ref(locale.value)

watch(currentLocale, (newLocale) => {
  locale.value = newLocale
})
</script> 
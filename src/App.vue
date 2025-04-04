<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="flex items-center">
                <img class="h-12 w-auto" src="/logo.png" alt="Logo" />
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <RouterLink 
                to="/" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2"
                :class="$route.path === '/' ? 'border-blue-500' : 'border-transparent hover:border-gray-300'"
              >
                {{ $t('navigation.home') }}
              </RouterLink>

              <RouterLink 
                to="/events" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2"
                :class="$route.path === '/events' ? 'border-blue-500' : 'border-transparent hover:border-gray-300'"
              >
                {{ $t('navigation.events') }}
              </RouterLink>

              <RouterLink 
                to="/travel" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2"
                :class="$route.path === '/travel' ? 'border-blue-500' : 'border-transparent hover:border-gray-300'"
              >
                {{ $t('navigation.travel') }}
              </RouterLink>

              <RouterLink 
                to="/help" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2"
                :class="$route.path === '/help' ? 'border-blue-500' : 'border-transparent hover:border-gray-300'"
              >
                {{ $t('navigation.help') }}
              </RouterLink>

              <RouterLink 
                to="/about" 
                class="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 border-b-2"
                :class="$route.path === '/about' ? 'border-blue-500' : 'border-transparent hover:border-gray-300'"
              >
                {{ $t('navigation.about') }}
              </RouterLink>
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <TranslateButton />
            <div class="relative group">
              <select 
                v-model="currentLanguage" 
                @change="changeLanguage"
                class="appearance-none block pl-10 pr-10 py-2 text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 cursor-pointer"
                :class="[
                  currentLanguage === 'en' ? 'border-blue-500 focus:ring-blue-500 bg-blue-50' :
                  currentLanguage === 'zh' ? 'border-red-500 focus:ring-red-500 bg-red-50' :
                  currentLanguage === 'vi' ? 'border-green-500 focus:ring-green-500 bg-green-50' :
                  'border-orange-500 focus:ring-orange-500 bg-orange-50'
                ]"
              >
                <option value="zh">中文 🇨🇳</option>
                <option value="en">English 🇬🇧</option>
                <option value="vi">Tiếng Việt 🇻🇳</option>
                <option value="hi">हिन्दी 🇮🇳</option>
              </select>
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl">
                {{ 
                  currentLanguage === 'en' ? '🇬🇧' :
                  currentLanguage === 'zh' ? '🇨🇳' :
                  currentLanguage === 'vi' ? '🇻🇳' :
                  '🇮🇳'
                }}
              </div>
              <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <!-- Tooltip -->
              <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Change language
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
    
    <!-- Language Selector Modal -->
    <LanguageSelector />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import TranslateButton from './components/TranslateButton.vue'
import LanguageSelector from './components/LanguageSelector.vue'

const route = useRoute()
const { locale } = useI18n()
const currentLanguage = ref(locale.value)

const changeLanguage = () => {
  locale.value = currentLanguage.value
  localStorage.setItem('language', currentLanguage.value)
}

onMounted(() => {
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage) {
    currentLanguage.value = savedLanguage
    locale.value = savedLanguage
  }
})
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f9fafb;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
</style> 
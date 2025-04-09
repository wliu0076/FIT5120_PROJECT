<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 全新设计的顶部导航栏 -->
    <header class="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo & Brand -->
          <div class="flex items-center">
            <router-link to="/" class="flex items-center space-x-2 group">
              <div class="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:scale-105">
                <img src="/logo.png" alt="Logo" class="w-6 h-6 object-contain" />
              </div>
              <span class="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">MelGuide</span>
            </router-link>
          </div>
          
          <!-- 主导航菜单 -->
          <nav class="hidden md:flex items-center space-x-1">
            <div class="relative group">
              <router-link to="/" class="hover:text-orange-600 px-4 py-2 rounded-lg text-gray-700 font-medium transition-colors duration-200 hover:bg-orange-50/60 relative"
                :class="$route.path === '/' ? 'text-orange-600 bg-orange-50/80' : ''">
                {{ $t('navigation.home') }}
                <span class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-0.5 rounded-full bg-orange-500"
                      :class="$route.path === '/' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-all duration-300'"></span>
              </router-link>
            </div>
            <div class="relative group">
              <router-link to="/events" class="hover:text-orange-600 px-4 py-2 rounded-lg text-gray-700 font-medium transition-colors duration-200 hover:bg-orange-50/60 relative"
                :class="$route.path === '/events' ? 'text-orange-600 bg-orange-50/80' : ''">
                {{ $t('navigation.events') }}
                <span class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-0.5 rounded-full bg-orange-500"
                      :class="$route.path === '/events' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-all duration-300'"></span>
              </router-link>
            </div>
            <div class="relative group">
              <router-link to="/landmarks" class="hover:text-orange-600 px-4 py-2 rounded-lg text-gray-700 font-medium transition-colors duration-200 hover:bg-orange-50/60 relative"
                :class="$route.path === '/landmarks' ? 'text-orange-600 bg-orange-50/80' : ''">
                {{ $t('navigation.landmarks') }}
                <span class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-10 h-0.5 rounded-full bg-orange-500"
                      :class="$route.path === '/landmarks' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 transition-all duration-300'"></span>
              </router-link>
            </div>
          </nav>
          
          <!-- 右侧操作区 -->
          <div class="flex items-center space-x-3">
            <!-- 语言切换 -->
            <div class="relative" v-click-outside="closeLanguageDropdown">
              <button 
                @click="toggleLanguageDropdown" 
                class="flex items-center space-x-1 px-3 py-2 border border-gray-200 rounded-lg shadow-sm hover:border-gray-300 text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 transition-all duration-200"
              >
                <span class="text-sm font-medium">
                  <span class="hidden sm:inline-block">
                    {{ currentLanguage === 'zh' ? '中文' : 
                       currentLanguage === 'en' ? 'English' : 
                       currentLanguage === 'vi' ? 'Tiếng Việt' : 'हिन्दी' }}
                  </span>
                  <span class="inline-block sm:hidden">
                    {{ currentLanguage === 'zh' ? '中' : 
                       currentLanguage === 'en' ? 'EN' : 
                       currentLanguage === 'vi' ? 'VI' : 'HI' }}
                  </span>
                </span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-4 w-4 text-gray-500 transition-transform duration-200"
                  :class="{ 'transform rotate-180': isLanguageOpen }"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <!-- 语言下拉菜单 -->
              <transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
              >
                <div v-show="isLanguageOpen" class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  <a 
                    v-for="lang in languages" 
                    :key="lang.code"
                    href="#" 
                    @click.prevent="setLanguage(lang.code)" 
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  >
                    <div class="flex items-center">
                      <span class="mr-2 flag-icon">{{ lang.flag }}</span>
                      <span>{{ lang.name }}</span>
                      <span v-if="currentLanguage === lang.code" class="ml-auto text-orange-500">✓</span>
                    </div>
                  </a>
                </div>
              </transition>
            </div>
            
            <!-- 移动菜单按钮 -->
            <button @click="isMenuOpen = !isMenuOpen" class="md:hidden flex items-center p-2 rounded-lg text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none">
              <svg :class="isMenuOpen ? 'hidden' : 'block'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg :class="isMenuOpen ? 'block' : 'hidden'" class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <!-- 移动端菜单 -->
        <div :class="isMenuOpen ? 'block' : 'hidden'" class="md:hidden">
          <div class="pt-2 pb-4 space-y-1">
            <router-link to="/" class="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50/70 transition-colors duration-200"
              :class="$route.path === '/' ? 'text-orange-600 bg-orange-50/70' : ''">
              {{ $t('navigation.home') }}
            </router-link>
            <router-link to="/events" class="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50/70 transition-colors duration-200"
              :class="$route.path === '/events' ? 'text-orange-600 bg-orange-50/70' : ''">
              {{ $t('navigation.events') }}
            </router-link>
            <router-link to="/landmarks" class="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50/70 transition-colors duration-200"
              :class="$route.path === '/landmarks' ? 'text-orange-600 bg-orange-50/70' : ''">
              {{ $t('navigation.landmarks') }}
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
    
    <!-- Language Selector Modal -->
    <LanguageSelector :is-open="isLanguageModalOpen" @close="closeLanguageModal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import LanguageSelector from './components/LanguageSelector.vue'

const route = useRoute()
const { locale } = useI18n()
const currentLanguage = ref(locale.value)
const isLanguageOpen = ref(false)
const isMenuOpen = ref(false)
const isLanguageModalOpen = ref(false)

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
]

const toggleLanguageDropdown = () => {
  isLanguageOpen.value = !isLanguageOpen.value
}

const closeLanguageDropdown = () => {
  isLanguageOpen.value = false
}

const setLanguage = (lang) => {
  currentLanguage.value = lang
  locale.value = lang
  localStorage.setItem('language', lang)
  closeLanguageDropdown()
  // 当用户选择语言时，显示语言选择器
  if (route.path === '/landmarks' || route.path === '/events') {
    isLanguageModalOpen.value = true
  }
}

const closeLanguageModal = () => {
  isLanguageModalOpen.value = false
}

// 点击外部关闭下拉菜单的指令
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
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
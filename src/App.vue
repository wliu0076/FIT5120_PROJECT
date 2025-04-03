<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <!-- Logo -->
            <div class="flex-shrink-0 flex items-center">
              <img class="h-8 w-auto" src="/logo.png" alt="Logo" />
            </div>
            
            <!-- 导航链接 -->
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

          <!-- 右侧工具栏 -->
          <div class="flex items-center space-x-4">
            <!-- 翻译按钮 -->
            <TranslateButton />
            
            <!-- 语言选择器 -->
            <select 
              v-model="currentLanguage" 
              @change="changeLanguage"
              class="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="zh">中文</option>
              <option value="en">English</option>
              <option value="vi">Tiếng Việt</option>
            </select>
          </div>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import TranslateButton from './components/TranslateButton.vue'

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

/* 滚动条美化 */
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
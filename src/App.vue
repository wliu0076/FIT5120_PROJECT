<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <nav class="bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg transition duration-500 ease-in-out transform hover:scale-105 text-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="flex items-center">
                <img class="h-14 w-auto" src="/src/assets/logo.png" alt="Logo" />
              </router-link>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link to="/" class="border-transparent text-white hover:border-white hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold" :class="{ 'border-white text-white': $route.path === '/' }">
                Home
              </router-link>
              <router-link to="/events" class="border-transparent text-white hover:border-white hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold" :class="{ 'border-white text-white': $route.path === '/events' }">
                Events
              </router-link>
              <router-link to="/landmarks" class="border-transparent text-white hover:border-white hover:text-gray-200 inline-flex items-center px-1 pt-1 border-b-2 text-lg font-semibold" :class="{ 'border-white text-white': $route.path === '/landmarks' }">
                Landmarks
              </router-link>
            </div>
          </div>
          <div class="flex items-center">
            <!-- Removed translation select box -->
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <transition name="fade" mode="out-in">
        <RouterView />
      </transition>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()
const { locale } = useI18n()
const isMenuOpen = ref(false)

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

// Loading animation for cultural landmarks
const isLoading = ref(true)

setTimeout(() => {
  isLoading.value = false
}, 2000) // Simulate loading time
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}
</style> 
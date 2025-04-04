<template>
  <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop with blur effect -->
    <div class="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
    
    <!-- Modal content -->
    <div class="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6 z-10">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">Welcome! Please choose your preferred language 🌐</h2>
        <p class="text-gray-600">Select your language to continue</p>
      </div>
      
      <div class="space-y-4">
        <button 
          v-for="lang in languages" 
          :key="lang.code"
          @click="selectLanguage(lang.code)"
          class="group w-full flex items-center justify-center p-4 rounded-lg border-2 transition-all duration-300 relative overflow-hidden"
          :class="[
            'hover:scale-105',
            'animate-pulse-border',
            lang.code === 'en' ? 'border-blue-500 hover:bg-blue-50' :
            lang.code === 'zh' ? 'border-red-500 hover:bg-red-50' :
            lang.code === 'vi' ? 'border-green-500 hover:bg-green-50' :
            'border-orange-500 hover:bg-orange-50'
          ]"
        >
          <!-- Gradient background -->
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
               :class="[
                 lang.code === 'en' ? 'bg-gradient-to-r from-blue-100 to-blue-200' :
                 lang.code === 'zh' ? 'bg-gradient-to-r from-red-100 to-red-200' :
                 lang.code === 'vi' ? 'bg-gradient-to-r from-green-100 to-green-200' :
                 'bg-gradient-to-r from-orange-100 to-orange-200'
               ]">
          </div>
          
          <!-- Content -->
          <div class="relative flex items-center space-x-3">
            <span class="text-3xl transform group-hover:scale-110 transition-transform duration-300">{{ lang.flag }}</span>
            <span class="text-lg font-medium group-hover:font-bold transition-all duration-300">{{ lang.name }}</span>
          </div>
          
          <!-- Tooltip -->
          <div class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Click to read in {{ lang.name }}
          </div>
        </button>
      </div>
      
      <div class="mt-6 flex items-center justify-center">
        <label class="flex items-center cursor-pointer group">
          <input 
            type="checkbox" 
            v-model="dontShowAgain" 
            class="form-checkbox h-5 w-5 text-blue-600 rounded transition-colors duration-200"
          >
          <span class="ml-2 text-gray-700 group-hover:text-gray-900 transition-colors duration-200">Don't show this again</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const showModal = ref(false)
const dontShowAgain = ref(false)

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '简体中文', flag: '🇨🇳' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
]

onMounted(() => {
  // Check if user has already selected a language
  const savedLanguage = localStorage.getItem('language')
  const dontShowAgain = localStorage.getItem('dontShowLanguageSelector')
  
  if (savedLanguage) {
    locale.value = savedLanguage
  } else if (!dontShowAgain) {
    // Show the language selector if no language is saved and user hasn't chosen to hide it
    showModal.value = true
  }
})

const selectLanguage = (langCode) => {
  locale.value = langCode
  localStorage.setItem('language', langCode)
  
  if (dontShowAgain.value) {
    localStorage.setItem('dontShowLanguageSelector', 'true')
  }
  
  showModal.value = false
}
</script>

<style scoped>
.form-checkbox {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid #d1d5db;
  border-radius: 0.25rem;
  background-color: white;
  position: relative;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.form-checkbox:hover {
  border-color: #2563eb;
  transform: scale(1.05);
}

.form-checkbox:checked {
  background-color: #2563eb;
  border-color: #2563eb;
}

.form-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

@keyframes pulse-border {
  0% {
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(37, 99, 235, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
  }
}

.animate-pulse-border {
  animation: pulse-border 2s infinite;
}
</style> 
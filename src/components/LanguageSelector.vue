<template>
  <div v-if="showModal" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

      <!-- Modal panel -->
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 class="text-2xl font-bold text-center mb-8">{{ $t('home.language.viewIn') }}</h3>
          
          <div class="grid grid-cols-2 gap-4">
            <button v-for="lang in languages" :key="lang.code"
              @click="selectLanguage(lang.code)"
              class="relative p-4 rounded-lg border-2 transition-all duration-300 group hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <!-- Content -->
              <div class="relative flex items-center space-x-3">
                <span class="text-3xl transform group-hover:scale-110 transition-transform duration-300">{{ lang.flag }}</span>
                <span class="text-lg font-medium group-hover:font-bold transition-all duration-300">{{ lang.name }}</span>
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
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const showModal = ref(false)
const dontShowAgain = ref(false)

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' }
]

const selectLanguage = (lang) => {
  locale.value = lang
  localStorage.setItem('language', lang)
  if (dontShowAgain.value) {
    localStorage.setItem('hideLanguageModal', 'true')
  }
  emit('close')
}

watch(() => props.isOpen, (newVal) => {
  showModal.value = newVal
})
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
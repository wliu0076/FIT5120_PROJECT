<template>
  <div class="translate-button">
    <button
      @click="toggleTranslation"
      :disabled="isTranslating"
      class="translate-btn"
    >
      <span v-if="!isTranslating">{{ buttonText }}</span>
      <span v-else class="translating">
        翻译中
        <span class="dots">...</span>
      </span>
    </button>
    
    <div v-if="showLanguages" class="language-dropdown">
      <div
        v-for="lang in languages"
        :key="lang.code"
        class="language-option"
        @click="selectLanguage(lang.code)"
      >
        {{ lang.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAutoTranslation } from '../composables/useTranslation'

const { isTranslating, translatePage } = useAutoTranslation()

const showLanguages = ref(false)
const selectedLang = ref('zh')

const languages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'vi', name: 'Tiếng Việt' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'es', name: 'Español' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' }
]

const buttonText = computed(() => {
  const lang = languages.find(l => l.code === selectedLang.value)
  return `翻译到${lang?.name}`
})

const toggleTranslation = () => {
  showLanguages.value = !showLanguages.value
}

const selectLanguage = async (langCode: string) => {
  selectedLang.value = langCode
  showLanguages.value = false
  await translatePage(langCode)
}
</script>

<style scoped>
.translate-button {
  position: relative;
  display: inline-block;
}

.translate-btn {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
  min-width: 120px;
}

.translate-btn:hover {
  background-color: #45a049;
}

.translate-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.translating {
  display: inline-flex;
  align-items: center;
}

.dots {
  display: inline-block;
  width: 12px;
  animation: dots 1.4s infinite;
}

@keyframes dots {
  0%, 20% { content: '.'; }
  40% { content: '..'; }
  60%, 100% { content: '...'; }
}

.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 150px;
  max-height: 300px;
  overflow-y: auto;
}

.language-option {
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  white-space: nowrap;
}

.language-option:hover {
  background-color: #f5f5f5;
}

/* 美化滚动条 */
.language-dropdown::-webkit-scrollbar {
  width: 6px;
}

.language-dropdown::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 3px;
}

.language-dropdown::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}
</style> 
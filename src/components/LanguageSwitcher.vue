<template>
  <div class="language-switcher">
    <select v-model="currentLocale" @change="changeLanguage" class="locale-select">
      <option value="zh">中文</option>
      <option value="en">English</option>
      <option value="vi">Tiếng Việt</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const currentLocale = ref(locale.value)

const changeLanguage = () => {
  locale.value = currentLocale.value
}

watch(() => locale.value, (newLocale) => {
  currentLocale.value = newLocale
})
</script>

<style scoped>
.language-switcher {
  display: inline-block;
  margin-left: 1rem;
}

.locale-select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 0.9rem;
  cursor: pointer;
  outline: none;
}

.locale-select:hover {
  border-color: #666;
}

.locale-select:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}
</style> 
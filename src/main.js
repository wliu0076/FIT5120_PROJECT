import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import './assets/main.css'

import en from './locales/en.json'
import zh from './locales/zh.json'
import vi from './locales/vi.json'

// 从 localStorage 获取语言设置
const getLanguage = () => {
  const savedLanguage = localStorage.getItem('language')
  return savedLanguage || navigator.language.split('-')[0] || 'zh'
}

const i18n = createI18n({
  legacy: false, 
  locale: getLanguage(), 
  fallbackLocale: 'en', 
  messages: {
    en,
    zh,
    vi
  }
})

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app') 
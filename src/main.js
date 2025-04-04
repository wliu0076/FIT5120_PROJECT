import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import './assets/main.css'

import en from './locales/en.json'
import zh from './locales/zh.json'
import vi from './locales/vi.json'

const i18n = createI18n({
  legacy: false, 
  locale: localStorage.getItem('language') || 'zh', 
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
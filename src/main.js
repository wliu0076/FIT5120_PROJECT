import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import './assets/main.css'

import en from './locales/en.json'
import zh from './locales/zh.json'
import vi from './locales/vi.json'

// 获取 cookie 中的语言设置
const getLanguageFromCookie = () => {
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'language') {
      return value
    }
  }
  return 'zh' // 默认语言
}

const i18n = createI18n({
  legacy: false, 
  locale: getLanguageFromCookie(), 
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
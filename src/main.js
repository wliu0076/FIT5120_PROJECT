import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// 导入翻译文件
import en from './locales/en.json'
import zh from './locales/zh.json'
import vi from './locales/vi.json'

// 创建 i18n 实例
const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: localStorage.getItem('language') || 'zh', // 默认语言
  fallbackLocale: 'en', // 回退语言
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
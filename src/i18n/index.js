import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import zh from '../locales/zh.json'
import hi from '../locales/hi.json'

// 获取存储的语言或使用英语作为默认值
const getLanguage = () => {
  // 首先尝试从localStorage获取
  const savedLanguage = localStorage.getItem('language')
  
  // 如果有保存的值，则使用它，否则使用英语
  if (savedLanguage) {
    // 保存到localStorage以备将来使用
    localStorage.setItem('language', savedLanguage)
    return savedLanguage
  }
  
  // 默认设置为英语
  localStorage.setItem('language', 'en')
  return 'en'
}

const i18n = createI18n({
  legacy: false,
  locale: getLanguage(),
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
    hi
  }
})

export default i18n 
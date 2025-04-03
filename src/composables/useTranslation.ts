import { ref } from 'vue'

const API_URL = 'https://api.mymemory.translated.net/get'

export function useAutoTranslation() {
  const isTranslating = ref(false)
  
  const translateText = async (text: string, targetLang: string) => {
    try {
      // 获取源语言
      const sourceLang = document.documentElement.lang || 'zh'
      const langPair = `${sourceLang}|${targetLang}`
      
      const response = await fetch(`${API_URL}?q=${encodeURIComponent(text)}&langpair=${langPair}`)
      const data = await response.json()
      
      if (data.responseStatus === 200 && data.responseData.translatedText) {
        return data.responseData.translatedText
      }
      return text
    } catch (error) {
      console.error('Translation error:', error)
      return text
    }
  }
  
  const translatePage = async (targetLang: string) => {
    isTranslating.value = true
    
    try {
      // 获取所有文本节点
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      )
      
      const textNodes: Text[] = []
      let node: Text | null = walker.nextNode() as Text
      
      while (node) {
        const parentElement = node.parentElement
        // 排除脚本和样式标签中的文本
        if (
          parentElement &&
          !['SCRIPT', 'STYLE'].includes(parentElement.tagName) &&
          node.textContent &&
          node.textContent.trim()
        ) {
          textNodes.push(node)
        }
        node = walker.nextNode() as Text
      }
      
      // 批量翻译文本，每次最多翻译5个节点，避免超出API限制
      const batchSize = 5
      for (let i = 0; i < textNodes.length; i += batchSize) {
        const batch = textNodes.slice(i, i + batchSize)
        await Promise.all(
          batch.map(async (node) => {
            const originalText = node.textContent?.trim()
            if (originalText && originalText.length > 0) {
              const translatedText = await translateText(originalText, targetLang)
              if (node.textContent) {
                node.textContent = node.textContent.replace(originalText, translatedText)
              }
            }
          })
        )
        // 添加延迟以避免API限制
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error) {
      console.error('Page translation error:', error)
    } finally {
      isTranslating.value = false
    }
  }
  
  return {
    isTranslating,
    translatePage,
  }
} 
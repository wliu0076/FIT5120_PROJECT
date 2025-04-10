import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://3.107.74.118:5000',
        changeOrigin: true,
        secure: false,
        // 移除路径重写，保留完整的API路径
        // rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}) 
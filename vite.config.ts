import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./public/assets', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/upload_image': 'http://localhost:8080',
      '/upload_file': 'http://localhost:8080',
      '/get_image': 'http://localhost:8080',
      '/get_file': 'http://localhost:8080',
      '/get_record': 'http://localhost:8080',
      '/get_video': 'http://localhost:8080',
    },
  },
})

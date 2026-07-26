import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: 'examples',
  plugins: [react()],
  resolve: {
    alias: {
      'ddd-charts': fileURLToPath(new URL('./src/index.ts', import.meta.url))
    }
  }
})

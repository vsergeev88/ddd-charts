import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    ...(mode === 'test'
      ? []
      : [
          dts({
            include: ['src'],
            exclude: ['src/**/*.test.*', 'src/**/__tests__/**'],
            insertTypesEntry: true
          })
        ])
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: 'src/index.ts',
      name: 'DddCharts',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'ddd-charts.js' : 'ddd-charts.cjs')
    },
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'three',
        '@react-three/fiber',
        '@react-three/drei',
        '@react-three/postprocessing',
        'postprocessing',
        /^three\/.+/
      ]
    }
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}']
  }
}))

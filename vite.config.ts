import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages sirve el sitio en /<repo>/, no en la raiz del dominio.
export default defineConfig({
  base: '/txaro-kandler/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsInlineLimit: 2048,
  },
})
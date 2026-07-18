import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // 3D-движок (three.js + rapier) грузится отдельным ленивым чанком по клику,
    // поэтому его вес ожидаем — не засоряем лог предупреждением.
    chunkSizeWarningLimit: 3500,
  },
  preview: {
    host: true,
    // Railway assigns a *.up.railway.app host (and custom domains) — allow them.
    allowedHosts: true,
  },
})

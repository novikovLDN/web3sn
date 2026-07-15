import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    host: true,
    // Railway assigns a *.up.railway.app host (and custom domains) — allow them.
    allowedHosts: true,
  },
})

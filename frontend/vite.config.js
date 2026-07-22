import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  server: {
    origin: 'https://flying-tortoise.vercel.app'
  },
  plugins: [react()],
})
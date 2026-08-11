import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE_PATH is set by GitHub Actions to /<repo-name>/ for GH Pages.
// Defaults to '/' for Vercel and local dev.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || '/',
})

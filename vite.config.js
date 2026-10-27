import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// React + Vite for the mobile-first site. Assets stay in the root-level
// `assets/` directory; components reference them by relative import so the
// development server and the production build resolve the same files.
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the site from the repository subpath:
  // https://mrutkarshrajchauhan.github.io/my-mobile-website/
  base: '/my-mobile-website/',
})

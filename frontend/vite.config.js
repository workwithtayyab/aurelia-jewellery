import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { validateApiUrl } from './validate-api-url.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  if (mode === 'production') {
    const env = loadEnv(mode, process.cwd(), 'VITE_')
    const { mode: apiMode, url } = validateApiUrl(env.VITE_API_URL)

    console.log(
      apiMode === 'same-origin'
        ? '\n[aurelia] API mode: same-origin (/api proxied by vercel.json)\n'
        : `\n[aurelia] API base URL for this build: ${url}\n`
    )
  }

  return {
    plugins: [react()],
  }
})

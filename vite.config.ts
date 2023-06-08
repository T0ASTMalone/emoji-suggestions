import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', 
    setupFiles: ['./__tests__/setup.ts'],
    testMatch: ['./__tests__/**/*.test.tsx'],
    globals: true,
  }
})

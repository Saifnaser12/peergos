import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': {},
    process: {
      env: {},
      browser: true
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5000,
    strictPort: false,
    hmr: {
      overlay: false,
    },
    fs: {
      allow: ['..']
    },
    allowedHosts: [
      'all',
      '04d74696-48b6-49ed-b46b-b28d6dd648f8-00-2exwgkv38g3ls.pike.replit.dev'
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          i18n: ['react-i18next', 'i18next']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
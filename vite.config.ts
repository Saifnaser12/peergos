
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: false,
    hmr: {
      overlay: false,
      clientPort: 443
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
    sourcemap: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})

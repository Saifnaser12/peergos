import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    process: JSON.stringify({
      env: {},
      version: 'v18.0.0',
      versions: { node: '18.0.0', npm: '9.0.0' },
      platform: 'browser',
      arch: 'x64',
      pid: 1,
      ppid: 0,
      title: 'browser',
      argv: ['node'],
      browser: true
    }),
    'process.env': '{}',
    'process.browser': 'true',
    'process.version': '"v18.0.0"',
    'process.versions': '{"node":"18.0.0"}',
    'process.platform': '"browser"',
    'process.arch': '"x64"',
    'process.pid': '1',
    'process.ppid': '0',
    'process.title': '"browser"',
    'process.argv': '["node"]',
    'process.cwd': '() => "/"',
    'process.nextTick': '(fn, ...args) => setTimeout(() => fn(...args), 0)',
    'process.exit': '() => {}',
    'process.stdout': '{ write: (data) => console.log(data) }',
    'process.stderr': '{ write: (data) => console.error(data) }',
    __dirname: '""',
    __filename: '""'
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
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
    sourcemap: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})

// Polyfills for browser compatibility
(window as any).global = window;

// Define process object for browser environment
if (typeof window !== 'undefined' && !window.process) {
  (window as any).process = {
    env: {
      NODE_ENV: 'development'
    },
    browser: true,
    version: '',
    versions: {},
    nextTick: (fn: Function) => setTimeout(fn, 0),
    cwd: () => '/',
    chdir: () => {},
    stdout: { write: () => {} },
    stderr: { write: () => {} }
  };
}

// Buffer polyfill
if (typeof window !== 'undefined' && !window.Buffer) {
  try {
    const { Buffer } = require('buffer');
    (window as any).Buffer = Buffer;
  } catch (e) {
    // Buffer not available
  }
}

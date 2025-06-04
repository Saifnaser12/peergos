// Essential polyfills for browser compatibility
declare global {
  interface Window {
    process: any;
    global: any;
    Buffer: any;
  }
}

// Only add if not already defined
if (typeof globalThis.process === 'undefined') {
  globalThis.process = {
    env: {},
    browser: true,
    version: '18.0.0',
    versions: { node: '18.0.0' },
    platform: 'browser',
    nextTick: (fn: Function, ...args: any[]) => setTimeout(() => fn(...args), 0),
    cwd: () => '/',
    argv: ['node'],
    exit: () => {},
    stdout: { write: (data: any) => console.log(data) },
    stderr: { write: (data: any) => console.error(data) }
  };
}

if (typeof globalThis.global === 'undefined') {
  globalThis.global = globalThis;
}

// Ensure window has these as well
if (typeof window !== 'undefined') {
  window.process = globalThis.process;
  window.global = globalThis.global;
}

export {};
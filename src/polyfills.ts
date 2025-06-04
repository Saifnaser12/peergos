
// Polyfill for Node.js globals in browser environment
declare global {
  var process: any;
  var global: any;
  var Buffer: any;
}

// Process polyfill
if (typeof globalThis.process === 'undefined') {
  globalThis.process = {
    env: {},
    version: '',
    versions: { node: '18.0.0' },
    platform: 'browser',
    arch: 'x64',
    nextTick: (fn: Function, ...args: any[]) => setTimeout(() => fn(...args), 0),
    cwd: () => '/',
    argv: ['node'],
    exit: (code?: number) => {},
    stdout: { 
      write: (data: string) => console.log(data) 
    },
    stderr: { 
      write: (data: string) => console.error(data) 
    },
    pid: 1,
    ppid: 0,
    title: 'browser',
    browser: true
  };
}

// Global polyfill
if (typeof globalThis.global === 'undefined') {
  globalThis.global = globalThis;
}

// Buffer polyfill (basic implementation)
if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = {
    from: (data: any) => new Uint8Array(data),
    alloc: (size: number) => new Uint8Array(size),
    isBuffer: (obj: any) => false
  };
}

export {};

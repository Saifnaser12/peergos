// Essential polyfills that must be loaded before any other modules
(function() {
  // Ensure globalThis exists
  if (typeof globalThis === 'undefined') {
    (window as any).globalThis = window;
  }

  // Comprehensive process polyfill
  if (!globalThis.process) {
    globalThis.process = {
      env: {},
      version: 'v18.0.0',
      versions: { node: '18.0.0', npm: '9.0.0' },
      platform: 'browser',
      arch: 'x64',
      pid: 1,
      ppid: 0,
      title: 'browser',
      argv: ['node'],
      cwd: () => '/',
      chdir: () => {},
      nextTick: (fn: Function, ...args: any[]) => setTimeout(() => fn(...args), 0),
      exit: () => {},
      kill: () => {},
      stdout: { 
        write: (data: any) => console.log(data),
        isTTY: false 
      },
      stderr: { 
        write: (data: any) => console.error(data),
        isTTY: false 
      },
      stdin: { 
        read: () => null,
        isTTY: false 
      },
      browser: true,
      emitWarning: () => {},
      binding: () => ({}),
      umask: () => 0,
      hrtime: () => [Math.floor(Date.now() / 1000), 0],
      uptime: () => Date.now() / 1000,
      memoryUsage: () => ({ rss: 0, heapTotal: 0, heapUsed: 0, external: 0 }),
      cpuUsage: () => ({ user: 0, system: 0 }),
      resourceUsage: () => ({ userCPUTime: 0, systemCPUTime: 0 }),
      getuid: () => 0,
      getgid: () => 0,
      setuid: () => {},
      setgid: () => {},
      on: () => {},
      off: () => {},
      once: () => {},
      emit: () => false,
      listeners: () => [],
      removeListener: () => {},
      removeAllListeners: () => {},
      setMaxListeners: () => {},
      getMaxListeners: () => 0
    };
  }

  // Global polyfill
  if (!globalThis.global) {
    globalThis.global = globalThis;
  }

  // Buffer polyfill
  if (!globalThis.Buffer) {
    globalThis.Buffer = {
      from: (data: any) => new Uint8Array(Array.isArray(data) ? data : []),
      alloc: (size: number) => new Uint8Array(size),
      allocUnsafe: (size: number) => new Uint8Array(size),
      isBuffer: () => false,
      byteLength: (data: any) => data.length || 0,
      compare: () => 0,
      concat: (list: any[]) => new Uint8Array(list.reduce((acc, curr) => acc + curr.length, 0))
    };
  }

  // Module polyfills
  if (!globalThis.module) {
    globalThis.module = { exports: {} };
  }

  if (!globalThis.exports) {
    globalThis.exports = {};
  }

  // Node.js specific globals
  if (!globalThis.__dirname) {
    globalThis.__dirname = '/';
  }

  if (!globalThis.__filename) {
    globalThis.__filename = '/index.js';
  }

  // Performance polyfill
  if (!globalThis.performance) {
    globalThis.performance = {
      now: () => Date.now(),
      mark: () => {},
      measure: () => {},
      clearMarks: () => {},
      clearMeasures: () => {},
      getEntriesByName: () => [],
      getEntriesByType: () => [],
      getEntries: () => []
    };
  }

  // Console enhancement
  if (typeof console !== 'undefined') {
    ['debug', 'info', 'warn', 'error', 'log', 'trace', 'assert'].forEach(method => {
      if (!console[method as keyof Console]) {
        (console as any)[method] = console.log || (() => {});
      }
    });
  }

  console.log('✅ Polyfills loaded successfully');
})();

export {};
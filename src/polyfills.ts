// Immediately executed global polyfills - must run before any imports
(() => {
  'use strict';

  // Ensure process exists globally before any module loading
  if (typeof window !== 'undefined' && !window.process) {
    window.process = {
      env: {},
      version: '18.0.0',
      versions: { 
        node: '18.0.0',
        v8: '10.0.0',
        uv: '1.43.0',
        zlib: '1.2.11',
        brotli: '1.0.9',
        ares: '1.18.1',
        modules: '108',
        nghttp2: '1.47.0',
        napi: '8',
        llhttp: '6.0.4',
        openssl: '3.0.2',
        cldr: '41.0',
        icu: '71.1',
        tz: '2022a',
        unicode: '14.0'
      },
      platform: 'browser',
      arch: 'x64',
      nextTick: function(callback, ...args) {
        setTimeout(() => callback.apply(null, args), 0);
      },
      cwd: () => '/',
      chdir: () => {},
      argv: ['node', 'browser'],
      argv0: 'node',
      execArgv: [],
      execPath: '/usr/local/bin/node',
      exit: (code) => { 
        console.warn('process.exit called with code:', code); 
      },
      exitCode: 0,
      stdout: { 
        write: (data) => { 
          console.log(data); 
          return true; 
        },
        isTTY: false
      },
      stderr: { 
        write: (data) => { 
          console.error(data); 
          return true; 
        },
        isTTY: false
      },
      stdin: {
        read: () => null,
        isTTY: false
      },
      pid: 1,
      ppid: 0,
      title: 'browser',
      browser: true,
      uptime: () => Date.now() / 1000,
      hrtime: () => [Math.floor(Date.now() / 1000), (Date.now() % 1000) * 1000000],
      memoryUsage: () => ({
        rss: 0,
        heapTotal: 0,
        heapUsed: 0,
        external: 0,
        arrayBuffers: 0
      }),
      cpuUsage: () => ({ user: 0, system: 0 }),
      umask: () => 0o022,
      binding: () => {},
      _linkedBinding: () => {},
      dlopen: () => {},
      _rawDebug: () => {},
      moduleLoadList: [],
      domain: null,
      _exiting: false,
      config: {},
      debugPort: 9229
    };
  }

  // Global polyfill
  if (typeof window !== 'undefined' && !window.global) {
    window.global = window;
  }

  // Buffer polyfill
  if (typeof window !== 'undefined' && !window.Buffer) {
    window.Buffer = {
      from: function(data, encoding) {
        if (typeof data === 'string') {
          return new TextEncoder().encode(data);
        }
        return new Uint8Array(data);
      },
      alloc: function(size, fill) {
        const buffer = new Uint8Array(size);
        if (fill !== undefined) {
          buffer.fill(fill);
        }
        return buffer;
      },
      allocUnsafe: function(size) {
        return new Uint8Array(size);
      },
      isBuffer: function(obj) {
        return obj instanceof Uint8Array;
      },
      byteLength: function(string) {
        return new TextEncoder().encode(string).length;
      },
      compare: function(buf1, buf2) {
        for (let i = 0; i < Math.min(buf1.length, buf2.length); i++) {
          if (buf1[i] < buf2[i]) return -1;
          if (buf1[i] > buf2[i]) return 1;
        }
        return buf1.length - buf2.length;
      },
      concat: function(list, totalLength) {
        const result = new Uint8Array(totalLength || list.reduce((acc, buf) => acc + buf.length, 0));
        let offset = 0;
        for (const buf of list) {
          result.set(buf, offset);
          offset += buf.length;
        }
        return result;
      }
    };
  }

  // __dirname and __filename polyfills
  if (typeof window !== 'undefined') {
    if (!window.__dirname) {
      window.__dirname = '/';
    }

    if (!window.__filename) {
      window.__filename = '/index.js';
    }
  }

  // Also set on globalThis for compatibility
  if (typeof globalThis !== 'undefined') {
    if (!globalThis.process) {
      globalThis.process = window.process;
    }
    if (!globalThis.global) {
      globalThis.global = globalThis;
    }
    if (!globalThis.Buffer) {
      globalThis.Buffer = window.Buffer;
    }
  }

})();

export {};
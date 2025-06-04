
// Enhanced polyfills for Node.js globals in browser environment
// This must be loaded before any other modules

(function() {
  'use strict';
  
  // Process polyfill with comprehensive API
  if (typeof globalThis.process === 'undefined') {
    globalThis.process = {
      env: import.meta?.env || {},
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
      release: {
        name: 'node',
        sourceUrl: 'https://nodejs.org/download/release/v18.0.0/node-v18.0.0.tar.gz',
        headersUrl: 'https://nodejs.org/download/release/v18.0.0/node-v18.0.0-headers.tar.gz'
      },
      nextTick: function(callback, ...args) {
        if (typeof callback !== 'function') {
          throw new TypeError('Callback must be a function');
        }
        setTimeout(() => callback.apply(null, args), 0);
      },
      cwd: () => '/',
      chdir: () => {},
      argv: ['node', 'browser'],
      argv0: 'node',
      execArgv: [],
      execPath: '/usr/local/bin/node',
      exit: (code) => { console.warn('process.exit called with code:', code); },
      exitCode: 0,
      getgid: () => 1000,
      setgid: () => {},
      getuid: () => 1000,
      setuid: () => {},
      geteuid: () => 1000,
      getegid: () => 1000,
      getgroups: () => [1000],
      setgroups: () => {},
      initgroups: () => {},
      stdout: { 
        write: (data) => { console.log(data); return true; },
        isTTY: false
      },
      stderr: { 
        write: (data) => { console.error(data); return true; },
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
      resourceUsage: () => ({
        userCPUTime: 0,
        systemCPUTime: 0,
        maxRSS: 0,
        sharedMemorySize: 0,
        unsharedDataSize: 0,
        unsharedStackSize: 0,
        minorPageFault: 0,
        majorPageFault: 0,
        swappedOut: 0,
        fsRead: 0,
        fsWrite: 0,
        ipcSent: 0,
        ipcReceived: 0,
        signalsCount: 0,
        voluntaryContextSwitches: 0,
        involuntaryContextSwitches: 0
      }),
      umask: () => 0o022,
      binding: () => {},
      _linkedBinding: () => {},
      dlopen: () => {},
      _rawDebug: () => {},
      moduleLoadList: [],
      domain: null,
      _exiting: false,
      config: {},
      debugPort: 9229,
      _debugProcess: () => {},
      _debugEnd: () => {},
      _startProfilerIdleNotifier: () => {},
      _stopProfilerIdleNotifier: () => {},
      stdout: { write: (data) => console.log(data) },
      stderr: { write: (data) => console.error(data) }
    };
  }

  // Global polyfill
  if (typeof globalThis.global === 'undefined') {
    globalThis.global = globalThis;
  }

  // Buffer polyfill
  if (typeof globalThis.Buffer === 'undefined') {
    globalThis.Buffer = {
      from: function(data, encoding) {
        if (typeof data === 'string') {
          return new TextEncoder().encode(data);
        }
        return new Uint8Array(data);
      },
      alloc: function(size, fill, encoding) {
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
      byteLength: function(string, encoding) {
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
  if (typeof globalThis.__dirname === 'undefined') {
    globalThis.__dirname = '/';
  }
  
  if (typeof globalThis.__filename === 'undefined') {
    globalThis.__filename = '/index.js';
  }

})();

export {};

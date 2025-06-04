
// Critical polyfills for browser compatibility
declare global {
  interface Window {
    process: any;
    global: any;
    Buffer: any;
  }
}

if (typeof globalThis.process === 'undefined') {
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
    cwd: function() { return '/'; },
    chdir: function() {},
    nextTick: function(fn: Function, ...args: any[]) { 
      setTimeout(function() { fn.apply(null, args); }, 0);
    },
    exit: function() {},
    kill: function() {},
    stdout: { 
      write: function(data: any) { console.log(data); },
      isTTY: false 
    },
    stderr: { 
      write: function(data: any) { console.error(data); },
      isTTY: false 
    },
    stdin: { 
      read: function() { return null; },
      isTTY: false 
    },
    browser: true,
    emitWarning: function() {},
    binding: function() { return {}; },
    umask: function() { return 0; },
    hrtime: function() { return [Math.floor(Date.now() / 1000), 0]; },
    uptime: function() { return Date.now() / 1000; },
    memoryUsage: function() { return { rss: 0, heapTotal: 0, heapUsed: 0, external: 0 }; },
    cpuUsage: function() { return { user: 0, system: 0 }; },
    getuid: function() { return 0; },
    getgid: function() { return 0; },
    setuid: function() {},
    setgid: function() {},
    on: function() {},
    off: function() {},
    once: function() {},
    emit: function() { return false; },
    listeners: function() { return []; },
    removeListener: function() {},
    removeAllListeners: function() {},
    setMaxListeners: function() {},
    getMaxListeners: function() { return 0; }
  };
}

if (typeof globalThis.global === 'undefined') {
  globalThis.global = globalThis;
}

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = {
    from: function(data: any) { return new Uint8Array(data); },
    alloc: function(size: number) { return new Uint8Array(size); },
    allocUnsafe: function(size: number) { return new Uint8Array(size); },
    isBuffer: function() { return false; },
    byteLength: function(data: any) { return data.length || 0; },
    compare: function() { return 0; },
    concat: function(list: any[]) {
      const totalLength = list.reduce((acc, curr) => acc + curr.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (let i = 0; i < list.length; i++) {
        result.set(list[i], offset);
        offset += list[i].length;
      }
      return result;
    }
  };
}

// Ensure window objects exist
if (typeof window !== 'undefined') {
  window.process = globalThis.process;
  window.global = globalThis;
  window.Buffer = globalThis.Buffer;
}

export {};

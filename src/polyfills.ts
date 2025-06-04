// Global polyfills for browser environment
if (typeof globalThis.process === 'undefined') {
  globalThis.process = {
    env: {},
    version: 'v18.0.0',
    versions: { node: '18.0.0' },
    platform: 'browser',
    arch: 'x64',
    nextTick: (fn: Function, ...args: any[]) => setTimeout(() => fn(...args), 0),
    cwd: () => '/',
    argv: ['node'],
    exit: () => {},
    stdout: { 
      write: (data: any) => console.log(data),
      on: () => {},
      once: () => {},
      emit: () => {}
    },
    stderr: { 
      write: (data: any) => console.error(data),
      on: () => {},
      once: () => {},
      emit: () => {}
    },
    pid: 1,
    ppid: 0,
    title: 'browser',
    browser: true,
    on: () => {},
    once: () => {},
    emit: () => {},
    removeListener: () => {},
    removeAllListeners: () => {}
  };
}

if (typeof globalThis.global === 'undefined') {
  globalThis.global = globalThis;
}

if (typeof globalThis.Buffer === 'undefined') {
  globalThis.Buffer = {
    from: (data: any) => new Uint8Array(data),
    alloc: (size: number) => new Uint8Array(size),
    isBuffer: () => false,
    concat: (list: Uint8Array[]) => {
      const totalLength = list.reduce((acc, buf) => acc + buf.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const buf of list) {
        result.set(buf, offset);
        offset += buf.length;
      }
      return result;
    }
  };
}

// Ensure window objects exist
if (typeof window !== 'undefined') {
  (window as any).process = globalThis.process;
  (window as any).global = globalThis;
  (window as any).Buffer = globalThis.Buffer;
}

export {};
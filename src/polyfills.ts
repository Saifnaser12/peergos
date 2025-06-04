
// Polyfill for Node.js process object in browser
if (typeof globalThis.process === 'undefined') {
  globalThis.process = {
    env: import.meta.env,
    version: '',
    versions: {},
    platform: 'browser',
    nextTick: (fn: Function) => setTimeout(fn, 0),
    cwd: () => '/',
    argv: [],
    exit: () => {},
    stdout: { write: () => {} },
    stderr: { write: () => {} }
  } as any;
}

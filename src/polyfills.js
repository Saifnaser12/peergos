// Create a more comprehensive process object
const processPolyfill = {
    env: {
        NODE_ENV: 'development',
        PUBLIC_URL: '',
        WDS_SOCKET_HOST: undefined,
        WDS_SOCKET_PATH: undefined,
        WDS_SOCKET_PORT: undefined,
        FAST_REFRESH: 'true'
    },
    version: 'v18.0.0',
    versions: {
        node: '18.0.0',
        npm: '9.0.0',
        ares: '1.18.1',
        brotli: '1.0.9',
        cldr: '41.0',
        icu: '71.1',
        llhttp: '6.0.7',
        modules: '108',
        napi: '8',
        openssl: '3.0.3',
        tz: '2022a',
        unicode: '14.0',
        uv: '1.43.0',
        v8: '10.2.154.15-node.9',
        zlib: '1.2.11'
    },
    platform: 'browser',
    arch: 'x64',
    pid: 1,
    ppid: 0,
    title: 'browser',
    argv: ['node'],
    argv0: 'node',
    execArgv: [],
    execPath: '/usr/local/bin/node',
    cwd: function () { return '/'; },
    chdir: function () { },
    nextTick: function (fn, ...args) {
        setTimeout(function () { fn.apply(null, args); }, 0);
    },
    exit: function () { },
    kill: function () { },
    stdout: {
        write: function (data) { console.log(data); return true; },
        isTTY: false,
        columns: 80,
        rows: 24
    },
    stderr: {
        write: function (data) { console.error(data); return true; },
        isTTY: false,
        columns: 80,
        rows: 24
    },
    stdin: {
        read: function () { return null; },
        isTTY: false,
        setRawMode: function () { return this; }
    },
    browser: true,
    emitWarning: function () { },
    binding: function () { return {}; },
    umask: function () { return 0; },
    hrtime: function () {
        const now = performance.now();
        const seconds = Math.floor(now / 1000);
        const nanoseconds = Math.floor((now % 1000) * 1e6);
        return [seconds, nanoseconds];
    },
    uptime: function () { return performance.now() / 1000; },
    memoryUsage: function () {
        return {
            rss: 0,
            heapTotal: 0,
            heapUsed: 0,
            external: 0,
            arrayBuffers: 0
        };
    },
    cpuUsage: function () { return { user: 0, system: 0 }; },
    getuid: function () { return 0; },
    getgid: function () { return 0; },
    setuid: function () { },
    setgid: function () { },
    on: function () { return this; },
    off: function () { return this; },
    once: function () { return this; },
    emit: function () { return false; },
    listeners: function () { return []; },
    removeListener: function () { return this; },
    removeAllListeners: function () { return this; },
    setMaxListeners: function () { return this; },
    getMaxListeners: function () { return 0; },
    prependListener: function () { return this; },
    prependOnceListener: function () { return this; },
    listenerCount: function () { return 0; },
    eventNames: function () { return []; },
    mainModule: undefined,
    release: {
        name: 'node',
        sourceUrl: '',
        headersUrl: '',
        libUrl: ''
    },
    features: {
        inspector: false,
        debug: false,
        uv: true,
        ipv6: true,
        tls_alpn: true,
        tls_sni: true,
        tls_ocsp: true,
        tls: true
    },
    config: {
        target_defaults: {},
        variables: {}
    }
};
// Enhanced Buffer polyfill
const bufferPolyfill = {
    from: function (data, encoding) {
        if (typeof data === 'string') {
            const encoder = new TextEncoder();
            return encoder.encode(data);
        }
        return new Uint8Array(data || []);
    },
    alloc: function (size, fill) {
        const buf = new Uint8Array(size);
        if (fill !== undefined) {
            buf.fill(fill);
        }
        return buf;
    },
    allocUnsafe: function (size) { return new Uint8Array(size); },
    allocUnsafeSlow: function (size) { return new Uint8Array(size); },
    isBuffer: function (obj) {
        return obj && obj.constructor && obj.constructor.name === 'Uint8Array';
    },
    byteLength: function (data, encoding) {
        if (typeof data === 'string') {
            return new TextEncoder().encode(data).length;
        }
        return data.length || 0;
    },
    compare: function (a, b) {
        if (a.length !== b.length) {
            return a.length < b.length ? -1 : 1;
        }
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                return a[i] < b[i] ? -1 : 1;
            }
        }
        return 0;
    },
    concat: function (list, totalLength) {
        const arrays = list.filter(item => item && item.length > 0);
        if (arrays.length === 0)
            return new Uint8Array(0);
        const length = totalLength !== undefined ? totalLength :
            arrays.reduce((acc, curr) => acc + curr.length, 0);
        const result = new Uint8Array(length);
        let offset = 0;
        for (let i = 0; i < arrays.length && offset < length; i++) {
            const item = arrays[i];
            const copyLength = Math.min(item.length, length - offset);
            result.set(item.subarray(0, copyLength), offset);
            offset += copyLength;
        }
        return result;
    },
    isEncoding: function (encoding) {
        return ['ascii', 'utf8', 'utf-8', 'utf16le', 'ucs2', 'ucs-2', 'base64', 'latin1', 'binary', 'hex'].includes(encoding.toLowerCase());
    }
};
// Apply polyfills to globalThis first
if (typeof globalThis.process === 'undefined') {
    globalThis.process = processPolyfill;
}
// Ensure process is available as a global variable
if (typeof process === 'undefined') {
    globalThis.process = processPolyfill;
}
if (typeof globalThis.global === 'undefined') {
    globalThis.global = globalThis;
}
if (typeof globalThis.Buffer === 'undefined') {
    globalThis.Buffer = bufferPolyfill;
}
// Apply to window if available
if (typeof window !== 'undefined') {
    if (!window.process) {
        window.process = globalThis.process;
    }
    if (!window.global) {
        window.global = globalThis;
    }
    if (!window.Buffer) {
        window.Buffer = globalThis.Buffer;
    }
}
// Apply to self if available (for web workers)
if (typeof self !== 'undefined') {
    if (!self.process) {
        self.process = globalThis.process;
    }
    if (!self.global) {
        self.global = globalThis;
    }
    if (!self.Buffer) {
        self.Buffer = globalThis.Buffer;
    }
}
// Polyfills for browser compatibility
if (typeof global === 'undefined') {
    window.global = window;
}
if (typeof process === 'undefined') {
    window.process = { env: {} };
}
if (typeof Buffer === 'undefined') {
    window.Buffer = {};
}
// Ensure crypto is available
if (typeof crypto === 'undefined' && typeof window !== 'undefined') {
    window.crypto = window.crypto || {};
}
export {};

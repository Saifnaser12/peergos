// Enhanced polyfills for browser compatibility
// Global polyfills
if (typeof globalThis.process === 'undefined') {
    globalThis.process = {
        env: {},
        browser: true,
        version: '18.0.0',
        versions: { node: '18.0.0' },
        platform: 'browser',
        nextTick: function (fn) { setTimeout(fn, 0); },
        cwd: function () { return '/'; },
        argv: ['node'],
        exit: function () { },
        stdout: { write: function (data) { console.log(data); } },
        stderr: { write: function (data) { console.error(data); } }
    };
}
if (typeof globalThis.global === 'undefined') {
    globalThis.global = globalThis;
}
// Buffer polyfill for browser
if (typeof globalThis.Buffer === 'undefined') {
    globalThis.Buffer = {
        from: function (str, encoding) {
            return new TextEncoder().encode(str);
        },
        isBuffer: function (obj) {
            return obj instanceof Uint8Array;
        }
    };
}
// EventTarget polyfill for older browsers
if (typeof EventTarget === 'undefined') {
    globalThis.EventTarget = class EventTarget {
        constructor() {
            Object.defineProperty(this, "listeners", {
                enumerable: true,
                configurable: true,
                writable: true,
                value: {}
            });
        }
        addEventListener(type, listener) {
            if (!this.listeners[type]) {
                this.listeners[type] = [];
            }
            this.listeners[type].push(listener);
        }
        removeEventListener(type, listener) {
            if (this.listeners[type]) {
                const index = this.listeners[type].indexOf(listener);
                if (index > -1) {
                    this.listeners[type].splice(index, 1);
                }
            }
        }
        dispatchEvent(event) {
            if (this.listeners[event.type]) {
                this.listeners[event.type].forEach(listener => listener(event));
            }
            return true;
        }
    };
}
// Console polyfill
if (typeof console === 'undefined') {
    globalThis.console = {
        log: () => { },
        error: () => { },
        warn: () => { },
        info: () => { },
        debug: () => { },
        trace: () => { },
        group: () => { },
        groupEnd: () => { },
        time: () => { },
        timeEnd: () => { },
        assert: () => { },
        clear: () => { },
        count: () => { },
        dir: () => { },
        dirxml: () => { },
        table: () => { }
    };
}
export {};

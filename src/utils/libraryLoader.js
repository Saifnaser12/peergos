// Library Loader Utility
// Handles dynamic loading of external libraries with fallbacks
class LibraryLoader {
    constructor() {
        Object.defineProperty(this, "loadedLibraries", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
        Object.defineProperty(this, "loadingPromises", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: new Map()
        });
    }
    static getInstance() {
        if (!LibraryLoader.instance) {
            LibraryLoader.instance = new LibraryLoader();
        }
        return LibraryLoader.instance;
    }
    async loadLibrary(config) {
        const { name, url, fallback, globalName } = config;
        // Return if already loaded
        const cached = this.loadedLibraries.get(name);
        if (cached?.loaded) {
            return cached.library;
        }
        // Return existing loading promise if in progress
        if (this.loadingPromises.has(name)) {
            return this.loadingPromises.get(name);
        }
        const loadingPromise = this.performLoad(config);
        this.loadingPromises.set(name, loadingPromise);
        try {
            const result = await loadingPromise;
            this.loadedLibraries.set(name, { library: result, loaded: true });
            this.loadingPromises.delete(name);
            return result;
        }
        catch (error) {
            console.warn(`Failed to load ${name}:`, error);
            this.loadingPromises.delete(name);
            // Try fallback
            if (fallback) {
                try {
                    const fallbackResult = fallback();
                    this.loadedLibraries.set(name, { library: fallbackResult, loaded: true });
                    return fallbackResult;
                }
                catch (fallbackError) {
                    console.warn(`Fallback failed for ${name}:`, fallbackError);
                }
            }
            this.loadedLibraries.set(name, {
                library: null,
                loaded: false,
                error: error instanceof Error ? error.message : String(error)
            });
            return null;
        }
    }
    async performLoad(config) {
        const { name, url, globalName } = config;
        // Check if already available globally
        if (globalName && window[globalName]) {
            console.log(`✅ ${name} already available globally`);
            return window[globalName];
        }
        // Try to load via URL
        if (url) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = () => {
                    const lib = globalName ? window[globalName] : true;
                    console.log(`✅ ${name} loaded successfully from ${url}`);
                    resolve(lib);
                };
                script.onerror = () => {
                    reject(new Error(`Failed to load script from ${url}`));
                };
                document.head.appendChild(script);
            });
        }
        throw new Error(`No loading method available for ${name}`);
    }
    isLoaded(libraryName) {
        return this.loadedLibraries.get(libraryName)?.loaded ?? false;
    }
    getLibrary(libraryName) {
        return this.loadedLibraries.get(libraryName)?.library ?? null;
    }
    getStatus(libraryName) {
        const cached = this.loadedLibraries.get(libraryName);
        if (!cached)
            return 'not_loaded';
        if (cached.loaded)
            return 'loaded';
        if (cached.error)
            return 'error';
        return 'loading';
    }
    // Add the missing methods that are being called
    async loadJsSHA() {
        return this.loadLibrary({
            name: 'jsSHA',
            url: 'https://cdn.jsdelivr.net/npm/jssha@3.3.1/dist/sha.min.js',
            globalName: 'jsSHA',
            fallback: () => {
                console.warn('jsSHA not available, cryptographic functions will be disabled');
                return null;
            }
        });
    }
    async loadQRCode() {
        return this.loadLibrary({
            name: 'QRCode',
            url: 'https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.5.3/qrcode.min.js',
            globalName: 'QRCode',
            fallback: () => {
                console.warn('QRCode not available, QR code generation will be disabled');
                // Return a mock QRCode object for graceful degradation
                return {
                    toCanvas: () => Promise.resolve(),
                    toDataURL: () => Promise.resolve('data:image/png;base64,'),
                    toString: () => Promise.resolve('')
                };
            }
        });
    }
    async loadPDFLib() {
        return this.loadLibrary({
            name: 'PDFLib',
            url: 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js',
            globalName: 'PDFLib',
            fallback: () => {
                console.warn('PDFLib not available, PDF generation will be disabled');
                return {
                    PDFDocument: {
                        create: () => ({
                            addPage: () => ({}),
                            save: () => new Uint8Array()
                        })
                    }
                };
            }
        });
    }
}
// Create and export the singleton instance
export const libraryLoader = LibraryLoader.getInstance();
// Export helper functions that use the singleton
// Export helper functions that use the singleton
export const loadLibrary = async (url, globalName) => {
    return new Promise((resolve, reject) => {
        if (typeof window !== 'undefined' && window[globalName]) {
            console.log(`✅ ${globalName} already loaded`);
            resolve(window[globalName]);
            return;
        }
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
            if (window[globalName]) {
                console.log(`✅ ${globalName} loaded successfully from ${url}`);
                resolve(window[globalName]);
            }
            else {
                console.error(`❌ ${globalName} not found after loading ${url}`);
                reject(new Error(`${globalName} not found after loading ${url}`));
            }
        };
        script.onerror = (error) => {
            console.error(`❌ Failed to load ${globalName} from ${url}:`, error);
            reject(new Error(`Failed to load ${url}`));
        };
        document.head.appendChild(script);
    });
};
export const loadJsSHA = async () => {
    return libraryLoader.loadJsSHA();
};
export const loadQRCode = async () => {
    return libraryLoader.loadQRCode();
};
export const loadPDFLib = async () => {
    return libraryLoader.loadPDFLib();
};
export const initializeLibraries = async () => {
    console.log('🔧 Initializing external libraries...');
    try {
        await Promise.allSettled([
            loadJsSHA(),
            loadQRCode(),
            loadPDFLib()
        ]);
        console.log('✅ Library initialization completed');
    }
    catch (error) {
        console.warn('⚠️ Some libraries failed to initialize:', error);
    }
};
// Export the class as default
export default LibraryLoader;

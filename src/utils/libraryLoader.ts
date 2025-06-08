
// Library Loader Utility
// Handles dynamic loading of external libraries with fallbacks

interface LibraryConfig {
  name: string;
  url?: string;
  fallback?: () => any;
  globalName?: string;
}

interface LoadedLibrary {
  library: any;
  loaded: boolean;
  error?: string;
}

class LibraryLoader {
  private static instance: LibraryLoader;
  private loadedLibraries: Map<string, LoadedLibrary> = new Map();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  static getInstance(): LibraryLoader {
    if (!LibraryLoader.instance) {
      LibraryLoader.instance = new LibraryLoader();
    }
    return LibraryLoader.instance;
  }

  async loadLibrary(config: LibraryConfig): Promise<any> {
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
    } catch (error) {
      console.warn(`Failed to load ${name}:`, error);
      this.loadingPromises.delete(name);
      
      // Try fallback
      if (fallback) {
        try {
          const fallbackResult = fallback();
          this.loadedLibraries.set(name, { library: fallbackResult, loaded: true });
          return fallbackResult;
        } catch (fallbackError) {
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

  private async performLoad(config: LibraryConfig): Promise<any> {
    const { name, url, globalName } = config;

    // Check if already available globally
    if (globalName && (window as any)[globalName]) {
      console.log(`✅ ${name} already available globally`);
      return (window as any)[globalName];
    }

    // Try to load via URL
    if (url) {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => {
          const lib = globalName ? (window as any)[globalName] : true;
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

  isLoaded(libraryName: string): boolean {
    return this.loadedLibraries.get(libraryName)?.loaded ?? false;
  }

  getLibrary(libraryName: string): any {
    return this.loadedLibraries.get(libraryName)?.library ?? null;
  }

  getStatus(libraryName: string): string {
    const cached = this.loadedLibraries.get(libraryName);
    if (!cached) return 'not_loaded';
    if (cached.loaded) return 'loaded';
    if (cached.error) return 'error';
    return 'loading';
  }
}

// Create and export the singleton instance
export const libraryLoader = LibraryLoader.getInstance();

// Export helper functions that use the singleton
export const loadJsSHA = async (): Promise<any> => {
  return libraryLoader.loadLibrary({
    name: 'jsSHA',
    url: 'https://cdn.jsdelivr.net/npm/jssha@3.3.1/dist/sha.min.js',
    globalName: 'jsSHA',
    fallback: () => {
      console.warn('jsSHA not available, cryptographic functions will be disabled');
      return null;
    }
  });
};

export const loadQRCode = async (): Promise<any> => {
  return libraryLoader.loadLibrary({
    name: 'QRCode',
    url: 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js',
    globalName: 'QRCode',
    fallback: () => {
      console.warn('QRCode not available, QR code generation will be disabled');
      return null;
    }
  });
};

export const loadPDFLib = async (): Promise<any> => {
  return libraryLoader.loadLibrary({
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
};

export const initializeLibraries = async (): Promise<void> => {
  console.log('🔧 Initializing external libraries...');
  
  try {
    await Promise.allSettled([
      loadJsSHA(),
      loadQRCode(),
      loadPDFLib()
    ]);
    console.log('✅ Library initialization completed');
  } catch (error) {
    console.warn('⚠️ Some libraries failed to initialize:', error);
  }
};

// Export the class as default
export default LibraryLoader;

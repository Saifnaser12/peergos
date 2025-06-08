
export class LibraryLoader {
  private static loadedLibraries = new Set<string>();

  static async loadScript(src: string, id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedLibraries.has(id)) {
        resolve();
        return;
      }

      if (document.getElementById(id)) {
        this.loadedLibraries.add(id);
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.id = id;
      script.async = true;
      
      script.onload = () => {
        this.loadedLibraries.add(id);
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error(`Failed to load script: ${src}`));
      };

      document.head.appendChild(script);
    });
  }

  static async loadJsSHA(): Promise<void> {
    try {
      await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jsSHA/3.3.1/sha256.min.js', 'jssha-script');
      console.log('jsSHA loaded successfully');
    } catch (error) {
      console.log('jsSHA not available, cryptographic functions will be disabled');
    }
  }

  static async loadQRCode(): Promise<void> {
    try {
      await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/qrcode/1.5.4/qrcode.min.js', 'qrcode-script');
      console.log('QRCode loaded successfully');
    } catch (error) {
      console.log('QRCode not available, QR code generation will be disabled');
    }
  }

  static async loadAllLibraries(): Promise<void> {
    await Promise.all([
      this.loadJsSHA(),
      this.loadQRCode()
    ]);
  }
}

export default LibraryLoader;


// Library loader utilities
class LibraryLoader {
  private jsSHALoaded = false;
  private qrCodeLoaded = false;

  async loadJsSHA(): Promise<any> {
    if (this.jsSHALoaded && window.jsSHA) {
      return window.jsSHA;
    }

    try {
      // Try to load jsSHA from CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/jssha@3.3.1/dist/sha.js';
      script.async = true;
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      this.jsSHALoaded = true;
      console.log('jsSHA loaded successfully');
      return window.jsSHA;
    } catch (error) {
      console.log('jsSHA not available, cryptographic functions will be disabled');
      return null;
    }
  }

  async loadQRCode(): Promise<any> {
    if (this.qrCodeLoaded && window.QRCode) {
      return window.QRCode;
    }

    try {
      // Try to load QRCode from CDN
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js';
      script.async = true;
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });

      this.qrCodeLoaded = true;
      console.log('QRCode loaded successfully');
      return window.QRCode;
    } catch (error) {
      console.log('QRCode not available, QR code generation will be disabled');
      return null;
    }
  }

  isJsSHAAvailable(): boolean {
    return this.jsSHALoaded && !!window.jsSHA;
  }

  isQRCodeAvailable(): boolean {
    return this.qrCodeLoaded && !!window.QRCode;
  }
}

// Create singleton instance and export it as the default
export const libraryLoader = new LibraryLoader();
export default libraryLoader;

// Type declarations for window objects
declare global {
  interface Window {
    jsSHA: any;
    QRCode: any;
  }
}


export class LibraryLoader {
  private static libraries: { [key: string]: any } = {};
  private static loadPromises: { [key: string]: Promise<any> } = {};
  private static loadAttempted = false;

  static async loadLibraries(): Promise<void> {
    if (this.loadAttempted) return;
    this.loadAttempted = true;

    // Load jsSHA
    if (!this.loadPromises.jsSHA) {
      this.loadPromises.jsSHA = this.loadJsSHA();
    }

    // Load QRCode
    if (!this.loadPromises.QRCode) {
      this.loadPromises.QRCode = this.loadQRCode();
    }

    await Promise.allSettled([
      this.loadPromises.jsSHA,
      this.loadPromises.QRCode
    ]);
  }

  private static async loadJsSHA(): Promise<any> {
    try {
      const jsSHA = await import('jssha');
      this.libraries.jsSHA = jsSHA.default || jsSHA;
      
      // Make globally available
      if (typeof window !== 'undefined') {
        (window as any).jsSHA = this.libraries.jsSHA;
      }
      
      console.log('✅ jsSHA loaded successfully');
      return this.libraries.jsSHA;
    } catch (error) {
      console.warn('⚠️ jsSHA not available, cryptographic functions will be disabled:', error);
      return null;
    }
  }

  private static async loadQRCode(): Promise<any> {
    try {
      const QRCode = await import('qrcode');
      this.libraries.QRCode = QRCode.default || QRCode;
      
      // Make globally available
      if (typeof window !== 'undefined') {
        (window as any).QRCode = this.libraries.QRCode;
      }
      
      console.log('✅ QRCode loaded successfully');
      return this.libraries.QRCode;
    } catch (error) {
      console.warn('⚠️ QRCode not available, QR code generation will be disabled:', error);
      return null;
    }
  }

  static getJsSHA() {
    return this.libraries.jsSHA;
  }

  static getQRCode() {
    return this.libraries.QRCode;
  }

  static isJsSHAAvailable(): boolean {
    return this.libraries.jsSHA !== null && this.libraries.jsSHA !== undefined;
  }

  static isQRCodeAvailable(): boolean {
    return this.libraries.QRCode !== null && this.libraries.QRCode !== undefined;
  }

  static async waitForLibraries(): Promise<void> {
    if (!this.loadAttempted) {
      await this.loadLibraries();
    }
    
    // Wait for all load promises to complete
    await Promise.allSettled(Object.values(this.loadPromises));
  }
}

// Export individual loader functions for direct use
export const loadJsSHA = () => LibraryLoader.getJsSHA();
export const loadQRCode = () => LibraryLoader.getQRCode();

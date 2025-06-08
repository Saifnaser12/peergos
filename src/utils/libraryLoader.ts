export class LibraryLoader {
  private static libraries: { [key: string]: any } = {};
  private static loadAttempted = false;

  static async loadLibraries(): Promise<void> {
    if (this.loadAttempted) return;
    this.loadAttempted = true;

    try {
      // Load jsSHA
      const jsSHA = await import('jssha');
      this.libraries.jsSHA = jsSHA.default || jsSHA;
      if (typeof window !== 'undefined') {
        (window as any).jsSHA = this.libraries.jsSHA;
      }
      console.log('jsSHA loaded successfully');
    } catch (error) {
      console.warn('jsSHA not available, cryptographic functions will be disabled');
    }

    try {
      // Load QRCode
      const QRCode = await import('qrcode');
      this.libraries.QRCode = QRCode.default || QRCode;
      if (typeof window !== 'undefined') {
        (window as any).QRCode = this.libraries.QRCode;
      }
      console.log('QRCode loaded successfully');
    } catch (error) {
      console.warn('QRCode not available, QR code generation will be disabled');
    }
  }
}
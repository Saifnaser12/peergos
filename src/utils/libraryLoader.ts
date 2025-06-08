
export class LibraryLoader {
  private static jsSHA: any = null;
  private static QRCode: any = null;
  private static loaded = false;

  static async loadLibraries() {
    if (this.loaded) return;

    try {
      const jsSHAModule = await import('jssha');
      this.jsSHA = jsSHAModule.default || jsSHAModule;
    } catch (error) {
      console.warn('jsSHA not available, cryptographic functions will be disabled');
    }

    try {
      const QRCodeModule = await import('qrcode');
      this.QRCode = QRCodeModule.default || QRCodeModule;
    } catch (error) {
      console.warn('QRCode not available, QR code generation will be disabled');
    }

    this.loaded = true;
  }

  static getJsSHA() {
    return this.jsSHA;
  }

  static getQRCode() {
    return this.QRCode;
  }

  static isJsSHAAvailable(): boolean {
    return this.jsSHA !== null;
  }

  static isQRCodeAvailable(): boolean {
    return this.QRCode !== null;
  }
}

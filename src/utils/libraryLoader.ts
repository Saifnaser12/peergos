export interface LibraryLoader {
  loadJsSHA(): Promise<any>;
  loadQRCode(): Promise<any>;
}

class DefaultLibraryLoader implements LibraryLoader {
  async loadJsSHA(): Promise<any> {
    try {
      const jsSHA = await import('jssha');
      console.log('jsSHA loaded successfully');
      return jsSHA.default || jsSHA;
    } catch (error) {
      console.warn('jsSHA not available, cryptographic functions will be disabled');
      return null;
    }
  }

  async loadQRCode(): Promise<any> {
    try {
      const QRCode = await import('qrcode');
      console.log('QRCode loaded successfully');
      return QRCode.default || QRCode;
    } catch (error) {
      console.warn('QRCode not available, QR code generation will be disabled');
      return null;
    }
  }
}

export const libraryLoader = new DefaultLibraryLoader();
export default libraryLoader;
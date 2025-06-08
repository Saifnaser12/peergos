// Dynamic library loading utility
let jsSHALoaded = false;
let qrCodeLoaded = false;

export const loadJsSHA = async (): Promise<any> => {
  if (jsSHALoaded && (window as any).jsSHA) {
    return (window as any).jsSHA;
  }

  try {
    const { default: jsSHA } = await import('jssha');
    (window as any).jsSHA = jsSHA;
    jsSHALoaded = true;
    console.log('jsSHA loaded successfully');
    return jsSHA;
  } catch (error) {
    console.warn('jsSHA not available, cryptographic functions will be disabled');
    (window as any).jsSHA = {
      sha256: () => ({ getHash: () => 'mock-hash' })
    };
    return (window as any).jsSHA;
  }
};

export const loadQRCode = async (): Promise<any> => {
  if (qrCodeLoaded && (window as any).QRCode) {
    return (window as any).QRCode;
  }

  try {
    const QRCode = await import('qrcode');
    (window as any).QRCode = QRCode;
    qrCodeLoaded = true;
    console.log('QRCode loaded successfully');
    return QRCode;
  } catch (error) {
    console.warn('QRCode not available, QR code generation will be disabled');
    (window as any).QRCode = {
      toDataURL: () => Promise.resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==')
    };
    return (window as any).QRCode;
  }
};
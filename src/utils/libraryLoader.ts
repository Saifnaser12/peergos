
let jsSHA: any = null;
let QRCode: any = null;

// Initialize libraries
const initializeLibraries = async () => {
  try {
    // Try to load jsSHA
    try {
      const jssha = await import('jssha');
      jsSHA = jssha.default || jssha;
      console.log('jsSHA loaded successfully');
    } catch (error) {
      console.warn('jsSHA not available, cryptographic functions will be disabled');
    }

    // Try to load QRCode
    try {
      const qrcode = await import('qrcode');
      QRCode = qrcode.default || qrcode;
      console.log('QRCode loaded successfully');
    } catch (error) {
      console.warn('QRCode not available, QR code generation will be disabled');
    }
  } catch (error) {
    console.error('Error initializing libraries:', error);
  }
};

// Initialize immediately
initializeLibraries();

export const getjsSHA = () => jsSHA;
export const getQRCode = () => QRCode;

export default {
  getjsSHA,
  getQRCode,
  isReady: () => Boolean(jsSHA && QRCode)
};

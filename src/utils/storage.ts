import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.VITE_STORAGE_KEY || 'default-key-replace-in-production';

interface StorageOptions {
  encrypted?: boolean;
  expiresIn?: number; // in milliseconds
}

export class SecureStorage {
  static set(key: string, value: any, options: StorageOptions = {}) {
    try {
      const storageItem = {
        value,
        timestamp: Date.now(),
        expiresIn: options.expiresIn,
      };

      const serializedValue = JSON.stringify(storageItem);
      const finalValue = options.encrypted 
        ? CryptoJS.AES.encrypt(serializedValue, ENCRYPTION_KEY).toString()
        : serializedValue;

      localStorage.setItem(key, finalValue);
    } catch (error) {
      console.error('Error setting secure storage:', error);
      throw new Error('Failed to set secure storage');
    }
  }

  static get<T>(key: string, options: StorageOptions = {}): T | null {
    try {
      const storedValue = localStorage.getItem(key);
      if (!storedValue) return null;

      const decryptedValue = options.encrypted
        ? CryptoJS.AES.decrypt(storedValue, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)
        : storedValue;

      const storageItem = JSON.parse(decryptedValue);

      // Check expiration
      if (storageItem.expiresIn && 
          Date.now() - storageItem.timestamp > storageItem.expiresIn) {
        this.remove(key);
        return null;
      }

      return storageItem.value as T;
    } catch (error) {
      console.error('Error getting secure storage:', error);
      return null;
    }
  }

  static remove(key: string): void {
    localStorage.removeItem(key);
  }

  static clear(): void {
    localStorage.clear();
  }
}

// Session-specific storage (cleared on tab close)
export class SecureSessionStorage extends SecureStorage {
  static set(key: string, value: any, options: StorageOptions = {}) {
    try {
      const storageItem = {
        value,
        timestamp: Date.now(),
        expiresIn: options.expiresIn,
      };

      const serializedValue = JSON.stringify(storageItem);
      const finalValue = options.encrypted 
        ? CryptoJS.AES.encrypt(serializedValue, ENCRYPTION_KEY).toString()
        : serializedValue;

      sessionStorage.setItem(key, finalValue);
    } catch (error) {
      console.error('Error setting secure session storage:', error);
      throw new Error('Failed to set secure session storage');
    }
  }

  static get<T>(key: string, options: StorageOptions = {}): T | null {
    try {
      const storedValue = sessionStorage.getItem(key);
      if (!storedValue) return null;

      const decryptedValue = options.encrypted
        ? CryptoJS.AES.decrypt(storedValue, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8)
        : storedValue;

      const storageItem = JSON.parse(decryptedValue);

      if (storageItem.expiresIn && 
          Date.now() - storageItem.timestamp > storageItem.expiresIn) {
        this.remove(key);
        return null;
      }

      return storageItem.value as T;
    } catch (error) {
      console.error('Error getting secure session storage:', error);
      return null;
    }
  }

  static remove(key: string): void {
    sessionStorage.removeItem(key);
  }

  static clear(): void {
    sessionStorage.clear();
  }
} 
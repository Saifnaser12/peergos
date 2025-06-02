import { SecureStorage, SecureSessionStorage } from '../storage';

describe('SecureStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Basic Storage Operations', () => {
    it('stores and retrieves unencrypted data correctly', () => {
      const testData = { name: 'Test User', id: 123 };
      SecureStorage.set('test-key', testData);
      const retrieved = SecureStorage.get('test-key');
      expect(retrieved).toEqual(testData);
    });

    it('stores and retrieves encrypted data correctly', () => {
      const testData = { sensitiveInfo: 'secret123' };
      SecureStorage.set('encrypted-key', testData, { encrypted: true });
      const retrieved = SecureStorage.get('encrypted-key', { encrypted: true });
      expect(retrieved).toEqual(testData);
    });

    it('returns null for non-existent keys', () => {
      const result = SecureStorage.get('non-existent-key');
      expect(result).toBeNull();
    });

    it('removes data correctly', () => {
      SecureStorage.set('remove-test', { data: 'test' });
      SecureStorage.remove('remove-test');
      const result = SecureStorage.get('remove-test');
      expect(result).toBeNull();
    });

    it('clears all data correctly', () => {
      SecureStorage.set('key1', 'value1');
      SecureStorage.set('key2', 'value2');
      SecureStorage.clear();
      expect(SecureStorage.get('key1')).toBeNull();
      expect(SecureStorage.get('key2')).toBeNull();
    });
  });

  describe('Expiration Handling', () => {
    it('expires data after specified time', () => {
      const testData = { name: 'Test User' };
      SecureStorage.set('expiring-key', testData, { expiresIn: 1000 }); // 1 second

      // Advance time by 2 seconds
      jest.advanceTimersByTime(2000);

      const retrieved = SecureStorage.get('expiring-key');
      expect(retrieved).toBeNull();
    });

    it('keeps data before expiration', () => {
      const testData = { name: 'Test User' };
      SecureStorage.set('expiring-key', testData, { expiresIn: 2000 });

      // Advance time by 1 second
      jest.advanceTimersByTime(1000);

      const retrieved = SecureStorage.get('expiring-key');
      expect(retrieved).toEqual(testData);
    });
  });

  describe('Error Handling', () => {
    it('handles invalid JSON gracefully', () => {
      // Manually set invalid JSON in localStorage
      localStorage.setItem('invalid-json', 'invalid{json');
      const result = SecureStorage.get('invalid-json');
      expect(result).toBeNull();
    });

    it('handles encryption errors gracefully', () => {
      // Manually set invalid encrypted data
      localStorage.setItem('invalid-encrypted', 'invalid-encrypted-data');
      const result = SecureStorage.get('invalid-encrypted', { encrypted: true });
      expect(result).toBeNull();
    });
  });
});

describe('SecureSessionStorage', () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('stores and retrieves data in session storage', () => {
    const testData = { name: 'Session Test' };
    SecureSessionStorage.set('session-key', testData);
    const retrieved = SecureSessionStorage.get('session-key');
    expect(retrieved).toEqual(testData);
  });

  it('handles encrypted session data', () => {
    const testData = { sensitiveInfo: 'session-secret' };
    SecureSessionStorage.set('encrypted-session', testData, { encrypted: true });
    const retrieved = SecureSessionStorage.get('encrypted-session', { encrypted: true });
    expect(retrieved).toEqual(testData);
  });

  it('maintains separate storage from localStorage', () => {
    const sessionData = { type: 'session' };
    const localData = { type: 'local' };

    SecureSessionStorage.set('test-key', sessionData);
    SecureStorage.set('test-key', localData);

    expect(SecureSessionStorage.get('test-key')).toEqual(sessionData);
    expect(SecureStorage.get('test-key')).toEqual(localData);
  });

  it('clears session storage independently', () => {
    SecureSessionStorage.set('session-key', 'session-value');
    SecureStorage.set('local-key', 'local-value');

    SecureSessionStorage.clear();

    expect(SecureSessionStorage.get('session-key')).toBeNull();
    expect(SecureStorage.get('local-key')).not.toBeNull();
  });
}); 
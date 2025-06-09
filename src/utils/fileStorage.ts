
export interface FileStorageConfig {
  companyId: string;
  financialYear: string;
  category: string;
  fileName: string;
  file: File;
}

export interface StoredFileInfo {
  id: string;
  originalName: string;
  storagePath: string;
  uploadDate: string;
  fileSize: number;
  mimeType: string;
  category: string;
  financialYear: string;
}

export class SecureFileStorage {
  private static readonly STORAGE_PREFIX = 'fta-expenses';
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png'
  ];

  /**
   * Generate FTA-compliant storage path
   * Structure: Company → Financial Year → Expense Category → File
   */
  private static generateStoragePath(config: FileStorageConfig): string {
    const sanitizedCompany = this.sanitizeFileName(config.companyId);
    const sanitizedCategory = this.sanitizeFileName(config.category);
    const sanitizedFileName = this.sanitizeFileName(config.fileName);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    return `${this.STORAGE_PREFIX}/${sanitizedCompany}/${config.financialYear}/${sanitizedCategory}/${timestamp}_${sanitizedFileName}`;
  }

  /**
   * Sanitize file names for safe storage
   */
  private static sanitizeFileName(name: string): string {
    return name
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 100); // Limit length
  }

  /**
   * Validate file before storage
   */
  private static validateFile(file: File): { isValid: boolean; error?: string } {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Invalid file type. Only PDF, JPEG, and PNG files are allowed for FTA compliance.' 
      };
    }

    if (file.size > this.MAX_FILE_SIZE) {
      return { 
        isValid: false, 
        error: 'File size exceeds 10MB limit.' 
      };
    }

    return { isValid: true };
  }

  /**
   * Store expense receipt securely with FTA-compliant structure
   */
  public static async storeExpenseReceipt(config: FileStorageConfig): Promise<StoredFileInfo> {
    try {
      // Validate file
      const validation = this.validateFile(config.file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }

      // Generate secure storage path
      const storagePath = this.generateStoragePath(config);
      
      // Convert file to base64 for localStorage (in production, use proper cloud storage)
      const fileData = await this.fileToBase64(config.file);
      
      // Create storage record
      const storageRecord: StoredFileInfo = {
        id: this.generateId(),
        originalName: config.fileName,
        storagePath,
        uploadDate: new Date().toISOString(),
        fileSize: config.file.size,
        mimeType: config.file.type,
        category: config.category,
        financialYear: config.financialYear
      };

      // Store file data securely
      const storageKey = `file_${storageRecord.id}`;
      localStorage.setItem(storageKey, JSON.stringify({
        ...storageRecord,
        data: fileData
      }));

      // Update file registry
      this.updateFileRegistry(storageRecord);

      return storageRecord;
    } catch (error) {
      console.error('Error storing expense receipt:', error);
      throw new Error('Failed to store expense receipt securely');
    }
  }

  /**
   * Retrieve stored file
   */
  public static async getStoredFile(fileId: string): Promise<{ info: StoredFileInfo; blob: Blob } | null> {
    try {
      const storageKey = `file_${fileId}`;
      const stored = localStorage.getItem(storageKey);
      
      if (!stored) return null;
      
      const fileRecord = JSON.parse(stored);
      const blob = this.base64ToBlob(fileRecord.data, fileRecord.mimeType);
      
      return {
        info: fileRecord,
        blob
      };
    } catch (error) {
      console.error('Error retrieving stored file:', error);
      return null;
    }
  }

  /**
   * List files by category and financial year
   */
  public static getFilesByCategory(category: string, financialYear: string): StoredFileInfo[] {
    try {
      const registry = this.getFileRegistry();
      return registry.filter(file => 
        file.category === category && file.financialYear === financialYear
      );
    } catch (error) {
      console.error('Error listing files by category:', error);
      return [];
    }
  }

  /**
   * Delete stored file
   */
  public static deleteStoredFile(fileId: string): boolean {
    try {
      const storageKey = `file_${fileId}`;
      localStorage.removeItem(storageKey);
      
      // Update registry
      const registry = this.getFileRegistry();
      const updatedRegistry = registry.filter(file => file.id !== fileId);
      localStorage.setItem('file_registry', JSON.stringify(updatedRegistry));
      
      return true;
    } catch (error) {
      console.error('Error deleting stored file:', error);
      return false;
    }
  }

  // Helper methods
  private static generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private static base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  private static getFileRegistry(): StoredFileInfo[] {
    try {
      const registry = localStorage.getItem('file_registry');
      return registry ? JSON.parse(registry) : [];
    } catch (error) {
      console.error('Error reading file registry:', error);
      return [];
    }
  }

  private static updateFileRegistry(fileInfo: StoredFileInfo): void {
    try {
      const registry = this.getFileRegistry();
      registry.push(fileInfo);
      localStorage.setItem('file_registry', JSON.stringify(registry));
    } catch (error) {
      console.error('Error updating file registry:', error);
    }
  }
}

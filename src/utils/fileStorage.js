export class SecureFileStorage {
    /**
     * Generate FTA-compliant storage path
     * Structure: Company → Financial Year → Expense Category → File
     */
    static generateStoragePath(config) {
        const sanitizedCompany = this.sanitizeFileName(config.companyId);
        const sanitizedCategory = this.sanitizeFileName(config.category);
        const sanitizedFileName = this.sanitizeFileName(config.fileName);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        return `${this.STORAGE_PREFIX}/${sanitizedCompany}/${config.financialYear}/${sanitizedCategory}/${timestamp}_${sanitizedFileName}`;
    }
    /**
     * Sanitize file names for safe storage
     */
    static sanitizeFileName(name) {
        return name
            .replace(/[^a-zA-Z0-9._-]/g, '_')
            .replace(/_{2,}/g, '_')
            .substring(0, 100); // Limit length
    }
    /**
     * Validate file before storage
     */
    static validateFile(file) {
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
    static async storeExpenseReceipt(config) {
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
            const storageRecord = {
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
        }
        catch (error) {
            console.error('Error storing expense receipt:', error);
            throw new Error('Failed to store expense receipt securely');
        }
    }
    /**
     * Retrieve stored file
     */
    static async getStoredFile(fileId) {
        try {
            const storageKey = `file_${fileId}`;
            const stored = localStorage.getItem(storageKey);
            if (!stored)
                return null;
            const fileRecord = JSON.parse(stored);
            const blob = this.base64ToBlob(fileRecord.data, fileRecord.mimeType);
            return {
                info: fileRecord,
                blob
            };
        }
        catch (error) {
            console.error('Error retrieving stored file:', error);
            return null;
        }
    }
    /**
     * List files by category and financial year
     */
    static getFilesByCategory(category, financialYear) {
        try {
            const registry = this.getFileRegistry();
            return registry.filter(file => file.category === category && file.financialYear === financialYear);
        }
        catch (error) {
            console.error('Error listing files by category:', error);
            return [];
        }
    }
    /**
     * Delete stored file
     */
    static deleteStoredFile(fileId) {
        try {
            const storageKey = `file_${fileId}`;
            localStorage.removeItem(storageKey);
            // Update registry
            const registry = this.getFileRegistry();
            const updatedRegistry = registry.filter(file => file.id !== fileId);
            localStorage.setItem('file_registry', JSON.stringify(updatedRegistry));
            return true;
        }
        catch (error) {
            console.error('Error deleting stored file:', error);
            return false;
        }
    }
    // Helper methods
    static generateId() {
        return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    static async fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    static base64ToBlob(base64, mimeType) {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: mimeType });
    }
    static getFileRegistry() {
        try {
            const registry = localStorage.getItem('file_registry');
            return registry ? JSON.parse(registry) : [];
        }
        catch (error) {
            console.error('Error reading file registry:', error);
            return [];
        }
    }
    static updateFileRegistry(fileInfo) {
        try {
            const registry = this.getFileRegistry();
            registry.push(fileInfo);
            localStorage.setItem('file_registry', JSON.stringify(registry));
        }
        catch (error) {
            console.error('Error updating file registry:', error);
        }
    }
}
Object.defineProperty(SecureFileStorage, "STORAGE_PREFIX", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 'fta-expenses'
});
Object.defineProperty(SecureFileStorage, "MAX_FILE_SIZE", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: 10 * 1024 * 1024
}); // 10MB
Object.defineProperty(SecureFileStorage, "ALLOWED_TYPES", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png'
    ]
});

import { InvoiceXMLGenerator } from '../utils/invoice/xml-generator';
import CryptoJS from 'crypto-js';
export class InvoiceService {
    constructor() {
        Object.defineProperty(this, "apiBaseUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "aspToken", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.apiBaseUrl = process.env.VITE_ASP_API_URL || '';
        this.aspToken = process.env.VITE_ASP_TOKEN || '';
    }
    static getInstance() {
        if (!InvoiceService.instance) {
            InvoiceService.instance = new InvoiceService();
        }
        return InvoiceService.instance;
    }
    async encryptData(data) {
        const key = process.env.VITE_ENCRYPTION_KEY || '';
        return CryptoJS.AES.encrypt(data, key).toString();
    }
    async decryptData(encryptedData) {
        const key = process.env.VITE_ENCRYPTION_KEY || '';
        const bytes = CryptoJS.AES.decrypt(encryptedData, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
    async storeInvoice(invoice, xml) {
        const encryptedXml = await this.encryptData(xml);
        // Store in IndexedDB for offline access
        const db = await this.openDatabase();
        const tx = db.transaction('invoices', 'readwrite');
        const store = tx.objectStore('invoices');
        await store.put({
            id: invoice.id,
            invoice,
            xml: encryptedXml,
            createdAt: new Date().toISOString()
        });
    }
    async openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('tax_invoices', 1);
            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('invoices')) {
                    db.createObjectStore('invoices', { keyPath: 'id' });
                }
            };
        });
    }
    async generateInvoice(invoice) {
        try {
            const xml = InvoiceXMLGenerator.generateXML(invoice);
            const privateKey = process.env.VITE_SIGNING_PRIVATE_KEY || '';
            const signedXml = InvoiceXMLGenerator.signXML(xml, privateKey);
            await this.storeInvoice(invoice, signedXml);
            return signedXml;
        }
        catch (error) {
            console.error('Error generating invoice:', error);
            throw new Error('Failed to generate invoice');
        }
    }
    async submitInvoice(invoice) {
        try {
            const signedXml = await this.generateInvoice(invoice);
            const response = await fetch(`${this.apiBaseUrl}/invoices`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/xml',
                    'Authorization': `Bearer ${this.aspToken}`
                },
                body: signedXml
            });
            if (!response.ok) {
                throw new Error(`Failed to submit invoice: ${response.statusText}`);
            }
            const result = await response.json();
            // Update stored invoice with submission status
            const db = await this.openDatabase();
            const tx = db.transaction('invoices', 'readwrite');
            const store = tx.objectStore('invoices');
            const storedInvoice = await store.get(invoice.id);
            if (storedInvoice) {
                storedInvoice.submissionStatus = result.status;
                storedInvoice.submittedAt = new Date().toISOString();
                await store.put(storedInvoice);
            }
            return result;
        }
        catch (error) {
            console.error('Error submitting invoice:', error);
            throw new Error('Failed to submit invoice');
        }
    }
    async getInvoice(id) {
        try {
            const db = await this.openDatabase();
            const tx = db.transaction('invoices', 'readonly');
            const store = tx.objectStore('invoices');
            const result = await store.get(id);
            if (!result)
                return null;
            const decryptedXml = await this.decryptData(result.xml);
            return {
                invoice: result.invoice,
                xml: decryptedXml
            };
        }
        catch (error) {
            console.error('Error retrieving invoice:', error);
            throw new Error('Failed to retrieve invoice');
        }
    }
    async listInvoices(page = 1, limit = 10, filters) {
        try {
            const db = await this.openDatabase();
            const tx = db.transaction('invoices', 'readonly');
            const store = tx.objectStore('invoices');
            return new Promise((resolve, reject) => {
                const request = store.getAll();
                request.onerror = () => reject(request.error);
                request.onsuccess = () => {
                    let invoices = request.result.map(item => item.invoice);
                    // Apply filters
                    if (filters) {
                        if (filters.status) {
                            invoices = invoices.filter(inv => inv.status === filters.status);
                        }
                        if (filters.dateRange) {
                            invoices = invoices.filter(inv => {
                                const invDate = new Date(inv.issueDate);
                                return invDate >= new Date(filters.dateRange.start) &&
                                    invDate <= new Date(filters.dateRange.end);
                            });
                        }
                    }
                    // Sort by date descending
                    invoices.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
                    const start = (page - 1) * limit;
                    const paginatedInvoices = invoices.slice(start, start + limit);
                    resolve({
                        invoices: paginatedInvoices,
                        total: invoices.length
                    });
                };
            });
        }
        catch (error) {
            console.error('Error listing invoices:', error);
            throw new Error('Failed to list invoices');
        }
    }
    async deleteInvoice(id) {
        try {
            const db = await this.openDatabase();
            const tx = db.transaction('invoices', 'readwrite');
            const store = tx.objectStore('invoices');
            await store.delete(id);
        }
        catch (error) {
            console.error('Error deleting invoice:', error);
            throw new Error('Failed to delete invoice');
        }
    }
}

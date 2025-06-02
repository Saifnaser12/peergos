import { Invoice } from '../types/invoice';
import { InvoiceXMLGenerator } from '../utils/invoice/xml-generator';
import CryptoJS from 'crypto-js';

export class InvoiceService {
  private static instance: InvoiceService;
  private apiBaseUrl: string;
  private aspToken: string;

  private constructor() {
    this.apiBaseUrl = process.env.VITE_ASP_API_URL || '';
    this.aspToken = process.env.VITE_ASP_TOKEN || '';
  }

  public static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService();
    }
    return InvoiceService.instance;
  }

  private async encryptData(data: string): Promise<string> {
    const key = process.env.VITE_ENCRYPTION_KEY || '';
    return CryptoJS.AES.encrypt(data, key).toString();
  }

  private async decryptData(encryptedData: string): Promise<string> {
    const key = process.env.VITE_ENCRYPTION_KEY || '';
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private async storeInvoice(invoice: Invoice, xml: string): Promise<void> {
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

  private async openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('tax_invoices', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('invoices')) {
          db.createObjectStore('invoices', { keyPath: 'id' });
        }
      };
    });
  }

  public async generateInvoice(invoice: Invoice): Promise<string> {
    try {
      const xml = InvoiceXMLGenerator.generateXML(invoice);
      const privateKey = process.env.VITE_SIGNING_PRIVATE_KEY || '';
      const signedXml = InvoiceXMLGenerator.signXML(xml, privateKey);
      
      await this.storeInvoice(invoice, signedXml);
      return signedXml;
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw new Error('Failed to generate invoice');
    }
  }

  public async submitInvoice(invoice: Invoice): Promise<{ status: string; message: string }> {
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
    } catch (error) {
      console.error('Error submitting invoice:', error);
      throw new Error('Failed to submit invoice');
    }
  }

  public async getInvoice(id: string): Promise<{ invoice: Invoice; xml: string } | null> {
    try {
      const db = await this.openDatabase();
      const tx = db.transaction('invoices', 'readonly');
      const store = tx.objectStore('invoices');
      
      const result = await store.get(id);
      if (!result) return null;
      
      const decryptedXml = await this.decryptData(result.xml);
      return {
        invoice: result.invoice,
        xml: decryptedXml
      };
    } catch (error) {
      console.error('Error retrieving invoice:', error);
      throw new Error('Failed to retrieve invoice');
    }
  }

  public async listInvoices(
    page: number = 1,
    limit: number = 10,
    filters?: { status?: string; dateRange?: { start: string; end: string } }
  ): Promise<{ invoices: Invoice[]; total: number }> {
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
                return invDate >= new Date(filters.dateRange!.start) &&
                       invDate <= new Date(filters.dateRange!.end);
              });
            }
          }
          
          // Sort by date descending
          invoices.sort((a, b) => 
            new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
          );
          
          const start = (page - 1) * limit;
          const paginatedInvoices = invoices.slice(start, start + limit);
          
          resolve({
            invoices: paginatedInvoices,
            total: invoices.length
          });
        };
      });
    } catch (error) {
      console.error('Error listing invoices:', error);
      throw new Error('Failed to list invoices');
    }
  }

  public async deleteInvoice(id: string): Promise<void> {
    try {
      const db = await this.openDatabase();
      const tx = db.transaction('invoices', 'readwrite');
      const store = tx.objectStore('invoices');
      await store.delete(id);
    } catch (error) {
      console.error('Error deleting invoice:', error);
      throw new Error('Failed to delete invoice');
    }
  }
} 
import { InvoiceXMLGenerator } from '../utils/invoice/xml-generator';
import { processInvoiceForPhase2, validatePhase2Compliance } from '../utils/phase2Compliance';
import CryptoJS from 'crypto-js';
import jsPDF from 'jspdf';
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
    // Convert Invoice to FTA E-Invoice JSON format
    convertToFTAFormat(invoice) {
        return {
            supplierTRN: invoice.seller.taxRegistrationNumber,
            buyerTRN: invoice.buyer.taxRegistrationNumber,
            issueDate: invoice.issueDate,
            invoiceNumber: invoice.invoiceNumber,
            currency: invoice.currency,
            subtotal: invoice.amount - invoice.vatAmount,
            vatAmount: invoice.vatAmount,
            totalAmount: invoice.amount,
            items: invoice.items.map(item => ({
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxRate: item.taxRate,
                taxAmount: item.taxAmount,
                totalAmount: item.totalAmount,
                productCode: item.productCode,
                unitsOfMeasure: item.unitsOfMeasure || 'PCE'
            })),
            seller: {
                name: invoice.seller.name,
                trn: invoice.seller.taxRegistrationNumber,
                address: {
                    street: invoice.seller.address.street,
                    city: invoice.seller.address.city,
                    emirate: invoice.seller.address.emirate,
                    country: invoice.seller.address.country,
                    postalCode: invoice.seller.address.postalCode
                },
                contact: invoice.seller.contactDetails ? {
                    phone: invoice.seller.contactDetails.phone,
                    email: invoice.seller.contactDetails.email
                } : undefined
            },
            buyer: invoice.buyer ? {
                name: invoice.buyer.name,
                trn: invoice.buyer.taxRegistrationNumber,
                address: {
                    street: invoice.buyer.address.street,
                    city: invoice.buyer.address.city,
                    emirate: invoice.buyer.address.emirate,
                    country: invoice.buyer.address.country,
                    postalCode: invoice.buyer.address.postalCode
                },
                contact: invoice.buyer.contactDetails ? {
                    phone: invoice.buyer.contactDetails.phone,
                    email: invoice.buyer.contactDetails.email
                } : undefined
            } : undefined,
            // PINT AE compliance fields
            customizationID: "urn:cen.eu:en16931:2017#compliant#urn:xeinkauf.de:kosit:xrechnung_3.0",
            profileID: "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0",
            invoiceTypeCode: "380", // Commercial invoice
            documentCurrencyCode: invoice.currency,
            taxCurrencyCode: invoice.currency,
            vatBreakdown: invoice.items.reduce((acc, item) => {
                const existing = acc.find(vat => vat.taxRate === item.taxRate);
                if (existing) {
                    existing.taxableAmount += item.taxableAmount;
                    existing.taxAmount += item.taxAmount;
                }
                else {
                    acc.push({
                        taxableAmount: item.taxableAmount,
                        taxRate: item.taxRate,
                        taxAmount: item.taxAmount,
                        taxCategory: item.taxCategory
                    });
                }
                return acc;
            }, [])
        };
    }
    // Generate human-readable PDF
    generatePDF(invoice, isRTL = false) {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        // Set font for Arabic support if needed
        if (isRTL) {
            doc.setR2L(true);
        }
        let yPos = 20;
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);
        // Header
        doc.setFontSize(24);
        doc.setFont(undefined, 'bold');
        doc.text(isRTL ? 'فاتورة ضريبية' : 'TAX INVOICE', margin, yPos);
        // Invoice number and date
        yPos += 15;
        doc.setFontSize(12);
        doc.setFont(undefined, 'normal');
        doc.text(`${isRTL ? 'رقم الفاتورة:' : 'Invoice Number:'} ${invoice.invoiceNumber}`, margin, yPos);
        yPos += 7;
        doc.text(`${isRTL ? 'التاريخ:' : 'Date:'} ${new Date(invoice.issueDate).toLocaleDateString()}`, margin, yPos);
        // Supplier information
        yPos += 20;
        doc.setFont(undefined, 'bold');
        doc.text(isRTL ? 'بيانات المورد' : 'SUPPLIER INFORMATION', margin, yPos);
        yPos += 10;
        doc.setFont(undefined, 'normal');
        doc.text(invoice.seller.name, margin, yPos);
        yPos += 5;
        doc.text(invoice.seller.address.street, margin, yPos);
        yPos += 5;
        doc.text(`${invoice.seller.address.city}, ${invoice.seller.address.emirate}`, margin, yPos);
        yPos += 5;
        doc.text(`${isRTL ? 'الرقم الضريبي:' : 'TRN:'} ${invoice.seller.taxRegistrationNumber}`, margin, yPos);
        // Customer information (if available)
        if (invoice.buyer && invoice.buyer.name) {
            yPos += 20;
            doc.setFont(undefined, 'bold');
            doc.text(isRTL ? 'بيانات العميل' : 'CUSTOMER INFORMATION', margin, yPos);
            yPos += 10;
            doc.setFont(undefined, 'normal');
            doc.text(invoice.buyer.name, margin, yPos);
            yPos += 5;
            doc.text(invoice.buyer.address.street, margin, yPos);
            yPos += 5;
            doc.text(`${invoice.buyer.address.city}, ${invoice.buyer.address.emirate}`, margin, yPos);
            if (invoice.buyer.taxRegistrationNumber) {
                yPos += 5;
                doc.text(`${isRTL ? 'الرقم الضريبي:' : 'TRN:'} ${invoice.buyer.taxRegistrationNumber}`, margin, yPos);
            }
        }
        // Items table
        yPos += 20;
        doc.setFont(undefined, 'bold');
        doc.text(isRTL ? 'تفاصيل الفاتورة' : 'INVOICE DETAILS', margin, yPos);
        // Table headers
        yPos += 15;
        const colWidths = [60, 25, 30, 25, 30];
        const headers = isRTL ?
            ['الوصف', 'الكمية', 'السعر', 'الضريبة', 'المجموع'] :
            ['Description', 'Qty', 'Unit Price', 'VAT', 'Total'];
        let xPos = margin;
        headers.forEach((header, index) => {
            doc.text(header, xPos, yPos);
            xPos += colWidths[index];
        });
        // Table rows
        yPos += 10;
        doc.setFont(undefined, 'normal');
        invoice.items.forEach(item => {
            xPos = margin;
            const values = [
                item.description.substring(0, 25) + (item.description.length > 25 ? '...' : ''),
                item.quantity.toString(),
                `${item.unitPrice.toFixed(2)} ${invoice.currency}`,
                `${item.taxAmount.toFixed(2)}`,
                `${item.totalAmount.toFixed(2)} ${invoice.currency}`
            ];
            values.forEach((value, index) => {
                doc.text(value, xPos, yPos);
                xPos += colWidths[index];
            });
            yPos += 7;
        });
        // Totals
        yPos += 15;
        const subtotal = invoice.amount - invoice.vatAmount;
        doc.setFont(undefined, 'bold');
        doc.text(`${isRTL ? 'المجموع الفرعي:' : 'Subtotal:'} ${subtotal.toFixed(2)} ${invoice.currency}`, pageWidth - 80, yPos);
        yPos += 7;
        doc.text(`${isRTL ? 'ضريبة القيمة المضافة:' : 'VAT Amount:'} ${invoice.vatAmount.toFixed(2)} ${invoice.currency}`, pageWidth - 80, yPos);
        yPos += 7;
        doc.setFontSize(14);
        doc.text(`${isRTL ? 'المجموع الكلي:' : 'TOTAL:'} ${invoice.amount.toFixed(2)} ${invoice.currency}`, pageWidth - 80, yPos);
        // Footer
        yPos = doc.internal.pageSize.getHeight() - 30;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(isRTL ? 'شكراً لتعاملكم معنا' : 'Thank you for your business', margin, yPos);
        return new Blob([doc.output('blob')], { type: 'application/pdf' });
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
    // Generate dual output: PDF + FTA JSON
    async generateDualOutput(invoice, language = 'en') {
        try {
            // Generate human-readable PDF
            const pdf = this.generatePDF(invoice, language === 'ar');
            // Generate FTA-compliant JSON
            const ftaJson = this.convertToFTAFormat(invoice);
            // Generate XML for submission
            const xmlString = await this.generateInvoice(invoice);
            return {
                pdf,
                ftaJson,
                xmlString
            };
        }
        catch (error) {
            console.error('Error generating dual output:', error);
            throw new Error('Failed to generate invoice outputs');
        }
    }
    // Generate Phase 2 compliant invoice with hash, signature, and QR code
    async generatePhase2Invoice(invoice) {
        try {
            // Generate XML
            const xmlString = await this.generateInvoice(invoice);
            // Process for Phase 2 compliance
            const phase2Data = await processInvoiceForPhase2(xmlString, {
                sellerTRN: invoice.seller.taxRegistrationNumber,
                buyerTRN: invoice.buyer?.taxRegistrationNumber || '',
                invoiceDate: invoice.issueDate,
                totalAmount: invoice.amount
            });
            // Validate compliance
            const validation = validatePhase2Compliance(phase2Data);
            if (!validation.isCompliant) {
                throw new Error(`Phase 2 compliance validation failed: ${validation.errors.join(', ')}`);
            }
            return phase2Data;
        }
        catch (error) {
            console.error('Error generating Phase 2 invoice:', error);
            throw new Error('Failed to generate Phase 2 compliant invoice');
        }
    }
    // Generate comprehensive output: PDF + FTA JSON + Phase 2 compliance
    async generateCompleteOutput(invoice, language = 'en') {
        try {
            // Generate human-readable PDF
            const pdf = this.generatePDF(invoice, language === 'ar');
            // Generate FTA-compliant JSON
            const ftaJson = this.convertToFTAFormat(invoice);
            // Generate Phase 2 compliant data
            const phase2Data = await this.generatePhase2Invoice(invoice);
            return {
                pdf,
                ftaJson,
                phase2Data
            };
        }
        catch (error) {
            console.error('Error generating complete output:', error);
            throw new Error('Failed to generate complete invoice output');
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

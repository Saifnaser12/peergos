import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { SignedXml } from 'xml-crypto';
export class InvoiceXMLGenerator {
    static createXMLDocument() {
        const parser = new DOMParser();
        return parser.parseFromString('<?xml version="1.0" encoding="UTF-8"?>' +
            '<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" ' +
            'xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" ' +
            'xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" ' +
            'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"/>', 'application/xml');
    }
    static appendElement(parent, name, value, attributes) {
        const doc = parent.ownerDocument;
        const element = doc.createElement(name);
        if (value !== undefined) {
            element.textContent = value;
        }
        if (attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                element.setAttribute(key, value);
            });
        }
        parent.appendChild(element);
        return element;
    }
    static appendPartyInfo(parent, partyType, invoice) {
        const party = invoice[partyType];
        const partyElement = this.appendElement(parent, `cac:${partyType === 'seller' ? 'AccountingSupplierParty' : 'AccountingCustomerParty'}`);
        const partyDetails = this.appendElement(partyElement, 'cac:Party');
        // Party Identification
        const partyIdentification = this.appendElement(partyDetails, 'cac:PartyIdentification');
        this.appendElement(partyIdentification, 'cbc:ID', party.trn);
        // Party Name
        const partyName = this.appendElement(partyDetails, 'cac:PartyName');
        this.appendElement(partyName, 'cbc:Name', party.name);
        // Postal Address
        const address = this.appendElement(partyDetails, 'cac:PostalAddress');
        this.appendElement(address, 'cbc:StreetName', party.address.street);
        this.appendElement(address, 'cbc:CityName', party.address.city);
        this.appendElement(address, 'cbc:PostalZone', party.address.postalCode);
        this.appendElement(address, 'cbc:CountrySubentity', party.address.emirate);
        const country = this.appendElement(address, 'cac:Country');
        this.appendElement(country, 'cbc:IdentificationCode', party.address.country);
        // Tax Scheme
        const partyTaxScheme = this.appendElement(partyDetails, 'cac:PartyTaxScheme');
        this.appendElement(partyTaxScheme, 'cbc:CompanyID', party.trn);
        const taxScheme = this.appendElement(partyTaxScheme, 'cac:TaxScheme');
        this.appendElement(taxScheme, 'cbc:ID', 'VAT');
        // Contact
        if (party.contactDetails) {
            const contact = this.appendElement(partyDetails, 'cac:Contact');
            if (party.contactDetails.phone) {
                this.appendElement(contact, 'cbc:Telephone', party.contactDetails.phone);
            }
            if (party.contactDetails.email) {
                this.appendElement(contact, 'cbc:ElectronicMail', party.contactDetails.email);
            }
        }
    }
    static appendInvoiceLine(parent, line) {
        const invoiceLine = this.appendElement(parent, 'cac:InvoiceLine');
        this.appendElement(invoiceLine, 'cbc:ID', line.id);
        this.appendElement(invoiceLine, 'cbc:InvoicedQuantity', line.quantity.toString());
        this.appendElement(invoiceLine, 'cbc:LineExtensionAmount', line.netAmount.toString(), {
            currencyID: 'AED'
        });
        // Item
        const item = this.appendElement(invoiceLine, 'cac:Item');
        this.appendElement(item, 'cbc:Name', line.description);
        const sellersItem = this.appendElement(item, 'cac:SellersItemIdentification');
        this.appendElement(sellersItem, 'cbc:ID', line.productCode);
        // Price
        const price = this.appendElement(invoiceLine, 'cac:Price');
        this.appendElement(price, 'cbc:PriceAmount', line.unitPrice.toString(), {
            currencyID: 'AED'
        });
        // Tax
        const taxTotal = this.appendElement(invoiceLine, 'cac:TaxTotal');
        this.appendElement(taxTotal, 'cbc:TaxAmount', line.taxBreakdown.taxAmount.toString(), {
            currencyID: 'AED'
        });
        const taxSubtotal = this.appendElement(taxTotal, 'cac:TaxSubtotal');
        this.appendElement(taxSubtotal, 'cbc:TaxableAmount', line.taxBreakdown.taxableAmount.toString(), {
            currencyID: 'AED'
        });
        this.appendElement(taxSubtotal, 'cbc:TaxAmount', line.taxBreakdown.taxAmount.toString(), {
            currencyID: 'AED'
        });
        const taxCategory = this.appendElement(taxSubtotal, 'cac:TaxCategory');
        this.appendElement(taxCategory, 'cbc:ID', line.taxBreakdown.taxCategory);
        this.appendElement(taxCategory, 'cbc:Percent', line.taxBreakdown.taxRate.toString());
        if (line.taxBreakdown.exemptionReason) {
            this.appendElement(taxCategory, 'cbc:TaxExemptionReason', line.taxBreakdown.exemptionReason);
        }
        const taxScheme = this.appendElement(taxCategory, 'cac:TaxScheme');
        this.appendElement(taxScheme, 'cbc:ID', 'VAT');
    }
    static generateXML(invoice) {
        const doc = this.createXMLDocument();
        const root = doc.documentElement;
        // UBL Version
        this.appendElement(root, 'cbc:UBLVersionID', '2.1');
        this.appendElement(root, 'cbc:CustomizationID', 'PINT AE');
        this.appendElement(root, 'cbc:ProfileID', 'reporting:1.0');
        // Invoice Information
        this.appendElement(root, 'cbc:ID', invoice.invoiceNumber);
        this.appendElement(root, 'cbc:UUID', invoice.uuid);
        this.appendElement(root, 'cbc:IssueDate', invoice.issueDate);
        if (invoice.dueDate) {
            this.appendElement(root, 'cbc:DueDate', invoice.dueDate);
        }
        this.appendElement(root, 'cbc:InvoiceTypeCode', invoice.type);
        if (invoice.notes) {
            this.appendElement(root, 'cbc:Note', invoice.notes);
        }
        // Document Currency
        this.appendElement(root, 'cbc:DocumentCurrencyCode', 'AED');
        this.appendElement(root, 'cbc:TaxCurrencyCode', 'AED');
        // Parties
        this.appendPartyInfo(root, 'seller', invoice);
        this.appendPartyInfo(root, 'buyer', invoice);
        // Payment Terms
        if (invoice.paymentTerms) {
            const paymentTerms = this.appendElement(root, 'cac:PaymentTerms');
            this.appendElement(paymentTerms, 'cbc:Note', invoice.paymentTerms);
        }
        // Tax Total
        const taxTotal = this.appendElement(root, 'cac:TaxTotal');
        this.appendElement(taxTotal, 'cbc:TaxAmount', invoice.totalTaxAmount.toString(), {
            currencyID: 'AED'
        });
        // Legal Monetary Total
        const legalMonetaryTotal = this.appendElement(root, 'cac:LegalMonetaryTotal');
        this.appendElement(legalMonetaryTotal, 'cbc:LineExtensionAmount', (invoice.totalAmount - invoice.totalTaxAmount).toString(), { currencyID: 'AED' });
        if (invoice.totalDiscountAmount) {
            this.appendElement(legalMonetaryTotal, 'cbc:AllowanceTotalAmount', invoice.totalDiscountAmount.toString(), { currencyID: 'AED' });
        }
        this.appendElement(legalMonetaryTotal, 'cbc:TaxExclusiveAmount', (invoice.totalAmount - invoice.totalTaxAmount).toString(), { currencyID: 'AED' });
        this.appendElement(legalMonetaryTotal, 'cbc:TaxInclusiveAmount', invoice.totalAmount.toString(), { currencyID: 'AED' });
        this.appendElement(legalMonetaryTotal, 'cbc:PayableAmount', invoice.totalAmount.toString(), { currencyID: 'AED' });
        // Invoice Lines
        invoice.lines.forEach(line => this.appendInvoiceLine(root, line));
        return new XMLSerializer().serializeToString(doc);
    }
    static signXML(xml, privateKey) {
        const sig = new SignedXml();
        sig.addReference("//*[local-name(.)='Invoice']", [
            'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
            'http://www.w3.org/2001/10/xml-exc-c14n#'
        ]);
        sig.privateKey = privateKey;
        sig.computeSignature(xml);
        return sig.getSignedXml();
    }
}

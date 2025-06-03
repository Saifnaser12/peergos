import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { SignedXml } from 'xml-crypto';
import { XMLDocument } from 'xmldom';
export class InvoiceXMLGenerator {
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
        const doc = new XMLDocument();
        const root = doc.createElement('Invoice');
        // Add invoice details
        this.appendElement(root, 'InvoiceNumber', invoice.invoiceNumber);
        this.appendElement(root, 'IssueDate', invoice.issueDate);
        if (invoice.dueDate)
            this.appendElement(root, 'DueDate', invoice.dueDate);
        this.appendElement(root, 'TotalAmount', invoice.totalAmount.toString());
        // Add invoice lines
        invoice.lines.forEach(line => this.appendInvoiceLine(root, line));
        const xmlString = doc.toString();
        return xmlString;
    }
    static signXML(xml, privateKey) {
        const sig = new SignedXml();
        sig.addReference("//*[local-name(.)='Invoice']", [
            'http://www.w3.org/2000/09/xmldsig#enveloped-signature',
            'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
        ]);
        sig.signingKey = privateKey;
        sig.computeSignature(xml);
        return sig.getSignedXml();
    }
    static validateXML(xmlString) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(xmlString, 'application/xml');
            return !doc.getElementsByTagName('parsererror').length;
        }
        catch (error) {
            return false;
        }
    }
}
Object.defineProperty(InvoiceXMLGenerator, "parser", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new DOMParser()
});
Object.defineProperty(InvoiceXMLGenerator, "serializer", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: new XMLSerializer()
});

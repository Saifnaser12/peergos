import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { SignedXml } from 'xml-crypto';
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
    static appendPartyInfo(parent, partyType, party) {
        const partyElement = this.appendElement(parent, `cac:${partyType === 'seller' ? 'AccountingSupplierParty' : 'AccountingCustomerParty'}`);
        const partyDetails = this.appendElement(partyElement, 'cac:Party');
        // Party Identification
        const partyIdentification = this.appendElement(partyDetails, 'cac:PartyIdentification');
        this.appendElement(partyIdentification, 'cbc:ID', party.taxRegistrationNumber);
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
        this.appendElement(partyTaxScheme, 'cbc:CompanyID', party.taxRegistrationNumber);
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
    static appendInvoiceItem(parent, item) {
        const itemElement = this.appendElement(parent, 'cac:InvoiceLine');
        this.appendElement(itemElement, 'cbc:ID', item.id);
        this.appendElement(itemElement, 'cbc:InvoicedQuantity', item.quantity.toString());
        this.appendElement(itemElement, 'cbc:LineExtensionAmount', item.totalAmount.toString(), {
            currencyID: 'AED'
        });
        // Item
        const itemDetails = this.appendElement(itemElement, 'cac:Item');
        this.appendElement(itemDetails, 'cbc:Name', item.description);
        const sellersItem = this.appendElement(itemDetails, 'cac:SellersItemIdentification');
        this.appendElement(sellersItem, 'cbc:ID', item.productCode);
        // Price
        const price = this.appendElement(itemElement, 'cac:Price');
        this.appendElement(price, 'cbc:PriceAmount', item.unitPrice.toString(), {
            currencyID: 'AED'
        });
        // Tax
        const taxTotal = this.appendElement(itemElement, 'cac:TaxTotal');
        this.appendElement(taxTotal, 'cbc:TaxAmount', item.taxAmount.toString(), {
            currencyID: 'AED'
        });
        const taxSubtotal = this.appendElement(taxTotal, 'cac:TaxSubtotal');
        this.appendElement(taxSubtotal, 'cbc:TaxableAmount', item.taxableAmount.toString(), {
            currencyID: 'AED'
        });
        this.appendElement(taxSubtotal, 'cbc:TaxAmount', item.taxAmount.toString(), {
            currencyID: 'AED'
        });
        const taxCategory = this.appendElement(taxSubtotal, 'cac:TaxCategory');
        this.appendElement(taxCategory, 'cbc:ID', item.taxCategory);
        this.appendElement(taxCategory, 'cbc:Percent', item.taxRate.toString());
        if (item.exemptionReason) {
            this.appendElement(taxCategory, 'cbc:TaxExemptionReason', item.exemptionReason);
        }
        const taxScheme = this.appendElement(taxCategory, 'cac:TaxScheme');
        this.appendElement(taxScheme, 'cbc:ID', 'VAT');
    }
    static generateXML(invoice) {
        const doc = this.parser.parseFromString('<?xml version="1.0" encoding="UTF-8"?><Invoice></Invoice>', 'application/xml');
        const root = doc.documentElement;
        if (!root)
            throw new Error('Failed to create root element for Invoice XML');
        // Add invoice details
        this.appendElement(root, 'InvoiceNumber', invoice.invoiceNumber);
        this.appendElement(root, 'IssueDate', invoice.issueDate);
        this.appendElement(root, 'DueDate', invoice.dueDate);
        this.appendElement(root, 'Currency', invoice.currency);
        this.appendElement(root, 'TotalAmount', invoice.amount.toString());
        this.appendElement(root, 'VATAmount', invoice.vatAmount.toString());
        // Add seller and buyer information
        this.appendPartyInfo(root, 'seller', invoice.seller);
        this.appendPartyInfo(root, 'buyer', invoice.buyer);
        // Add invoice items
        const itemsElement = doc.createElement('Items');
        root.appendChild(itemsElement);
        invoice.items.forEach(item => this.appendInvoiceItem(itemsElement, item));
        return this.serializer.serializeToString(doc);
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

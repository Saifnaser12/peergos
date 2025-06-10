import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { downloadPhase2InvoiceXML } from "../utils/invoiceXml";
export default function SimpleInvoice() {
    const [items, setItems] = useState([{ description: "", amount: 0, vatRate: 5 }]);
    const [buyerTRN, setBuyerTRN] = useState("");
    const [sellerTRN] = useState("100123456700003"); // Static for now
    const date = new Date().toISOString().split("T")[0];
    const handleChange = (i, field, value) => {
        const updated = [...items];
        if (field === "amount" || field === "vatRate") {
            updated[i][field] = parseFloat(value) || 0;
        }
        else {
            updated[i][field] = value;
        }
        setItems(updated);
    };
    const addItem = () => {
        setItems([...items, { description: "", amount: 0, vatRate: 5 }]);
    };
    const removeItem = (index) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };
    const generateXML = () => {
        if (!buyerTRN.trim()) {
            alert("Please enter Buyer TRN");
            return;
        }
        if (items.some(item => !item.description.trim() || item.amount <= 0)) {
            alert("Please fill all item details");
            return;
        }
        const invoice = {
            id: `INV-${Date.now()}`,
            buyerTRN,
            sellerTRN,
            items,
            date
        };
        downloadPhase2InvoiceXML(invoice);
    };
    const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
    const totalVAT = items.reduce((sum, item) => sum + (item.amount * item.vatRate / 100), 0);
    const grandTotal = totalAmount + totalVAT;
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg", children: [_jsx("h1", { className: "text-2xl font-bold mb-6 text-gray-800", children: "Create Invoice" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Seller TRN" }), _jsx("input", { value: sellerTRN, disabled: true, className: "w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "Buyer TRN" }), _jsx("input", { value: buyerTRN, onChange: (e) => setBuyerTRN(e.target.value), placeholder: "Enter buyer TRN", className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full border-collapse border border-gray-300", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-50", children: [_jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Description" }), _jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Amount (AED)" }), _jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "VAT Rate (%)" }), _jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "VAT Amount" }), _jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Total" }), _jsx("th", { className: "border border-gray-300 px-4 py-2 text-left", children: "Actions" })] }) }), _jsx("tbody", { children: items.map((item, i) => {
                                const vatAmount = item.amount * item.vatRate / 100;
                                const lineTotal = item.amount + vatAmount;
                                return (_jsxs("tr", { children: [_jsx("td", { className: "border border-gray-300 px-2 py-1", children: _jsx("input", { value: item.description, onChange: (e) => handleChange(i, "description", e.target.value), placeholder: "Item description", className: "w-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 rounded" }) }), _jsx("td", { className: "border border-gray-300 px-2 py-1", children: _jsx("input", { type: "number", value: item.amount, onChange: (e) => handleChange(i, "amount", e.target.value), min: "0", step: "0.01", className: "w-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 rounded" }) }), _jsx("td", { className: "border border-gray-300 px-2 py-1", children: _jsx("input", { type: "number", value: item.vatRate, onChange: (e) => handleChange(i, "vatRate", e.target.value), min: "0", max: "100", step: "0.1", className: "w-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 rounded" }) }), _jsx("td", { className: "border border-gray-300 px-4 py-2 text-right", children: vatAmount.toFixed(2) }), _jsx("td", { className: "border border-gray-300 px-4 py-2 text-right font-medium", children: lineTotal.toFixed(2) }), _jsx("td", { className: "border border-gray-300 px-2 py-1", children: _jsx("button", { onClick: () => removeItem(i), disabled: items.length === 1, className: "text-red-600 hover:text-red-800 disabled:text-gray-400 px-2 py-1", children: "Remove" }) })] }, i));
                            }) })] }) }), _jsxs("div", { className: "mt-4 flex justify-between items-center", children: [_jsx("button", { onClick: addItem, className: "px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors", children: "Add Item" }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-sm text-gray-600", children: ["Subtotal: AED ", totalAmount.toFixed(2)] }), _jsxs("div", { className: "text-sm text-gray-600", children: ["VAT: AED ", totalVAT.toFixed(2)] }), _jsxs("div", { className: "text-lg font-bold", children: ["Total: AED ", grandTotal.toFixed(2)] })] })] }), _jsx("div", { className: "mt-6 flex justify-end", children: _jsx("button", { onClick: generateXML, className: "px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium", children: "Generate & Download XML" }) })] }));
}


import { useState } from "react";
import { downloadPhase2InvoiceXML, Phase2Invoice, Phase2InvoiceItem } from "../utils/invoiceXml";
import { v4 as uuidv4 } from 'uuid';

export default function SimpleInvoice() {
  const [items, setItems] = useState<Phase2InvoiceItem[]>([{ description: "", amount: 0, vatRate: 5 }]);
  const [buyerTRN, setBuyerTRN] = useState("");
  const [sellerTRN] = useState("100123456700003"); // Static for now
  const date = new Date().toISOString().split("T")[0];

  const handleChange = (i: number, field: keyof Phase2InvoiceItem, value: string) => {
    const updated = [...items];
    if (field === "amount" || field === "vatRate") {
      updated[i][field] = parseFloat(value) || 0;
    } else {
      updated[i][field] = value;
    }
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { description: "", amount: 0, vatRate: 5 }]);
  };

  const removeItem = (index: number) => {
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

    const invoice: Phase2Invoice = {
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create Invoice</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Seller TRN</label>
          <input 
            value={sellerTRN} 
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Buyer TRN</label>
          <input 
            value={buyerTRN} 
            onChange={(e) => setBuyerTRN(e.target.value)}
            placeholder="Enter buyer TRN"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-50">
              <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Amount (AED)</th>
              <th className="border border-gray-300 px-4 py-2 text-left">VAT Rate (%)</th>
              <th className="border border-gray-300 px-4 py-2 text-left">VAT Amount</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Total</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const vatAmount = item.amount * item.vatRate / 100;
              const lineTotal = item.amount + vatAmount;
              
              return (
                <tr key={i}>
                  <td className="border border-gray-300 px-2 py-1">
                    <input 
                      value={item.description} 
                      onChange={(e) => handleChange(i, "description", e.target.value)}
                      placeholder="Item description"
                      className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input 
                      type="number" 
                      value={item.amount} 
                      onChange={(e) => handleChange(i, "amount", e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <input 
                      type="number" 
                      value={item.vatRate} 
                      onChange={(e) => handleChange(i, "vatRate", e.target.value)}
                      min="0"
                      max="100"
                      step="0.1"
                      className="w-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 rounded"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {vatAmount.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-medium">
                    {lineTotal.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-2 py-1">
                    <button 
                      onClick={() => removeItem(i)}
                      disabled={items.length === 1}
                      className="text-red-600 hover:text-red-800 disabled:text-gray-400 px-2 py-1"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <button 
          onClick={addItem}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
        >
          Add Item
        </button>

        <div className="text-right">
          <div className="text-sm text-gray-600">Subtotal: AED {totalAmount.toFixed(2)}</div>
          <div className="text-sm text-gray-600">VAT: AED {totalVAT.toFixed(2)}</div>
          <div className="text-lg font-bold">Total: AED {grandTotal.toFixed(2)}</div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button 
          onClick={generateXML}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Generate & Download XML
        </button>
      </div>
    </div>
  );
}

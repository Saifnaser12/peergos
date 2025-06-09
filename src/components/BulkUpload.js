import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
const BulkUpload = ({ type, onUpload, onCancel }) => {
    const [parsedData, setParsedData] = useState([]);
    const [errors, setErrors] = useState([]);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const validateEntry = (entry) => {
        const errors = [];
        // Validate date
        if (!entry.date || isNaN(Date.parse(entry.date))) {
            errors.push('Invalid date format');
        }
        // Validate amount
        const amount = parseFloat(entry.amount);
        if (isNaN(amount) || amount <= 0) {
            errors.push('Amount must be a positive number');
        }
        // Validate type-specific fields
        if (type === 'revenue') {
            if (!entry.source) {
                errors.push('Source is required for revenue entries');
            }
            if (!entry.vatAmount || isNaN(parseFloat(entry.vatAmount))) {
                errors.push('VAT amount must be a valid number');
            }
        }
        else {
            if (!entry.category) {
                errors.push('Category is required for expense entries');
            }
        }
        return errors;
    };
    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    const parsedEntries = results.data;
                    setParsedData(parsedEntries);
                    setIsPreviewMode(true);
                    // Validate all entries
                    const allErrors = [];
                    parsedEntries.forEach((entry, index) => {
                        const entryErrors = validateEntry(entry);
                        if (entryErrors.length > 0) {
                            allErrors.push(`Row ${index + 1}: ${entryErrors.join(', ')}`);
                        }
                    });
                    setErrors(allErrors);
                },
                error: (error) => {
                    setErrors([`Failed to parse CSV: ${error.message}`]);
                }
            });
        }
    }, [type]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
        },
        multiple: false
    });
    const handleConfirm = () => {
        if (errors.length > 0)
            return;
        const formattedEntries = parsedData.map(entry => {
            const baseEntry = {
                id: crypto.randomUUID(),
                date: new Date(entry.date).toISOString(),
                amount: parseFloat(entry.amount),
            };
            if (type === 'revenue') {
                return {
                    ...baseEntry,
                    source: entry.source,
                    vatAmount: parseFloat(entry.vatAmount),
                };
            }
            else {
                return {
                    ...baseEntry,
                    category: entry.category,
                };
            }
        });
        onUpload(formattedEntries);
    };
    return (_jsxs("div", { className: "p-4 bg-white rounded-lg shadow", children: [_jsxs("h3", { className: "text-lg font-medium mb-4", children: ["Bulk Upload ", type === 'revenue' ? 'Revenue' : 'Expense', " Entries"] }), !isPreviewMode ? (_jsxs("div", { ...getRootProps(), className: `border-2 border-dashed p-8 rounded-lg text-center cursor-pointer
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`, children: [_jsx("input", { ...getInputProps() }), _jsx("p", { className: "text-gray-600", children: isDragActive
                            ? 'Drop the CSV file here'
                            : 'Drag and drop a CSV file here, or click to select one' }), _jsxs("p", { className: "text-sm text-gray-500 mt-2", children: ["Required columns: date, amount, ", type === 'revenue' ? 'source, vatAmount' : 'category'] })] })) : (_jsxs("div", { children: [_jsxs("div", { className: "mb-4 overflow-x-auto", children: [_jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Date" }), type === 'revenue' && (_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Source" })), type === 'expense' && (_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Category" })), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "Amount" }), type === 'revenue' && (_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase", children: "VAT Amount" }))] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: parsedData.slice(0, 5).map((entry, index) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: entry.date }), type === 'revenue' && (_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: entry.source })), type === 'expense' && (_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: entry.category })), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: entry.amount }), type === 'revenue' && (_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-900", children: entry.vatAmount }))] }, index))) })] }), parsedData.length > 5 && (_jsxs("p", { className: "text-sm text-gray-500 mt-2", children: ["Showing 5 of ", parsedData.length, " entries"] }))] }), errors.length > 0 && (_jsxs("div", { className: "mb-4 p-4 bg-red-50 rounded-md", children: [_jsx("h4", { className: "text-sm font-medium text-red-800 mb-2", children: "Validation Errors:" }), _jsx("ul", { className: "text-sm text-red-700 list-disc list-inside", children: errors.map((error, index) => (_jsx("li", { children: error }, index))) })] })), _jsxs("div", { className: "flex justify-end space-x-3", children: [_jsx("button", { onClick: onCancel, className: "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50", children: "Cancel" }), _jsxs("button", { onClick: handleConfirm, disabled: errors.length > 0, className: `px-4 py-2 text-sm font-medium text-white rounded-md
                ${errors.length > 0
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'}`, children: ["Import ", parsedData.length, " Entries"] })] })] }))] }));
};
export default BulkUpload;

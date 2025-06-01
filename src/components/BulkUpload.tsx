import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import type { RevenueEntry, ExpenseEntry } from '../types';

interface BulkUploadProps {
  type: 'revenue' | 'expense';
  onUpload: (entries: (RevenueEntry | ExpenseEntry)[]) => void;
  onCancel: () => void;
}

interface ParsedEntry {
  date: string;
  amount: string;
  [key: string]: string;
}

const BulkUpload: React.FC<BulkUploadProps> = ({ type, onUpload, onCancel }) => {
  const [parsedData, setParsedData] = useState<ParsedEntry[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const validateEntry = (entry: ParsedEntry): string[] => {
    const errors: string[] = [];
    
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
    } else {
      if (!entry.category) {
        errors.push('Category is required for expense entries');
      }
    }
    
    return errors;
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      Papa.parse<ParsedEntry>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedEntries = results.data;
          setParsedData(parsedEntries);
          setIsPreviewMode(true);
          
          // Validate all entries
          const allErrors: string[] = [];
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
    if (errors.length > 0) return;

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
        } as RevenueEntry;
      } else {
        return {
          ...baseEntry,
          category: entry.category,
        } as ExpenseEntry;
      }
    });

    onUpload(formattedEntries);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">
        Bulk Upload {type === 'revenue' ? 'Revenue' : 'Expense'} Entries
      </h3>

      {!isPreviewMode ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-8 rounded-lg text-center cursor-pointer
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
        >
          <input {...getInputProps()} />
          <p className="text-gray-600">
            {isDragActive
              ? 'Drop the CSV file here'
              : 'Drag and drop a CSV file here, or click to select one'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Required columns: date, amount, {type === 'revenue' ? 'source, vatAmount' : 'category'}
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  {type === 'revenue' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                  )}
                  {type === 'expense' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  {type === 'revenue' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">VAT Amount</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parsedData.slice(0, 5).map((entry, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.date}</td>
                    {type === 'revenue' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.source}</td>
                    )}
                    {type === 'expense' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.category}</td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.amount}</td>
                    {type === 'revenue' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.vatAmount}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {parsedData.length > 5 && (
              <p className="text-sm text-gray-500 mt-2">
                Showing 5 of {parsedData.length} entries
              </p>
            )}
          </div>

          {errors.length > 0 && (
            <div className="mb-4 p-4 bg-red-50 rounded-md">
              <h4 className="text-sm font-medium text-red-800 mb-2">Validation Errors:</h4>
              <ul className="text-sm text-red-700 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={errors.length > 0}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md
                ${errors.length > 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              Import {parsedData.length} Entries
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkUpload; 
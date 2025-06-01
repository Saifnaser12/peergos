import React, { useState } from 'react';
import type { ChangeEvent } from 'react';

const Setup: React.FC = () => {
  const [revenue, setRevenue] = useState<string>('');
  const [taxMessage, setTaxMessage] = useState<string>('');
  const [messageColor, setMessageColor] = useState<string>('text-gray-600');

  const handleRevenueChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRevenue(value);
    
    const numericRevenue = parseFloat(value.replace(/,/g, ''));
    
    if (!isNaN(numericRevenue)) {
      if (numericRevenue < 375000) {
        setTaxMessage('No VAT or Corporate Income Tax obligations');
        setMessageColor('text-green-600');
      } else if (numericRevenue <= 3000000) {
        setTaxMessage('VAT registration required. No Corporate Income Tax obligations');
        setMessageColor('text-blue-600');
      } else {
        setTaxMessage('Both VAT registration and Corporate Income Tax (accrual basis) required');
        setMessageColor('text-indigo-600');
      }
    } else {
      setTaxMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Setup Your Tax Profile
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Configure your tax compliance settings
          </p>
        </div>
        <div className="mt-8">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <div className="mt-1">
                  <input
                    id="company"
                    name="company"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter company name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="trn" className="block text-sm font-medium text-gray-700">
                  TRN Number
                </label>
                <div className="mt-1">
                  <input
                    id="trn"
                    name="trn"
                    type="text"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter TRN number"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="licenseType" className="block text-sm font-medium text-gray-700">
                  License Type
                </label>
                <div className="mt-1">
                  <select
                    id="licenseType"
                    name="licenseType"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="">Select license type</option>
                    <option value="mainland">Mainland</option>
                    <option value="freezone">Free Zone</option>
                    <option value="offshore">Offshore</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="revenue" className="block text-sm font-medium text-gray-700">
                  Annual Revenue (AED)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">AED</span>
                  </div>
                  <input
                    type="text"
                    name="revenue"
                    id="revenue"
                    value={revenue}
                    onChange={handleRevenueChange}
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                  />
                </div>
                {taxMessage && (
                  <p className={`mt-2 text-sm ${messageColor}`}>
                    {taxMessage}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Documents
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup; 
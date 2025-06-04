import React, { useState, useEffect, useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { useAudit } from '../context/AuditContext';
import { useTax } from '../context/TaxContext';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import type { CompanyProfile } from '../types';
import {
  BuildingOfficeIcon,
  IdentificationIcon,
  DocumentCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import ComplianceBadges from '../components/ComplianceBadges';
import Card from '../components/Card';
import Button from '../components/Button';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { validateTRN } from '../utils/validation';
import { calculateTaxLiability } from '../utils/calculations';
import { PageHeader } from '../components/Card';

interface ValidationState {
  isValid: boolean;
  message: string;
}

interface FormErrors {
  companyName: ValidationState;
  trnNumber: ValidationState;
  licenseType: ValidationState;
  revenue: ValidationState;
}

interface FormData {
  companyName: string;
  trnNumber: string;
  licenseType: string;
  revenue: string;
  vatRegistered: boolean;
  citRegistered: boolean;
  citSubmissionDate: string;
}

const STORAGE_KEY = 'setup_form_data';

const Setup: React.FC = () => {
  const navigate = useNavigate();
  const { log } = useAudit();
  const { dispatch, state } = useTax();
  const { t } = useTranslation();

  const [profile, setProfile] = useState<CompanyProfile>({
    companyName: state.profile?.companyName || '',
    trnNumber: state.profile?.trnNumber || '',
    licenseType: state.profile?.licenseType || '',
    email: state.profile?.email || '',
    phone: state.profile?.phone || '',
    address: state.profile?.address || '',
    businessActivity: state.profile?.businessActivity || '',
    vatRegistered: state.profile?.vatRegistered || false,
    citRegistered: state.profile?.citRegistered || false,
    citSubmissionDate: state.profile?.citSubmissionDate
  });

  const [errors, setErrors] = useState<FormErrors>({
    companyName: { isValid: true, message: '' },
    trnNumber: { isValid: true, message: '' },
    licenseType: { isValid: true, message: '' },
    revenue: { isValid: true, message: '' }
  });

  const [taxMessage, setTaxMessage] = useState<string>('');
  const [messageColor, setMessageColor] = useState<string>('text-gray-600');
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [saveIndicator, setSaveIndicator] = useState<string>('');

  // Log page view
  useEffect(() => {
    log('VIEW_SETUP');
  }, [log]);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    const saveData = () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setSaveIndicator('Saved');
      const timer = setTimeout(() => setSaveIndicator(''), 2000);
      return () => clearTimeout(timer);
    };

    // Debounce the save operation
    const timeoutId = setTimeout(saveData, 500);
    return () => clearTimeout(timeoutId);
  }, [profile]);

  const validateTRN = (trn: string): ValidationState => {
    if (!trn) return { isValid: false, message: 'TRN is required' };
    if (!/^\d+$/.test(trn)) return { isValid: false, message: 'TRN must contain only digits' };
    if (trn.length !== 15) return { isValid: false, message: 'TRN must be exactly 15 digits' };
    
    // Checksum validation
    const sum = trn.split('').reduce((acc, digit) => acc + parseInt(digit), 0);
    if (sum % 7 !== 0) return { isValid: false, message: 'Invalid TRN checksum' };
    
    return { isValid: true, message: '' };
  };

  const validateRevenue = (value: string): ValidationState => {
    if (!value) return { isValid: false, message: 'Revenue is required' };
    const numericValue = parseFloat(value.replace(/,/g, ''));
    if (isNaN(numericValue)) return { isValid: false, message: 'Revenue must be a valid number' };
    if (numericValue < 0) return { isValid: false, message: 'Revenue cannot be negative' };
    return { isValid: true, message: '' };
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (name === 'trnNumber') {
      processedValue = value.replace(/[^0-9]/g, '').slice(0, 15);
    } else if (name === 'revenue') {
      processedValue = value.replace(/[^0-9.]/g, '');
    }

    setProfile(prev => ({
      ...prev,
      [name]: processedValue
    }));

    setSaveIndicator('Saving...');

    // Validate field
    let validation: ValidationState = { isValid: true, message: '' };
    switch (name) {
      case 'companyName':
        validation = { 
          isValid: value.trim().length > 0,
          message: value.trim().length === 0 ? 'Company name is required' : ''
        };
        break;
      case 'trnNumber':
        validation = validateTRN(processedValue);
        break;
      case 'licenseType':
        validation = {
          isValid: value !== '',
          message: value === '' ? 'Please select a license type' : ''
        };
        break;
      case 'revenue':
        validation = validateRevenue(processedValue);
        if (validation.isValid) {
          const numericRevenue = parseFloat(processedValue.replace(/,/g, ''));
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
        }
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: validation
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_PROFILE', payload: profile });
    setSaveIndicator('Saved');
    setTimeout(() => setSaveIndicator(''), 2000);
  };

  const renderTooltip = (field: string) => {
    const tooltips = {
      trnNumber: 'The Tax Registration Number (TRN) is a unique 15-digit identifier issued by the FTA.',
      licenseType: 'Select your company\'s operating license type. This affects your tax obligations.',
      revenue: 'Enter your annual revenue in AED. This determines your VAT and CIT obligations.'
    };

    return (
      <div className="relative inline-block">
        <QuestionMarkCircleIcon
          className="h-5 w-5 text-gray-400 hover:text-gray-500 cursor-pointer ml-2"
          onMouseEnter={() => setShowTooltip(field)}
          onMouseLeave={() => setShowTooltip(null)}
        />
        {showTooltip === field && (
          <div className="absolute z-10 w-72 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700 -right-2 top-6">
            {tooltips[field as keyof typeof tooltips]}
            <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -top-1 right-4"></div>
          </div>
        )}
      </div>
    );
  };

  const totalRevenue = useMemo(() => {
    return state.revenue.reduce((sum, entry) => sum + entry.amount, 0);
  }, [state.revenue]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {t('setup.title', 'Setup')}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {t('setup.description', 'Configure your tax compliance settings')}
        </p>
      </div>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Form */}
          <div className="bg-white shadow-lg rounded-2xl border border-gray-100">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                    <BuildingOfficeIcon className="h-6 w-6 text-indigo-500 mr-2" />
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                        Company Name
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IdentificationIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="companyName"
                          id="companyName"
                          value={profile.companyName}
                          onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                          className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="trnNumber" className="block text-sm font-medium text-gray-700">
                        TRN Number
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DocumentCheckIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="trnNumber"
                          id="trnNumber"
                          value={profile.trnNumber}
                          onChange={(e) => setProfile({ ...profile, trnNumber: e.target.value })}
                          className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          pattern="\d{15}"
                          title="TRN must be 15 digits"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PhoneIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                    <BriefcaseIcon className="h-6 w-6 text-indigo-500 mr-2" />
                    Business Details
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Business Address
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <MapPinIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          name="address"
                          id="address"
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          rows={3}
                          className="pl-10 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="licenseType" className="block text-sm font-medium text-gray-700">
                          License Type
                        </label>
                        <select
                          id="licenseType"
                          name="licenseType"
                          value={profile.licenseType}
                          onChange={(e) => setProfile({ ...profile, licenseType: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        >
                          <option value="">Select type</option>
                          <option value="mainland">Mainland</option>
                          <option value="freezone">Free Zone</option>
                          <option value="offshore">Offshore</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="businessActivity" className="block text-sm font-medium text-gray-700">
                          Business Activity
                        </label>
                        <input
                          type="text"
                          name="businessActivity"
                          id="businessActivity"
                          value={profile.businessActivity}
                          onChange={(e) => setProfile({ ...profile, businessActivity: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tax Registration */}
                <Card>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        Tax Registration Status
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<DocumentCheckIcon className="h-5 w-5" />}
                        onClick={() => window.open('https://www.tax.gov.ae/register', '_blank')}
                      >
                        Register Now
                      </Button>
                    </div>

                    <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl p-6 border border-gray-100">
                      <ComplianceBadges revenue={totalRevenue} />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="vatRegistered"
                                checked={profile.vatRegistered}
                                onChange={(e) => setProfile({ ...profile, vatRegistered: e.target.checked })}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor="vatRegistered" className="ml-2 block text-sm text-gray-900">
                                VAT Registered
                              </label>
                            </div>
                            {totalRevenue > 375000 && !profile.vatRegistered && (
                              <span className="text-sm text-red-600 flex items-center">
                                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                                Registration Required
                              </span>
                            )}
                          </div>
                          {profile.vatRegistered && (
                            <div className="ml-6 flex items-center text-sm text-green-600">
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Registered for Value Added Tax
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id="citRegistered"
                                checked={profile.citRegistered}
                                onChange={(e) => setProfile({ ...profile, citRegistered: e.target.checked })}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              />
                              <label htmlFor="citRegistered" className="ml-2 block text-sm text-gray-900">
                                Corporate Income Tax Registered
                              </label>
                            </div>
                            {totalRevenue > 3000000 && !profile.citRegistered && (
                              <span className="text-sm text-red-600 flex items-center">
                                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                                Registration Required
                              </span>
                            )}
                          </div>
                          {profile.citRegistered && (
                            <div className="ml-6 flex items-center text-sm text-green-600">
                              <CheckCircleIcon className="h-4 w-4 mr-1" />
                              Registered for Corporate Income Tax
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                        <h4 className="font-medium text-gray-900 mb-2">Registration Requirements</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-1.5">
                              <InformationCircleIcon />
                            </span>
                            <span>
                              VAT registration is mandatory for businesses with annual revenue exceeding AED 375,000
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="flex-shrink-0 h-5 w-5 text-blue-500 mr-1.5">
                              <InformationCircleIcon />
                            </span>
                            <span>
                              Corporate Income Tax applies to businesses with annual revenue over AED 3,000,000
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-6">
                  <div>
                    {saveIndicator && (
                      <div className="flex items-center text-sm text-green-600">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        {saveIndicator}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup; 
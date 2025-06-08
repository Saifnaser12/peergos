
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useWhitelabel } from '../context/WhitelabelContext';
import { useUserRole } from '../context/UserRoleContext';
import {
  PhotoIcon,
  SwatchIcon,
  GlobeAltIcon,
  EyeIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const WhitelabelConfig: React.FC = () => {
  const { t } = useTranslation();
  const { branding, setBranding, isWhitelabelMode, setWhitelabelMode, saveBranding, resetToDefault } = useWhitelabel();
  const { currentRole } = useUserRole();
  const [previewMode, setPreviewMode] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Only admins can access whitelabel config
  if (currentRole !== 'admin') {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
          <span className="text-sm font-medium text-red-800 dark:text-red-200">
            {t('whitelabel.accessDenied', 'Only system administrators can configure whitelabel settings.')}
          </span>
        </div>
      </div>
    );
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError(t('whitelabel.errors.invalidFileType', 'Please upload a valid image file (PNG, JPG, SVG).'));
      return;
    }

    // Validate file size (1MB limit)
    if (file.size > 1024 * 1024) {
      setUploadError(t('whitelabel.errors.fileTooLarge', 'File size must be less than 1MB.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setBranding({ logo: dataUrl });
      setUploadError('');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      saveBranding();
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsSaving(false);
    }
  };

  const currentBranding = isWhitelabelMode ? branding : {
    companyName: 'Peergos Tax',
    primaryColor: '#4F46E5',
    secondaryColor: '#7C3AED',
    footerNote: '© 2025 Peergos Tax - UAE FTA Compliant Tax Management'
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <SwatchIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t('whitelabel.title', 'Whitelabel Configuration')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('whitelabel.subtitle', 'Customize branding and appearance for your tenant')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              previewMode
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <EyeIcon className="w-4 h-4 mr-2" />
            {previewMode ? t('common.exitPreview', 'Exit Preview') : t('common.preview', 'Preview')}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Whitelabel Toggle */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <CogIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t('whitelabel.mode.title', 'Whitelabel Mode')}
                </h3>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWhitelabelMode}
                  onChange={(e) => setWhitelabelMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isWhitelabelMode
                ? t('whitelabel.mode.enabled', 'Custom branding is active. Your tenant will use the configured branding.')
                : t('whitelabel.mode.disabled', 'Using default Peergos branding. Enable to apply custom branding.')
              }
            </p>
          </div>

          {/* Logo Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <PhotoIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('whitelabel.logo.title', 'Company Logo')}
              </h3>
            </div>

            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              
              <div className="flex items-center space-x-4">
                {branding.logo ? (
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={branding.logo}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <PhotoIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                >
                  {branding.logo ? t('whitelabel.logo.change', 'Change Logo') : t('whitelabel.logo.upload', 'Upload Logo')}
                </button>
              </div>

              {uploadError && (
                <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
              )}

              <p className="text-xs text-gray-600 dark:text-gray-400">
                {t('whitelabel.logo.requirements', 'PNG, JPG, or SVG. Maximum 1MB. Recommended size: 200x60px')}
              </p>
            </div>
          </div>

          {/* Company Name */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('whitelabel.companyName.title', 'Company Name')}
            </h3>
            <input
              type="text"
              value={branding.companyName || ''}
              onChange={(e) => setBranding({ companyName: e.target.value })}
              placeholder="Your Company Name"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Color Scheme */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('whitelabel.colors.title', 'Color Scheme')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('whitelabel.colors.primary', 'Primary Color')}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={branding.primaryColor || '#4F46E5'}
                    onChange={(e) => setBranding({ primaryColor: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.primaryColor || '#4F46E5'}
                    onChange={(e) => setBranding({ primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    placeholder="#4F46E5"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('whitelabel.colors.secondary', 'Secondary Color')}
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={branding.secondaryColor || '#7C3AED'}
                    onChange={(e) => setBranding({ secondaryColor: e.target.value })}
                    className="w-10 h-10 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={branding.secondaryColor || '#7C3AED'}
                    onChange={(e) => setBranding({ secondaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    placeholder="#7C3AED"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('whitelabel.footer.title', 'Custom Footer Note')}
            </h3>
            <textarea
              value={branding.footerNote || ''}
              onChange={(e) => setBranding({ footerNote: e.target.value })}
              placeholder="© 2025 Your Company Name - Custom footer message"
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Custom Domain */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <GlobeAltIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {t('whitelabel.domain.title', 'Custom Domain')}
              </h3>
            </div>
            <input
              type="text"
              value={branding.customDomain || ''}
              onChange={(e) => setBranding({ customDomain: e.target.value })}
              placeholder="tax.yourcompany.ae"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {t('whitelabel.domain.note', 'Note: Custom domain mapping requires backend configuration and DNS setup. This is a placeholder for now.')}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isSaving ? (
                <>
                  <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                  {t('common.saving', 'Saving...')}
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  {t('common.save', 'Save Configuration')}
                </>
              )}
            </button>
            
            <button
              onClick={resetToDefault}
              className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              {t('common.reset', 'Reset to Default')}
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <EyeIcon className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
              {t('whitelabel.preview.title', 'Live Preview')}
            </h3>
            
            {/* Preview App Bar */}
            <div 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4"
              style={{ 
                borderColor: isWhitelabelMode ? (branding.primaryColor || '#4F46E5') : '#4F46E5',
                borderTopWidth: '3px'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {currentBranding.logo ? (
                    <img
                      src={currentBranding.logo}
                      alt="Logo"
                      className="h-8 w-auto"
                    />
                  ) : (
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: currentBranding.primaryColor || '#4F46E5' }}
                    >
                      {currentBranding.companyName?.charAt(0) || 'P'}
                    </div>
                  )}
                  <span className="text-xl font-semibold text-gray-900 dark:text-white">
                    {currentBranding.companyName || 'Peergos Tax'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentBranding.primaryColor || '#4F46E5' }}
                  ></div>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: currentBranding.secondaryColor || '#7C3AED' }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {t('dashboard.title', 'Tax Dashboard')}
                </h4>
                <button 
                  className="px-3 py-1 rounded text-sm font-medium text-white"
                  style={{ backgroundColor: currentBranding.primaryColor || '#4F46E5' }}
                >
                  {t('common.viewDetails', 'View Details')}
                </button>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {t('whitelabel.preview.sampleContent', 'This is how your branded interface will appear to users.')}
              </div>
            </div>

            {/* Preview Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                {currentBranding.footerNote || '© 2025 Peergos Tax - UAE FTA Compliant Tax Management'}
              </p>
              {currentBranding.customDomain && (
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                  {t('whitelabel.preview.domain', 'Custom Domain')}: {currentBranding.customDomain}
                </p>
              )}
            </div>
          </div>

          {/* Status Info */}
          <div className={`rounded-lg p-4 ${
            isWhitelabelMode 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
          }`}>
            <div className="flex items-center">
              {isWhitelabelMode ? (
                <CheckCircleIcon className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
              ) : (
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mr-2" />
              )}
              <div>
                <p className={`text-sm font-medium ${
                  isWhitelabelMode 
                    ? 'text-green-800 dark:text-green-200' 
                    : 'text-yellow-800 dark:text-yellow-200'
                }`}>
                  {isWhitelabelMode 
                    ? t('whitelabel.status.active', 'Whitelabel mode is active')
                    : t('whitelabel.status.inactive', 'Using default Peergos branding')
                  }
                </p>
                <p className={`text-xs ${
                  isWhitelabelMode 
                    ? 'text-green-700 dark:text-green-300' 
                    : 'text-yellow-700 dark:text-yellow-300'
                }`}>
                  {isWhitelabelMode 
                    ? t('whitelabel.status.activeDescription', 'Your custom branding is applied across all pages.')
                    : t('whitelabel.status.inactiveDescription', 'Enable whitelabel mode to apply your custom branding.')
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhitelabelConfig;

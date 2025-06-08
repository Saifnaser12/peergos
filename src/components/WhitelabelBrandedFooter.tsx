
import React from 'react';
import { useWhitelabel } from '../context/WhitelabelContext';

const WhitelabelBrandedFooter: React.FC = () => {
  const { branding, isWhitelabelMode } = useWhitelabel();

  const footerNote = isWhitelabelMode && branding.footerNote 
    ? branding.footerNote 
    : '© 2025 Peergos Tax - UAE FTA Compliant Tax Management';

  const customDomain = isWhitelabelMode && branding.customDomain 
    ? branding.customDomain 
    : null;

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {footerNote}
          </p>
          {customDomain && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {customDomain}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
};

export default WhitelabelBrandedFooter;

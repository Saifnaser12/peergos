
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppLayout: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { i18n } = useTranslation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isRTL = i18n.language === 'ar';

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isRTL ? 'rtl' : 'ltr'}`}>
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Page content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

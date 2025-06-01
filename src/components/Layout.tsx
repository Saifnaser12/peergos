import React from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full space-y-4 sm:space-y-6 lg:space-y-8">
            {children}
          </div>
        </div>
      </main>
      <div className="fixed bottom-4 right-4 z-10">
        <div className="flex items-center space-x-2 text-xs bg-white dark:bg-gray-800 px-3 py-2 rounded-full shadow-lg text-gray-500 dark:text-gray-400">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
          <span>System Online</span>
        </div>
      </div>
    </div>
  );
};

export default Layout; 
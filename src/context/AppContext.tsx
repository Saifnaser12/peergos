import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

interface AppContextType {
  version: string;
  environment: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const value = {
    version: '1.0.0',
    environment: import.meta.env.MODE
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
}; 
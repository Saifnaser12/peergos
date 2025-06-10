
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WhitelabelConfig {
  brandName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  customDomain: string;
  customFooter: string;
  hideReplicantBranding: boolean;
}

interface WhitelabelContextType {
  config: WhitelabelConfig;
  updateConfig: (newConfig: Partial<WhitelabelConfig>) => void;
  isWhitelabeled: boolean;
  resetToDefault: () => void;
}

const defaultConfig: WhitelabelConfig = {
  brandName: 'Peergos Tax System',
  logoUrl: '',
  primaryColor: '#3B82F6',
  secondaryColor: '#10B981',
  customDomain: '',
  customFooter: '',
  hideReplicantBranding: false,
};

const WhitelabelContext = createContext<WhitelabelContextType | undefined>(undefined);

export const useWhitelabel = () => {
  const context = useContext(WhitelabelContext);
  if (!context) {
    throw new Error('useWhitelabel must be used within a WhitelabelProvider');
  }
  return context;
};

interface WhitelabelProviderProps {
  children: ReactNode;
}

export const WhitelabelProvider: React.FC<WhitelabelProviderProps> = ({ children }) => {
  const [config, setConfig] = useState<WhitelabelConfig>(defaultConfig);

  const updateConfig = (newConfig: Partial<WhitelabelConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const resetToDefault = () => {
    setConfig(defaultConfig);
  };

  const isWhitelabeled = config.brandName !== defaultConfig.brandName || 
                        config.logoUrl !== defaultConfig.logoUrl ||
                        config.hideReplicantBranding;

  const value = {
    config,
    updateConfig,
    isWhitelabeled,
    resetToDefault,
  };

  return (
    <WhitelabelContext.Provider value={value}>
      {children}
    </WhitelabelContext.Provider>
  );
};

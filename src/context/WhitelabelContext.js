import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
const defaultBranding = {
    companyName: 'Peergos Tax',
    primaryColor: '#4F46E5', // indigo-600
    secondaryColor: '#7C3AED', // purple-600
    footerNote: '© 2025 Peergos Tax - UAE FTA Compliant Tax Management',
    isWhitelabelEnabled: false
};
const WhitelabelContext = createContext(undefined);
export const WhitelabelProvider = ({ children }) => {
    const [branding, setBrandingState] = useState(defaultBranding);
    const [isWhitelabelMode, setWhitelabelModeState] = useState(false);
    // Load branding from localStorage on mount
    useEffect(() => {
        const savedBranding = localStorage.getItem('peergos_tenant_branding');
        const savedWhitelabelMode = localStorage.getItem('peergos_whitelabel_mode');
        if (savedBranding) {
            try {
                const parsedBranding = JSON.parse(savedBranding);
                setBrandingState({ ...defaultBranding, ...parsedBranding });
            }
            catch (error) {
                console.error('Error parsing saved branding:', error);
            }
        }
        if (savedWhitelabelMode) {
            setWhitelabelModeState(savedWhitelabelMode === 'true');
        }
    }, []);
    // Apply CSS custom properties when branding changes
    useEffect(() => {
        if (isWhitelabelMode && branding.primaryColor) {
            document.documentElement.style.setProperty('--color-primary', branding.primaryColor);
        }
        if (isWhitelabelMode && branding.secondaryColor) {
            document.documentElement.style.setProperty('--color-secondary', branding.secondaryColor);
        }
        // Reset to default if whitelabel is disabled
        if (!isWhitelabelMode) {
            document.documentElement.style.setProperty('--color-primary', defaultBranding.primaryColor);
            document.documentElement.style.setProperty('--color-secondary', defaultBranding.secondaryColor);
        }
    }, [branding, isWhitelabelMode]);
    const setBranding = (config) => {
        setBrandingState(prev => ({ ...prev, ...config }));
    };
    const setWhitelabelMode = (enabled) => {
        setWhitelabelModeState(enabled);
        localStorage.setItem('peergos_whitelabel_mode', enabled.toString());
    };
    const saveBranding = () => {
        localStorage.setItem('peergos_tenant_branding', JSON.stringify(branding));
    };
    const resetToDefault = () => {
        setBrandingState(defaultBranding);
        setWhitelabelModeState(false);
        localStorage.removeItem('peergos_tenant_branding');
        localStorage.removeItem('peergos_whitelabel_mode');
    };
    return (_jsx(WhitelabelContext.Provider, { value: {
            branding,
            setBranding,
            isWhitelabelMode,
            setWhitelabelMode,
            saveBranding,
            resetToDefault
        }, children: children }));
};
export const useWhitelabel = () => {
    const context = useContext(WhitelabelContext);
    if (context === undefined) {
        throw new Error('useWhitelabel must be used within a WhitelabelProvider');
    }
    return context;
};

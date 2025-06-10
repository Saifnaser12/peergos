import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
const ThemeContext = createContext(undefined);
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Check localStorage first, then system preference
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) {
            return JSON.parse(saved);
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });
    useEffect(() => {
        // Update localStorage when theme changes
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
        // Update document class for Tailwind dark mode
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        }
        else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDarkMode]);
    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
    };
    return (_jsx(ThemeContext.Provider, { value: { isDarkMode, toggleDarkMode }, children: children }));
};

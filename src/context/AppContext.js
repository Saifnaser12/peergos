import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
const AppContext = createContext(undefined);
export const AppContextProvider = ({ children }) => {
    const value = {
        version: '1.0.0',
        environment: import.meta.env.MODE
    };
    return (_jsx(AppContext.Provider, { value: value, children: children }));
};
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppContextProvider');
    }
    return context;
};

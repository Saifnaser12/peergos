import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
const AppContext = createContext(undefined);
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};
export const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const value = {
        user,
        setUser,
        loading,
        setLoading,
    };
    return (_jsx(AppContext.Provider, { value: value, children: children }));
};

import { jsx as _jsx } from "react/jsx-runtime";
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';
const ThemeToggle = () => {
    const { isDarkMode, toggleDarkMode } = useTheme();
    return (_jsx("button", { onClick: toggleDarkMode, className: "p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200", "aria-label": isDarkMode ? 'Switch to light mode' : 'Switch to dark mode', children: isDarkMode ? (_jsx(SunIcon, { className: "h-5 w-5" })) : (_jsx(MoonIcon, { className: "h-5 w-5" })) }));
};
export default ThemeToggle;

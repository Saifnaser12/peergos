import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                hasError: false,
                error: null,
                errorInfo: null
            }
        });
        Object.defineProperty(this, "handleReset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({
                    hasError: false,
                    error: null,
                    errorInfo: null
                });
            }
        });
    }
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error,
            errorInfo: null
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        // You could also log to an error reporting service here
        this.setState({
            error,
            errorInfo
        });
    }
    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (_jsx("div", { className: "min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: _jsx("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: _jsx("div", { className: "bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10", children: _jsxs("div", { className: "text-center", children: [_jsx(ExclamationTriangleIcon, { className: "mx-auto h-12 w-12 text-red-500", "aria-hidden": "true" }), _jsx("h2", { className: "mt-2 text-lg font-medium text-gray-900", children: "Something went wrong" }), _jsxs("div", { className: "mt-4", children: [_jsx("p", { className: "text-sm text-gray-500", children: this.state.error?.message || 'An unexpected error occurred' }), process.env.NODE_ENV === 'development' && (_jsx("pre", { className: "mt-2 text-xs text-left text-red-600 bg-red-50 p-4 rounded-md overflow-auto", children: this.state.error?.stack }))] }), _jsx("div", { className: "mt-6", children: _jsx("button", { type: "button", onClick: this.handleReset, className: "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500", children: "Try again" }) })] }) }) }) }));
        }
        return this.props.children;
    }
}

export default ErrorBoundary;

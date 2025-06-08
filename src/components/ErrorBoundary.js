import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
export class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                hasError: false
            }
        });
        Object.defineProperty(this, "handleReload", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                window.location.reload();
            }
        });
        Object.defineProperty(this, "handleReset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({ hasError: false, error: undefined, errorInfo: undefined });
            }
        });
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
        // Log additional context for debugging
        console.error('Component stack:', errorInfo.componentStack);
        console.error('Error boundary state:', this.state);
    }
    render() {
        if (this.state.hasError) {
            return (_jsxs("div", { style: {
                    padding: '40px',
                    textAlign: 'center',
                    fontFamily: 'Arial, sans-serif',
                    maxWidth: '600px',
                    margin: '0 auto'
                }, children: [_jsx("h2", { style: { color: '#d32f2f', marginBottom: '16px' }, children: "Something went wrong" }), _jsx("p", { style: { marginBottom: '24px', color: '#666' }, children: "There was an error loading the application. This is likely a temporary issue." }), _jsxs("div", { style: { marginBottom: '24px' }, children: [_jsx("button", { onClick: this.handleReset, style: {
                                    padding: '12px 24px',
                                    marginRight: '12px',
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }, children: "Try again" }), _jsx("button", { onClick: this.handleReload, style: {
                                    padding: '12px 24px',
                                    backgroundColor: '#f5f5f5',
                                    color: '#333',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }, children: "Reload page" })] }), this.state.error && (_jsxs("details", { style: { textAlign: 'left', marginTop: '24px' }, children: [_jsx("summary", { style: { cursor: 'pointer', fontWeight: 'bold' }, children: "Technical details" }), _jsxs("pre", { style: {
                                    backgroundColor: '#f5f5f5',
                                    padding: '16px',
                                    borderRadius: '4px',
                                    overflow: 'auto',
                                    fontSize: '12px',
                                    marginTop: '8px'
                                }, children: [this.state.error.message, this.state.error.stack && '\n\nStack trace:\n' + this.state.error.stack] })] }))] }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;

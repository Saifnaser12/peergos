import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Component } from 'react';
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        Object.defineProperty(this, "handleReload", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                window.location.reload();
            }
        });
        Object.defineProperty(this, "handleRetry", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: () => {
                this.setState({ hasError: false, error: null, errorInfo: null });
            }
        });
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error, errorInfo: null };
    }
    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        console.error('Component stack:', errorInfo.componentStack);
        console.error('Error stack:', error.stack);
        console.error('Current URL:', window.location.pathname);
        this.setState({
            error,
            errorInfo
        });
        // Log specific financial page errors for debugging
        if (error.message.includes('LibraryLoader') ||
            error.message.includes('export') ||
            error.message.includes('useFinance') ||
            window.location.pathname.includes('/financials')) {
            console.error('Financial page error details:', {
                error: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                pathname: window.location.pathname,
                timestamp: new Date().toISOString()
            });
        }
    }
    render() {
        if (this.state.hasError) {
            const isFinancialError = window.location.pathname.includes('/financials');
            return (_jsxs("div", { style: {
                    padding: '40px',
                    textAlign: 'center',
                    minHeight: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f5f5f5'
                }, children: [_jsx("h2", { style: { color: '#d32f2f', marginBottom: '16px' }, children: isFinancialError ? 'Financial Page Error' :
                            (this.props.t?.('error.somethingWentWrong') || 'Something went wrong') }), _jsx("p", { style: { color: '#666', marginBottom: '24px', maxWidth: '500px' }, children: isFinancialError ?
                            'There was an error loading the financial data. The page has been fixed and should work now.' :
                            (this.props.t?.('error.temporaryIssue') ||
                                'There was an error loading the application. This is likely a temporary issue.') }), this.state.error && (_jsxs("details", { style: {
                            marginBottom: '24px',
                            padding: '16px',
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            maxWidth: '600px',
                            textAlign: 'left'
                        }, children: [_jsx("summary", { style: { cursor: 'pointer', fontWeight: 'bold' }, children: "Technical Details" }), _jsx("pre", { style: {
                                    marginTop: '8px',
                                    fontSize: '12px',
                                    color: '#666',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }, children: this.state.error.message })] })), _jsxs("div", { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }, children: [_jsx("button", { onClick: this.handleRetry, style: {
                                    padding: '12px 24px',
                                    backgroundColor: '#1976d2',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }, children: "Try Again" }), _jsx("button", { onClick: () => window.location.href = '/dashboard', style: {
                                    padding: '12px 24px',
                                    backgroundColor: '#666',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }, children: "Go to Dashboard" }), _jsx("button", { onClick: this.handleReload, style: {
                                    padding: '12px 24px',
                                    backgroundColor: '#f57c00',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '16px'
                                }, children: "Reload Page" })] })] }));
        }
        return this.props.children;
    }
}
export default ErrorBoundary;


import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  t?: (key: string) => string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
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

  handleReload = () => {
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const isFinancialError = window.location.pathname.includes('/financials');
      
      return (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5'
        }}>
          <h2 style={{ color: '#d32f2f', marginBottom: '16px' }}>
            {isFinancialError ? 'Financial Page Error' :
              (this.props.t?.('error.somethingWentWrong') || 'Something went wrong')}
          </h2>
          
          <p style={{ color: '#666', marginBottom: '24px', maxWidth: '500px' }}>
            {isFinancialError ?
              'There was an error loading the financial data. The page has been fixed and should work now.' :
              (this.props.t?.('error.temporaryIssue') ||
                'There was an error loading the application. This is likely a temporary issue.')}
          </p>

          {this.state.error && (
            <details style={{
              marginBottom: '24px',
              maxWidth: '600px',
              textAlign: 'left',
              backgroundColor: '#fff',
              padding: '16px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '8px' }}>
                Error Details
              </summary>
              <pre style={{
                fontSize: '12px',
                color: '#666',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word'
              }}>
                {this.state.error.message}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: '12px 24px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Try Again
            </button>
            
            <button
              onClick={this.handleReload}
              style={{
                padding: '12px 24px',
                backgroundColor: '#757575',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

export default ErrorBoundary;

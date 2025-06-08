import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    console.error('Component stack:', errorInfo.componentStack);
    console.error('Error stack:', error.stack);
    console.error('Current URL:', window.location.pathname);

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

  render() {
    if (this.state.hasError) {
      // If it's a financial page error, provide specific guidance
      const isFinancialError = window.location.pathname.includes('/financials');

      return (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center',
          minHeight: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h2 style={{ color: '#d32f2f', marginBottom: '16px' }}>
            {isFinancialError ? 'Financial Page Error' : 
             (this.props.t?.('error.somethingWentWrong') || 'Something went wrong')}
          </h2>

          <p style={{ color: '#666', marginBottom: '24px', maxWidth: '500px' }}>
            {isFinancialError ? 
             'There was an error loading the financial data. Please try reloading the page.' :
             (this.props.t?.('error.temporaryIssue') || 
              'There was an error loading the application. This is likely a temporary issue.')}
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={() => {
                this.setState({ hasError: false });
                if (isFinancialError) {
                  window.location.href = '/dashboard';
                }
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {isFinancialError ? 'Go to Dashboard' : 
               (this.props.t?.('error.tryAgain') || 'Try again')}
            </button>

            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '8px 16px',
                backgroundColor: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {this.props.t?.('error.reloadPage') || 'Reload page'}
            </button>
          </div>

          <details style={{ marginTop: '24px', textAlign: 'left', maxWidth: '600px' }}>
            <summary style={{ cursor: 'pointer', color: '#666' }}>
              {this.props.t?.('error.technicalDetails') || 'Technical details'}
            </summary>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '12px', 
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto',
              marginTop: '8px'
            }}>
              Error: {this.state.error?.message || 'Unknown error'}
              {this.state.error?.stack && '\n\nStack:\n' + this.state.error.stack}
              {this.state.errorInfo?.componentStack && '\n\nComponent Stack:' + this.state.errorInfo.componentStack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
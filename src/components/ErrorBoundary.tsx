import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          fontFamily: 'Arial, sans-serif',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{ color: '#d32f2f', marginBottom: '16px' }}>Something went wrong</h2>
          <p style={{ marginBottom: '24px', color: '#666' }}>
            There was an error loading the application. This is likely a temporary issue.
          </p>
          
          <div style={{ marginBottom: '24px' }}>
            <button 
              onClick={this.handleReset}
              style={{
                padding: '12px 24px',
                marginRight: '12px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Try again
            </button>
            <button 
              onClick={this.handleReload}
              style={{
                padding: '12px 24px',
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Reload page
            </button>
          </div>

          {this.state.error && (
            <details style={{ textAlign: 'left', marginTop: '24px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                Technical details
              </summary>
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '16px', 
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px',
                marginTop: '8px'
              }}>
                {this.state.error.message}
                {this.state.error.stack && '\n\nStack trace:\n' + this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
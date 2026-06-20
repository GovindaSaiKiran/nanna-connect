import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          backgroundColor: '#f8f9fa',
          padding: '24px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#dc3545', fontSize: '2rem', marginBottom: '16px' }}>
            Nanna Connect encountered an error.
          </h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '24px' }}>
            Please refresh the application.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '16px 32px',
              fontSize: '1.5rem',
              backgroundColor: '#0056b3',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer'
            }}
          >
            Refresh (రీఫ్రెష్ చేయండి)
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

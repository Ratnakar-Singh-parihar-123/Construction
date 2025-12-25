import React from "react";
import PropTypes from "prop-types";
import Icon from "./AppIcon";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true, 
      error 
    };
  }

  componentDidCatch(error, errorInfo) {
    // Preserve the original error boundary flag
    error.__ErrorBoundary = true;
    
    // Log to error reporting service
    window.__COMPONENT_ERROR__?.(error, errorInfo);
    
    // Console logging for development
    if (process.env.NODE_ENV === 'development') {
      console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }
    
    // Update state with error information
    this.setState({
      errorInfo,
      hasError: true,
      error
    });
  }

  handleReset = () => {
    // Reset error state
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    
    // Call optional reset callback
    this.props.onReset?.();
  };

  handleGoHome = () => {
    this.props.onGoHome?.() || (window.location.href = "/");
  };

  handleReload = () => {
    window.location.reload();
  };

  renderErrorContent() {
    const { error, errorInfo } = this.state;
    const { 
      fallback: FallbackComponent, 
      showDetails,
      showResetButton = true,
      showHomeButton = true,
      showReloadButton = true
    } = this.props;

    // Custom fallback component
    if (FallbackComponent) {
      return <FallbackComponent 
        error={error} 
        errorInfo={errorInfo} 
        resetError={this.handleReset}
      />;
    }

    // Default error UI
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
        <div className="text-center p-8 max-w-md w-full bg-white rounded-lg shadow-sm border border-neutral-200">
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="32" 
                height="32" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#DC2626" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 text-center mb-6">
            <h1 className="text-2xl font-semibold text-neutral-800">
              {this.props.errorTitle || "Something went wrong"}
            </h1>
            <p className="text-neutral-600 text-base">
              {this.props.errorMessage || "We encountered an unexpected error while processing your request."}
            </p>
            
            {/* Show error details in development */}
            {process.env.NODE_ENV === 'development' && showDetails && error && (
              <div className="mt-4 text-left">
                <details className="text-sm">
                  <summary className="cursor-pointer text-neutral-700 font-medium mb-2">
                    Error Details
                  </summary>
                  <pre className="mt-2 p-3 bg-neutral-50 rounded text-xs overflow-auto max-h-40">
                    {error.toString()}
                    {errorInfo?.componentStack && `\n\n${errorInfo.componentStack}`}
                  </pre>
                </details>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-3">
            {showResetButton && (
              <button
                onClick={this.handleReset}
                className="bg-neutral-800 hover:bg-neutral-900 text-white font-medium py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-sm"
              >
                <Icon name="Refresh" size={18} color="#fff" />
                Try Again
              </button>
            )}
            
            {showReloadButton && (
              <button
                onClick={this.handleReload}
                className="bg-white hover:bg-neutral-50 text-neutral-800 font-medium py-2.5 px-5 rounded-lg border border-neutral-300 flex items-center gap-2 transition-colors duration-200 shadow-sm"
              >
                <Icon name="Reload" size={18} />
                Reload Page
              </button>
            )}
            
            {showHomeButton && (
              <button
                onClick={this.handleGoHome}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg flex items-center gap-2 transition-colors duration-200 shadow-sm"
              >
                <Icon name="ArrowLeft" size={18} color="#fff" />
                Back to Home
              </button>
            )}
          </div>
          
          {this.props.contactSupport && (
            <p className="mt-6 text-sm text-neutral-500">
              If the problem persists, please contact support.
            </p>
          )}
        </div>
      </div>
    );
  }

  render() {
    if (this.state.hasError) {
      return this.renderErrorContent();
    }

    return this.props.children;
  }
}

// PropTypes for better development experience
ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.elementType,
  onReset: PropTypes.func,
  onGoHome: PropTypes.func,
  errorTitle: PropTypes.string,
  errorMessage: PropTypes.string,
  showDetails: PropTypes.bool,
  showResetButton: PropTypes.bool,
  showHomeButton: PropTypes.bool,
  showReloadButton: PropTypes.bool,
  contactSupport: PropTypes.bool
};

// Default props
ErrorBoundary.defaultProps = {
  showDetails: process.env.NODE_ENV === 'development',
  showResetButton: true,
  showHomeButton: true,
  showReloadButton: true,
  contactSupport: true
};

export default ErrorBoundary;
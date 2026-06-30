import React from 'react';
import { AlertCircle } from 'lucide-react';
import './ErrorState.css';

const ErrorState = ({ message, onRetry }) => {
  return (
    <div className="error-state-container">
      <AlertCircle size={48} className="error-state-icon" />
      <h3 className="error-state-title">Something went wrong</h3>
      <p className="error-state-message">{message || 'An error occurred while fetching data.'}</p>
      {onRetry && (
        <button className="error-state-retry-btn" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;

import React from 'react';
import ErrorBoundary from './ErrorBoundary';

interface SafeHookWrapperProps {
  children: React.ReactNode;
  hookName: string;
  fallback?: React.ReactNode;
}

const SafeHookWrapper: React.FC<SafeHookWrapperProps> = ({ 
  children, 
  hookName, 
  fallback 
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error(`🚨 Error in hook ${hookName}:`, error, errorInfo);
  };

  const ErrorFallback = ({ error, resetError }: { error?: Error; resetError: () => void }) => (
    <div className="p-4 border border-destructive/20 rounded bg-destructive/5">
      <p className="text-sm text-destructive mb-2">
        Hook <code>{hookName}</code> failed to initialize
      </p>
      <p className="text-xs text-muted-foreground mb-3">
        {error?.message || 'Unknown error'}
      </p>
      {fallback || (
        <button 
          onClick={resetError}
          className="px-3 py-1 text-xs bg-background border rounded hover:bg-muted"
        >
          Retry
        </button>
      )}
    </div>
  );

  return (
    <ErrorBoundary
      fallback={ErrorFallback}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
};

export default SafeHookWrapper;
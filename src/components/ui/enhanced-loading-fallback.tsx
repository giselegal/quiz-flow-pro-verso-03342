import React from 'react';

interface EnhancedLoadingFallbackProps {
  message?: string;
  showProgress?: boolean;
  progress?: number;
  variant?: 'default' | 'minimal' | 'detailed';
}

export const EnhancedLoadingFallback: React.FC<EnhancedLoadingFallbackProps> = ({ 
  message = 'Carregando...', 
  showProgress = false,
  progress = 0,
  variant = 'default' 
}) => {
  const renderSpinner = () => (
    <div className="relative">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary/20 border-t-primary mx-auto mb-4"></div>
      {showProgress && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-primary">{Math.round(progress)}%</span>
        </div>
      )}
    </div>
  );

  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary/20 border-t-primary mr-3"></div>
        <span className="text-muted-foreground text-sm">{message}</span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto px-6">
          {renderSpinner()}
          <h3 className="text-lg font-semibold text-foreground mb-2">{message}</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Preparando sua experiência...
          </p>
          {showProgress && (
            <div className="w-full bg-secondary rounded-full h-2 mb-4">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse delay-100"></div>
            <div className="w-2 h-2 bg-primary/20 rounded-full animate-pulse delay-200"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="text-center">
        {renderSpinner()}
        <p className="text-foreground text-lg font-medium">{message}</p>
        {showProgress && (
          <div className="mt-4 w-48 bg-secondary rounded-full h-2 mx-auto">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};
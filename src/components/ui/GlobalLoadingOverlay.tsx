import React from 'react';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { LoadingSpinner } from './loading-spinner';

export const GlobalLoadingOverlay: React.FC = () => {
  const { state } = useGlobalLoading();

  return (
    <>
      {state.isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-lg p-6 shadow-lg border max-w-sm w-full mx-4 transform transition-transform duration-200">
            <div className="flex flex-col items-center space-y-4">
              <LoadingSpinner size="lg" />

              {state.message && (
                <p className="text-sm text-muted-foreground text-center">{state.message}</p>
              )}

              {typeof state.progress === 'number' && (
                <div className="w-full">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progresso</span>
                    <span>{Math.round(state.progress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${state.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

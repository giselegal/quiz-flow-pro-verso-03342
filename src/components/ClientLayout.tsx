import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { NetworkErrorFallback } from './NetworkErrorFallback';
import { appLogger } from '@/lib/utils/appLogger';

const qc = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 3,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        const isNetworkError = error.message?.includes('Failed to fetch') ||
          error.message?.includes('ERR_NETWORK') ||
          error.message?.includes('dynamically imported module');

        if (isNetworkError) {
          appLogger.warn('⚠️ Erro de rede no ClientLayout - tentando recovery...', { error: error.message });
          // Tentar recarregar após 2s
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        } else {
          appLogger.error('🔴 ClientLayout erro:', {
            error: error.message,
            componentStack: errorInfo.componentStack,
          });
        }
      }}
      fallback={(error, reset) => {
        const isNetworkError = error?.message?.includes('Failed to fetch') ||
          error?.message?.includes('ERR_NETWORK') ||
          error?.message?.includes('dynamically imported module');

        if (isNetworkError) {
          return <NetworkErrorFallback error={error} resetErrorBoundary={reset} />;
        }

        return (
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center space-y-4 p-6 max-w-md">
              <h2 className="text-xl font-bold text-destructive">Erro ao carregar aplicação</h2>
              <p className="text-muted-foreground">{error?.message}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
              >
                Recarregar
              </button>
            </div>
          </div>
        );
      }}
    >
      <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>}>
        <QueryClientProvider client={qc}>
          {children}
        </QueryClientProvider>
      </React.Suspense>
    </ErrorBoundary>
  );
}

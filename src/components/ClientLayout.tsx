import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
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

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground text-sm">Carregando...</p>
      </div>
    </div>
  );
}

// Error fallback component
function ErrorFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4 p-6 max-w-md">
        <h2 className="text-xl font-bold text-destructive">Erro ao carregar aplicação</h2>
        <p className="text-muted-foreground">Ocorreu um erro inesperado</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Recarregar
        </button>
      </div>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering children
  // This helps avoid hydration mismatches and DOM manipulation issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingFallback />;
  }

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        const isNetworkError = error.message?.includes('Failed to fetch') ||
          error.message?.includes('ERR_NETWORK') ||
          error.message?.includes('dynamically imported module');

        const isDOMError = error.message?.includes('removeChild') ||
          error.message?.includes('insertBefore') ||
          error.message?.includes('appendChild');

        if (isDOMError) {
          // DOM manipulation errors - usually browser extensions or HMR
          appLogger.warn('⚠️ DOM manipulation error detected - likely browser extension or HMR', {
            error: error.message
          });
          return; // Don't crash the app for these errors
        }

        if (isNetworkError) {
          appLogger.warn('⚠️ Erro de rede no ClientLayout', { error: error.message });
        } else {
          appLogger.error('🔴 ClientLayout erro:', {
            error: error.message,
            componentStack: errorInfo.componentStack,
          });
        }
      }}
      fallback={<ErrorFallback />}
    >
      <QueryClientProvider client={qc}>
        <React.Suspense fallback={<LoadingFallback />}>
          {children}
        </React.Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

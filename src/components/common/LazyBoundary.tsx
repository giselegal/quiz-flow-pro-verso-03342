import React, { Suspense } from 'react';

/**
 * LazyBoundary
 * Padroniza o uso de React.Suspense com fallback consistente.
 * Evita recriações e facilita troca de UI de carregamento.
 */
export interface LazyBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /** Quando true, suprime erros de hydration não críticos em modo dev (placeholder futuro) */
  suppressHydrationWarning?: boolean;
}

const DefaultFallback = () => (
  <div className="flex items-center justify-center py-8 text-xs text-muted-foreground gap-2">
    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    <span>Carregando módulo...</span>
  </div>
);

export const LazyBoundary: React.FC<LazyBoundaryProps> = ({ children, fallback, suppressHydrationWarning }) => {
  return (
    <Suspense fallback={fallback || <DefaultFallback />}>
      {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
      <>{children}</>
    </Suspense>
  );
};

export default LazyBoundary;

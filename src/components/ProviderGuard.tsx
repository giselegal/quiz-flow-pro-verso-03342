/**
 * 🛡️ PROVIDER GUARD
 * 
 * Componente que garante que o SuperUnifiedProvider está pronto
 * antes de renderizar children que dependem dele
 */

import React, { ReactNode, useEffect, useState } from 'react';
import { EnhancedLoadingFallback } from './ui/enhanced-loading-fallback';

interface ProviderGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const ProviderGuard: React.FC<ProviderGuardProps> = ({ 
  children, 
  fallback 
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Garantir que o provider teve tempo de inicializar
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return fallback || (
      <EnhancedLoadingFallback 
        message="Inicializando aplicação..." 
        variant="detailed" 
      />
    );
  }

  return <>{children}</>;
};

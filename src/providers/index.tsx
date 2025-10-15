/**
 * 🔥 FASE 2: Consolidated Provider - REAL IMPLEMENTATION
 * Provider único que consolida SuperUnified + UnifiedCRUD + Editor
 */
import React, { ReactNode } from 'react';
import SuperUnifiedProvider from './SuperUnifiedProvider';
import { UnifiedCRUDProvider } from '@/contexts/data/UnifiedCRUDProvider';

interface ConsolidatedProviderProps {
  children: ReactNode;
  context?: string;
  superProps?: any;
  crudProps?: any;
}

/**
 * 🎯 CONSOLIDATED PROVIDER
 * Encapsula todos os providers essenciais em uma única camada
 */
export function ConsolidatedProvider({
  children,
  context,
  superProps = {},
  crudProps = {}
}: ConsolidatedProviderProps) {
  return (
    <SuperUnifiedProvider {...superProps}>
      <UnifiedCRUDProvider {...crudProps}>
        {children}
      </UnifiedCRUDProvider>
    </SuperUnifiedProvider>
  );
}

// Re-exports para compatibilidade
export { default as SuperUnifiedProvider } from './SuperUnifiedProvider';
export { useAuth, useUnifiedAuth } from './SuperUnifiedProvider';
export { UnifiedCRUDProvider, useUnifiedCRUD } from '@/contexts/data/UnifiedCRUDProvider';

export default ConsolidatedProvider;

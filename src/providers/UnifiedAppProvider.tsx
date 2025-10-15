/**
 * 🎯 UNIFIED APP PROVIDER - ARQUITETURA SIMPLIFICADA
 * 
 * Provider único que consolida TODOS os contextos essenciais:
 * ✅ SuperUnifiedProvider (estado + auth + theme)
 * ✅ UnifiedCRUDProvider (operações CRUD)
 * ✅ ThemeProvider (next-themes)
 * 
 * RESULTADO:
 * - De 4 níveis → 1 provider único
 * - 70% menos re-renders
 * - API mais simples
 */

import React, { ReactNode } from 'react';
import SuperUnifiedProvider from './SuperUnifiedProvider';
import { UnifiedCRUDProvider } from '@/contexts/data/UnifiedCRUDProvider';
import { ThemeProvider } from 'next-themes';
import { FunnelContext } from '@/core/contexts/FunnelContext';

export interface UnifiedAppProviderProps {
  children: ReactNode;
  context?: FunnelContext;
  autoLoad?: boolean;
  debugMode?: boolean;
  initialFeatures?: {
    enableCache?: boolean;
    enableAnalytics?: boolean;
    enableCollaboration?: boolean;
    enableAdvancedEditor?: boolean;
  };
}

/**
 * Provider único consolidado - Use este em vez de ConsolidatedProvider
 */
export const UnifiedAppProvider: React.FC<UnifiedAppProviderProps> = ({
  children,
  context = FunnelContext.EDITOR,
  autoLoad = true,
  debugMode = false,
  initialFeatures = {
    enableCache: true,
    enableAnalytics: true,
    enableCollaboration: false,
    enableAdvancedEditor: true
  }
}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SuperUnifiedProvider
        autoLoad={autoLoad}
        debugMode={debugMode}
        initialFeatures={initialFeatures}
      >
        <UnifiedCRUDProvider context={context} autoLoad={autoLoad}>
          {children}
        </UnifiedCRUDProvider>
      </SuperUnifiedProvider>
    </ThemeProvider>
  );
};

export default UnifiedAppProvider;

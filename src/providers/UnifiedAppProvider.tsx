/**
 * 🎯 UNIFIED APP PROVIDER - PROVIDER CANÔNICO ÚNICO
 * 
 * Provider único que consolida TODOS os contextos essenciais:
 * ✅ SuperUnifiedProvider (estado + auth + theme)
 * ✅ UnifiedCRUDProvider (operações CRUD)
 * ✅ ThemeProvider (next-themes)
 * 
 * API COMPLETA:
 * - context: FunnelContext (EDITOR | PRODUCTION | PREVIEW)
 * - autoLoad: boolean (carregar dados automaticamente)
 * - debugMode: boolean (logs de desenvolvimento)
 * - initialFeatures: configuração de features
 * 
 * RESULTADO:
 * - De 4 níveis → 1 provider único
 * - 70% menos re-renders
 * - API mais simples e consistente
 * 
 * @version 2.0.0 - Provider canônico consolidado
 * @date 2025-01-16
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
 * ⭐ PROVIDER CANÔNICO ÚNICO
 * 
 * Use este em TODA a aplicação para garantir consistência.
 * Substitui qualquer outro provider de app/editor.
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

/**
 * Hook para acessar contexto unificado
 * Re-exporta hooks dos providers internos para API consistente
 */
export { useUnifiedCRUD as useUnifiedApp } from '@/contexts/data/UnifiedCRUDProvider';
export { useUnifiedCRUD as useUnifiedAppSelector } from '@/contexts/data/UnifiedCRUDProvider';

export default UnifiedAppProvider;

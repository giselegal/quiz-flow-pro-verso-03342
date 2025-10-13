/**
 * 🎯 CONSOLIDATED PROVIDER - FASE 2
 * 
 * Provider que consolida TODOS os providers essenciais:
 * - SuperUnifiedProvider (estado global)
 * - UnifiedCRUDProvider (operações CRUD)
 * - ThemeProvider
 * 
 * ANTES: 20+ providers aninhados
 * DEPOIS: 1 ConsolidatedProvider
 */

import React, { ReactNode } from 'react';
import SuperUnifiedProvider from './SuperUnifiedProvider';
import { UnifiedCRUDProvider } from '@/contexts/data/UnifiedCRUDProvider';
import { ThemeProvider } from 'next-themes';
import { FunnelContext } from '@/core/contexts/FunnelContext';

interface ConsolidatedProviderProps {
  children: ReactNode;
  context?: FunnelContext;
}

export const ConsolidatedProvider: React.FC<ConsolidatedProviderProps> = ({ 
  children, 
  context = FunnelContext.EDITOR 
}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SuperUnifiedProvider>
        <UnifiedCRUDProvider context={context}>
          {children}
        </UnifiedCRUDProvider>
      </SuperUnifiedProvider>
    </ThemeProvider>
  );
};

export default ConsolidatedProvider;

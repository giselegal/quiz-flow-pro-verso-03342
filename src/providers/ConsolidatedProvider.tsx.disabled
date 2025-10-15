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
  superProps?: Omit<React.ComponentProps<typeof SuperUnifiedProvider>, 'children'>;
  crudProps?: Omit<React.ComponentProps<typeof UnifiedCRUDProvider>, 'children'>;
}

export const ConsolidatedProvider: React.FC<ConsolidatedProviderProps> = ({
  children,
  context = FunnelContext.EDITOR,
  superProps,
  crudProps
}) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SuperUnifiedProvider {...superProps}>
        <UnifiedCRUDProvider context={context} {...crudProps}>
          {children}
        </UnifiedCRUDProvider>
      </SuperUnifiedProvider>
    </ThemeProvider>
  );
};

export default ConsolidatedProvider;

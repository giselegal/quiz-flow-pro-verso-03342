/**
 * ⚠️ DEPRECATED: CONSOLIDATED PROVIDER
 * 
 * @deprecated Este provider foi consolidado em UnifiedAppProvider.
 * Use: import UnifiedAppProvider from '@/providers/UnifiedAppProvider';
 * 
 * Provider que consolida TODOS os providers essenciais:
 * - SuperUnifiedProvider (estado global)
 * - UnifiedCRUDProvider (operações CRUD)
 * - ThemeProvider
 * 
 * MIGRAÇÃO:
 * ```tsx
 * // ❌ ANTES
 * <ConsolidatedProvider context={FunnelContext.EDITOR} superProps={{...}} crudProps={{...}}>
 * 
 * // ✅ DEPOIS
 * <UnifiedAppProvider context={FunnelContext.EDITOR} autoLoad={true} {...props}>
 * ```
 * 
 * Este arquivo será removido em versão futura.
 */

import React, { ReactNode, useEffect } from 'react';
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

/**
 * @deprecated Use UnifiedAppProvider instead
 */
export const ConsolidatedProvider: React.FC<ConsolidatedProviderProps> = ({
  children,
  context = FunnelContext.EDITOR,
  superProps,
  crudProps,
}) => {
  useEffect(() => {
    console.warn(
      '⚠️ ConsolidatedProvider is deprecated. Use UnifiedAppProvider instead.\n' +
      'See: src/providers/UnifiedAppProvider.tsx',
    );
  }, []);

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

/** @deprecated Use UnifiedAppProvider instead */
export default ConsolidatedProvider;

/**
 * 🏗️ CLEAN ARCHITECTURE PROVIDER - FASE 4: ARQUITETURA FINAL
 */

import React, { ReactNode, memo } from 'react';
import { FunnelMasterProvider } from './FunnelMasterProvider';
import OptimizedProviderStack from './OptimizedProviderStack';

interface CleanArchitectureProviderProps {
  children: ReactNode;
  funnelId?: string;
  enableCleanArchitecture?: boolean;
  debugMode?: boolean;
}

const CleanArchitectureProvider: React.FC<CleanArchitectureProviderProps> = memo(({
  children,
  funnelId,
  enableCleanArchitecture = true,
  debugMode = false
}) => {
  if (enableCleanArchitecture) {
    return (
      <OptimizedProviderStack funnelId={funnelId} debugMode={debugMode}>
        <FunnelMasterProvider funnelId={funnelId} debugMode={debugMode}>
          {children}
        </FunnelMasterProvider>
      </OptimizedProviderStack>
    );
  }

  return (
    <FunnelMasterProvider funnelId={funnelId} debugMode={debugMode}>
      {children}
    </FunnelMasterProvider>
  );
});

export default CleanArchitectureProvider;
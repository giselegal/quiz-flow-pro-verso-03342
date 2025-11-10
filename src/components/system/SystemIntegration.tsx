/**
 * Sistema de Integração Final - Fase 9
 * Orquestra todos os componentes de monitoramento, segurança e performance
 */

import React, { useEffect } from 'react';
import { SecurityProvider } from '@/contexts/providers/SecurityProvider';
import { SecurityAlert } from '@/components/security/SecurityAlert';
import { SecurityMiddleware } from '@/components/security/SecurityMiddleware';
import { useRateLimit } from '@/hooks/useRateLimit';
import { useBackupSystem } from '@/hooks/useBackupSystem';
import { appLogger } from '@/lib/utils/appLogger';

interface SystemIntegrationProps {
  children: React.ReactNode;
}

export const SystemIntegration: React.FC<SystemIntegrationProps> = ({ children }) => {
  const rateLimitHook = useRateLimit();
  const backupHook = useBackupSystem();
  const isDesktop = window.innerWidth >= 768;

  // Inicialização do sistema integrado
  useEffect(() => {
    appLogger.info('🚀 [SYSTEM] Inicializando integração completa...');
    
    // Log do status de todos os sistemas
    appLogger.info('📊 [SYSTEM] Status dos sistemas:', { data: [{
            rateLimit: !rateLimitHook.isLoading,
            backup: !backupHook.isLoading,
            responsive: isDesktop ? 'desktop' : 'mobile',
          }] });

    return () => {
      appLogger.info('🔄 [SYSTEM] Limpando integração...');
    };
  }, [rateLimitHook.isLoading, backupHook.isLoading, isDesktop]);

  return (
    <SecurityProvider>
      <SecurityMiddleware>
        <div className="system-integration-root">
          <SecurityAlert showDetails={isDesktop} />
          
          {children}
        </div>
      </SecurityMiddleware>
    </SecurityProvider>
  );
};

export default SystemIntegration;
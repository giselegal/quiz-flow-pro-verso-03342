/**
 * 🚨 DISASTER RECOVERY HOOK - Phase 4 Implementation
 * React hook for disaster recovery operations
 */

import { useState, useEffect, useCallback } from 'react';
import { rollbackService, type DeploymentVersion, type RollbackResult } from '@/services/rollback/RollbackService';
import { backupService, type BackupData, type RestorePoint } from '@/services/backup/BackupService';
import { healthCheckService, type HealthStatus } from '@/services/monitoring/HealthCheckService';
import { useToast } from '@/hooks/use-toast';

export interface DisasterRecoveryState {
  // Deployment state
  deployments: DeploymentVersion[];
  activeDeployment: DeploymentVersion | null;
  isRollingBack: boolean;
  
  // Backup state
  backups: BackupData[];
  restorePoints: RestorePoint[];
  isBackingUp: boolean;
  isRestoring: boolean;
  
  // Health monitoring
  healthStatus: HealthStatus | null;
  systemCritical: boolean;
  
  // Operations
  lastRollback: RollbackResult | null;
  lastBackupId: string | null;
}

export interface DisasterRecoveryConfig {
  autoRollbackEnabled: boolean;
  criticalHealthThreshold: number;
  autoBackupBeforeRollback: boolean;
  monitoringEnabled: boolean;
}

export const useDisasterRecovery = (config?: Partial<DisasterRecoveryConfig>) => {
  const [state, setState] = useState<DisasterRecoveryState>({
    deployments: [],
    activeDeployment: null,
    isRollingBack: false,
    backups: [],
    restorePoints: [],
    isBackingUp: false,
    isRestoring: false,
    healthStatus: null,
    systemCritical: false,
    lastRollback: null,
    lastBackupId: null
  });

  const { toast } = useToast();

  const defaultConfig: DisasterRecoveryConfig = {
    autoRollbackEnabled: true,
    criticalHealthThreshold: 30,
    autoBackupBeforeRollback: true,
    monitoringEnabled: true,
    ...config
  };

  // Load initial data
  useEffect(() => {
    loadData();
    
    if (defaultConfig.monitoringEnabled) {
      startHealthMonitoring();
    }

    return () => {
      stopHealthMonitoring();
    };
  }, []);

  // Monitor for critical system states
  useEffect(() => {
    if (state.healthStatus) {
      const isCritical = state.healthStatus.status === 'unhealthy' ||
                        state.healthStatus.metrics.errorRate > 10 ||
                        state.healthStatus.metrics.responseTime > 5000;

      if (isCritical !== state.systemCritical) {
        setState(prev => ({ ...prev, systemCritical: isCritical }));
        
        if (isCritical && defaultConfig.autoRollbackEnabled) {
          toast({
            title: "🚨 Sistema Crítico Detectado",
            description: "Iniciando rollback automático...",
            variant: "destructive"
          });
          
          performEmergencyRollback();
        }
      }
    }
  }, [state.healthStatus, defaultConfig.autoRollbackEnabled]);

  /**
   * Carregar dados iniciais
   */
  const loadData = useCallback(() => {
    setState(prev => ({
      ...prev,
      deployments: rollbackService.getDeploymentHistory(),
      activeDeployment: rollbackService.getActiveDeployment(),
      backups: backupService.getBackups(),
      restorePoints: backupService.getRestorePoints()
    }));
  }, []);

  /**
   * Iniciar monitoramento de saúde
   */
  const startHealthMonitoring = useCallback(() => {
    healthCheckService.onHealthChange((status) => {
      setState(prev => ({ ...prev, healthStatus: status }));
    });
    
    healthCheckService.startMonitoring(15000); // Check every 15 seconds
  }, []);

  /**
   * Parar monitoramento de saúde
   */
  const stopHealthMonitoring = useCallback(() => {
    healthCheckService.stopMonitoring();
  }, []);

  /**
   * Rollback de emergência
   */
  const performEmergencyRollback = useCallback(async (): Promise<boolean> => {
    if (state.isRollingBack) return false;

    setState(prev => ({ ...prev, isRollingBack: true }));

    try {
      // Criar backup antes do rollback se configurado
      if (defaultConfig.autoBackupBeforeRollback) {
        const backupId = await backupService.createBackup('pre-deployment', 'Emergency backup before auto-rollback');
        setState(prev => ({ ...prev, lastBackupId: backupId }));
      }

      const result = await rollbackService.rollback(undefined, 'Emergency auto-rollback due to critical system state');
      
      setState(prev => ({ 
        ...prev, 
        lastRollback: result,
        isRollingBack: false 
      }));

      if (result.success) {
        toast({
          title: "✅ Rollback de Emergência Concluído",
          description: `Sistema restaurado para versão ${result.toVersion}`,
        });
        
        loadData();
        return true;
      } else {
        throw new Error('Emergency rollback failed');
      }

    } catch (error) {
      setState(prev => ({ ...prev, isRollingBack: false }));
      
      toast({
        title: "❌ Rollback de Emergência Falhou",
        description: error instanceof Error ? error.message : 'Erro crítico no rollback',
        variant: "destructive"
      });
      
      return false;
    }
  }, [state.isRollingBack, defaultConfig, toast, loadData]);

  /**
   * Rollback manual
   */
  const performRollback = useCallback(async (targetVersion?: string, reason?: string): Promise<boolean> => {
    if (state.isRollingBack) return false;

    setState(prev => ({ ...prev, isRollingBack: true }));

    try {
      const result = await rollbackService.rollback(targetVersion, reason || 'Manual rollback');
      
      setState(prev => ({ 
        ...prev, 
        lastRollback: result,
        isRollingBack: false 
      }));

      if (result.success) {
        toast({
          title: "✅ Rollback Concluído",
          description: `Rollback para ${result.toVersion} executado com sucesso`,
        });
        
        loadData();
        return true;
      } else {
        throw new Error('Rollback failed');
      }

    } catch (error) {
      setState(prev => ({ ...prev, isRollingBack: false }));
      
      toast({
        title: "❌ Rollback Falhou",
        description: error instanceof Error ? error.message : 'Erro no rollback',
        variant: "destructive"
      });
      
      return false;
    }
  }, [state.isRollingBack, toast, loadData]);

  /**
   * Criar backup manual
   */
  const createBackup = useCallback(async (reason?: string): Promise<string | null> => {
    if (state.isBackingUp) return null;

    setState(prev => ({ ...prev, isBackingUp: true }));

    try {
      const backupId = await backupService.createBackup('manual', reason || 'Manual backup');
      
      setState(prev => ({ 
        ...prev, 
        lastBackupId: backupId,
        isBackingUp: false 
      }));

      toast({
        title: "✅ Backup Criado",
        description: `Backup ${backupId} criado com sucesso`,
      });
      
      loadData();
      return backupId;

    } catch (error) {
      setState(prev => ({ ...prev, isBackingUp: false }));
      
      toast({
        title: "❌ Backup Falhou",
        description: error instanceof Error ? error.message : 'Erro no backup',
        variant: "destructive"
      });
      
      return null;
    }
  }, [state.isBackingUp, toast, loadData]);

  /**
   * Restaurar de backup
   */
  const restoreFromBackup = useCallback(async (backupId: string): Promise<boolean> => {
    if (state.isRestoring) return false;

    setState(prev => ({ ...prev, isRestoring: true }));

    try {
      const success = await backupService.restoreFromBackup(backupId);
      
      setState(prev => ({ ...prev, isRestoring: false }));

      if (success) {
        toast({
          title: "✅ Restauração Concluída",
          description: `Dados restaurados do backup ${backupId}`,
        });
        
        loadData();
        
        // Recarregar página para aplicar mudanças
        setTimeout(() => {
          window.location.reload();
        }, 2000);
        
        return true;
      } else {
        throw new Error('Restore failed');
      }

    } catch (error) {
      setState(prev => ({ ...prev, isRestoring: false }));
      
      toast({
        title: "❌ Restauração Falhou",
        description: error instanceof Error ? error.message : 'Erro na restauração',
        variant: "destructive"
      });
      
      return false;
    }
  }, [state.isRestoring, toast, loadData]);

  /**
   * Obter status de saúde do sistema
   */
  const getSystemHealthStatus = useCallback((): 'healthy' | 'degraded' | 'critical' => {
    if (!state.healthStatus) return 'degraded';
    
    if (state.systemCritical) return 'critical';
    if (state.healthStatus.status === 'unhealthy') return 'critical';
    if (state.healthStatus.status === 'degraded') return 'degraded';
    
    return 'healthy';
  }, [state.healthStatus, state.systemCritical]);

  /**
   * Verificar se rollback de emergência está disponível
   */
  const canPerformEmergencyRollback = useCallback((): boolean => {
    return !state.isRollingBack && 
           state.deployments.length > 0 && 
           state.deployments.some(d => d.status === 'standby');
  }, [state.isRollingBack, state.deployments]);

  return {
    // Estado
    ...state,
    
    // Status computados
    systemHealthStatus: getSystemHealthStatus(),
    canPerformEmergencyRollback: canPerformEmergencyRollback(),
    
    // Ações
    performRollback,
    performEmergencyRollback,
    createBackup,
    restoreFromBackup,
    loadData,
    
    // Configuração
    config: defaultConfig,
    
    // Utilitários
    isOperationInProgress: state.isRollingBack || state.isBackingUp || state.isRestoring,
    hasRecentBackups: state.backups.length > 0,
    hasValidRestorePoints: state.restorePoints.some(rp => rp.verified)
  };
};
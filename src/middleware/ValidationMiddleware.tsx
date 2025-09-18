/**
 * 🛡️ MIDDLEWARE DE VALIDAÇÃO AUTOMÁTICA - FASE 3
 *
 * Sistema que executa validação contínua em background
 * Detecta problemas automaticamente e aciona fallbacks
 */

import { MonitoringService } from '@/services/MonitoringService';
import { useSystemValidation } from '@/testing/SystemValidation';
import { useFeatureFlags } from '@/utils/FeatureFlagManager';
import React, { useCallback, useEffect } from 'react';
import useOptimizedScheduler from '@/hooks/useOptimizedScheduler';

interface ValidationMiddlewareProps {
  children: React.ReactNode;
  onValidationFailed?: (score: number) => void;
  onCriticalError?: (error: Error) => void;
}

interface ValidationState {
  isRunning: boolean;
  lastScore: number;
  lastRun: string;
  consecutiveFailures: number;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
}

/**
 * 🔍 Middleware principal de validação
 */
export const ValidationMiddleware: React.FC<ValidationMiddlewareProps> = ({
  children,
  onValidationFailed,
  onCriticalError,
}) => {
  const flags = useFeatureFlags();
  const { runValidationSuite } = useSystemValidation();
  const monitoring = MonitoringService.getInstance();

  // Update system health with flags
  React.useEffect(() => {
    monitoring.updateSystemHealth(flags);
  }, [flags, monitoring]);

  const [validationState, setValidationState] = React.useState<ValidationState>({
    isRunning: false,
    lastScore: 100,
    lastRun: '',
    consecutiveFailures: 0,
    status: 'healthy',
  });

  // timers substituídos por scheduler
  const { schedule, cancel } = useOptimizedScheduler();

  /**
   * 🧪 Executar validação automática
   */
  const runAutoValidation = useCallback(async () => {
    if (!flags.shouldValidateCompatibility()) {
      return;
    }

    console.log('🔍 Executando validação automática...');

    setValidationState(prev => ({ ...prev, isRunning: true }));

    try {
      // Timeout para validação (10 segundos máximo)
      const validationPromise = runValidationSuite();
      const timeoutPromise = new Promise((_, reject) => {
        cancel('validation-timeout');
        schedule('validation-timeout', () => reject(new Error('Validation timeout')), 10000, 'timeout');
      });

      const report = await Promise.race([validationPromise, timeoutPromise]);

  cancel('validation-timeout');

      const now = new Date().toISOString();
      const newScore = (report as any).compatibilityScore || 0;

      // Determinar status baseado no score
      let status: ValidationState['status'] = 'healthy';
      let consecutiveFailures = validationState.consecutiveFailures;

      if (newScore < 70) {
        status = 'critical';
        consecutiveFailures++;

        // Trigger callback de falha
        onValidationFailed?.(newScore);

        console.warn(`🚨 Score crítico: ${newScore}%`);
      } else if (newScore < 85) {
        status = 'warning';
        consecutiveFailures++;

        console.warn(`⚠️ Score baixo: ${newScore}%`);
      } else {
        consecutiveFailures = 0;
      }

      // Atualizar estado
      setValidationState({
        isRunning: false,
        lastScore: newScore,
        lastRun: now,
        consecutiveFailures,
        status,
      });

      // Enviar para monitoramento
      monitoring.trackUserEvent('auto_validation_completed', {
        score: newScore,
        status,
        consecutiveFailures,
      });

      // Auto-rollback em caso crítico
      if (consecutiveFailures >= 3 && status === 'critical') {
        console.error('🚨 Muitas falhas consecutivas, iniciando auto-rollback');
        await triggerAutoRollback(newScore);
      }
    } catch (error) {
      console.error('❌ Erro na validação automática:', error);

      setValidationState(prev => ({
        ...prev,
        isRunning: false,
        status: 'offline',
        consecutiveFailures: prev.consecutiveFailures + 1,
      }));

      onCriticalError?.(error as Error);

      monitoring.trackError(error as Error, { context: 'auto_validation' });
    }
  }, [
    flags,
    runValidationSuite,
    onValidationFailed,
    onCriticalError,
    monitoring,
    validationState.consecutiveFailures,
  ]);

  /**
   * 🔄 Auto-rollback em caso de problemas críticos
   */
  const triggerAutoRollback = async (score: number) => {
    try {
      console.log('🔄 Iniciando auto-rollback...');

      // Desabilitar sistema unificado
      flags.setFlag('useUnifiedQuizSystem', false);

      // Notificar monitoramento
      monitoring.trackUserEvent('auto_rollback_triggered', {
        reason: 'consecutive_validation_failures',
        score,
        timestamp: new Date().toISOString(),
      });

      // Mostrar notificação ao usuário
      showRollbackNotification();

      // Recarregar página após 2 segundos
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('❌ Erro no auto-rollback:', error);
      onCriticalError?.(error as Error);
    }
  };

  /**
   * 📢 Mostrar notificação de rollback
   */
  const showRollbackNotification = () => {
    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-family: system-ui, sans-serif;
      ">
        <div style="font-weight: bold; margin-bottom: 8px;">
          🔄 Sistema revertido automaticamente
        </div>
        <div style="font-size: 14px;">
          Detectamos problemas. Voltando para versão estável...
        </div>
      </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 5000);
  };

  /**
   * 🚀 Inicializar validação periódica
   */
  useEffect(() => {
    const validationEnabled = flags.shouldValidateCompatibility();
    if (!validationEnabled) {
      return;
    }

    // Executar validação imediatamente
    runAutoValidation();

    // Configurar intervalo (a cada 5 minutos)
    cancel('validation-interval');
    // usa schedule + recursivo para simular interval com cleanup confiável
    const scheduleNext = () => {
      schedule('validation-interval', () => {
        runAutoValidation();
        scheduleNext();
      }, 5 * 60 * 1000, 'timeout');
    };
    scheduleNext();

    return () => {
  cancel('validation-interval');
  cancel('validation-timeout');
    };
  }, [flags.shouldValidateCompatibility(), runAutoValidation]);

  /**
   * 🎯 Render com indicador de status
   */
  return (
    <>
      {children}
      {flags.shouldLogCompatibility() && import.meta.env.DEV && (
        <ValidationStatusIndicator state={validationState} />
      )}
    </>
  );
};

/**
 * 📊 Indicador visual de status (apenas desenvolvimento)
 */
interface ValidationStatusIndicatorProps {
  state: ValidationState;
}

const ValidationStatusIndicator: React.FC<ValidationStatusIndicatorProps> = ({ state }) => {
  const getStatusColor = () => {
    switch (state.status) {
      case 'healthy':
        return '#10b981';
      case 'warning':
        return '#f59e0b';
      case 'critical':
        return '#ef4444';
      case 'offline':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = () => {
    switch (state.status) {
      case 'healthy':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'critical':
        return '🚨';
      case 'offline':
        return '⚫';
      default:
        return '❓';
    }
  };

  return (
    <div className="fixed top-4 left-4 bg-white shadow-lg rounded-lg p-3 text-xs z-50 border">
      <div className="flex items-center space-x-2 mb-2">
        <span>{getStatusIcon()}</span>
        <span className="font-medium" style={{ color: getStatusColor() }}>
          {state.status.toUpperCase()}
        </span>
        {state.isRunning && (
          <div className="animate-spin h-3 w-3 border border-gray-400 border-t-transparent rounded-full"></div>
        )}
      </div>

      <div className="space-y-1 text-gray-600">
        <div>
          Score: <span style={{ color: getStatusColor() }}>{state.lastScore.toFixed(1)}%</span>
        </div>
        <div>Falhas: {state.consecutiveFailures}/3</div>
        {state.lastRun && <div>Última: {new Date(state.lastRun).toLocaleTimeString()}</div>}
      </div>
    </div>
  );
};

/**
 * 🎯 Hook para controle manual da validação
 */
export const useValidationControl = () => {
  const flags = useFeatureFlags();
  const { runValidationSuite } = useSystemValidation();

  const runManualValidation = async () => {
    if (!flags.shouldValidateCompatibility()) {
      console.warn('⚠️ Validação desabilitada por feature flag');
      return null;
    }

    try {
      console.log('🔍 Executando validação manual...');
      const report = await runValidationSuite();
      console.log('✅ Validação manual concluída:', report);
      return report;
    } catch (error) {
      console.error('❌ Erro na validação manual:', error);
      return null;
    }
  };

  const enableAutoValidation = () => {
    flags.setFlag('enableSystemValidation', true);
    console.log('✅ Validação automática habilitada');
  };

  const disableAutoValidation = () => {
    flags.setFlag('enableSystemValidation', false);
    console.log('❌ Validação automática desabilitada');
  };

  return {
    runManualValidation,
    enableAutoValidation,
    disableAutoValidation,
    isEnabled: flags.shouldValidateCompatibility(),
  };
};

export default ValidationMiddleware;

/**
 * 📊 DASHBOARD DE MONITORAMENTO VISUAL - FASE 3
 *
 * Interface visual para acompanhar métricas do sistema em tempo real
 */

import { useValidationControl } from '@/middleware/ValidationMiddleware';
import { useMonitoring } from '@/services/MonitoringService';
import { useFeatureFlags } from '@/utils/FeatureFlagManager';
import React, { useEffect, useState } from 'react';

interface DashboardProps {
  isVisible?: boolean;
  onToggle?: () => void;
}

/**
 * 📱 Dashboard principal de monitoramento
 */
export const MonitoringDashboard: React.FC<DashboardProps> = ({ isVisible = false, onToggle }) => {
  const { metrics, trackEvent } = useMonitoring();
  const flags = useFeatureFlags();
  const { runManualValidation, isEnabled } = useValidationControl();

  const [isExpanded, setIsExpanded] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Auto-update a cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Não mostrar em produção se não for flagged
  if (process.env.NODE_ENV === 'production' && !flags.shouldLogCompatibility()) {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg z-50 transition-colors"
        title="Abrir Dashboard de Monitoramento"
      >
        📊
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-2xl rounded-lg border z-50 max-w-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <span className="text-lg">📊</span>
          <h3 className="font-semibold text-gray-800">System Monitor</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title={isExpanded ? 'Minimizar' : 'Expandir'}
          >
            {isExpanded ? '📉' : '📈'}
          </button>
          <button
            onClick={onToggle}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Fechar"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4 space-y-4">
        {/* Status Geral */}
        <SystemStatusCard metrics={metrics} />

        {isExpanded && (
          <>
            {/* Métricas de Performance */}
            <PerformanceMetricsCard metrics={metrics} />

            {/* Compatibilidade */}
            <CompatibilityCard metrics={metrics} />

            {/* Controles */}
            <ControlsCard
              onValidation={runManualValidation}
              isValidationEnabled={isEnabled}
              onEvent={trackEvent}
            />
          </>
        )}

        {/* Footer */}
        <div className="text-xs text-gray-500 border-t pt-2">
          Última atualização: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

/**
 * 🎯 Card de status geral do sistema
 */
const SystemStatusCard: React.FC<{ metrics: any }> = ({ metrics }) => {
  const getSystemStatusColor = () => {
    if (!metrics?.system) return 'text-gray-500';

    const errorCount = metrics.system.errorCount || 0;
    if (errorCount > 5) return 'text-red-500';
    if (errorCount > 0) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getSystemStatusIcon = () => {
    if (!metrics?.system) return '❓';

    const errorCount = metrics.system.errorCount || 0;
    if (errorCount > 5) return '🔴';
    if (errorCount > 0) return '🟡';
    return '🟢';
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Status do Sistema</span>
        <span className="text-lg">{getSystemStatusIcon()}</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-gray-600">Sistema:</span>
          <div
            className={`font-medium ${
              metrics?.system?.activeSystem === 'unified' ? 'text-blue-600' : 'text-purple-600'
            }`}
          >
            {metrics?.system?.activeSystem || 'N/A'}
          </div>
        </div>

        <div>
          <span className="text-gray-600">Erros:</span>
          <div className={getSystemStatusColor()}>{metrics?.system?.errorCount || 0}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * ⚡ Card de métricas de performance
 */
const PerformanceMetricsCard: React.FC<{ metrics: any }> = ({ metrics }) => {
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const formatMemory = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="bg-blue-50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Performance</span>
        <span className="text-lg">⚡</span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-gray-600">Load Time:</span>
          <div className="font-medium text-blue-600">
            {metrics?.performance?.loadTime ? formatTime(metrics.performance.loadTime) : 'N/A'}
          </div>
        </div>

        <div>
          <span className="text-gray-600">Memory:</span>
          <div className="font-medium text-blue-600">
            {metrics?.performance?.memoryUsage
              ? formatMemory(metrics.performance.memoryUsage)
              : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 🎯 Card de compatibilidade
 */
const CompatibilityCard: React.FC<{ metrics: any }> = ({ metrics }) => {
  const score = metrics?.compatibility?.validationScore || 0;

  const getScoreColor = () => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = () => {
    if (score >= 90) return '✅';
    if (score >= 70) return '⚠️';
    return '🚨';
  };

  return (
    <div className="bg-green-50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Compatibilidade</span>
        <span className="text-lg">{getScoreIcon()}</span>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">Score:</span>
          <span className={`text-sm font-bold ${getScoreColor()}`}>{score.toFixed(1)}%</span>
        </div>

        {metrics?.compatibility?.failedTests && metrics.compatibility.failedTests.length > 0 && (
          <div className="text-xs">
            <span className="text-red-600">Testes falhando:</span>
            <div className="text-red-500 mt-1">
              {metrics.compatibility.failedTests.slice(0, 2).join(', ')}
              {metrics.compatibility.failedTests.length > 2 && '...'}
            </div>
          </div>
        )}

        {metrics?.compatibility?.lastValidation && (
          <div className="text-xs text-gray-500">
            Última validação: {new Date(metrics.compatibility.lastValidation).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 🎮 Card de controles
 */
interface ControlsCardProps {
  onValidation: () => Promise<any>;
  isValidationEnabled: boolean;
  onEvent: (event: string, data?: any) => void;
}

const ControlsCard: React.FC<ControlsCardProps> = ({
  onValidation,
  isValidationEnabled,
  onEvent,
}) => {
  const [isValidating, setIsValidating] = useState(false);
  const flags = useFeatureFlags();

  const handleManualValidation = async () => {
    setIsValidating(true);
    onEvent('manual_validation_requested');

    try {
      await onValidation();
      onEvent('manual_validation_completed');
    } catch (error) {
      onEvent('manual_validation_failed', { error: String(error) });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSystemSwitch = () => {
    const currentSystem = flags.shouldUseUnifiedSystem() ? 'unified' : 'legacy';
    const newSystem = currentSystem === 'unified' ? 'legacy' : 'unified';

    flags.setFlag('useUnifiedQuizSystem', newSystem === 'unified');
    onEvent('system_switched', { from: currentSystem, to: newSystem });

    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="bg-purple-50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Controles</span>
        <span className="text-lg">🎮</span>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleManualValidation}
          disabled={!isValidationEnabled || isValidating}
          className="w-full text-xs bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-3 py-1 rounded transition-colors"
        >
          {isValidating ? '🔄 Validando...' : '🧪 Executar Validação'}
        </button>

        <button
          onClick={handleSystemSwitch}
          className="w-full text-xs bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded transition-colors"
        >
          🔄 Alternar Sistema
        </button>

        <div className="text-xs text-gray-500">
          Sistema atual:{' '}
          <span className="font-medium">
            {flags.shouldUseUnifiedSystem() ? 'Unificado' : 'Legado'}
          </span>
        </div>
      </div>
    </div>
  );
};

/**
 * 🎯 Hook para controle do dashboard
 */
export const useDashboardControl = () => {
  const [isVisible, setIsVisible] = useState(false);
  const flags = useFeatureFlags();

  const toggle = () => setIsVisible(prev => !prev);
  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);

  const shouldShow = () => {
    return process.env.NODE_ENV === 'development' || flags.shouldLogCompatibility();
  };

  return {
    isVisible: isVisible && shouldShow(),
    toggle,
    show,
    hide,
    shouldShow: shouldShow(),
  };
};

// Adicionar controles ao console para desenvolvimento
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).quizDashboard = {
    show: () => {
      const event = new CustomEvent('show-dashboard');
      window.dispatchEvent(event);
    },
    hide: () => {
      const event = new CustomEvent('hide-dashboard');
      window.dispatchEvent(event);
    },
  };

  console.log('📊 Dashboard controls disponíveis em window.quizDashboard');
}

export default MonitoringDashboard;

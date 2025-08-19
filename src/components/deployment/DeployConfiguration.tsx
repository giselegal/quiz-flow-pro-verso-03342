/**
 * 🚀 CONFIGURAÇÃO DE DEPLOY - FASE 3
 *
 * Sistema para rollout gradual e controle de feature flags em produção
 */

import { useMonitoring } from '@/services/MonitoringService';
import { useFeatureFlags } from '@/utils/FeatureFlagManager';
import React, { useEffect, useState } from 'react';

interface DeployConfigProps {
  environment: 'development' | 'staging' | 'production';
  onConfigChange?: (config: DeployConfig) => void;
}

export interface DeployConfig {
  environment: string;
  rolloutPercentage: number;
  featureFlags: Record<string, boolean | number>;
  healthChecks: HealthCheck[];
  rollbackTriggers: RollbackTrigger[];
  gradualRollout: GradualRolloutConfig;
}

interface HealthCheck {
  name: string;
  enabled: boolean;
  threshold: number;
  metric: string;
}

interface RollbackTrigger {
  name: string;
  enabled: boolean;
  condition: string;
  threshold: number;
}

interface GradualRolloutConfig {
  enabled: boolean;
  stages: RolloutStage[];
  autoProgress: boolean;
  maxFailuresPerStage: number;
}

interface RolloutStage {
  name: string;
  percentage: number;
  duration: number; // minutos
  successThreshold: number;
}

/**
 * 🎛️ Componente principal de configuração de deploy
 */
export const DeployConfiguration: React.FC<DeployConfigProps> = ({
  environment,
  onConfigChange,
}) => {
  const flags = useFeatureFlags();
  const { metrics, trackEvent } = useMonitoring();

  const [config, setConfig] = useState<DeployConfig>(() => getDefaultConfig(environment));
  const [isActive, setIsActive] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);

  // Sincronizar mudanças
  useEffect(() => {
    onConfigChange?.(config);
  }, [config, onConfigChange]);

  // Não mostrar em produção para usuários normais
  if (environment === 'production' && !flags.shouldLogCompatibility()) {
    return null;
  }

  const handleConfigUpdate = (updates: Partial<DeployConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    trackEvent('deploy_config_updated', { environment, updates });
  };

  const startGradualRollout = () => {
    setIsActive(true);
    setCurrentStage(0);
    trackEvent('gradual_rollout_started', { environment, config });
  };

  const stopRollout = () => {
    setIsActive(false);
    setCurrentStage(0);
    trackEvent('gradual_rollout_stopped', { environment });
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Deploy Configuration</h2>
          <p className="text-sm text-gray-600">
            Ambiente: <span className="font-medium capitalize">{environment}</span>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <StatusIndicator isActive={isActive} currentStage={currentStage} />
          {isActive ? (
            <button
              onClick={stopRollout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🛑 Parar Rollout
            </button>
          ) : (
            <button
              onClick={startGradualRollout}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              🚀 Iniciar Rollout
            </button>
          )}
        </div>
      </div>

      {/* Configuração de Feature Flags */}
      <FeatureFlagsSection
        config={config}
        onChange={featureFlags => handleConfigUpdate({ featureFlags })}
      />

      {/* Configuração de Rollout Gradual */}
      <GradualRolloutSection
        config={config}
        onChange={gradualRollout => handleConfigUpdate({ gradualRollout })}
        isActive={isActive}
        currentStage={currentStage}
      />

      {/* Health Checks */}
      <HealthChecksSection
        config={config}
        onChange={healthChecks => handleConfigUpdate({ healthChecks })}
        metrics={metrics}
      />

      {/* Rollback Triggers */}
      <RollbackTriggersSection
        config={config}
        onChange={rollbackTriggers => handleConfigUpdate({ rollbackTriggers })}
      />

      {/* Status atual */}
      <CurrentStatusSection
        config={config}
        metrics={metrics}
        isActive={isActive}
        currentStage={currentStage}
      />
    </div>
  );
};

/**
 * 🎚️ Seção de Feature Flags
 */
const FeatureFlagsSection: React.FC<{
  config: DeployConfig;
  onChange: (flags: Record<string, boolean | number>) => void;
}> = ({ config, onChange }) => {
  const updateFlag = (key: string, value: boolean | number) => {
    onChange({
      ...config.featureFlags,
      [key]: value,
    });
  };

  return (
    <div className="bg-blue-50 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">🎚️ Feature Flags</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sistema Unificado */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Sistema Unificado</label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={Boolean(config.featureFlags.useUnifiedQuizSystem)}
              onChange={e => updateFlag('useUnifiedQuizSystem', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">
              {config.featureFlags.useUnifiedQuizSystem ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>

        {/* Percentual de Rollout */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Percentual de Rollout</label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="100"
              value={config.rolloutPercentage}
              onChange={e => updateFlag('rolloutPercentage', Number(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium text-blue-600 min-w-[3rem]">
              {config.rolloutPercentage}%
            </span>
          </div>
        </div>

        {/* Compatibilidade Logs */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Logs de Compatibilidade</label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={Boolean(config.featureFlags.compatibilityLogs)}
              onChange={e => updateFlag('compatibilityLogs', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">
              {config.featureFlags.compatibilityLogs ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>

        {/* Validação Automática */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Validação Automática</label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={Boolean(config.featureFlags.autoValidation)}
              onChange={e => updateFlag('autoValidation', e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-600">
              {config.featureFlags.autoValidation ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 📈 Seção de Rollout Gradual
 */
const GradualRolloutSection: React.FC<{
  config: DeployConfig;
  onChange: (gradualRollout: GradualRolloutConfig) => void;
  isActive: boolean;
  currentStage: number;
}> = ({ config, onChange, isActive, currentStage }) => {
  const updateGradualRollout = (updates: Partial<GradualRolloutConfig>) => {
    onChange({
      ...config.gradualRollout,
      ...updates,
    });
  };

  const updateStage = (index: number, updates: Partial<RolloutStage>) => {
    const newStages = [...config.gradualRollout.stages];
    newStages[index] = { ...newStages[index], ...updates };
    updateGradualRollout({ stages: newStages });
  };

  return (
    <div className="bg-green-50 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">📈 Rollout Gradual</h3>

      {/* Controles gerais */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Rollout Gradual Habilitado</label>
          <input
            type="checkbox"
            checked={config.gradualRollout.enabled}
            onChange={e => updateGradualRollout({ enabled: e.target.checked })}
            className="rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Progressão Automática</label>
          <input
            type="checkbox"
            checked={config.gradualRollout.autoProgress}
            onChange={e => updateGradualRollout({ autoProgress: e.target.checked })}
            className="rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Max Falhas por Estágio</label>
          <input
            type="number"
            min="0"
            max="10"
            value={config.gradualRollout.maxFailuresPerStage}
            onChange={e => updateGradualRollout({ maxFailuresPerStage: Number(e.target.value) })}
            className="w-full px-3 py-1 text-sm border rounded"
          />
        </div>
      </div>

      {/* Estágios */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Estágios do Rollout</h4>
        {config.gradualRollout.stages.map((stage, index) => (
          <div
            key={index}
            className={`p-3 rounded border-2 transition-colors ${
              isActive && index === currentStage
                ? 'border-blue-400 bg-blue-50'
                : index < currentStage
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 bg-white'
            }`}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-gray-600">Nome</label>
                <input
                  type="text"
                  value={stage.name}
                  onChange={e => updateStage(index, { name: e.target.value })}
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Percentual</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={stage.percentage}
                  onChange={e => updateStage(index, { percentage: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Duração (min)</label>
                <input
                  type="number"
                  min="1"
                  max="1440"
                  value={stage.duration}
                  onChange={e => updateStage(index, { duration: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600">Threshold (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={stage.successThreshold}
                  onChange={e => updateStage(index, { successThreshold: Number(e.target.value) })}
                  className="w-full px-2 py-1 text-sm border rounded"
                />
              </div>
            </div>

            {isActive && index === currentStage && (
              <div className="mt-2 text-xs text-blue-600 font-medium">
                🔄 Estágio atual em execução
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 🏥 Seção de Health Checks
 */
const HealthChecksSection: React.FC<{
  config: DeployConfig;
  onChange: (healthChecks: HealthCheck[]) => void;
  metrics: any;
}> = ({ config, onChange, metrics }) => {
  const updateHealthCheck = (index: number, updates: Partial<HealthCheck>) => {
    const newChecks = [...config.healthChecks];
    newChecks[index] = { ...newChecks[index], ...updates };
    onChange(newChecks);
  };

  const getHealthStatus = (check: HealthCheck) => {
    if (!metrics || !check.enabled) return '⚪';

    const value = metrics[check.metric] || 0;
    return value <= check.threshold ? '🟢' : '🔴';
  };

  return (
    <div className="bg-purple-50 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">🏥 Health Checks</h3>

      <div className="space-y-3">
        {config.healthChecks.map((check, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded border">
            <span className="text-lg">{getHealthStatus(check)}</span>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={check.name}
                onChange={e => updateHealthCheck(index, { name: e.target.value })}
                className="px-2 py-1 text-sm border rounded"
                placeholder="Nome do check"
              />

              <select
                value={check.metric}
                onChange={e => updateHealthCheck(index, { metric: e.target.value })}
                className="px-2 py-1 text-sm border rounded"
              >
                <option value="errorCount">Error Count</option>
                <option value="loadTime">Load Time</option>
                <option value="memoryUsage">Memory Usage</option>
                <option value="validationScore">Validation Score</option>
              </select>

              <input
                type="number"
                value={check.threshold}
                onChange={e => updateHealthCheck(index, { threshold: Number(e.target.value) })}
                className="px-2 py-1 text-sm border rounded"
                placeholder="Threshold"
              />

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={check.enabled}
                  onChange={e => updateHealthCheck(index, { enabled: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Ativo</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * ⚠️ Seção de Rollback Triggers
 */
const RollbackTriggersSection: React.FC<{
  config: DeployConfig;
  onChange: (triggers: RollbackTrigger[]) => void;
}> = ({ config, onChange }) => {
  const updateTrigger = (index: number, updates: Partial<RollbackTrigger>) => {
    const newTriggers = [...config.rollbackTriggers];
    newTriggers[index] = { ...newTriggers[index], ...updates };
    onChange(newTriggers);
  };

  return (
    <div className="bg-red-50 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">⚠️ Rollback Triggers</h3>

      <div className="space-y-3">
        {config.rollbackTriggers.map((trigger, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded border">
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={trigger.name}
                onChange={e => updateTrigger(index, { name: e.target.value })}
                className="px-2 py-1 text-sm border rounded"
                placeholder="Nome do trigger"
              />

              <select
                value={trigger.condition}
                onChange={e => updateTrigger(index, { condition: e.target.value })}
                className="px-2 py-1 text-sm border rounded"
              >
                <option value="errorRate">Error Rate</option>
                <option value="responseTime">Response Time</option>
                <option value="failureCount">Failure Count</option>
                <option value="validationScore">Validation Score</option>
              </select>

              <input
                type="number"
                value={trigger.threshold}
                onChange={e => updateTrigger(index, { threshold: Number(e.target.value) })}
                className="px-2 py-1 text-sm border rounded"
                placeholder="Threshold"
              />

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={trigger.enabled}
                  onChange={e => updateTrigger(index, { enabled: e.target.checked })}
                  className="rounded"
                />
                <span className="text-sm">Ativo</span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 📊 Seção de Status Atual
 */
const CurrentStatusSection: React.FC<{
  config: DeployConfig;
  metrics: any;
  isActive: boolean;
  currentStage: number;
}> = ({ config, metrics, isActive, currentStage }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-800 mb-4">📊 Status Atual</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{config.rolloutPercentage}%</div>
          <div className="text-sm text-gray-600">Rollout Atual</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {metrics?.compatibility?.validationScore?.toFixed(1) || '0.0'}%
          </div>
          <div className="text-sm text-gray-600">Score de Compatibilidade</div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {isActive ? currentStage + 1 : 0}/{config.gradualRollout.stages.length}
          </div>
          <div className="text-sm text-gray-600">Estágio Atual</div>
        </div>
      </div>

      {isActive && (
        <div className="mt-4 p-3 bg-blue-100 rounded border-l-4 border-blue-400">
          <div className="text-sm text-blue-800">
            🔄 Rollout em progresso - Estágio:{' '}
            {config.gradualRollout.stages[currentStage]?.name || 'N/A'}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * 🚦 Indicador de Status
 */
const StatusIndicator: React.FC<{
  isActive: boolean;
  currentStage: number;
}> = ({ isActive, currentStage }) => {
  if (!isActive) {
    return (
      <div className="flex items-center space-x-2 text-gray-500">
        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
        <span className="text-sm">Inativo</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-green-600">
      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
      <span className="text-sm">Ativo - Estágio {currentStage + 1}</span>
    </div>
  );
};

/**
 * 🎯 Configuração padrão por ambiente
 */
function getDefaultConfig(environment: string): DeployConfig {
  const baseConfig: DeployConfig = {
    environment,
    rolloutPercentage: 0,
    featureFlags: {
      useUnifiedQuizSystem: false,
      compatibilityLogs: true,
      autoValidation: true,
      rolloutPercentage: 0,
    },
    healthChecks: [
      {
        name: 'Error Rate',
        enabled: true,
        threshold: 5,
        metric: 'errorCount',
      },
      {
        name: 'Load Time',
        enabled: true,
        threshold: 3000,
        metric: 'loadTime',
      },
      {
        name: 'Validation Score',
        enabled: true,
        threshold: 80,
        metric: 'validationScore',
      },
    ],
    rollbackTriggers: [
      {
        name: 'High Error Rate',
        enabled: true,
        condition: 'errorRate',
        threshold: 10,
      },
      {
        name: 'Low Validation Score',
        enabled: true,
        condition: 'validationScore',
        threshold: 70,
      },
    ],
    gradualRollout: {
      enabled: false,
      autoProgress: false,
      maxFailuresPerStage: 3,
      stages: [
        { name: 'Canary', percentage: 5, duration: 30, successThreshold: 95 },
        { name: 'Small', percentage: 25, duration: 60, successThreshold: 90 },
        { name: 'Half', percentage: 50, duration: 120, successThreshold: 85 },
        { name: 'Full', percentage: 100, duration: 180, successThreshold: 80 },
      ],
    },
  };

  // Ajustes por ambiente
  switch (environment) {
    case 'development':
      baseConfig.rolloutPercentage = 100;
      baseConfig.featureFlags.useUnifiedQuizSystem = true;
      baseConfig.gradualRollout.enabled = false;
      break;

    case 'staging':
      baseConfig.rolloutPercentage = 50;
      baseConfig.featureFlags.useUnifiedQuizSystem = true;
      baseConfig.gradualRollout.enabled = true;
      baseConfig.gradualRollout.autoProgress = true;
      break;

    case 'production':
      baseConfig.rolloutPercentage = 0;
      baseConfig.featureFlags.useUnifiedQuizSystem = false;
      baseConfig.gradualRollout.enabled = true;
      baseConfig.gradualRollout.autoProgress = false;
      break;
  }

  return baseConfig;
}

export default DeployConfiguration;

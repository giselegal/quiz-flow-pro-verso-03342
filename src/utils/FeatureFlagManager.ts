/**
 * 🎛️ SISTEMA DE FEATURE FLAGS
 *
 * Controla a migração gradual entre sistema Supabase e sistema CORE
 * Permite testar e validar antes da migração completa
 */

export interface FeatureFlags {
  useUnifiedQuizSystem: boolean;
  enableSystemValidation: boolean;
  enableCompatibilityLogging: boolean;
  enablePerformanceComparison: boolean;
  forceUnifiedInEditor: boolean;
  enableUnifiedEditorFacade: boolean;
  allowSystemFallback: boolean;
}

export interface FeatureFlagConfig {
  environment: 'development' | 'staging' | 'production';
  userId?: string;
  experimentGroups?: string[];
}

/**
 * 🎯 Gerenciador de Feature Flags
 */
export class FeatureFlagManager {
  private static instance: FeatureFlagManager;
  private flags: FeatureFlags;
  private config: FeatureFlagConfig;

  private constructor() {
    this.config = this.loadConfig();
    this.flags = this.loadFlags();
  }

  static getInstance(): FeatureFlagManager {
    if (!FeatureFlagManager.instance) {
      FeatureFlagManager.instance = new FeatureFlagManager();
    }
    return FeatureFlagManager.instance;
  }

  /**
   * 🔧 Carregar configuração do ambiente
   */
  private loadConfig(): FeatureFlagConfig {
    const environment =
      (import.meta.env.MODE as 'development' | 'staging' | 'production') || 'development';

    return {
      environment,
      userId: localStorage.getItem('user_id') || undefined,
      experimentGroups: JSON.parse(localStorage.getItem('experiment_groups') || '[]'),
    };
  }

  /**
   * 🎛️ Carregar flags baseado no ambiente e usuário
   */
  private loadFlags(): FeatureFlags {
    const baseFlags: FeatureFlags = {
      useUnifiedQuizSystem: false,
      enableSystemValidation: false,
      enableCompatibilityLogging: false,
      enablePerformanceComparison: false,
      forceUnifiedInEditor: false,
      enableUnifiedEditorFacade: false,
      allowSystemFallback: true,
    };

    // Flags específicas por ambiente
    switch (this.config.environment) {
      case 'development':
        return {
          ...baseFlags,
          useUnifiedQuizSystem: import.meta.env.VITE_USE_UNIFIED_QUIZ === 'true',
          enableSystemValidation: false, // Desabilita validação automática por padrão no DEV
          enableCompatibilityLogging: true,
          enablePerformanceComparison: true,
          forceUnifiedInEditor: import.meta.env.VITE_FORCE_UNIFIED_EDITOR === 'true',
          enableUnifiedEditorFacade:
            import.meta.env.VITE_ENABLE_UNIFIED_EDITOR_FACADE === 'true' ||
            import.meta.env.VITE_FORCE_UNIFIED_EDITOR === 'true',
          allowSystemFallback: true,
        };

      case 'staging':
        return {
          ...baseFlags,
          useUnifiedQuizSystem: import.meta.env.VITE_USE_UNIFIED_QUIZ === 'true',
          enableSystemValidation: true,
          enableCompatibilityLogging: true,
          enablePerformanceComparison: false,
          forceUnifiedInEditor: false,
          enableUnifiedEditorFacade: import.meta.env.VITE_ENABLE_UNIFIED_EDITOR_FACADE === 'true',
          allowSystemFallback: true,
        };

      case 'production':
        return {
          ...baseFlags,
          useUnifiedQuizSystem: this.isUserInExperiment('unified_quiz_rollout'),
          enableSystemValidation: false,
          enableCompatibilityLogging: false,
          enablePerformanceComparison: false,
          forceUnifiedInEditor: false,
          enableUnifiedEditorFacade: this.isUserInExperiment('unified_editor_facade_rollout'),
          allowSystemFallback: true,
        };

      default:
        return baseFlags;
    }
  }

  /**
   * 🎲 Verificar se usuário está em experimento
   */
  private isUserInExperiment(experimentName: string): boolean {
    const groups = this.config.experimentGroups || [];
    return groups.includes(experimentName);
  }

  /**
   * 🔍 Obter valor de uma flag
   */
  getFlag(flagName: keyof FeatureFlags): boolean {
    // Override via localStorage para debug
    const override = localStorage.getItem(`flag_${flagName}`);
    if (override !== null) {
      return override === 'true';
    }

    return this.flags[flagName];
  }

  /**
   * ⚙️ Definir flag temporariamente (apenas desenvolvimento)
   */
  setFlag(flagName: keyof FeatureFlags, value: boolean): void {
    if (this.config.environment !== 'development') {
      console.warn('🚫 Feature flags só podem ser alteradas em desenvolvimento');
      return;
    }

    localStorage.setItem(`flag_${flagName}`, String(value));
    console.log(`🎛️ Flag ${flagName} definida como ${value}`);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('feature-flags:update', {
        detail: {
          flag: flagName,
          value
        }
      }));
    }
  }

  /**
   * 🔄 Resetar todas as flags para padrão
   */
  resetFlags(): void {
    if (this.config.environment !== 'development') {
      console.warn('🚫 Reset de flags só disponível em desenvolvimento');
      return;
    }

    Object.keys(this.flags).forEach(flagName => {
      localStorage.removeItem(`flag_${flagName}`);
    });

    console.log('🔄 Todas as flags foram resetadas');
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('feature-flags:update', {
        detail: {
          reset: true
        }
      }));
    }
  }

  /**
   * 📊 Obter status de todas as flags
   */
  getAllFlags(): FeatureFlags {
    const currentFlags: Partial<FeatureFlags> = {};

    Object.keys(this.flags).forEach(flagName => {
      currentFlags[flagName as keyof FeatureFlags] = this.getFlag(flagName as keyof FeatureFlags);
    });

    return currentFlags as FeatureFlags;
  }

  /**
   * 🧪 Métodos específicos para validação
   */
  shouldUseUnifiedSystem(): boolean {
    return this.getFlag('useUnifiedQuizSystem');
  }

  shouldValidateCompatibility(): boolean {
    return this.getFlag('enableSystemValidation');
  }

  shouldLogCompatibility(): boolean {
    return this.getFlag('enableCompatibilityLogging');
  }

  shouldComparePerformance(): boolean {
    return this.getFlag('enablePerformanceComparison');
  }

  shouldForceUnifiedInEditor(): boolean {
    return this.getFlag('forceUnifiedInEditor');
  }

  shouldEnableUnifiedEditorFacade(): boolean {
    return this.getFlag('enableUnifiedEditorFacade');
  }

  shouldAllowFallback(): boolean {
    return this.getFlag('allowSystemFallback');
  }
}

/**
 * 🎯 Hook para usar feature flags
 */
export const useFeatureFlags = () => {
  const manager = FeatureFlagManager.getInstance();

  return {
    flags: manager.getAllFlags(),
    getFlag: (flagName: keyof FeatureFlags) => manager.getFlag(flagName),
    setFlag: (flagName: keyof FeatureFlags, value: boolean) => manager.setFlag(flagName, value),
    resetFlags: () => manager.resetFlags(),

    // Métodos de conveniência
    shouldUseUnifiedSystem: () => manager.shouldUseUnifiedSystem(),
    shouldValidateCompatibility: () => manager.shouldValidateCompatibility(),
    shouldLogCompatibility: () => manager.shouldLogCompatibility(),
    shouldComparePerformance: () => manager.shouldComparePerformance(),
    shouldForceUnifiedInEditor: () => manager.shouldForceUnifiedInEditor(),
    shouldAllowFallback: () => manager.shouldAllowFallback(),
  };
};

/**
 * 🎮 Console de debug para development
 */
if (typeof window !== 'undefined' && import.meta.env.MODE === 'development') {
  (window as any).quizFlags = {
    get: () => FeatureFlagManager.getInstance().getAllFlags(),
    set: (flagName: keyof FeatureFlags, value: boolean) =>
      FeatureFlagManager.getInstance().setFlag(flagName, value),
    reset: () => FeatureFlagManager.getInstance().resetFlags(),

    // Helpers rápidos
    enableUnified: () => FeatureFlagManager.getInstance().setFlag('useUnifiedQuizSystem', true),
    disableUnified: () => FeatureFlagManager.getInstance().setFlag('useUnifiedQuizSystem', false),
    enableValidation: () =>
      FeatureFlagManager.getInstance().setFlag('enableSystemValidation', true),
  };

  console.log('🎛️ Debug console disponível em window.quizFlags');
}

export default FeatureFlagManager;

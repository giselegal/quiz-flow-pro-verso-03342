/**
 * 🎯 APPLICATION LAYER - Public API
 * 
 * Exporta todos os serviços de aplicação, hooks e utilitários.
 * Esta é a camada que orquestra as operações de negócio.
 */

// Services
export { QuizService } from './services/QuizService';
export { FunnelService } from './services/FunnelService';
export { EditorService } from './services/EditorService';

export type {
  QuizAnalytics,
  QuizSession
} from './services/QuizService';

export type {
  FunnelAnalytics,
  FunnelSession
} from './services/FunnelService';

export type {
  EditorHistory,
  EditorSession
} from './services/EditorService';

// Hooks
export { useQuiz } from './hooks/useQuiz';
export { useFunnel } from './hooks/useFunnel';
// Note: useEditor now available from @/components/editor/EditorProvider

export type {
  UseQuizState,
  UseQuizActions
} from './hooks/useQuiz';

export type {
  UseFunnelState,
  UseFunnelActions
} from './hooks/useFunnel';

// Note: UseEditor types removed - use EditorProvider types instead

// Utility Functions
export const createQuizFromTemplate = async (templateId: string, newName: string) => {
  const { QuizService } = await import('./services/QuizService');
  const service = new QuizService();
  return service.cloneQuiz(templateId, newName);
};

export const createFunnelFromTemplate = async (templateId: string, newName: string) => {
  const { FunnelService } = await import('./services/FunnelService');
  const service = new FunnelService();
  return service.createFromTemplate(templateId, newName);
};

export const validateQuizConfiguration = async (quizId: string) => {
  const { QuizService } = await import('./services/QuizService');
  const service = new QuizService();
  return service.validateQuiz(quizId);
};

export const validateFunnelConfiguration = async (funnelId: string) => {
  const { FunnelService } = await import('./services/FunnelService');
  const service = new FunnelService();
  return service.validateFunnel(funnelId);
};

export const validateEditorSession = async (sessionId: string) => {
  const { EditorService } = await import('./services/EditorService');
  const service = new EditorService();
  return service.validateEditorSession(sessionId);
};

// Performance Monitoring
export class ApplicationMonitor {
  private static instance: ApplicationMonitor;
  private metrics: Record<string, { calls: number; totalTime: number; errors: number }> = {};

  static getInstance(): ApplicationMonitor {
    if (!ApplicationMonitor.instance) {
      ApplicationMonitor.instance = new ApplicationMonitor();
    }
    return ApplicationMonitor.instance;
  }

  async trackOperation<T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();

    if (!this.metrics[operationName]) {
      this.metrics[operationName] = { calls: 0, totalTime: 0, errors: 0 };
    }

    try {
      const result = await operation();
      const endTime = performance.now();

      this.metrics[operationName].calls++;
      this.metrics[operationName].totalTime += endTime - startTime;

      return result;
    } catch (error) {
      this.metrics[operationName].errors++;
      throw error;
    }
  }

  getMetrics(): Record<string, {
    calls: number;
    averageTime: number;
    totalTime: number;
    errors: number;
    errorRate: number;
  }> {
    const result: any = {};

    Object.entries(this.metrics).forEach(([operation, data]) => {
      result[operation] = {
        calls: data.calls,
        averageTime: data.calls > 0 ? data.totalTime / data.calls : 0,
        totalTime: data.totalTime,
        errors: data.errors,
        errorRate: data.calls > 0 ? data.errors / data.calls : 0
      };
    });

    return result;
  }

  reset(): void {
    this.metrics = {};
  }
}

// Error Handling Utilities
export class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly service: string,
    public readonly operation: string,
    public readonly originalError?: any
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

export const handleApplicationError = (error: any, context: string): ApplicationError => {
  if (error instanceof ApplicationError) {
    return error;
  }

  return new ApplicationError(
    error.message || 'An unexpected error occurred',
    context.split('.')[0],
    context.split('.')[1] || 'unknown',
    error
  );
};

// Configuration Management
export interface ApplicationConfig {
  autoSave: {
    enabled: boolean;
    intervalMs: number;
  };
  cache: {
    enabled: boolean;
    ttlMs: number;
  };
  analytics: {
    enabled: boolean;
    trackingId?: string;
  };
  validation: {
    strictMode: boolean;
  };
}

export const defaultApplicationConfig: ApplicationConfig = {
  autoSave: {
    enabled: true,
    intervalMs: 30000 // 30 seconds
  },
  cache: {
    enabled: true,
    ttlMs: 300000 // 5 minutes
  },
  analytics: {
    enabled: true
  },
  validation: {
    strictMode: false
  }
};

export class ApplicationConfigManager {
  private static config: ApplicationConfig = defaultApplicationConfig;

  static getConfig(): ApplicationConfig {
    return { ...ApplicationConfigManager.config };
  }

  static updateConfig(updates: Partial<ApplicationConfig>): void {
    ApplicationConfigManager.config = {
      ...ApplicationConfigManager.config,
      ...updates
    };
  }

  static resetConfig(): void {
    ApplicationConfigManager.config = defaultApplicationConfig;
  }
}

// Global instances
export const applicationMonitor = ApplicationMonitor.getInstance();
export const configManager = ApplicationConfigManager;

// Feature Flags
export interface FeatureFlags {
  experimentalEditor: boolean;
  advancedAnalytics: boolean;
  aiAssistant: boolean;
  collaborativeEditing: boolean;
  templateMarketplace: boolean;
}

export const defaultFeatureFlags: FeatureFlags = {
  experimentalEditor: false,
  advancedAnalytics: true,
  aiAssistant: false,
  collaborativeEditing: false,
  templateMarketplace: false
};

export class FeatureFlagManager {
  private static flags: FeatureFlags = defaultFeatureFlags;

  static getFlags(): FeatureFlags {
    return { ...FeatureFlagManager.flags };
  }

  static isEnabled(flag: keyof FeatureFlags): boolean {
    return FeatureFlagManager.flags[flag];
  }

  static updateFlags(updates: Partial<FeatureFlags>): void {
    FeatureFlagManager.flags = {
      ...FeatureFlagManager.flags,
      ...updates
    };
  }

  static resetFlags(): void {
    FeatureFlagManager.flags = defaultFeatureFlags;
  }
}

export const featureFlags = FeatureFlagManager;
/**
 * 🎯 CONFIGURAÇÃO PRINCIPAL DO SISTEMA INTEGRADO
 *
 * Ponto central de configuração para migração gradual
 * Controla todas as funcionalidades de compatibilidade e validação
 */

// Feature Flags - Configuração por ambiente
export const FEATURE_FLAGS = {
  development: {
    USE_UNIFIED_QUIZ: process.env.VITE_USE_UNIFIED_QUIZ === 'true',
    ENABLE_VALIDATION: true,
    ENABLE_LOGGING: true,
    ENABLE_DEBUG_PANEL: true,
    FORCE_UNIFIED_EDITOR: process.env.VITE_FORCE_UNIFIED_EDITOR === 'true',
    ALLOW_SYSTEM_FALLBACK: true,
    ENABLE_PERFORMANCE_COMPARISON: true,
  },

  staging: {
    USE_UNIFIED_QUIZ: process.env.VITE_USE_UNIFIED_QUIZ === 'true',
    ENABLE_VALIDATION: true,
    ENABLE_LOGGING: true,
    ENABLE_DEBUG_PANEL: false,
    FORCE_UNIFIED_EDITOR: false,
    ALLOW_SYSTEM_FALLBACK: true,
    ENABLE_PERFORMANCE_COMPARISON: false,
  },

  production: {
    USE_UNIFIED_QUIZ: process.env.VITE_ROLLOUT_PERCENTAGE
      ? Math.random() < Number(process.env.VITE_ROLLOUT_PERCENTAGE)
      : false,
    ENABLE_VALIDATION: false,
    ENABLE_LOGGING: false,
    ENABLE_DEBUG_PANEL: false,
    FORCE_UNIFIED_EDITOR: false,
    ALLOW_SYSTEM_FALLBACK: true,
    ENABLE_PERFORMANCE_COMPARISON: false,
  },
};

// Configuração de rollout gradual
export const ROLLOUT_CONFIG = {
  // Percentual de usuários que recebem o novo sistema
  DEFAULT_ROLLOUT_PERCENTAGE: 0.1, // 10%

  // Grupos de usuários prioritários (sempre recebem novo sistema)
  PRIORITY_USER_GROUPS: ['beta_testers', 'internal_users', 'development_team'],

  // Critérios para forçar sistema antigo (fallback)
  FALLBACK_CRITERIA: {
    MAX_VALIDATION_FAILURES: 3,
    MIN_COMPATIBILITY_SCORE: 70,
    UNSUPPORTED_BROWSERS: ['IE'],
  },
};

// URLs e endpoints
export const SYSTEM_ENDPOINTS = {
  UNIFIED_QUIZ: '/quiz/unified',
  SUPABASE_QUIZ: '/quiz/production',
  VALIDATION_API: '/api/validation',
  ANALYTICS_API: '/api/analytics',
};

// Configuração de cache e performance
export const CACHE_CONFIG = {
  QUIZ_DATA_TTL: 5 * 60 * 1000, // 5 minutos
  USER_ANSWERS_TTL: 24 * 60 * 60 * 1000, // 24 horas
  VALIDATION_RESULTS_TTL: 10 * 60 * 1000, // 10 minutos

  // LocalStorage keys
  STORAGE_KEYS: {
    QUIZ_STATE: 'quiz_unified_state',
    USER_ANSWERS: 'quiz_user_answers',
    SYSTEM_PREFERENCE: 'quiz_system_preference',
    VALIDATION_CACHE: 'quiz_validation_cache',
    FEATURE_FLAGS: 'quiz_feature_flags_override',
  },
};

// Configuração de analytics e monitoramento
export const ANALYTICS_CONFIG = {
  TRACK_SYSTEM_SWITCHES: true,
  TRACK_VALIDATION_RESULTS: true,
  TRACK_PERFORMANCE_METRICS: true,
  TRACK_ERROR_RATES: true,

  // Eventos importantes
  EVENTS: {
    SYSTEM_INITIALIZED: 'quiz_system_initialized',
    SYSTEM_SWITCHED: 'quiz_system_switched',
    VALIDATION_COMPLETED: 'quiz_validation_completed',
    COMPATIBILITY_ISSUE: 'quiz_compatibility_issue',
    PERFORMANCE_BENCHMARK: 'quiz_performance_benchmark',
  },
};

// Configuração de validação
export const VALIDATION_CONFIG = {
  RUN_ON_STARTUP: true,
  RUN_INTERVAL: 30 * 60 * 1000, // 30 minutos
  MAX_RETRIES: 3,
  TIMEOUT: 10 * 1000, // 10 segundos

  // Testes críticos que devem sempre passar
  CRITICAL_TESTS: ['system_initialization', 'data_persistence', 'final_result'],

  // Score mínimo para aprovar sistema
  MIN_PASSING_SCORE: 80,
};

// Configuração de desenvolvimento
export const DEV_CONFIG = {
  ENABLE_HOT_RELOAD: true,
  SHOW_PERFORMANCE_METRICS: true,
  LOG_ALL_ACTIONS: true,
  ENABLE_TIME_TRAVEL: true, // Para debug de estado

  // Console helpers
  CONSOLE_HELPERS: {
    enableUnified: 'window.quizFlags.enableUnified()',
    disableUnified: 'window.quizFlags.disableUnified()',
    runValidation: 'window.quizDebug.runValidation()',
    switchSystem: 'window.quizDebug.switchSystem()',
    resetState: 'window.quizDebug.resetState()',
  },
};

/**
 * 🎯 Função principal de inicialização
 */
export const initializeQuizSystem = async () => {
  const environment = (process.env.NODE_ENV as keyof typeof FEATURE_FLAGS) || 'development';
  const config = FEATURE_FLAGS[environment];

  console.log(`🚀 Inicializando sistema Quiz (${environment})`, config);

  // Configurar feature flags
  if (typeof window !== 'undefined') {
    const flags = { ...config };

    // Override via localStorage se disponível
    Object.keys(flags).forEach(key => {
      const override = localStorage.getItem(`flag_${key}`);
      if (override !== null) {
        flags[key as keyof typeof flags] = override === 'true';
      }
    });

    // Salvar configuração atual
    sessionStorage.setItem('quiz_active_config', JSON.stringify(flags));

    console.log('🎛️ Feature flags ativas:', flags);
  }

  return config;
};

/**
 * 🔧 Helpers para desenvolvimento
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).quizDebug = {
    config: FEATURE_FLAGS,
    rollout: ROLLOUT_CONFIG,
    cache: CACHE_CONFIG,

    // Quick actions
    enableUnified: () => localStorage.setItem('flag_USE_UNIFIED_QUIZ', 'true'),
    disableUnified: () => localStorage.setItem('flag_USE_UNIFIED_QUIZ', 'false'),
    clearCache: () => {
      Object.values(CACHE_CONFIG.STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
    },

    // System info
    getSystemInfo: () => ({
      environment: process.env.NODE_ENV,
      flags: JSON.parse(sessionStorage.getItem('quiz_active_config') || '{}'),
      cache: Object.fromEntries(
        Object.values(CACHE_CONFIG.STORAGE_KEYS).map(key => [
          key,
          localStorage.getItem(key) || sessionStorage.getItem(key),
        ])
      ),
    }),
  };

  console.log('🔧 Debug helpers disponíveis em window.quizDebug');
}

export default {
  FEATURE_FLAGS,
  ROLLOUT_CONFIG,
  SYSTEM_ENDPOINTS,
  CACHE_CONFIG,
  ANALYTICS_CONFIG,
  VALIDATION_CONFIG,
  DEV_CONFIG,
  initializeQuizSystem,
};

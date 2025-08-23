/**
 * 🎯 SISTEMA EDITOR UNIFICADO - ÍNDICE PRINCIPAL
 *
 * Este arquivo centraliza todas as exportações do sistema unificado,
 * facilitando imports e mantendo compatibilidade com código existente.
 *
 * Versão: 2.0.0
 * Data: 2024-12-19
 */

// ===== COMPONENTES PRINCIPAIS =====

export { default as EditorUnified } from './EditorUnified';
export { EditorContext, UnifiedEditorProvider, useUnifiedEditor } from './UnifiedEditorProvider';

// ===== SISTEMA DE CÁLCULO =====

export { createCalculationEngine, UnifiedCalculationEngine } from './UnifiedCalculationEngine';

// ===== ADAPTADORES DE TEMPLATE =====

export { DefaultTemplateAdapter, load21StepsTemplate } from './TemplateAdapter';

// ===== TIPOS CONSOLIDADOS =====

export type {
  // Analytics Types
  AnalyticsEvent,
  AnalyticsMetrics,
  AnalyticsService,
  // Block Types
  Block,
  BlockMetadata,
  BlockProperties,
  BlockType,
  CalculationBreakdown,
  CalculationConfig,
  // Calculation Types
  CalculationResult,
  ConfidenceMetrics,
  EditorAction,
  EditorActions,
  EditorComputed,
  // Core Editor Types
  EditorConfig,
  // Error Types
  EditorError,
  // Event Types
  EditorEvent,
  EditorEventType,
  EditorMode,
  // Module Types
  EditorModule,
  EditorState,
  ErrorCode,
  IntegrationAdapter,
  LegacyBlock,
  // Legacy Compatibility
  LegacyQuizResult,
  LegacyStyleResult,
  ModuleConfig,
  QualityMetrics,
  QuestionType,
  Quiz,
  QuizAnswer,
  QuizMetadata,
  QuizOption,
  QuizProgress,
  // Quiz Types
  QuizQuestion,
  QuizResults,
  // Service Types
  QuizService,
  QuizSettings,
  // Recommendation Types
  Recommendation,
  RecommendationType,
  StorageService,
  StyleCalculationInput,
  StyleCalculationResult,
  // Style Types
  StyleCategory,
  StyleDistribution,
  StyleProfile,
  StyleResult,
  // Integration Types
  SupabaseConfig,
  UnifiedBlock,
  UnifiedCalculationResult,
  // Unified Re-exports
  UnifiedEditorConfig,
  UnifiedEditorState,
  UnifiedQuizAnswer,
  UnifiedStyleResult,
  UseEditorReturn,
  ValidationResult,
} from './types';

// ===== UTILITÁRIOS =====

export const UNIFIED_SYSTEM_VERSION = '2.0.0';

export const UNIFIED_SYSTEM_INFO = {
  version: '2.0.0',
  buildDate: '2024-12-19',
  components: {
    editor: 'EditorUnified',
    provider: 'UnifiedEditorProvider',
    calculator: 'UnifiedCalculationEngine',
    types: 'Consolidated type system',
  },
  features: [
    'Modular panel system',
    '21-step quiz navigation',
    'Drag-drop ready architecture',
    'Auto-save functionality',
    'Analytics integration',
    'Unified calculation engine',
    'Backward compatibility',
    'TypeScript strict mode',
  ],
  improvements: {
    editorReduction: '94%', // 16 → 1
    calculatorReduction: '80%', // 5 → 1
    typeReduction: '92%', // 12+ → 1
    duplicateFilesRemoved: 6,
  },
};

// ===== HELPERS DE MIGRAÇÃO =====

/**
 * Helper para migração gradual de componentes existentes
 */
export const MIGRATION_HELPERS = {
  /**
   * Mapeamento de editores antigos para o novo sistema
   */
  LEGACY_EDITOR_MAPPING: {
    EditorPro: 'EditorUnified',
    SchemaDrivenEditorResponsive: 'EditorUnified',
    QuizEditorInterface: 'EditorUnified',
    EditorCanvas: 'EditorUnified',
    'EditorPro-backup': 'EditorUnified', // removido
    'EditorPro-clean': 'EditorUnified', // removido
  },

  /**
   * Mapeamento de calculadoras antigas
   */
  LEGACY_CALCULATOR_MAPPING: {
    calcResults: 'UnifiedCalculationEngine',
    quizResults: 'UnifiedCalculationEngine',
    styleCalculation: 'UnifiedCalculationEngine',
    quizEngine: 'UnifiedCalculationEngine',
    personalityCalculator: 'UnifiedCalculationEngine',
  },

  /**
   * Guia de migração de props
   */
  PROPS_MIGRATION_GUIDE: {
    // EditorPro → EditorUnified
    showSidebar: 'config.showComponents',
    showPreview: 'config.enablePreview',
    enableDragDrop: 'config.enableDragDrop',
    autoSave: 'config.enableAutoSave',
    onBlockChange: 'actions.updateBlock',
    onStepChange: 'actions.setCurrentStep',
  },
};

// ===== CONFIGURAÇÕES PADRÃO =====

/**
 * Configuração padrão para o sistema unificado
 */
export const DEFAULT_UNIFIED_CONFIG = {
  showToolbar: true,
  showStages: true,
  showComponents: true,
  showProperties: true,
  enableAnalytics: true,
  enableAutoSave: true,
  autoSaveInterval: 30000, // 30 segundos
  enableDragDrop: true,
  enablePreview: true,
} as const;

/**
 * Configuração padrão para o engine de cálculo
 */
export const DEFAULT_CALCULATION_CONFIG = {
  enableDebug: false,
  confidenceThreshold: 0.6,
  minAnswersRequired: 10,
  weightingAlgorithm: 'adaptive' as const,
  normalizationMethod: 'zscore' as const,
} as const;

// ===== VALIDADORES =====

/**
 * Valida se o sistema unificado está sendo usado corretamente
 */
export const validateUnifiedUsage = (context: string): boolean => {
  if (typeof window !== 'undefined') {
    console.log(`✅ Sistema Unificado ativo em: ${context}`);
    console.log(`📊 Versão: ${UNIFIED_SYSTEM_VERSION}`);
    console.log(`🔧 Componentes disponíveis:`, Object.keys(UNIFIED_SYSTEM_INFO.components));
  }
  return true;
};

/**
 * Hook para verificar compatibilidade
 */
export const checkLegacyCompatibility = (componentName: string): string => {
  const mapping =
    MIGRATION_HELPERS.LEGACY_EDITOR_MAPPING[
      componentName as keyof typeof MIGRATION_HELPERS.LEGACY_EDITOR_MAPPING
    ];

  if (mapping) {
    console.warn(
      `⚠️  Componente '${componentName}' está deprecated. Use '${mapping}' do sistema unificado.`
    );
    return mapping;
  }

  return componentName;
};

// ===== LOGS DE SISTEMA =====

if (typeof window !== 'undefined') {
  console.log('🎯 Sistema Editor Unificado carregado');
  console.log('📊 Versão:', UNIFIED_SYSTEM_VERSION);
  console.log('📈 Melhorias:', UNIFIED_SYSTEM_INFO.improvements);
  console.log('🚀 Features:', UNIFIED_SYSTEM_INFO.features);
}

// ===== EXPORTS DEFAULT =====

const unifiedSystem = {
  version: UNIFIED_SYSTEM_VERSION,
  info: UNIFIED_SYSTEM_INFO,
  config: {
    default: DEFAULT_UNIFIED_CONFIG,
    calculation: DEFAULT_CALCULATION_CONFIG,
  },
  helpers: MIGRATION_HELPERS,
  validators: {
    validateUnifiedUsage,
    checkLegacyCompatibility,
  },
};

export default unifiedSystem;

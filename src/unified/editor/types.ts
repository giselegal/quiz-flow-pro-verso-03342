/**
 * 🎯 UNIFIED TYPES - Sistema de Tipos Unificado
 *
 * Este arquivo centraliza todos os tipos necessários para o sistema unificado,
 * consolidando interfaces que estavam espalhadas em múltiplos arquivos.
 */

// ===== CORE EDITOR TYPES =====

export interface EditorConfig {
  showToolbar?: boolean;
  showStages?: boolean;
  showComponents?: boolean;
  showProperties?: boolean;
  enableAnalytics?: boolean;
  enableAutoSave?: boolean;
  autoSaveInterval?: number;
  enableDragDrop?: boolean;
  enablePreview?: boolean;
}

export interface EditorState {
  currentStep: number;
  selectedBlockId: string | null;
  blocks: Record<string, Block[]>;
  mode: EditorMode;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  lastSaved?: Date;
}

export type EditorMode = 'edit' | 'preview' | 'interactive';

export interface EditorAction {
  type: string;
  payload?: any;
  meta?: {
    timestamp: Date;
    user?: string;
    step?: number;
  };
}

// ===== BLOCK TYPES =====

export interface Block {
  id: string;
  type: BlockType;
  properties: BlockProperties;
  order: number;
  parentId?: string;
  children?: string[];
  metadata?: BlockMetadata;
}

export type BlockType =
  | 'text'
  | 'image'
  | 'button'
  | 'input'
  | 'select'
  | 'quiz-question'
  | 'quiz-option'
  | 'result-display'
  | 'progress-bar'
  | 'section'
  | 'container'
  | 'spacer';

export interface BlockProperties {
  [key: string]: any;
  // Propriedades comuns
  className?: string;
  style?: React.CSSProperties;
  visible?: boolean;
  disabled?: boolean;
  // Propriedades específicas por tipo
  content?: string;
  src?: string;
  alt?: string;
  href?: string;
  target?: string;
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string; weight?: number }>;
}

export interface BlockMetadata {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  version: number;
  tags?: string[];
  description?: string;
}

// ===== TEMPLATE ADAPTER TYPES =====

/**
 * Adaptador para converter o formato legacy de template para o formato do sistema unificado
 * @param legacyTemplate Template no formato legacy (Record<string, Block[]>)
 * @returns Template no formato do sistema unificado (Record<string, Block[]>)
 */
export interface TemplateAdapter {
  convertToUnifiedFormat(legacyTemplate: Record<string, any[]>): Record<string, Block[]>;
  convertFromUnifiedFormat(unifiedTemplate: Record<string, Block[]>): Record<string, any[]>;
}

export interface LegacyTemplateBlock {
  id: string;
  type: string;
  order: number;
  content?: any;
  properties?: any;
}

export interface IntegrationAdapter {
  importTemplate(source: string, template: any): Promise<EditorState>;
  exportTemplate(state: EditorState, format: string): Promise<any>;
  validateTemplate(template: any): boolean;
}

// ===== QUIZ TYPES =====

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  options: QuizOption[];
  required?: boolean;
  multiSelect?: boolean;
  maxSelections?: number;
  minSelections?: number;
  scoring?: boolean;
  order: number;
  stepNumber: number;
}

export type QuestionType =
  | 'single-choice'
  | 'multiple-choice'
  | 'text-input'
  | 'scale'
  | 'ranking'
  | 'matrix';

export interface QuizOption {
  id: string;
  label: string;
  value: string;
  weight?: number;
  styleCategory?: StyleCategory;
  icon?: string;
  description?: string;
  order: number;
}

export interface QuizAnswer {
  questionId: string;
  optionId: string | string[];
  value?: string | number;
  timestamp: Date;
  weights?: Record<string, number>;
  step?: number;
  type?: string;
  answeredAt?: Date;
}

// ===== STYLE TYPES =====

export type StyleCategory =
  | 'Clássico'
  | 'Romântico'
  | 'Dramático'
  | 'Natural'
  | 'Criativo'
  | 'Contemporâneo'
  | 'Elegante'
  | 'Sexy';

export interface StyleResult {
  style: StyleCategory;
  category: StyleCategory; // alias for backward compatibility
  score: number;
  percentage: number;
  points: number; // alias for score
  rank: number;
  confidence?: number;
}

export interface StyleProfile {
  primaryStyle: StyleResult;
  secondaryStyles: StyleResult[];
  totalScore: number;
  distribution: Record<StyleCategory, number>;
  confidence: number;
  metadata: {
    algorithm: string;
    version: string;
    calculatedAt: Date;
  };
}

// ===== CALCULATION TYPES =====

export interface StyleDistribution {
  Analista: number;
  Diretor: number;
  Relacional: number;
  Expressivo: number;
}

export interface ConfidenceMetrics {
  overall: number;
  separation: number;
  consistency: number;
  sampleSize: number;
  factors: {
    dataQuality: 'high' | 'medium' | 'low';
    sampleAdequacy: 'sufficient' | 'limited';
    styleClarity: 'clear' | 'moderate' | 'unclear';
  };
}

export interface QuizResults {
  userId: string;
  quizId: string;
  answers: QuizAnswer[];
  primaryStyle: string;
  secondaryStyle: string | null;
  styleScores: StyleDistribution;
  confidence: number;
  insights: string[];
  completedAt: Date;
  metadata: {
    version: string;
    engine: string;
    processingTime: number;
  };
}

export interface CalculationConfig {
  enableDebug: boolean;
  confidenceThreshold: number;
  minAnswersRequired: number;
  weightingAlgorithm: 'basic' | 'adaptive' | 'weighted';
  normalizationMethod: 'zscore' | 'minmax' | 'none';
}

export interface StyleCalculationInput {
  answers: Array<{
    value: any;
    type?: string;
  }>;
}

export interface StyleCalculationResult {
  primaryStyle: string;
  percentage: number;
  confidence: number;
  distribution: StyleDistribution;
}

export interface CalculationEngine {
  version: string;
  computeResults(answers: QuizAnswer[]): CalculationResult;
  validateAnswers(answers: QuizAnswer[]): ValidationResult;
  getStyleProfile(answers: QuizAnswer[]): StyleProfile;
}

export interface CalculationResult {
  styleProfile: StyleProfile;
  distributions?: StyleDistribution;
  confidence?: ConfidenceMetrics;
  insights?: string[];
  quizResults?: QuizResults;
  rawScores: Record<StyleCategory, number>;
  normalizedScores: Record<StyleCategory, number>;
  quality: QualityMetrics;
  breakdown: CalculationBreakdown;
  recommendations?: Recommendation[];
  metadata?: {
    calculatedAt: Date;
    version: string;
    engine: string;
    totalAnswers: number;
    processingTime: number;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  completeness: number;
}

export interface QualityMetrics {
  completeness: number; // % of questions answered
  consistency: number; // consistency of answers
  confidence: number; // confidence in result
  reliability: number; // reliability score
}

export interface CalculationBreakdown {
  totalQuestions: number;
  answeredQuestions: number;
  scoringQuestions: number;
  totalResponses: number;
  validResponses: number;
  invalidResponses: number;
  styleDistribution: Record<
    StyleCategory,
    {
      score: number;
      percentage: number;
      responseCount: number;
    }
  >;
}

// ===== SERVICE TYPES =====

export interface QuizService {
  loadQuiz(quizId: string): Promise<Quiz>;
  saveAnswer(answer: QuizAnswer): Promise<void>;
  calculateResults(answers: QuizAnswer[]): Promise<CalculationResult>;
  getProgress(sessionId: string): Promise<QuizProgress>;
}

export interface StorageService {
  save(key: string, data: any): Promise<void>;
  load(key: string): Promise<any>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}

export interface AnalyticsService {
  track(event: AnalyticsEvent): Promise<void>;
  trackPageView(page: string, properties?: any): Promise<void>;
  trackQuizStep(step: number, properties?: any): Promise<void>;
  trackQuizCompletion(results: CalculationResult): Promise<void>;
}

// ===== ANALYTICS TYPES =====

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: Date;
  userId?: string;
  sessionId?: string;
}

export interface AnalyticsMetrics {
  totalUsers: number;
  completionRate: number;
  averageTimeSpent: number;
  dropoffRates: Record<number, number>;
  styleDistribution: Record<StyleCategory, number>;
}

// ===== RECOMMENDATION TYPES =====

export interface Recommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  confidence: number;
  priority: number;
  category?: string;
  data?: any;
}

export type RecommendationType =
  | 'product'
  | 'style-tip'
  | 'color-palette'
  | 'outfit'
  | 'brand'
  | 'content';

// ===== INTEGRATION TYPES =====

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  tables: {
    quizSessions: string;
    quizAnswers: string;
    quizResults: string;
    analytics: string;
  };
}

export interface IntegrationAdapter {
  name: string;
  version: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
}

// ===== UTILITY TYPES =====

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  settings: QuizSettings;
  metadata: QuizMetadata;
}

export interface QuizSettings {
  allowBackNavigation: boolean;
  showProgressBar: boolean;
  autoAdvance: boolean;
  timeLimit?: number;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
}

export interface QuizMetadata {
  version: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  tags?: string[];
  totalSteps: number;
}

export interface QuizProgress {
  sessionId: string;
  currentStep: number;
  completedSteps: number[];
  answers: QuizAnswer[];
  startedAt: Date;
  lastActivityAt: Date;
  isCompleted: boolean;
}

// ===== EVENT TYPES =====

export interface EditorEvent {
  type: EditorEventType;
  data?: any;
  timestamp: Date;
  source: string;
}

export type EditorEventType =
  | 'block-added'
  | 'block-updated'
  | 'block-deleted'
  | 'block-selected'
  | 'step-changed'
  | 'mode-changed'
  | 'save-triggered'
  | 'preview-opened'
  | 'calculation-started'
  | 'calculation-completed'
  | 'error-occurred';

// ===== HOOK TYPES =====

export interface UseEditorReturn {
  state: EditorState;
  actions: EditorActions;
  computed: EditorComputed;
}

export interface EditorActions {
  // Step management
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Block management
  addBlock: (type: BlockType, properties?: BlockProperties) => Promise<string>;
  updateBlock: (blockId: string, updates: Partial<Block>) => Promise<void>;
  deleteBlock: (blockId: string) => Promise<void>;
  selectBlock: (blockId: string | null) => void;
  reorderBlocks: (blockIds: string[]) => Promise<void>;

  // State management
  setMode: (mode: EditorMode) => void;
  save: () => Promise<void>;
  load: (data: any) => Promise<void>;
  reset: () => void;

  // Calculations
  calculateResults: () => Promise<CalculationResult>;

  // Analytics
  trackEvent: (event: AnalyticsEvent) => Promise<void>;
}

export interface EditorComputed {
  currentStep: number;
  currentStepBlocks: Block[];
  selectedBlock: Block | null;
  totalBlocks: number;
  hasUnsavedChanges: boolean;
  canGoNext: boolean;
  canGoPrevious: boolean;
  progress: number;
}

// ===== ERROR TYPES =====

export interface EditorError extends Error {
  code: string;
  context?: any;
  recoverable: boolean;
}

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'CALCULATION_ERROR'
  | 'STORAGE_ERROR'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

// ===== MODULE TYPES =====

export interface EditorModule {
  name: string;
  version: string;
  dependencies?: string[];
  initialize(): Promise<void>;
  destroy(): Promise<void>;
  render(): React.ReactNode;
}

export interface ModuleConfig {
  enabled: boolean;
  settings?: Record<string, any>;
  order?: number;
}

// ===== LEGACY COMPATIBILITY =====

// Mantém compatibilidade com tipos existentes
export type LegacyQuizResult = CalculationResult;
export type LegacyStyleResult = StyleResult;
export type LegacyBlock = Block;

// Re-exports para facilitar migração
export type {
  Block as UnifiedBlock,
  CalculationResult as UnifiedCalculationResult,
  EditorConfig as UnifiedEditorConfig,
  EditorState as UnifiedEditorState,
  QuizAnswer as UnifiedQuizAnswer,
  StyleResult as UnifiedStyleResult,
};

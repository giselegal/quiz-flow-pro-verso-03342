/**
 * 🏗️ CORE FUNNEL TYPES
 * 
 * Tipos centralizados para o sistema de funis
 * Separados da lógica de quiz para melhor organização
 */

// ============================================================================
// INTERFACES BÁSICAS DE FUNIL
// ============================================================================

export interface FunnelId {
    id: string;
    type: 'template' | 'instance' | 'draft';
    timestamp?: number;
}

export interface FunnelMetadata {
    id: string;
    name: string;
    description?: string;
    category: string;
    theme: string;
    version: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: string;
    isPublished: boolean;
    isOfficial: boolean;
}

export interface FunnelSettings {
    autoSave: boolean;
    autoAdvance: boolean;
    progressTracking: boolean;
    analytics: boolean;
    theme: FunnelTheme;
    navigation: FunnelNavigation;
    validation: FunnelValidation;
}

export interface FunnelTheme {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    borderRadius: string;
    spacing: string;
    layout: 'centered' | 'full-width' | 'sidebar';
}

export interface FunnelNavigation {
    showProgress: boolean;
    showStepNumbers: boolean;
    allowBackward: boolean;
    showNavigationButtons: boolean;
    autoAdvanceDelay: number;
}

export interface FunnelValidation {
    strictMode: boolean;
    requiredFields: string[];
    customValidators: Record<string, ValidationRule>;
}

export interface ValidationRule {
    type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
    value?: any;
    message: string;
    validator?: (value: any) => boolean;
}

// ============================================================================
// ESTRUTURA DE ETAPAS E COMPONENTES
// ============================================================================

export interface FunnelStep {
    id: string;
    name: string;
    description?: string;
    order: number;
    type: FunnelStepType;
    isRequired: boolean;
    isVisible: boolean;
    conditions?: StepCondition[];
    components: FunnelComponent[];
    settings: StepSettings;
}

export type FunnelStepType =
    | 'intro'
    | 'question'
    | 'form'
    | 'result'
    | 'transition'
    | 'custom';

/**
 * Direções de navegação no funil
 */
export type NavigationDirection =
    | 'forward'
    | 'backward'
    | 'first'
    | 'last';

export interface StepCondition {
    type: 'always' | 'if' | 'unless';
    field?: string;
    operator?: 'equals' | 'contains' | 'greater' | 'less';
    value?: any;
}

export interface StepSettings {
    autoAdvance: boolean;
    autoAdvanceDelay: number;
    showProgress: boolean;
    allowSkip: boolean;
    validation: StepValidation;
}

export interface StepValidation {
    required: boolean;
    minSelections?: number;
    maxSelections?: number;
    customRules?: ValidationRule[];
}

export interface FunnelComponent {
    id: string;
    type: string;
    order: number;
    isVisible: boolean;
    content: Record<string, any>;
    properties: Record<string, any>;
    styling: Record<string, any>;
    conditions?: ComponentCondition[];
}

export interface ComponentCondition {
    type: 'show' | 'hide' | 'require' | 'disable';
    when: 'always' | 'if' | 'unless';
    field?: string;
    operator?: string;
    value?: any;
}

// ============================================================================
// ESTADO E FLUXO DE FUNIL
// ============================================================================

export interface FunnelState {
    id: string;
    metadata: FunnelMetadata;
    settings: FunnelSettings;
    steps: FunnelStep[];
    currentStep: string;
    completedSteps: string[];
    userData: Record<string, any>;
    progress: FunnelProgress;
    navigation: NavigationState;
    validation: ValidationState;
    status: FunnelStatus;
    isLoading?: boolean;
    loadingMessage?: string;
    error?: FunnelError | null;
    completedAt?: number;
}

export interface FunnelProgress {
    currentStepIndex: number;
    totalSteps: number;
    completedSteps: number;
    percentage: number;
    estimatedTimeRemaining?: number;
}

export interface NavigationState {
    canGoForward: boolean;
    canGoBackward: boolean;
    nextStep?: string;
    previousStep?: string;
    history: string[];
    direction?: NavigationDirection;
}

export interface ValidationState {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    currentStepValid: boolean;
}

export interface ValidationError {
    stepId: string;
    componentId?: string;
    field: string;
    message: string;
    type: string;
}

export interface ValidationWarning {
    stepId: string;
    componentId?: string;
    message: string;
    type: string;
}

// ============================================================================
// TEMPLATES E CONFIGURAÇÃO
// ============================================================================

export interface FunnelTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    theme: string;
    stepCount: number;
    isOfficial: boolean;
    usageCount: number;
    tags: string[];
    thumbnailUrl?: string;
    templateData: FunnelTemplateData;
    components: any[];
    createdAt: string;
    updatedAt: string;
}

export interface FunnelTemplateData {
    metadata: Omit<FunnelMetadata, 'id' | 'createdAt' | 'updatedAt'>;
    settings: FunnelSettings;
    steps: Omit<FunnelStep, 'id'>[];
}

export interface TemplateCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    templateCount: number;
}

// ============================================================================
// EVENTOS E AÇÕES
// ============================================================================

export interface FunnelEvent {
    type: FunnelEventType;
    timestamp: number;
    funnelId?: string;
    stepId?: string;
    componentId?: string;
    data?: Record<string, any>;
    userId?: string;
    sessionId?: string;
    payload?: any;
}

export type FunnelEventType =
    | 'funnel_started'
    | 'funnel_completed'
    | 'funnel_abandoned'
    | 'step_entered'
    | 'step_completed'
    | 'step_skipped'
    | 'component_interacted'
    | 'validation_failed'
    | 'navigation_occurred'
    | 'data_updated'
    | 'step-complete'
    | 'step-change'
    | 'data-update'
    | 'state-change'
    | 'initialize'
    | 'complete'
    | 'pause'
    | 'resume'
    | 'reset'
    | 'error';

export interface FunnelAction {
    type: FunnelActionType;
    payload?: any;
    meta?: Record<string, any>;
}

export type FunnelActionType =
    | 'INIT_FUNNEL'
    | 'SET_CURRENT_STEP'
    | 'NAVIGATE_FORWARD'
    | 'NAVIGATE_BACKWARD'
    | 'UPDATE_USER_DATA'
    | 'VALIDATE_STEP'
    | 'COMPLETE_STEP'
    | 'SAVE_PROGRESS'
    | 'LOAD_PROGRESS'
    | 'RESET_FUNNEL'
    | 'navigate'
    | 'update-user-data'
    | 'complete-step'
    | 'set-loading'
    | 'set-error'
    | 'reset'
    | 'update-settings';

// ============================================================================
// CONFIGURAÇÕES DE PERSISTÊNCIA
// ============================================================================

export interface FunnelPersistenceConfig {
    enabled: boolean;
    storage: 'local' | 'session' | 'supabase' | 'custom';
    autoSave: boolean;
    autoSaveInterval: number;
    compression: boolean;
    encryption: boolean;
}

export interface FunnelAnalyticsConfig {
    enabled: boolean;
    trackingId?: string;
    events: FunnelEventType[];
    customEvents: Record<string, any>;
    realTime: boolean;
}

// ============================================================================
// TIPOS DE RESULTADO E EXPORT/IMPORT
// ============================================================================

export interface FunnelResult {
    funnelId: string;
    userId?: string;
    sessionId: string;
    completedAt: string;
    data: Record<string, any>;
    analytics: FunnelAnalytics;
    metadata: Record<string, any>;
}

export interface FunnelAnalytics {
    totalTime: number;
    stepTimes: Record<string, number>;
    interactions: number;
    validationErrors: number;
    abandonment?: {
        stepId: string;
        reason?: string;
        timestamp: number;
    };
}

export interface FunnelExportData {
    funnel: FunnelState;
    results?: FunnelResult[];
    analytics?: FunnelAnalytics;
    version: string;
    exportedAt: string;
}

// ============================================================================
// TIPOS DE ERRO E STATUS
// ============================================================================

export interface FunnelError {
    code: string;
    message: string;
    stepId?: string;
    componentId?: string;
    details?: Record<string, any>;
    timestamp: number;
}

export type FunnelStatus =
    | 'idle'
    | 'loading'
    | 'ready'
    | 'in_progress'
    | 'completed'
    | 'error'
    | 'saving'
    | 'validating'
    | 'active'
    | 'paused';

// ============================================================================
// HOOKS E CONTEXT TYPES
// ============================================================================

export interface FunnelContextValue {
    state: FunnelState;
    status: FunnelStatus;
    error?: FunnelError;

    // Actions
    initFunnel: (templateId: string, config?: Partial<FunnelSettings>) => Promise<void>;
    navigateToStep: (stepId: string) => Promise<void>;
    navigateForward: () => Promise<void>;
    navigateBackward: () => Promise<void>;
    updateUserData: (data: Record<string, any>) => void;
    validateCurrentStep: () => Promise<boolean>;
    completeStep: (stepId: string) => Promise<void>;
    saveFunnel: () => Promise<void>;
    resetFunnel: () => void;

    // Utilities
    getCurrentStep: () => FunnelStep | undefined;
    getStepById: (stepId: string) => FunnelStep | undefined;
    isStepCompleted: (stepId: string) => boolean;
    canNavigateForward: () => boolean;
    canNavigateBackward: () => boolean;
}

export interface UseFunnelOptions {
    funnelId?: string;
    templateId?: string;
    autoInit?: boolean;
    persistence?: FunnelPersistenceConfig;
    analytics?: FunnelAnalyticsConfig;
    onError?: (error: FunnelError) => void;
    onStepChange?: (stepId: string) => void;
    onComplete?: (result: FunnelResult) => void;
}

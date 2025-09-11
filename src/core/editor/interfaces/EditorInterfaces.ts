/**
 * 🎨 INTERFACES DO SISTEMA DE EDITOR DESACOPLADO
 * 
 * Define todas as interfaces para permitir editor de funis completamente
 * desacoplado do contexto da aplicação, permitindo testabilidade e reuso
 */

// ============================================================================
// TIPOS BÁSICOS
// ============================================================================

export type EditorMode = 'edit' | 'preview' | 'readonly';
export type EditorPageType = 'intro' | 'question' | 'result' | 'custom';

export interface EditorBlockContent {
    text?: string;
    html?: string;
    image?: string;
    video?: string;
    question?: EditorQuestionData;
    [key: string]: any;
}

export interface EditorQuestionData {
    text: string;
    type: 'multiple-choice' | 'single-choice' | 'text-input' | 'number-input' | 'rating' | 'boolean';
    options?: string[];
    required?: boolean;
    validation?: {
        min?: number;
        max?: number;
        pattern?: string;
        message?: string;
    };
}

// ============================================================================
// ESTRUTURA DE DADOS
// ============================================================================

export interface EditorBlockData {
    id: string;
    type: string;
    content: EditorBlockContent;
    style: Record<string, any>;
    position: { x: number; y: number };
    size: { width: number; height: number };
    order: number;
    metadata: {
        createdAt: Date;
        updatedAt: Date;
    };
}

export interface EditorPageSettings {
    title: string;
    description: string;
    showProgressBar: boolean;
    allowSkip: boolean;
    autoAdvance: boolean;
    timeLimit?: number;
    background: {
        type: 'color' | 'image' | 'gradient';
        value: string;
    };
}

export interface EditorPageData {
    id: string;
    name: string;
    type: EditorPageType;
    blocks: EditorBlockData[];
    settings: EditorPageSettings;
    transitions: {
        next?: string;
        previous?: string;
        conditions?: Array<{
            condition: string;
            target: string;
        }>;
    };
    metadata: {
        createdAt: Date;
        updatedAt: Date;
        order: number;
    };
}

export interface EditorTheme {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
    borderRadius: string;
    spacing: 'compact' | 'normal' | 'spacious';
}

export interface EditorNavigation {
    showProgress: boolean;
    showStepNumbers: boolean;
    allowBackward: boolean;
    autoAdvance: boolean;
}

export interface EditorFunnelSettings {
    theme: EditorTheme;
    navigation: EditorNavigation;
    autoSave: boolean;
    previewMode: boolean;
}

export interface EditorFunnelMetadata {
    createdAt: Date;
    updatedAt: Date;
    version: number;
    isPublished: boolean;
    lastSavedBy?: string;
    tags: string[];
    category: string;
}

export interface EditorFunnelData {
    id: string;
    name: string;
    description: string;
    pages: EditorPageData[];
    settings: EditorFunnelSettings;
    metadata: EditorFunnelMetadata;
}

// ============================================================================
// PROVIDERS E SERVIÇOS
// ============================================================================

export interface EditorSaveResult {
    success: boolean;
    timestamp: Date;
    version: number;
    error?: string;
}

export interface EditorListOptions {
    limit?: number;
    offset?: number;
    category?: string;
    published?: boolean;
    sortBy?: 'name' | 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
}

export interface EditorFunnelSummary {
    id: string;
    name: string;
    description: string;
    pageCount: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
    category: string;
    tags: string[];
}

export interface EditorDataProvider {
    loadFunnel(id: string): Promise<EditorFunnelData | null>;
    saveFunnel(data: EditorFunnelData): Promise<EditorSaveResult>;
    listFunnels(options?: EditorListOptions): Promise<EditorFunnelSummary[]>;
    createFunnel(data: Partial<EditorFunnelData>): Promise<EditorFunnelData>;
    deleteFunnel(id: string): Promise<boolean>;
    duplicateFunnel(id: string, newName: string): Promise<EditorFunnelData>;
}

export interface EditorTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    preview: string;
    data: Partial<EditorFunnelData>;
}

export interface EditorTemplateProvider {
    getAvailableTemplates(category?: string): Promise<EditorTemplate[]>;
    getTemplate(id: string): Promise<EditorTemplate | null>;
    createFromTemplate(templateId: string, name: string): Promise<EditorFunnelData>;
}

export interface EditorValidationResult {
    isValid: boolean;
    errors: string[];
    warnings?: string[];
}

export interface EditorValidator {
    validateFunnel(data: EditorFunnelData): Promise<EditorValidationResult>;
    validatePage(page: EditorPageData): Promise<EditorValidationResult>;
    validateBlock(block: EditorBlockData): Promise<EditorValidationResult>;
}

export interface EditorEventHandler {
    onFunnelLoad?: (data: EditorFunnelData) => void;
    onFunnelSave?: (data: EditorFunnelData) => void;
    onFunnelChange?: (data: EditorFunnelData) => void;
    onPageAdd?: (page: EditorPageData) => void;
    onPageRemove?: (pageId: string) => void;
    onPageReorder?: (fromIndex: number, toIndex: number) => void;
    onBlockAdd?: (pageId: string, block: EditorBlockData) => void;
    onBlockRemove?: (pageId: string, blockId: string) => void;
    onBlockUpdate?: (pageId: string, blockId: string, block: EditorBlockData) => void;
    onModeChange?: (mode: EditorMode) => void;
}

// ============================================================================
// CONFIGURAÇÃO DO EDITOR
// ============================================================================

export interface EditorFeatures {
    canAddPages: boolean;
    canRemovePages: boolean;
    canReorderPages: boolean;
    canEditBlocks: boolean;
    canPreview: boolean;
    canPublish: boolean;
    canDuplicate: boolean;
    canExport: boolean;
}

export interface EditorAutoSave {
    enabled: boolean;
    interval: number;
    onUserInput: boolean;
    showIndicator: boolean;
}

export interface EditorValidation {
    realTime: boolean;
    onSave: boolean;
    showWarnings: boolean;
    strictMode: boolean;
}

export interface EditorUIConfig {
    theme: 'light' | 'dark' | 'auto';
    layout: 'sidebar' | 'tabs' | 'compact';
    showMinimap: boolean;
    showGridlines: boolean;
    showRulers: boolean;
}

export interface EditorConfig {
    mode: EditorMode;
    features: EditorFeatures;
    autoSave: EditorAutoSave;
    validation: EditorValidation;
    ui: EditorUIConfig;
}

// ============================================================================
// ESTADO DO EDITOR
// ============================================================================

export interface EditorSaveStatus {
    saved: boolean;
    saving: boolean;
    lastSaved: Date | null;
    hasChanges: boolean;
    autoSaveEnabled: boolean;
}

export interface EditorHistory {
    past: EditorFunnelData[];
    present: EditorFunnelData | null;
    future: EditorFunnelData[];
    canUndo: boolean;
    canRedo: boolean;
}

export interface EditorValidationStatus {
    valid: boolean;
    errors: string[];
    warnings?: string[];
}

export interface EditorState {
    funnel: EditorFunnelData | null;
    mode: EditorMode;
    selectedPageId: string | null;
    selectedBlockId: string | null;
    isLoading: boolean;
    isSaving: boolean;
    hasUnsavedChanges: boolean;
    validationErrors: string[];
    autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error';
    // Novos campos para sistema completo
    saveStatus: EditorSaveStatus;
    history: EditorHistory;
    validation: EditorValidationStatus;
    loading: boolean;
    error: string | null;
}

export type EditorAction =
    | { type: 'LOAD_FUNNEL_START' }
    | { type: 'LOAD_FUNNEL_SUCCESS'; payload: EditorFunnelData }
    | { type: 'LOAD_FUNNEL_ERROR'; payload: string }
    | { type: 'SAVE_FUNNEL_START' }
    | { type: 'SAVE_FUNNEL_SUCCESS'; payload: { timestamp: Date; version: number } }
    | { type: 'SAVE_FUNNEL_ERROR'; payload: string }
    | { type: 'UPDATE_FUNNEL_DATA'; payload: Partial<EditorFunnelData> }
    | { type: 'SET_MODE'; payload: EditorMode }
    | { type: 'SELECT_PAGE'; payload: string | null }
    | { type: 'SELECT_BLOCK'; payload: string | null }
    | { type: 'ADD_PAGE'; payload: EditorPageData }
    | { type: 'REMOVE_PAGE'; payload: string }
    | { type: 'REORDER_PAGES'; payload: { fromIndex: number; toIndex: number } }
    | { type: 'UPDATE_PAGE'; payload: { pageId: string; updates: Partial<EditorPageData> } }
    | { type: 'ADD_BLOCK'; payload: { pageId: string; block: EditorBlockData } }
    | { type: 'REMOVE_BLOCK'; payload: { pageId: string; blockId: string } }
    | { type: 'UPDATE_BLOCK'; payload: { pageId: string; blockId: string; updates: Partial<EditorBlockData> } }
    | { type: 'SET_VALIDATION_ERRORS'; payload: string[] }
    | { type: 'CLEAR_VALIDATION_ERRORS' }
    | { type: 'SET_AUTO_SAVE_STATUS'; payload: 'idle' | 'saving' | 'saved' | 'error' }
    // Novas ações para sistema completo
    | { type: 'LOAD_FUNNEL'; payload: { id: string } }
    | { type: 'LOAD_FUNNEL_SUCCESS'; payload: { funnel: EditorFunnelData } }
    | { type: 'LOAD_FUNNEL_ERROR'; payload: { error: string } }
    | { type: 'SAVE_FUNNEL'; payload: { funnel: EditorFunnelData } }
    | { type: 'SAVE_FUNNEL_SUCCESS'; payload: { result: EditorSaveResult } }
    | { type: 'SAVE_FUNNEL_ERROR'; payload: { error: string } }
    | { type: 'UPDATE_FUNNEL'; payload: { funnel: Partial<EditorFunnelData> } }
    | { type: 'SELECT_PAGE'; payload: { pageId: string } }
    | { type: 'SELECT_BLOCK'; payload: { blockId: string } }
    | { type: 'SET_MODE'; payload: { mode: EditorMode } }
    | { type: 'UNDO' }
    | { type: 'REDO' }
    | { type: 'VALIDATE'; payload: { result: EditorValidationStatus } };

// ============================================================================
// PROPS DOS COMPONENTES
// ============================================================================

export interface EditorPagePanelProps {
    pages: EditorPageData[];
    selectedPageId?: string;
    onPageSelect: (pageId: string) => void;
    onPageAdd: (type: EditorPageType) => void;
    onPageRemove: (pageId: string) => void;
    onPageReorder: (fromIndex: number, toIndex: number) => void;
    onPageDuplicate: (pageId: string) => void;
    canEdit: boolean;
}

export interface EditorPropertiesPanelProps {
    selectedBlock?: EditorBlockData;
    selectedPage?: EditorPageData;
    onBlockUpdate: (blockId: string, properties: Record<string, any>) => void;
    onPageUpdate: (pageId: string, settings: EditorPageSettings) => void;
    onStyleUpdate: (targetId: string, styles: Record<string, any>) => void;
}

export interface EditorCanvasProps {
    page: EditorPageData | null;
    selectedBlockId?: string;
    onBlockSelect: (blockId: string | null) => void;
    onBlockUpdate: (blockId: string, updates: Partial<EditorBlockData>) => void;
    onBlockAdd: (block: EditorBlockData) => void;
    onBlockRemove: (blockId: string) => void;
    onBlockReorder: (fromIndex: number, toIndex: number) => void;
    canEdit: boolean;
    showGridlines: boolean;
    showRulers: boolean;
}

export interface EditorToolbarProps {
    mode: EditorMode;
    canSave: boolean;
    canUndo: boolean;
    canRedo: boolean;
    isAutoSaving: boolean;
    hasUnsavedChanges: boolean;
    onSave: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onModeChange: (mode: EditorMode) => void;
    onPreview: () => void;
    onPublish: () => void;
    onExport: () => void;
    features: EditorFeatures;
}

export interface EditorProps {
    funnelId?: string;
    initialData?: EditorFunnelData;
    dataProvider: EditorDataProvider;
    templateProvider?: EditorTemplateProvider;
    validator?: EditorValidator;
    eventHandler?: EditorEventHandler;
    metricsProvider?: EditorMetricsProvider;
    config?: Partial<EditorConfig>;
    onSave?: (data: EditorFunnelData) => void;
    onChange?: (data: EditorFunnelData) => void;
    onError?: (error: string) => void;
    onLoad?: (data: EditorFunnelData) => void;
    onModeChange?: (mode: EditorMode) => void;
}

// ============================================================================
// UTILITÁRIOS E HELPERS
// ============================================================================

export interface EditorUtils {
    generateId(): string;
    isValidFunnelData(data: any): data is EditorFunnelData;
    createEmptyFunnel(name: string): EditorFunnelData;
    createEmptyPage(type: EditorPageType): EditorPageData;
    createEmptyBlock(type: string): EditorBlockData;
    createTextBlock(text: string): EditorBlockData;
    createQuestionBlock(question: string, type: EditorQuestionData['type']): EditorBlockData;
    deepClone<T>(data: T): T;
    hasChanges(current: EditorFunnelData, previous: EditorFunnelData): boolean;
}

export interface EditorMockDataProvider extends EditorDataProvider {
    setMockData(funnels: EditorFunnelData[]): void;
    getMockData(): EditorFunnelData[];
    simulateError(operation: keyof EditorDataProvider, error: string): void;
    simulateDelay(operation: keyof EditorDataProvider, delay: number): void;
}

// ============================================================================
// SISTEMA DE MÉTRICAS E OBSERVABILIDADE
// ============================================================================

export type EditorMetricType =
    | 'load_time'
    | 'save_time'
    | 'validation_time'
    | 'render_time'
    | 'operation_time'
    | 'error_count'
    | 'success_count'
    | 'fallback_count'
    | 'memory_usage'
    | 'bundle_size'
    | 'interaction_count';

export type EditorOperationType =
    | 'load_funnel'
    | 'save_funnel'
    | 'validate_funnel'
    | 'add_page'
    | 'remove_page'
    | 'add_block'
    | 'remove_block'
    | 'undo'
    | 'redo'
    | 'mode_change'
    | 'template_apply'
    | 'duplicate_funnel';

export interface EditorMetricData {
    type: EditorMetricType;
    operation: EditorOperationType;
    value: number;
    unit: 'ms' | 'bytes' | 'count' | 'percentage';
    timestamp: Date;
    funnelId?: string;
    pageId?: string;
    blockId?: string;
    userId?: string;
    sessionId?: string;
    metadata?: Record<string, any>;
}

export interface EditorPerformanceSnapshot {
    timestamp: Date;
    funnelId?: string;
    pageCount: number;
    blockCount: number;
    memoryUsage: number;
    renderTime: number;
    bundleSize: number;
    hasErrors: boolean;
    errorCount: number;
}

export interface EditorValidationMetrics {
    operation: EditorOperationType;
    funnelId?: string;
    validationTime: number;
    errorCount: number;
    warningCount: number;
    errors: string[];
    warnings?: string[];
    success: boolean;
    timestamp: Date;
}

export interface EditorLoadingMetrics {
    operation: EditorOperationType;
    funnelId?: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    success: boolean;
    error?: string;
    cacheHit: boolean;
    fallbackUsed: boolean;
    retryCount: number;
    dataSize?: number;
}

export interface EditorFallbackMetrics {
    operation: EditorOperationType;
    fallbackType: 'network_error' | 'validation_error' | 'data_corruption' | 'timeout';
    originalError: string;
    fallbackAction: 'cache' | 'default_data' | 'retry' | 'graceful_degradation';
    success: boolean;
    timestamp: Date;
    funnelId?: string;
}

export interface EditorUsageMetrics {
    sessionId: string;
    userId?: string;
    funnelId?: string;
    sessionStart: Date;
    sessionEnd?: Date;
    duration?: number;
    operationCounts: Partial<Record<EditorOperationType, number>>;
    errorCount: number;
    successfulSaves: number;
    abandonedEdits: number;
    mostUsedFeatures: string[];
    performanceIssues: string[];
}

export interface EditorMetricsProvider {
    recordMetric(metric: EditorMetricData): void;
    recordPerformanceSnapshot(snapshot: EditorPerformanceSnapshot): void;
    recordValidationMetrics(metrics: EditorValidationMetrics): void;
    recordLoadingMetrics(metrics: EditorLoadingMetrics): void;
    recordFallbackMetrics(metrics: EditorFallbackMetrics): void;
    recordUsageMetrics(metrics: EditorUsageMetrics): void;

    getMetrics(filter?: {
        type?: EditorMetricType;
        operation?: EditorOperationType;
        funnelId?: string;
        from?: Date;
        to?: Date;
    }): Promise<EditorMetricData[]>;

    getPerformanceReport(funnelId?: string): Promise<{
        averageLoadTime: number;
        averageSaveTime: number;
        averageValidationTime: number;
        errorRate: number;
        fallbackRate: number;
        performanceScore: number;
        issues: string[];
        recommendations: string[];
    }>;

    exportMetrics(format: 'json' | 'csv'): Promise<string>;
    clearMetrics(olderThan?: Date): Promise<void>;
}

export interface EditorMetricsConfig {
    enabled: boolean;
    collectPerformance: boolean;
    collectValidation: boolean;
    collectUsage: boolean;
    collectErrors: boolean;
    bufferSize: number;
    flushInterval: number;
    enableRealTimeAlerts: boolean;
    performanceThresholds: {
        loadTime: number;
        saveTime: number;
        validationTime: number;
        renderTime: number;
    };
    errorThresholds: {
        maxErrorRate: number;
        maxFallbackRate: number;
    };
}

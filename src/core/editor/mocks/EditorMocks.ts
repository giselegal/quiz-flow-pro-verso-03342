// @ts-nocheck
/**
 * 🧪 IMPLEMENTAÇÕES MOCK PARA TESTE DO EDITOR DESACOPLADO
 * 
 * Fornece implementações completas de todas as interfaces para permitir
 * testes isolados e desenvolvimento independente do contexto da aplicação
 * 
 * ✨ NOVO: Inclui instrumentação completa de métricas para testes de observabilidade
 */

import {
    EditorFunnelData,
    EditorPageData,
    EditorBlockData,
    EditorDataProvider,
    EditorTemplateProvider,
    EditorValidator,
    EditorEventHandler,
    EditorUtils,
    EditorTemplate,
    EditorSaveResult,
    EditorListOptions,
    EditorFunnelSummary,
    EditorValidationResult,
    EditorPageType,
    EditorFunnelSettings,
    EditorFunnelMetadata,
    EditorPageSettings,
    EditorTheme,
    EditorNavigation,
    EditorBlockContent,
    EditorQuestionData,
    EditorMockDataProvider,
    EditorMetricsProvider,
    EditorMetricData,
    EditorPerformanceSnapshot,
    EditorValidationMetrics,
    EditorLoadingMetrics,
    EditorFallbackMetrics,
    EditorUsageMetrics
} from '../interfaces/EditorInterfaces';

// ============================================================================
// MOCK DATA PROVIDER
// ============================================================================

export class MockEditorDataProvider implements EditorMockDataProvider {
    private mockFunnels: EditorFunnelData[] = [];
    private errors: Partial<Record<keyof EditorDataProvider, string>> = {};
    private delays: Partial<Record<keyof EditorDataProvider, number>> = {};

    constructor() {
        this.initializeMockData();
    }

    private initializeMockData() {
        this.mockFunnels = [
            {
                id: 'mock-funnel-1',
                name: 'Sample Funnel',
                description: 'A sample funnel for testing',
                pages: [
                    this.createSamplePage('intro', 'Welcome'),
                    this.createSamplePage('question', 'Question 1'),
                    this.createSamplePage('result', 'Results')
                ],
                settings: this.getDefaultSettings(),
                metadata: this.getDefaultMetadata()
            }
        ];
    }

    private createSamplePage(type: EditorPageType, name: string): EditorPageData {
        return {
            id: this.generateId(),
            name,
            type,
            blocks: [
                {
                    id: this.generateId(),
                    type: 'text',
                    content: { text: `This is a ${name} page` },
                    style: {},
                    position: { x: 0, y: 0 },
                    size: { width: 100, height: 50 },
                    order: 1,
                    metadata: {
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }
                }
            ],
            settings: {
                title: name,
                description: `${name} page description`,
                showProgressBar: true,
                allowSkip: false,
                autoAdvance: false,
                background: {
                    type: 'color',
                    value: '#ffffff'
                }
            },
            transitions: {},
            metadata: {
                createdAt: new Date(),
                updatedAt: new Date(),
                order: 1
            }
        };
    }

    private getDefaultSettings(): EditorFunnelSettings {
        return {
            theme: {
                primaryColor: '#007bff',
                secondaryColor: '#6c757d',
                backgroundColor: '#ffffff',
                textColor: '#212529',
                fontFamily: 'Inter, sans-serif',
                borderRadius: '8px',
                spacing: 'normal'
            },
            navigation: {
                showProgress: true,
                showStepNumbers: true,
                allowBackward: true,
                autoAdvance: false
            },
            autoSave: true,
            previewMode: false
        };
    }

    private getDefaultMetadata(): EditorFunnelMetadata {
        return {
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            isPublished: false,
            tags: ['sample', 'test'],
            category: 'general'
        };
    }

    private generateId(): string {
        return 'mock-' + Math.random().toString(36).substr(2, 9);
    }

    private async simulateDelayInternal(operation: keyof EditorDataProvider) {
        const delay = this.delays[operation];
        if (delay) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    private checkForError(operation: keyof EditorDataProvider) {
        const error = this.errors[operation];
        if (error) {
            throw new Error(error);
        }
    }

    async loadFunnel(id: string): Promise<EditorFunnelData | null> {
        await this.simulateDelayInternal('loadFunnel');
        this.checkForError('loadFunnel');

        return this.mockFunnels.find(f => f.id === id) || null;
    }

    async saveFunnel(data: EditorFunnelData): Promise<EditorSaveResult> {
        await this.simulateDelayInternal('saveFunnel');
        this.checkForError('saveFunnel');

        const existingIndex = this.mockFunnels.findIndex(f => f.id === data.id);
        const updatedData = {
            ...data,
            metadata: {
                ...data.metadata,
                updatedAt: new Date(),
                version: data.metadata.version + 1
            }
        };

        if (existingIndex >= 0) {
            this.mockFunnels[existingIndex] = updatedData;
        } else {
            this.mockFunnels.push(updatedData);
        }

        return {
            success: true,
            timestamp: new Date(),
            version: updatedData.metadata.version
        };
    }

    async listFunnels(options?: EditorListOptions): Promise<EditorFunnelSummary[]> {
        await this.simulateDelayInternal('listFunnels');
        this.checkForError('listFunnels');

        let filtered = [...this.mockFunnels];

        if (options?.category) {
            filtered = filtered.filter(f => f.metadata.category === options.category);
        }

        if (options?.published !== undefined) {
            filtered = filtered.filter(f => f.metadata.isPublished === options.published);
        }

        // Apply sorting
        if (options?.sortBy) {
            filtered.sort((a, b) => {
                const aVal = options.sortBy === 'name' ? a.name : a.metadata[options.sortBy as keyof EditorFunnelMetadata];
                const bVal = options.sortBy === 'name' ? b.name : b.metadata[options.sortBy as keyof EditorFunnelMetadata];

                if (options.sortOrder === 'desc') {
                    return aVal < bVal ? 1 : -1;
                }
                return aVal > bVal ? 1 : -1;
            });
        }

        // Apply pagination
        if (options?.offset || options?.limit) {
            const start = options.offset || 0;
            const end = start + (options.limit || filtered.length);
            filtered = filtered.slice(start, end);
        }

        return filtered.map(f => ({
            id: f.id,
            name: f.name,
            description: f.description,
            pageCount: f.pages.length,
            isPublished: f.metadata.isPublished,
            createdAt: f.metadata.createdAt,
            updatedAt: f.metadata.updatedAt,
            category: f.metadata.category,
            tags: f.metadata.tags
        }));
    }

    async createFunnel(data: Partial<EditorFunnelData>): Promise<EditorFunnelData> {
        await this.simulateDelayInternal('createFunnel');
        this.checkForError('createFunnel');

        const newFunnel: EditorFunnelData = {
            id: this.generateId(),
            name: data.name || 'New Funnel',
            description: data.description || '',
            pages: data.pages || [],
            settings: data.settings || this.getDefaultSettings(),
            metadata: data.metadata || this.getDefaultMetadata()
        };

        this.mockFunnels.push(newFunnel);
        return newFunnel;
    }

    async deleteFunnel(id: string): Promise<boolean> {
        await this.simulateDelayInternal('deleteFunnel');
        this.checkForError('deleteFunnel');

        const index = this.mockFunnels.findIndex(f => f.id === id);
        if (index >= 0) {
            this.mockFunnels.splice(index, 1);
            return true;
        }
        return false;
    }

    async duplicateFunnel(id: string, newName: string): Promise<EditorFunnelData> {
        await this.simulateDelayInternal('duplicateFunnel');
        this.checkForError('duplicateFunnel');

        const original = await this.loadFunnel(id);
        if (!original) {
            throw new Error(`Funnel ${id} not found`);
        }

        return this.createFunnel({
            ...original,
            name: newName,
            metadata: {
                ...original.metadata,
                isPublished: false
            }
        });
    }

    // Mock-specific methods
    setMockData(funnels: EditorFunnelData[]): void {
        this.mockFunnels = [...funnels];
    }

    getMockData(): EditorFunnelData[] {
        return [...this.mockFunnels];
    }

    simulateError(operation: keyof EditorDataProvider, error: string): void {
        this.errors[operation] = error;
    }

    simulateDelay(operation: keyof EditorDataProvider, delay: number): void {
        this.delays[operation] = delay;
    }
}

// ============================================================================
// MOCK TEMPLATE PROVIDER
// ============================================================================

export class MockEditorTemplateProvider implements EditorTemplateProvider {
    private templates: EditorTemplate[] = [
        {
            id: 'template-1',
            name: 'Basic Quiz',
            description: 'Simple quiz template',
            category: 'quiz',
            preview: '/templates/basic-quiz.jpg',
            data: {
                name: 'Basic Quiz',
                description: 'A simple quiz template',
                pages: []
            }
        }
    ];

    async getAvailableTemplates(category?: string): Promise<EditorTemplate[]> {
        if (category) {
            return this.templates.filter(t => t.category === category);
        }
        return [...this.templates];
    }

    async getTemplate(id: string): Promise<EditorTemplate | null> {
        return this.templates.find(t => t.id === id) || null;
    }

    async createFromTemplate(templateId: string, name: string): Promise<EditorFunnelData> {
        const template = await this.getTemplate(templateId);
        if (!template) {
            throw new Error(`Template ${templateId} not found`);
        }

        return {
            id: this.generateId(),
            name,
            description: template.data.description || '',
            pages: template.data.pages || [],
            settings: template.data.settings || this.getDefaultSettings(),
            metadata: this.getDefaultMetadata()
        };
    }

    private generateId(): string {
        return 'template-' + Math.random().toString(36).substr(2, 9);
    }

    private getDefaultSettings(): EditorFunnelSettings {
        return {
            theme: {
                primaryColor: '#007bff',
                secondaryColor: '#6c757d',
                backgroundColor: '#ffffff',
                textColor: '#212529',
                fontFamily: 'Inter, sans-serif',
                borderRadius: '8px',
                spacing: 'normal'
            },
            navigation: {
                showProgress: true,
                showStepNumbers: true,
                allowBackward: true,
                autoAdvance: false
            },
            autoSave: true,
            previewMode: false
        };
    }

    private getDefaultMetadata(): EditorFunnelMetadata {
        return {
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 1,
            isPublished: false,
            tags: [],
            category: 'general'
        };
    }
}

// ============================================================================
// MOCK VALIDATOR
// ============================================================================

export class MockEditorValidator implements EditorValidator {
    async validateFunnel(data: EditorFunnelData): Promise<EditorValidationResult> {
        const errors: string[] = [];

        if (!data.name.trim()) {
            errors.push('Funnel name is required');
        }

        if (data.pages.length === 0) {
            errors.push('At least one page is required');
        }

        // Validate each page
        for (const page of data.pages) {
            const pageResult = await this.validatePage(page);
            errors.push(...pageResult.errors);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    async validatePage(page: EditorPageData): Promise<EditorValidationResult> {
        const errors: string[] = [];

        if (!page.name.trim()) {
            errors.push('Page name is required');
        }

        if (!page.settings.title.trim()) {
            errors.push('Page title is required');
        }

        // Validate blocks
        for (const block of page.blocks) {
            const blockResult = await this.validateBlock(block);
            errors.push(...blockResult.errors);
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    async validateBlock(block: EditorBlockData): Promise<EditorValidationResult> {
        const errors: string[] = [];

        if (!block.type) {
            errors.push('Block type is required');
        }

        if (block.type === 'text' && !block.content.text?.trim()) {
            errors.push('Text block content is required');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

// ============================================================================
// MOCK EVENT HANDLER
// ============================================================================

export class MockEditorEventHandler implements EditorEventHandler {
    onFunnelLoad = (data: EditorFunnelData) => {
        console.log('Mock: Funnel loaded:', data.name);
    };

    onFunnelSave = (data: EditorFunnelData) => {
        console.log('Mock: Funnel saved:', data.name);
    };

    onFunnelChange = (data: EditorFunnelData) => {
        console.log('Mock: Funnel changed:', data.name);
    };

    onPageAdd = (page: EditorPageData) => {
        console.log('Mock: Page added:', page.name);
    };

    onPageRemove = (pageId: string) => {
        console.log('Mock: Page removed:', pageId);
    };

    onPageReorder = (fromIndex: number, toIndex: number) => {
        console.log('Mock: Page reordered:', fromIndex, '->', toIndex);
    };

    onBlockAdd = (pageId: string, block: EditorBlockData) => {
        console.log('Mock: Block added to page:', pageId, block.type);
    };

    onBlockRemove = (pageId: string, blockId: string) => {
        console.log('Mock: Block removed from page:', pageId, blockId);
    };

    onBlockUpdate = (pageId: string, blockId: string, block: EditorBlockData) => {
        console.log('Mock: Block updated on page:', pageId, blockId);
    };

    onModeChange = (mode: string) => {
        console.log('Mock: Mode changed to:', mode);
    };
}

// ============================================================================
// MOCK UTILS
// ============================================================================

export class MockEditorUtils implements EditorUtils {
    generateId(): string {
        return 'mock-' + Math.random().toString(36).substr(2, 9);
    }

    isValidFunnelData(data: any): data is EditorFunnelData {
        return (
            typeof data === 'object' &&
            data !== null &&
            typeof data.id === 'string' &&
            typeof data.name === 'string' &&
            Array.isArray(data.pages)
        );
    }

    createEmptyFunnel(name: string): EditorFunnelData {
        return {
            id: this.generateId(),
            name,
            description: '',
            pages: [],
            settings: {
                theme: {
                    primaryColor: '#007bff',
                    secondaryColor: '#6c757d',
                    backgroundColor: '#ffffff',
                    textColor: '#212529',
                    fontFamily: 'Inter, sans-serif',
                    borderRadius: '8px',
                    spacing: 'normal'
                },
                navigation: {
                    showProgress: true,
                    showStepNumbers: true,
                    allowBackward: true,
                    autoAdvance: false
                },
                autoSave: true,
                previewMode: false
            },
            metadata: {
                createdAt: new Date(),
                updatedAt: new Date(),
                version: 1,
                isPublished: false,
                tags: [],
                category: 'general'
            }
        };
    }

    createEmptyPage(type: EditorPageType): EditorPageData {
        return {
            id: this.generateId(),
            name: `New ${type} Page`,
            type,
            blocks: [],
            settings: {
                title: `New ${type} Page`,
                description: '',
                showProgressBar: true,
                allowSkip: false,
                autoAdvance: false,
                background: {
                    type: 'color',
                    value: '#ffffff'
                }
            },
            transitions: {},
            metadata: {
                createdAt: new Date(),
                updatedAt: new Date(),
                order: 1
            }
        };
    }

    createEmptyBlock(type: string): EditorBlockData {
        return {
            id: this.generateId(),
            type,
            content: {},
            style: {},
            position: { x: 0, y: 0 },
            size: { width: 300, height: 200 },
            order: 1,
            metadata: {
                createdAt: new Date(),
                updatedAt: new Date()
            }
        };
    }

    createTextBlock(text: string): EditorBlockData {
        return {
            id: this.generateId(),
            type: 'text',
            content: { text },
            style: {},
            position: { x: 0, y: 0 },
            size: { width: 300, height: 100 },
            order: 1,
            metadata: {
                createdAt: new Date(),
                updatedAt: new Date()
            }
        };
    }

    createQuestionBlock(question: string, type: EditorQuestionData['type']): EditorBlockData {
        return {
            id: this.generateId(),
            type: 'question',
            content: {
                question: {
                    text: question,
                    type,
                    required: false
                }
            },
            style: {},
            position: { x: 0, y: 0 },
            size: { width: 400, height: 250 },
            order: 1,
            metadata: {
                createdAt: new Date(),
                updatedAt: new Date()
            }
        };
    }

    deepClone<T>(data: T): T {
        return JSON.parse(JSON.stringify(data));
    }

    hasChanges(current: EditorFunnelData, previous: EditorFunnelData): boolean {
        return JSON.stringify(current) !== JSON.stringify(previous);
    }
}

// ============================================================================
// MOCK METRICS PROVIDER PARA TESTES
// ============================================================================

export class MockEditorMetricsProvider implements EditorMetricsProvider {
    private metrics: EditorMetricData[] = [];
    private performanceSnapshots: EditorPerformanceSnapshot[] = [];
    private validationMetrics: EditorValidationMetrics[] = [];
    private loadingMetrics: EditorLoadingMetrics[] = [];
    private fallbackMetrics: EditorFallbackMetrics[] = [];
    private usageMetrics: EditorUsageMetrics[] = [];

    public sessionId: string;

    constructor() {
        this.sessionId = `mock_session_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    }

    recordMetric(metric: EditorMetricData): void {
        console.log('Mock Metrics - recordMetric:', metric.type, metric.operation, metric.value);
        this.metrics.push({
            ...metric,
            sessionId: this.sessionId,
            timestamp: metric.timestamp || new Date()
        });

        // Simular alertas para métricas críticas
        if (metric.type === 'error_count') {
            console.warn('🚨 Mock Alert: Error detected', metric);
        }
        if (metric.type === 'load_time' && metric.value > 2000) {
            console.warn('🐌 Mock Alert: Slow loading detected', metric);
        }
    }

    recordPerformanceSnapshot(snapshot: EditorPerformanceSnapshot): void {
        console.log('Mock Metrics - Performance Snapshot:', snapshot);
        this.performanceSnapshots.push(snapshot);

        // Simular detecção de problemas de performance
        if (snapshot.memoryUsage > 100000000) { // 100MB
            console.warn('🧠 Mock Alert: High memory usage', snapshot);
        }
        if (snapshot.renderTime > 100) {
            console.warn('🎨 Mock Alert: Slow rendering', snapshot);
        }
    }

    recordValidationMetrics(metrics: EditorValidationMetrics): void {
        console.log('Mock Metrics - Validation:', metrics.operation, metrics.validationTime + 'ms',
            metrics.errorCount + ' errors');
        this.validationMetrics.push(metrics);
    }

    recordLoadingMetrics(metrics: EditorLoadingMetrics): void {
        console.log('Mock Metrics - Loading:', metrics.operation, metrics.duration + 'ms',
            'Success:', metrics.success, 'Fallback:', metrics.fallbackUsed);
        this.loadingMetrics.push(metrics);
    }

    recordFallbackMetrics(metrics: EditorFallbackMetrics): void {
        console.warn('🔄 Mock Metrics - Fallback triggered:', metrics.fallbackType,
            metrics.fallbackAction, metrics.originalError);
        this.fallbackMetrics.push(metrics);
    }

    recordUsageMetrics(metrics: EditorUsageMetrics): void {
        console.log('Mock Metrics - Usage Session:', metrics.sessionId,
            'Duration:', metrics.duration + 'ms', 'Operations:', metrics.operationCounts);
        this.usageMetrics.push(metrics);
    }

    async getMetrics(filter?: {
        type?: any;
        operation?: any;
        funnelId?: string;
        from?: Date;
        to?: Date;
    }): Promise<EditorMetricData[]> {
        let filtered = [...this.metrics];

        if (filter) {
            if (filter.type) {
                filtered = filtered.filter(m => m.type === filter.type);
            }
            if (filter.operation) {
                filtered = filtered.filter(m => m.operation === filter.operation);
            }
            if (filter.funnelId) {
                filtered = filtered.filter(m => m.funnelId === filter.funnelId);
            }
            if (filter.from) {
                filtered = filtered.filter(m => m.timestamp >= filter.from!);
            }
            if (filter.to) {
                filtered = filtered.filter(m => m.timestamp <= filter.to!);
            }
        }

        console.log('Mock Metrics - getMetrics returning:', filtered.length, 'metrics');
        return filtered;
    }

    async getPerformanceReport(funnelId?: string) {
        const filter = funnelId ? { funnelId } : undefined;
        const metrics = await this.getMetrics(filter);

        // Simulação de cálculos de performance
        const loadTimes = metrics.filter(m => m.type === 'load_time').map(m => m.value);
        const saveTimes = metrics.filter(m => m.type === 'save_time').map(m => m.value);
        const validationTimes = metrics.filter(m => m.type === 'validation_time').map(m => m.value);

        const report = {
            averageLoadTime: loadTimes.length ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length : 450,
            averageSaveTime: saveTimes.length ? saveTimes.reduce((a, b) => a + b, 0) / saveTimes.length : 250,
            averageValidationTime: validationTimes.length ? validationTimes.reduce((a, b) => a + b, 0) / validationTimes.length : 80,
            errorRate: Math.random() * 0.05, // 0-5%
            fallbackRate: Math.random() * 0.02, // 0-2%
            performanceScore: 85 + Math.random() * 15, // 85-100
            issues: this.generateMockIssues(),
            recommendations: this.generateMockRecommendations()
        };

        console.log('Mock Metrics - Performance Report:', report);
        return report;
    }

    async exportMetrics(format: 'json' | 'csv'): Promise<string> {
        const allData = {
            metrics: this.metrics,
            performanceSnapshots: this.performanceSnapshots,
            validationMetrics: this.validationMetrics,
            loadingMetrics: this.loadingMetrics,
            fallbackMetrics: this.fallbackMetrics,
            usageMetrics: this.usageMetrics,
            sessionId: this.sessionId,
            exportedAt: new Date()
        };

        if (format === 'json') {
            console.log('Mock Metrics - Exporting as JSON');
            return JSON.stringify(allData, null, 2);
        }

        // CSV simplificado
        console.log('Mock Metrics - Exporting as CSV');
        const csvLines = ['Type,Operation,Value,Unit,Timestamp'];
        this.metrics.forEach(metric => {
            csvLines.push([
                metric.type,
                metric.operation,
                metric.value.toString(),
                metric.unit,
                metric.timestamp.toISOString()
            ].join(','));
        });

        return csvLines.join('\n');
    }

    async clearMetrics(olderThan?: Date): Promise<void> {
        const cutoff = olderThan || new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h

        const before = this.metrics.length;
        this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
        this.performanceSnapshots = this.performanceSnapshots.filter(s => s.timestamp > cutoff);
        this.validationMetrics = this.validationMetrics.filter(v => v.timestamp > cutoff);
        this.loadingMetrics = this.loadingMetrics.filter(l => l.startTime > cutoff);
        this.fallbackMetrics = this.fallbackMetrics.filter(f => f.timestamp > cutoff);
        this.usageMetrics = this.usageMetrics.filter(u => u.sessionStart > cutoff);

        console.log('Mock Metrics - Cleared metrics:', before, '->', this.metrics.length);
    }

    // Mock-specific methods
    getAllData() {
        return {
            metrics: this.metrics,
            performanceSnapshots: this.performanceSnapshots,
            validationMetrics: this.validationMetrics,
            loadingMetrics: this.loadingMetrics,
            fallbackMetrics: this.fallbackMetrics,
            usageMetrics: this.usageMetrics
        };
    }

    simulateSlowOperation(operation: string, delay: number = 2000) {
        setTimeout(() => {
            this.recordMetric({
                type: operation.includes('load') ? 'load_time' : 'operation_time',
                operation: operation as any,
                value: delay + Math.random() * 1000,
                unit: 'ms',
                timestamp: new Date(),
                sessionId: this.sessionId
            });
        }, 100);
    }

    simulateError(operation: string, error: string) {
        this.recordMetric({
            type: 'error_count',
            operation: operation as any,
            value: 1,
            unit: 'count',
            timestamp: new Date(),
            sessionId: this.sessionId,
            metadata: { error }
        });
    }

    private generateMockIssues(): string[] {
        const possibleIssues = [
            'Average validation time is higher than expected',
            'Memory usage showing upward trend',
            'Error rate increased in last hour',
            'Slow network response detected',
            'Cache hit rate below optimal'
        ];

        const issueCount = Math.floor(Math.random() * 3);
        return possibleIssues.slice(0, issueCount);
    }

    private generateMockRecommendations(): string[] {
        const possibleRecommendations = [
            'Consider implementing client-side caching for frequently accessed data',
            'Review validation logic for optimization opportunities',
            'Implement progressive loading for large funnels',
            'Add retry logic for network operations',
            'Consider using Web Workers for heavy computations'
        ];

        const recommendationCount = Math.floor(Math.random() * 3) + 1;
        return possibleRecommendations.slice(0, recommendationCount);
    }

    // Lifecycle
    dispose() {
        console.log('Mock Metrics - Provider disposed');
        this.metrics = [];
        this.performanceSnapshots = [];
        this.validationMetrics = [];
        this.loadingMetrics = [];
        this.fallbackMetrics = [];
        this.usageMetrics = [];
    }
}

// ============================================================================
// FACTORY E PROVIDER PRINCIPAL
// ============================================================================

export class EditorMockProvider {
    static createFullMockSetup() {
        const dataProvider = new MockEditorDataProvider();
        const templateProvider = new MockEditorTemplateProvider();
        const validator = new MockEditorValidator();
        const eventHandler = new MockEditorEventHandler();
        const utils = new MockEditorUtils();
        const metricsProvider = new MockEditorMetricsProvider();

        return {
            dataProvider,
            templateProvider,
            validator,
            eventHandler,
            utils,
            metricsProvider
        };
    }

    static createMinimalMockSetup() {
        const dataProvider = new MockEditorDataProvider();
        const utils = new MockEditorUtils();
        const metricsProvider = new MockEditorMetricsProvider();

        return {
            dataProvider,
            utils,
            metricsProvider
        };
    }

    static createMetricsTestSetup() {
        const metricsProvider = new MockEditorMetricsProvider();

        // Simular alguns dados de teste
        metricsProvider.simulateSlowOperation('load_funnel', 1500);
        metricsProvider.simulateError('save_funnel', 'Network timeout');

        setTimeout(() => {
            metricsProvider.recordPerformanceSnapshot({
                timestamp: new Date(),
                funnelId: 'test-funnel',
                pageCount: 3,
                blockCount: 12,
                memoryUsage: 85000000, // 85MB
                renderTime: 45,
                bundleSize: 0,
                hasErrors: false,
                errorCount: 0
            });
        }, 1000);

        return {
            metricsProvider,
            dataProvider: new MockEditorDataProvider(),
            utils: new MockEditorUtils()
        };
    }
}

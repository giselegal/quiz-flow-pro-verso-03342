/**
 * 🔗 SISTEMA AVANÇADO DE METADADOS PARA STEPS
 * 
 * Maximiza o uso de APIs e dados disponíveis para criar
 * steps mais inteligentes, conectados e personalizados
 */

// Mock imports para tipos e serviços não existentes
interface Logger {
    debug: (message: string, data?: any) => void;
    info: (message: string, data?: any) => void;
    warn: (message: string, data?: any) => void;
    error: (message: string, data?: any) => void;
    performance: (name: string, duration: number) => void;
}

interface CacheManager<T> {
    get: (key: string) => T | null;
    set: (key: string, value: T) => void;
    has: (key: string) => boolean;
    delete: (key: string) => boolean;
}

interface UnifiedIDGenerator {
    generateID: (type: string, context?: any) => string;
}

interface PersonalizationEngine {
    personalizeContent: (content: string, context: UserPersonalizationContext, options?: any) => string;
}

export interface UserPersonalizationContext {
    user: {
        id: string;
        preferences?: Record<string, any>;
    };
    session: {
        id: string;
        answers: Record<string, any>;
        startTime: Date;
    };
    history: {
        completedSteps: string[];
        totalTime: number;
    };
}

// Mock implementations
const mockLogger: Logger = {
    debug: (message: string, data?: any) => console.log(`[DEBUG] ${message}`, data),
    info: (message: string, data?: any) => console.log(`[INFO] ${message}`, data),
    warn: (message: string, data?: any) => console.warn(`[WARN] ${message}`, data),
    error: (message: string, data?: any) => console.error(`[ERROR] ${message}`, data),
    performance: (name: string, duration: number) => console.log(`[PERF] ${name}: ${duration}ms`)
};

const mockCacheManager = {
    getCache: <T>(_name: string, _size: number): CacheManager<T> => ({
        get: (_key: string) => null,
        set: (_key: string, _value: T) => {},
        has: (_key: string) => false,
        delete: (_key: string) => false
    })
};

const mockUnifiedIDGenerator: UnifiedIDGenerator = {
    generateID: (type: string, _context?: any) => `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
};

const mockPersonalizationEngine: PersonalizationEngine = {
    personalizeContent: (content: string, _context: UserPersonalizationContext, _options?: any) => content
};

// Define all missing types
export interface AnimationConfig {
    type: 'fade' | 'slide' | 'bounce';
    duration: number;
    delay?: number;
}

export interface ResponsiveConfig {
    mobile: number;
    tablet: number;
    desktop: number;
}

export interface AccessibilityConfig {
    screenReaderSupport: boolean;
    keyboardNavigation: boolean;
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
}

export interface ValidationRule {
    type: string;
    condition: string;
    message: string;
    severity: 'error' | 'warning' | 'info';
}

export interface ValidationTrigger {
    event: string;
    condition?: string;
}

export interface CustomValidator {
    name: string;
    validate: (value: any) => boolean | string;
}

export interface ErrorHandlingConfig {
    showInline: boolean;
    showSummary: boolean;
    blockProgression: boolean;
}

export interface BusinessRuleAction {
    type: 'modify_content' | 'add_validation' | 'change_layout' | 'redirect';
    target?: string;
    value?: any;
}

export interface DynamicContentRule {
    condition: string;
    content: Record<string, any>;
}

export interface AdaptiveUIRule {
    condition: string;
    modifications: Record<string, any>;
}

export interface RecommendationConfig {
    type: string;
    criteria: string;
    weight: number;
}

export interface ClickHeatmapData {
    x: number;
    y: number;
    clicks: number;
}

export interface ScrollDepthData {
    average: number;
    distribution: number[];
}

export interface InteractionPattern {
    type: string;
    sequence: string[];
    frequency: number;
}

export interface ABTestConfig {
    name: string;
    variants: string[];
    traffic: number;
}

export interface StepInteraction {
    type: string;
    timestamp: Date;
    data: any;
}

export interface ExternalIntegration {
    name: string;
    endpoint: string;
    method: string;
    headers?: Record<string, string>;
}

export interface WebhookConfig {
    url: string;
    events: string[];
    method: string;
}

export interface EventTrigger {
    event: string;
    action: string;
    condition?: string;
}

export interface CacheStrategy {
    type: 'memory' | 'localStorage' | 'sessionStorage';
    ttl: number;
}

export interface PreloadRule {
    condition: string;
    resources: string[];
}

export interface SecurityRule {
    type: string;
    condition: string;
    action: string;
}

export interface InternationalizationConfig {
    defaultLocale: string;
    supportedLocales: string[];
}

export interface DebugInfo {
    traces: string[];
    performance: Record<string, number>;
}

export interface PerformanceMetrics {
    avgProcessingTime: number;
    memoryUsage: number;
    cacheHitRate: number;
}

export interface StepRecommendation {
    type: string;
    title: string;
    description: string;
    confidence: number;
}

export interface AnalyticsInsight {
    type: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
}

export interface OptimizationRecommendation {
    type: string;
    title: string;
    description: string;
    impact: 'low' | 'medium' | 'high';
}

export interface OptimizationAction {
    type: 'performance' | 'ux' | 'engagement';
    action: string;
    description: string;
    expectedImprovement: string;
}

export interface StepOptimizationResult {
    stepId: string;
    optimizationsApplied: OptimizationAction[];
    estimatedImprovements: Record<string, number>;
    newConfiguration: EnhancedStepMetadata;
}

export interface StepExportData {
    version: string;
    exportedAt: Date;
    step: EnhancedStepMetadata;
    dependencies: DependencyChain;
    relatedComponents: any[];
    analytics: StepAnalyticsReport;
    optimizations: any[];
}

// ✅ METADADOS AVANÇADOS PARA STEPS
export interface EnhancedStepMetadata {
    // IDs únicos e rastreáveis
    id: string;
    templateId: string;
    funnelId: string;
    componentIds: string[];

    // Informações básicas
    title: string;
    description?: string;
    type: StepType;
    category: string;
    version: string;

    // Dependências e relacionamentos
    dependencies: StepDependency[];
    prerequisites: string[]; // IDs de steps obrigatórios
    unlocks: string[]; // IDs de steps que este libera
    relatedSteps: string[];
    parentStep?: string;
    childSteps: string[];

    // Configuração de apresentação
    presentation: StepPresentation;

    // Validações e regras
    validation: StepValidation;
    businessRules: BusinessRule[];

    // Personalização
    personalization: StepPersonalization;

    // Analytics e métricas
    analytics: StepAnalytics;

    // Dados de sessão e contexto
    sessionData: SessionStepData;

    // Configurações avançadas
    advanced: AdvancedStepConfig;

    // Metadados de sistema
    system: SystemMetadata;
}

export interface StepDependency {
    stepId: string;
    type: 'required' | 'optional' | 'conditional';
    condition?: string; // JavaScript expression
    errorMessage?: string;
}

export interface StepPresentation {
    layout: 'single' | 'split' | 'multi' | 'wizard' | 'custom';
    theme?: string;
    animations?: AnimationConfig[];
    responsiveBreakpoints: ResponsiveConfig;
    accessibility: AccessibilityConfig;
}

export interface StepValidation {
    rules: ValidationRule[];
    triggers: ValidationTrigger[];
    customValidators: CustomValidator[];
    errorHandling: ErrorHandlingConfig;
}

export interface BusinessRule {
    id: string;
    name: string;
    description: string;
    condition: string; // JavaScript expression
    actions: BusinessRuleAction[];
    priority: number;
    active: boolean;
}

export interface StepPersonalization {
    userSegments: string[];
    dynamicContent: DynamicContentRule[];
    adaptiveUI: AdaptiveUIRule[];
    recommendations: RecommendationConfig[];
}

export interface StepAnalytics {
    // Métricas básicas
    viewCount: number;
    completionRate: number;
    averageTimeSpent: number;
    abandonmentRate: number;

    // Métricas avançadas
    engagementScore: number;
    conversionFunnelPosition: number;
    userSatisfactionScore?: number;

    // Dados comportamentais
    clickHeatmap: ClickHeatmapData[];
    scrollDepth: ScrollDepthData;
    interactionPatterns: InteractionPattern[];

    // A/B Testing
    experiments: ABTestConfig[];

    // Performance
    loadTime: number;
    renderTime: number;
    errorRate: number;
}

export interface SessionStepData {
    startedAt?: Date;
    completedAt?: Date;
    currentAttempt: number;
    maxAttempts?: number;
    timeSpent: number;
    interactions: StepInteraction[];
    answers: Record<string, any>;
    calculations: Record<string, any>;
    flags: Record<string, boolean>;
    temporaryData: Record<string, any>;
}

export interface AdvancedStepConfig {
    // Integração com APIs externas
    externalIntegrations: ExternalIntegration[];

    // Webhooks e eventos
    webhooks: WebhookConfig[];
    eventTriggers: EventTrigger[];

    // Cache e performance
    cacheStrategy: CacheStrategy;
    preloadRules: PreloadRule[];

    // Segurança
    securityRules: SecurityRule[];

    // Internacionalização
    i18n: InternationalizationConfig;
}

export interface SystemMetadata {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    version: string;
    tags: string[];
    status: 'draft' | 'active' | 'archived' | 'deprecated';

    // Debugging
    debugInfo?: DebugInfo;

    // Performance tracking
    performanceMetrics: PerformanceMetrics;

    // Logs relacionados
    associatedLogIds: string[];
}

/**
 * 🧩 GESTOR AVANÇADO DE STEPS
 */
export class EnhancedStepManager {
    private static instance: EnhancedStepManager;
    private logger = mockLogger;
    private cache = mockCacheManager.getCache<EnhancedStepMetadata>('enhanced_steps', 200);
    private steps: Map<string, EnhancedStepMetadata> = new Map();
    private dependencyGraph: Map<string, Set<string>> = new Map();

    static getInstance(): EnhancedStepManager {
        if (!this.instance) {
            this.instance = new EnhancedStepManager();
        }
        return this.instance;
    }

    /**
     * Cria um novo step com metadados completos
     */
    createEnhancedStep(
        basicData: {
            title: string;
            type: StepType;
            templateId: string;
            funnelId: string;
        },
        options?: Partial<EnhancedStepMetadata>
    ): EnhancedStepMetadata {

        const stepId = mockUnifiedIDGenerator.generateID('step', {
            template: basicData.templateId,
            funnel: basicData.funnelId,
            type: basicData.type
        });

        const enhancedStep: EnhancedStepMetadata = {
            // IDs únicos
            id: stepId,
            templateId: basicData.templateId,
            funnelId: basicData.funnelId,
            componentIds: [],

            // Básicos
            title: basicData.title,
            type: basicData.type,
            category: this.inferCategory(basicData.type),
            version: '1.0.0',

            // Dependências
            dependencies: [],
            prerequisites: [],
            unlocks: [],
            relatedSteps: [],
            childSteps: [],

            // Configurações padrão
            presentation: this.createDefaultPresentation(),
            validation: this.createDefaultValidation(),
            businessRules: [],
            personalization: this.createDefaultPersonalization(),
            analytics: this.createDefaultAnalytics(),
            sessionData: this.createDefaultSessionData(),
            advanced: this.createDefaultAdvancedConfig(),
            system: this.createSystemMetadata(),

            // Override com opções fornecidas
            ...options
        };

        // Registrar no sistema
        this.steps.set(stepId, enhancedStep);
        this.updateDependencyGraph(enhancedStep);

        // Cache
        this.cache.set(stepId, enhancedStep);

        this.logger.debug('Enhanced step created', {
            stepId,
            title: basicData.title,
            type: basicData.type
        });

        return enhancedStep;
    }

    /**
     * Processa um step com personalização e contexto
     */
    async processStep(
        stepId: string,
        userContext: UserPersonalizationContext,
        sessionContext?: Record<string, any>
    ): Promise<ProcessedStepResult> {

        const step = this.getStep(stepId);
        if (!step) {
            throw new Error(`Step not found: ${stepId}`);
        }

        const startTime = Date.now();

        try {
            // 1. Validar dependências
            await this.validateDependencies(step, userContext);

            // 2. Aplicar personalização
            const personalizedStep = await this.applyPersonalization(step, userContext);

            // 3. Executar regras de negócio
            const processedStep = await this.applyBusinessRules(personalizedStep, userContext, sessionContext);

            // 4. Preparar dados de apresentação
            const presentationData = await this.preparePresentationData(processedStep, userContext);

            // 5. Configurar analytics
            this.configureStepAnalytics(processedStep, userContext);

            // 6. Atualizar dados de sessão
            this.updateSessionData(processedStep, userContext, sessionContext);

            const processingTime = Date.now() - startTime;

            this.logger.performance('process_step', processingTime);

            return {
                step: processedStep,
                presentationData,
                processingTime,
                recommendations: await this.generateStepRecommendations(processedStep, userContext),
                nextSteps: this.calculateNextSteps(processedStep, userContext)
            };

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error('Step processing failed', { stepId, error: errorMessage });
            throw error;
        }
    }

    /**
     * Calcula dependências entre steps
     */
    calculateDependencyChain(stepId: string): DependencyChain {
        const step = this.getStep(stepId);
        if (!step) throw new Error(`Step not found: ${stepId}`);

        const visited = new Set<string>();
        const chain: DependencyChain = {
            requiredBefore: [],
            optionalBefore: [],
            unlocksAfter: [],
            relatedSteps: step.relatedSteps
        };

        // Calcular dependências recursivamente
        this.calculateRecursiveDependencies(stepId, visited, chain);

        return chain;
    }

    /**
     * Gera relatório de analytics para um step
     */
    generateStepAnalyticsReport(stepId: string, timeRange?: { start: Date; end: Date }): StepAnalyticsReport {
        const step = this.getStep(stepId);
        if (!step) throw new Error(`Step not found: ${stepId}`);

        // Coletar dados analíticos
        const analytics = step.analytics;

        return {
            stepId,
            stepTitle: step.title,
            timeRange: timeRange || { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() },

            // Métricas principais
            metrics: {
                views: analytics.viewCount,
                completions: Math.floor(analytics.viewCount * analytics.completionRate),
                completionRate: analytics.completionRate,
                averageTime: analytics.averageTimeSpent,
                abandonmentRate: analytics.abandonmentRate,
                engagementScore: analytics.engagementScore
            },

            // Performance
            performance: {
                loadTime: analytics.loadTime,
                renderTime: analytics.renderTime,
                errorRate: analytics.errorRate
            },

            // Insights
            insights: this.generateAnalyticsInsights(step),

            // Recomendações
            recommendations: this.generateOptimizationRecommendations(step)
        };
    }

    /**
     * Otimiza step baseado em dados de uso
     */
    optimizeStepPerformance(stepId: string): StepOptimizationResult {
        const step = this.getStep(stepId);
        if (!step) throw new Error(`Step not found: ${stepId}`);

        const optimizations: OptimizationAction[] = [];

        // 1. Analisar tempo de carregamento
        if (step.analytics.loadTime > 3000) {
            optimizations.push({
                type: 'performance',
                action: 'enable_lazy_loading',
                description: 'Ativar carregamento lazy para componentes pesados',
                expectedImprovement: '40% mais rápido'
            });
        }

        // 2. Analisar taxa de abandono
        if (step.analytics.abandonmentRate > 0.3) {
            optimizations.push({
                type: 'ux',
                action: 'simplify_interface',
                description: 'Simplificar interface para reduzir cognitive load',
                expectedImprovement: '25% menos abandono'
            });
        }

        // 3. Analisar engajamento
        if (step.analytics.engagementScore < 0.6) {
            optimizations.push({
                type: 'engagement',
                action: 'add_interactive_elements',
                description: 'Adicionar elementos interativos para aumentar engajamento',
                expectedImprovement: '30% mais engajamento'
            });
        }

        // Aplicar otimizações automáticas
        this.applyAutomaticOptimizations(step, optimizations);

        return {
            stepId,
            optimizationsApplied: optimizations,
            estimatedImprovements: this.calculateEstimatedImprovements(optimizations),
            newConfiguration: step
        };
    }

    /**
     * Exporta configuração completa de um step
     */
    exportStepConfiguration(stepId: string): StepExportData {
        const step = this.getStep(stepId);
        if (!step) throw new Error(`Step not found: ${stepId}`);

        return {
            version: '2.0',
            exportedAt: new Date(),
            step: this.sanitizeStepForExport(step),
            dependencies: this.calculateDependencyChain(stepId),
            relatedComponents: this.getRelatedComponents(stepId),
            analytics: this.generateStepAnalyticsReport(stepId),
            optimizations: this.getAppliedOptimizations(stepId)
        };
    }

    // ===== MÉTODOS PRIVADOS =====

    private getStep(stepId: string): EnhancedStepMetadata | null {
        // Tentar cache primeiro
        const cached = this.cache.get(stepId);
        if (cached) return cached;

        // Buscar em memória
        const step = this.steps.get(stepId);
        if (step) {
            this.cache.set(stepId, step);
            return step;
        }

        // TODO: Buscar em banco de dados se necessário
        return null;
    }

    private inferCategory(type: StepType): string {
        const categoryMap: Record<StepType, string> = {
            'question': 'quiz',
            'form': 'data-collection',
            'result': 'output',
            'info': 'content',
            'calculation': 'processing'
        };

        return categoryMap[type] || 'general';
    }

    private createDefaultPresentation(): StepPresentation {
        return {
            layout: 'single',
            animations: [],
            responsiveBreakpoints: {
                mobile: 768,
                tablet: 1024,
                desktop: 1200
            },
            accessibility: {
                screenReaderSupport: true,
                keyboardNavigation: true,
                highContrast: false,
                fontSize: 'medium'
            }
        };
    }

    private createDefaultValidation(): StepValidation {
        return {
            rules: [],
            triggers: [],
            customValidators: [],
            errorHandling: {
                showInline: true,
                showSummary: false,
                blockProgression: true
            }
        };
    }

    private createDefaultPersonalization(): StepPersonalization {
        return {
            userSegments: [],
            dynamicContent: [],
            adaptiveUI: [],
            recommendations: []
        };
    }

    private createDefaultAnalytics(): StepAnalytics {
        return {
            viewCount: 0,
            completionRate: 0,
            averageTimeSpent: 0,
            abandonmentRate: 0,
            engagementScore: 0,
            conversionFunnelPosition: 0,
            clickHeatmap: [],
            scrollDepth: { average: 0, distribution: [] },
            interactionPatterns: [],
            experiments: [],
            loadTime: 0,
            renderTime: 0,
            errorRate: 0
        };
    }

    private createDefaultSessionData(): SessionStepData {
        return {
            currentAttempt: 1,
            timeSpent: 0,
            interactions: [],
            answers: {},
            calculations: {},
            flags: {},
            temporaryData: {}
        };
    }

    private createDefaultAdvancedConfig(): AdvancedStepConfig {
        return {
            externalIntegrations: [],
            webhooks: [],
            eventTriggers: [],
            cacheStrategy: { type: 'memory', ttl: 300000 },
            preloadRules: [],
            securityRules: [],
            i18n: { defaultLocale: 'pt-BR', supportedLocales: ['pt-BR', 'en-US'] }
        };
    }

    private createSystemMetadata(): SystemMetadata {
        return {
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: 'system',
            version: '1.0.0',
            tags: [],
            status: 'draft',
            performanceMetrics: {
                avgProcessingTime: 0,
                memoryUsage: 0,
                cacheHitRate: 0
            },
            associatedLogIds: []
        };
    }

    private updateDependencyGraph(step: EnhancedStepMetadata): void {
        // Atualizar grafo de dependências
        if (!this.dependencyGraph.has(step.id)) {
            this.dependencyGraph.set(step.id, new Set());
        }

        const deps = this.dependencyGraph.get(step.id)!;
        step.dependencies.forEach(dep => deps.add(dep.stepId));
    }

    private async validateDependencies(step: EnhancedStepMetadata, context: UserPersonalizationContext): Promise<void> {
        // Implementar validação de dependências
        for (const dep of step.dependencies) {
            if (dep.type === 'required') {
                const depStep = this.getStep(dep.stepId);
                if (!depStep || !this.isStepCompleted(dep.stepId, context)) {
                    throw new Error(dep.errorMessage || `Dependency not met: ${dep.stepId}`);
                }
            }
        }
    }

    private async applyPersonalization(step: EnhancedStepMetadata, context: UserPersonalizationContext): Promise<EnhancedStepMetadata> {
        // Aplicar personalização usando o PersonalizationEngine
        const personalizedContent = mockPersonalizationEngine.personalizeContent(
            JSON.stringify(step),
            context,
            { cacheResult: true }
        );

        return JSON.parse(personalizedContent);
    }

    private async applyBusinessRules(
        step: EnhancedStepMetadata,
        userContext: UserPersonalizationContext,
        sessionContext?: Record<string, any>
    ): Promise<EnhancedStepMetadata> {

        let processedStep = { ...step };

        for (const rule of step.businessRules.filter(r => r.active)) {
            if (this.evaluateBusinessRule(rule, userContext, sessionContext)) {
                processedStep = this.executeBusinessRuleActions(processedStep, rule);
            }
        }

        return processedStep;
    }

    private evaluateBusinessRule(
        rule: BusinessRule,
        userContext: UserPersonalizationContext,
        sessionContext?: Record<string, any>
    ): boolean {
        try {
            // Criar contexto para avaliação
            const evalContext = {
                user: userContext.user,
                session: userContext.session,
                history: userContext.history,
                custom: sessionContext || {}
            };

            // Avaliar condição
            const func = new Function(...Object.keys(evalContext), `return !!(${rule.condition})`);
            return func(...Object.values(evalContext));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.warn('Business rule evaluation failed', { ruleId: rule.id, error: errorMessage });
            return false;
        }
    }

    private executeBusinessRuleActions(step: EnhancedStepMetadata, rule: BusinessRule): EnhancedStepMetadata {
        // Implementar execução de ações das regras de negócio
        let modifiedStep = { ...step };

        for (const action of rule.actions) {
            switch (action.type) {
                case 'modify_content':
                    // Modificar conteúdo
                    break;
                case 'add_validation':
                    // Adicionar validação
                    break;
                case 'change_layout':
                    // Alterar layout
                    break;
            }
        }

        return modifiedStep;
    }

    private isStepCompleted(stepId: string, context: UserPersonalizationContext): boolean {
        // Verificar se step foi completado
        return context.session.answers[stepId] !== undefined;
    }

    // ===== MÉTODOS AUSENTES IMPLEMENTADOS =====

    private async preparePresentationData(step: EnhancedStepMetadata, _userContext: UserPersonalizationContext): Promise<any> {
        return {
            layout: step.presentation.layout,
            theme: step.presentation.theme,
            accessibility: step.presentation.accessibility,
            responsive: step.presentation.responsiveBreakpoints
        };
    }

    private configureStepAnalytics(step: EnhancedStepMetadata, _userContext: UserPersonalizationContext): void {
        step.analytics.viewCount++;
        step.system.updatedAt = new Date();
    }

    private updateSessionData(step: EnhancedStepMetadata, userContext: UserPersonalizationContext, _sessionContext?: Record<string, any>): void {
        step.sessionData.interactions.push({
            type: 'view',
            timestamp: new Date(),
            data: { userId: userContext.user.id }
        });
    }

    private async generateStepRecommendations(step: EnhancedStepMetadata, userContext: UserPersonalizationContext): Promise<StepRecommendation[]> {
        return [
            {
                type: 'optimization',
                title: 'Optimize step performance',
                description: 'Consider reducing complexity for better user experience',
                confidence: 0.8
            }
        ];
    }

    private calculateNextSteps(step: EnhancedStepMetadata, userContext: UserPersonalizationContext): string[] {
        return step.unlocks.filter(stepId => {
            const nextStep = this.getStep(stepId);
            return nextStep && this.canAccessStep(nextStep, userContext);
        });
    }

    private canAccessStep(step: EnhancedStepMetadata, userContext: UserPersonalizationContext): boolean {
        return step.prerequisites.every(prereqId => 
            userContext.session.answers[prereqId] !== undefined
        );
    }

    private calculateRecursiveDependencies(stepId: string, visited: Set<string>, chain: DependencyChain): void {
        if (visited.has(stepId)) return;
        visited.add(stepId);

        const step = this.getStep(stepId);
        if (!step) return;

        step.dependencies.forEach(dep => {
            if (dep.type === 'required') {
                chain.requiredBefore.push(dep.stepId);
            } else {
                chain.optionalBefore.push(dep.stepId);
            }
            this.calculateRecursiveDependencies(dep.stepId, visited, chain);
        });
    }

    private generateAnalyticsInsights(step: EnhancedStepMetadata): AnalyticsInsight[] {
        const insights: AnalyticsInsight[] = [];

        if (step.analytics.abandonmentRate > 0.3) {
            insights.push({
                type: 'abandonment',
                title: 'High Abandonment Rate',
                description: 'This step has a high abandonment rate. Consider simplifying the interface.',
                severity: 'high'
            });
        }

        return insights;
    }

    private generateOptimizationRecommendations(step: EnhancedStepMetadata): OptimizationRecommendation[] {
        const recommendations: OptimizationRecommendation[] = [];

        if (step.analytics.loadTime > 3000) {
            recommendations.push({
                type: 'performance',
                title: 'Slow Loading Time',
                description: 'Consider optimizing assets and enabling lazy loading',
                impact: 'high'
            });
        }

        return recommendations;
    }

    private applyAutomaticOptimizations(step: EnhancedStepMetadata, optimizations: OptimizationAction[]): void {
        optimizations.forEach(opt => {
            switch (opt.action) {
                case 'enable_lazy_loading':
                    step.advanced.preloadRules = [];
                    break;
                case 'simplify_interface':
                    step.presentation.layout = 'single';
                    break;
                case 'add_interactive_elements':
                    // Add interaction configurations
                    break;
            }
        });
    }

    private calculateEstimatedImprovements(optimizations: OptimizationAction[]): Record<string, number> {
        const improvements: Record<string, number> = {};
        
        optimizations.forEach(opt => {
            switch (opt.type) {
                case 'performance':
                    improvements.loadTimeReduction = 40;
                    break;
                case 'ux':
                    improvements.abandonmentReduction = 25;
                    break;
                case 'engagement':
                    improvements.engagementIncrease = 30;
                    break;
            }
        });

        return improvements;
    }

    private sanitizeStepForExport(step: EnhancedStepMetadata): EnhancedStepMetadata {
        const sanitized = { ...step };
        // Remove sensitive data
        delete sanitized.system.debugInfo;
        return sanitized;
    }

    private getRelatedComponents(stepId: string): any[] {
        const step = this.getStep(stepId);
        return step ? step.componentIds.map(id => ({ id, type: 'component' })) : [];
    }

    private getAppliedOptimizations(stepId: string): any[] {
        // Return list of optimizations applied to this step
        return [];
    }
}

// ===== TIPOS AUXILIARES =====

export type StepType = 'question' | 'form' | 'result' | 'info' | 'calculation';

export interface ProcessedStepResult {
    step: EnhancedStepMetadata;
    presentationData: any;
    processingTime: number;
    recommendations: StepRecommendation[];
    nextSteps: string[];
}

export interface DependencyChain {
    requiredBefore: string[];
    optionalBefore: string[];
    unlocksAfter: string[];
    relatedSteps: string[];
}

export interface StepAnalyticsReport {
    stepId: string;
    stepTitle: string;
    timeRange: { start: Date; end: Date };
    metrics: {
        views: number;
        completions: number;
        completionRate: number;
        averageTime: number;
        abandonmentRate: number;
        engagementScore: number;
    };
    performance: {
        loadTime: number;
        renderTime: number;
        errorRate: number;
    };
    insights: AnalyticsInsight[];
    recommendations: OptimizationRecommendation[];
}

// ✅ SINGLETON EXPORT
export const enhancedStepManager = EnhancedStepManager.getInstance();

export default enhancedStepManager;
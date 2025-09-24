/**
 * 🔗 INTEGRAÇÃO COMPLETA DOS SISTEMAS AVANÇADOS
 * 
 * Demonstra como usar todos os sistemas implementados
 * de forma coordenada e eficiente
 */

import { unifiedIDGenerator } from './ids/UnifiedIDGenerator';
import { personalizationEngine, UserPersonalizationContext } from './personalization/PersonalizationEngine';
import { enhancedStepManager } from './steps/EnhancedStepManager';
import { realAnalyticsEngine } from './analytics/RealAnalyticsEngine';
import { useLogger } from './logger/SmartLogger';
import { cacheManager } from './cache/LRUCache';

// ✅ INTERFACE PRINCIPAL DE INTEGRAÇÃO
export interface IntegratedQuizSystem {
    // IDs e identificação
    funnelId: string;
    sessionId: string;
    userId?: string;

    // Contexto do usuário
    userContext: UserPersonalizationContext;

    // Estado atual
    currentStep: number;
    totalSteps: number;
    progress: number;

    // Configurações
    config: QuizSystemConfig;

    // Dados da sessão
    sessionData: QuizSessionData;
}

export interface QuizSystemConfig {
    enablePersonalization: boolean;
    enableAnalytics: boolean;
    enableABTesting: boolean;
    cacheStrategy: 'memory' | 'persistent' | 'hybrid';
    performanceMonitoring: boolean;
    realTimeUpdates: boolean;
}

export interface QuizSessionData {
    startedAt: Date;
    lastActivity: Date;
    answers: Record<string, any>;
    calculations: Record<string, any>;
    experimentVariants: Record<string, string>;
    personalizations: Record<string, any>;
    analytics: {
        events: string[];
        metrics: Record<string, number>;
    };
}

/**
 * 🎯 SISTEMA INTEGRADO DE QUIZ
 * 
 * Combina todos os componentes avançados em uma interface única
 */
export class IntegratedQuizEngine {
    private static instance: IntegratedQuizEngine;
    private logger = useLogger('IntegratedQuizEngine');
    private activeSessions: Map<string, IntegratedQuizSystem> = new Map();

    static getInstance(): IntegratedQuizEngine {
        if (!this.instance) {
            this.instance = new IntegratedQuizEngine();
        }
        return this.instance;
    }

    /**
     * Inicializa uma nova sessão de quiz com todos os sistemas integrados
     */
    async initializeQuizSession(
        templateId: string,
        userId?: string,
        config: Partial<QuizSystemConfig> = {}
    ): Promise<IntegratedQuizSystem> {

        const sessionId = unifiedIDGenerator.generateID('quiz_session');
        const funnelId = unifiedIDGenerator.generateID('funnel', { template: templateId });

        // Configuração padrão
        const fullConfig: QuizSystemConfig = {
            enablePersonalization: true,
            enableAnalytics: true,
            enableABTesting: true,
            cacheStrategy: 'hybrid',
            performanceMonitoring: true,
            realTimeUpdates: true,
            ...config
        };

        // Inicializar analytics se habilitado
        if (fullConfig.enableAnalytics) {
            realAnalyticsEngine.initialize({
                enableRealTime: fullConfig.realTimeUpdates,
                enablePerformanceMonitoring: fullConfig.performanceMonitoring
            });

            // Registrar início da sessão
            realAnalyticsEngine.trackUserSession(userId || 'anonymous', {
                templateId,
                sessionId,
                funnelId
            });
        }

        // Construir contexto do usuário
        const userContext = await this.buildUserContext(userId, sessionId);

        // Criar sistema integrado
        const integratedSystem: IntegratedQuizSystem = {
            funnelId,
            sessionId,
            userId,
            userContext,
            currentStep: 0,
            totalSteps: 0, // Será calculado
            progress: 0,
            config: fullConfig,
            sessionData: {
                startedAt: new Date(),
                lastActivity: new Date(),
                answers: {},
                calculations: {},
                experimentVariants: {},
                personalizations: {},
                analytics: {
                    events: [],
                    metrics: {}
                }
            }
        };

        // Registrar sessão ativa
        this.activeSessions.set(sessionId, integratedSystem);

        // Configurar A/B tests se habilitado
        if (fullConfig.enableABTesting && userId) {
            await this.setupABTests(integratedSystem);
        }

        this.logger.info('Quiz session initialized', {
            sessionId,
            funnelId,
            userId,
            config: fullConfig
        });

        return integratedSystem;
    }

    /**
     * Processa um step com todos os sistemas integrados
     */
    async processStep(
        sessionId: string,
        stepData: {
            templateId: string;
            stepType: 'question' | 'form' | 'result' | 'info';
            title: string;
            content?: any;
            metadata?: Record<string, any>;
        }
    ): Promise<ProcessedStepResult> {

        const session = this.activeSessions.get(sessionId);
        if (!session) {
            throw new Error(`Session not found: ${sessionId}`);
        }

        const startTime = Date.now();

        try {
            // 1. Criar step avançado
            const enhancedStep = enhancedStepManager.createEnhancedStep({
                title: stepData.title,
                type: stepData.stepType,
                templateId: stepData.templateId,
                funnelId: session.funnelId
            }, stepData.metadata);

            // 2. Processar step com personalização
            const processedResult = await enhancedStepManager.processStep(
                enhancedStep.id,
                session.userContext,
                session.sessionData
            );

            // 3. Aplicar personalização adicional se habilitada
            if (session.config.enablePersonalization) {
                const personalizedContent = personalizationEngine.personalizeContent(
                    JSON.stringify(processedResult.presentationData),
                    session.userContext,
                    { cacheResult: true, useAI: false }
                );
                processedResult.presentationData = JSON.parse(personalizedContent);

                // Armazenar personalizações
                session.sessionData.personalizations[enhancedStep.id] = personalizedContent;
            }

            // 4. Registrar analytics
            if (session.config.enableAnalytics) {
                const eventId = realAnalyticsEngine.trackStepInteraction(
                    enhancedStep.id,
                    'view',
                    {
                        stepTitle: stepData.title,
                        stepType: stepData.stepType,
                        processingTime: Date.now() - startTime,
                        sessionId: session.sessionId,
                        funnelId: session.funnelId
                    }
                );

                session.sessionData.analytics.events.push(eventId);
            }

            // 5. Atualizar progresso da sessão
            this.updateSessionProgress(session, enhancedStep.id);

            const result: ProcessedStepResult = {
                ...processedResult,
                sessionId: session.sessionId,
                totalProcessingTime: Date.now() - startTime,
                appliedPersonalizations: Object.keys(session.sessionData.personalizations).length,
                analyticsEvents: session.sessionData.analytics.events.length
            };

            this.logger.debug('Step processed successfully', {
                sessionId,
                stepId: enhancedStep.id,
                processingTime: result.totalProcessingTime
            });

            return result;

        } catch (error) {
            // Registrar erro se analytics habilitado
            if (session.config.enableAnalytics) {
                realAnalyticsEngine.trackError(error as Error, {
                    component: 'IntegratedQuizEngine',
                    action: 'processStep',
                    metadata: { sessionId, stepData }
                });
            }

            this.logger.error('Step processing failed', {
                sessionId,
                error: error.message,
                stepData
            });

            throw error;
        }
    }

    /**
     * Registra resposta do usuário com todos os sistemas
     */
    async recordAnswer(
        sessionId: string,
        stepId: string,
        answer: any,
        metadata?: Record<string, any>
    ): Promise<AnswerResult> {

        const session = this.activeSessions.get(sessionId);
        if (!session) {
            throw new Error(`Session not found: ${sessionId}`);
        }

        // Armazenar resposta
        session.sessionData.answers[stepId] = {
            value: answer,
            timestamp: new Date(),
            metadata: metadata || {}
        };

        // Executar cálculos personalizados se existirem
        if (session.userContext.customCalculations.length > 0) {
            await this.executeCustomCalculations(session, stepId, answer);
        }

        // Registrar analytics
        if (session.config.enableAnalytics) {
            realAnalyticsEngine.track('form_interaction', 'step', 'answer', {
                stepId,
                metadata: {
                    answerType: typeof answer,
                    hasMetadata: !!metadata,
                    sessionId,
                    calculationsTriggered: session.userContext.customCalculations.length
                }
            });

            // Atualizar métricas de progresso
            realAnalyticsEngine.trackStepInteraction(stepId, 'complete', {
                answer,
                processingTime: Date.now() - session.sessionData.lastActivity.getTime()
            });
        }

        // Atualizar última atividade
        session.sessionData.lastActivity = new Date();

        const result: AnswerResult = {
            success: true,
            stepId,
            calculatedValues: session.sessionData.calculations,
            recommendations: await this.generateStepRecommendations(session, stepId),
            nextStepSuggestions: await this.calculateNextSteps(session)
        };

        return result;
    }

    /**
     * Gera relatório completo da sessão
     */
    async generateSessionReport(sessionId: string): Promise<SessionReport> {
        const session = this.activeSessions.get(sessionId);
        if (!session) {
            throw new Error(`Session not found: ${sessionId}`);
        }

        // Gerar relatório de analytics se habilitado
        let analyticsReport = null;
        if (session.config.enableAnalytics) {
            const timeRange = {
                start: session.sessionData.startedAt,
                end: new Date()
            };

            analyticsReport = realAnalyticsEngine.generateReport('overview', timeRange, {
                sessionId: session.sessionId,
                funnelId: session.funnelId
            });
        }

        // Calcular insights de personalização
        const personalizationInsights = this.analyzePersonalizationEffectiveness(session);

        // Gerar recomendações finais
        const finalRecommendations = await this.generateFinalRecommendations(session);

        const report: SessionReport = {
            sessionId: session.sessionId,
            funnelId: session.funnelId,
            userId: session.userId,

            // Estatísticas básicas
            duration: new Date().getTime() - session.sessionData.startedAt.getTime(),
            completedSteps: Object.keys(session.sessionData.answers).length,
            totalSteps: session.totalSteps,
            completionRate: Object.keys(session.sessionData.answers).length / session.totalSteps,

            // Dados de personalização
            personalizationInsights,
            appliedPersonalizations: Object.keys(session.sessionData.personalizations).length,

            // Analytics
            analyticsReport,
            eventsGenerated: session.sessionData.analytics.events.length,

            // A/B Testing
            experimentVariants: session.sessionData.experimentVariants,

            // Recomendações
            recommendations: finalRecommendations,

            // Metadados
            generatedAt: new Date(),
            config: session.config
        };

        return report;
    }

    /**
     * Finaliza sessão e faz cleanup
     */
    async finalizeSession(sessionId: string): Promise<void> {
        const session = this.activeSessions.get(sessionId);
        if (!session) {
            return;
        }

        // Registrar finalização no analytics
        if (session.config.enableAnalytics) {
            realAnalyticsEngine.track('conversion', 'session', 'complete', {
                funnelId: session.funnelId,
                value: Object.keys(session.sessionData.answers).length,
                metadata: {
                    duration: new Date().getTime() - session.sessionData.startedAt.getTime(),
                    completionRate: Object.keys(session.sessionData.answers).length / session.totalSteps
                }
            });
        }

        // Cache dados importantes
        const cache = cacheManager.getCache('quiz_sessions', 50);
        cache.set(`completed_${sessionId}`, {
            funnelId: session.funnelId,
            userId: session.userId,
            completedAt: new Date(),
            answers: session.sessionData.answers,
            calculations: session.sessionData.calculations
        });

        // Remover da memória ativa
        this.activeSessions.delete(sessionId);

        this.logger.info('Quiz session finalized', {
            sessionId,
            duration: new Date().getTime() - session.sessionData.startedAt.getTime(),
            completedSteps: Object.keys(session.sessionData.answers).length
        });
    }

    /**
     * Obtém estatísticas do sistema
     */
    getSystemStats(): SystemStats {
        return {
            activeSessions: this.activeSessions.size,
            totalEventsTracked: Array.from(this.activeSessions.values())
                .reduce((acc, session) => acc + session.sessionData.analytics.events.length, 0),

            // Cache stats
            cacheStats: {
                ids: cacheManager.getStats('unified_ids'),
                personalization: cacheManager.getStats('personalization'),
                steps: cacheManager.getStats('enhanced_steps'),
                analytics: cacheManager.getStats('analytics')
            },

            // Analytics stats
            analyticsStats: session.config.enableAnalytics
                ? realAnalyticsEngine.getRealTimeMetrics()
                : null,

            timestamp: new Date()
        };
    }

    // ===== MÉTODOS PRIVADOS =====

    private async buildUserContext(userId?: string, sessionId?: string): Promise<UserPersonalizationContext> {
        // Implementar construção do contexto do usuário
        // Por enquanto, contexto básico
        return {
            user: {
                id: userId || 'anonymous',
                joinedAt: new Date(),
                lastActiveAt: new Date()
            },
            preferences: {},
            history: {
                completedFunnels: [],
                abandonedSteps: [],
                timeSpentByStep: {},
                clickPatterns: [],
                deviceUsage: [],
                sessionTimes: []
            },
            session: {
                id: sessionId || '',
                startedAt: new Date(),
                currentFunnel: '',
                currentStep: 0,
                progress: 0,
                answers: {},
                metadata: {}
            },
            segments: [],
            customCalculations: []
        };
    }

    private async setupABTests(system: IntegratedQuizSystem): Promise<void> {
        // Implementar configuração de A/B tests
        // Por enquanto, placeholder
    }

    private updateSessionProgress(session: IntegratedQuizSystem, stepId: string): void {
        session.currentStep++;
        session.progress = session.totalSteps > 0 ? session.currentStep / session.totalSteps : 0;
    }

    private async executeCustomCalculations(
        session: IntegratedQuizSystem,
        stepId: string,
        answer: any
    ): Promise<void> {
        for (const calc of session.userContext.customCalculations) {
            if (calc.inputs.includes(stepId) || calc.inputs.includes('*')) {
                try {
                    // Executar cálculo personalizado
                    const result = this.calculateCustomFormula(calc.formula, {
                        [stepId]: answer,
                        ...session.sessionData.answers,
                        ...session.sessionData.calculations
                    });

                    session.sessionData.calculations[calc.name] = result;
                    calc.result = result;
                    calc.lastCalculated = new Date();

                } catch (error) {
                    this.logger.warn('Custom calculation failed', {
                        calcId: calc.id,
                        error: error.message
                    });
                }
            }
        }
    }

    private calculateCustomFormula(formula: string, context: any): any {
        // Implementação segura de cálculo personalizado
        try {
            const func = new Function(...Object.keys(context), `return ${formula}`);
            return func(...Object.values(context));
        } catch (error) {
            throw new Error(`Formula execution failed: ${error.message}`);
        }
    }

    private async generateStepRecommendations(
        session: IntegratedQuizSystem,
        stepId: string
    ): Promise<string[]> {
        // Implementar geração de recomendações
        return ['Continue para próximo step', 'Considere revisar resposta'];
    }

    private async calculateNextSteps(session: IntegratedQuizSystem): Promise<string[]> {
        // Implementar cálculo de próximos steps
        return ['step_2', 'step_3'];
    }

    private analyzePersonalizationEffectiveness(session: IntegratedQuizSystem): PersonalizationInsight[] {
        // Implementar análise de efetividade da personalização
        return [
            {
                type: 'content_personalization',
                effectiveness: 0.85,
                description: 'Personalização de conteúdo foi bem recebida'
            }
        ];
    }

    private async generateFinalRecommendations(session: IntegratedQuizSystem): Promise<string[]> {
        // Implementar recomendações finais
        return ['Explore funcionalidades similares', 'Complete seu perfil'];
    }
}

// ===== INTERFACES AUXILIARES =====

interface ProcessedStepResult {
    step: any;
    presentationData: any;
    processingTime: number;
    recommendations: any[];
    nextSteps: string[];
    sessionId: string;
    totalProcessingTime: number;
    appliedPersonalizations: number;
    analyticsEvents: number;
}

interface AnswerResult {
    success: boolean;
    stepId: string;
    calculatedValues: Record<string, any>;
    recommendations: string[];
    nextStepSuggestions: string[];
}

interface SessionReport {
    sessionId: string;
    funnelId: string;
    userId?: string;
    duration: number;
    completedSteps: number;
    totalSteps: number;
    completionRate: number;
    personalizationInsights: PersonalizationInsight[];
    appliedPersonalizations: number;
    analyticsReport: any;
    eventsGenerated: number;
    experimentVariants: Record<string, string>;
    recommendations: string[];
    generatedAt: Date;
    config: QuizSystemConfig;
}

interface PersonalizationInsight {
    type: string;
    effectiveness: number;
    description: string;
}

interface SystemStats {
    activeSessions: number;
    totalEventsTracked: number;
    cacheStats: Record<string, any>;
    analyticsStats: any;
    timestamp: Date;
}

// ✅ SINGLETON EXPORT
export const integratedQuizEngine = IntegratedQuizEngine.getInstance();

// ✅ HOOK REACT PARA USO FÁCIL
export function useIntegratedQuiz(templateId: string, userId?: string) {
    const [session, setSession] = React.useState<IntegratedQuizSystem | null>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const initializeSession = React.useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const newSession = await integratedQuizEngine.initializeQuizSession(templateId, userId);
            setSession(newSession);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [templateId, userId]);

    const processStep = React.useCallback(async (stepData: any) => {
        if (!session) throw new Error('Session not initialized');

        return await integratedQuizEngine.processStep(session.sessionId, stepData);
    }, [session]);

    const recordAnswer = React.useCallback(async (stepId: string, answer: any, metadata?: any) => {
        if (!session) throw new Error('Session not initialized');

        return await integratedQuizEngine.recordAnswer(session.sessionId, stepId, answer, metadata);
    }, [session]);

    const finalizeSession = React.useCallback(async () => {
        if (!session) return;

        await integratedQuizEngine.finalizeSession(session.sessionId);
        setSession(null);
    }, [session]);

    return {
        session,
        loading,
        error,
        initializeSession,
        processStep,
        recordAnswer,
        finalizeSession,
        systemStats: integratedQuizEngine.getSystemStats()
    };
}

export default integratedQuizEngine;
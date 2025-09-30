'use client';

/**
 * 📊 ANALYTICS SERVICE (LEGACY)
 * STATUS: DEPRECATED – substituído por unifiedEventTracker + unifiedAnalyticsEngine.
 * SUNSET PLAN:
 *   - Data de corte aceite: 2025-10-15 (parar novas referências)
 *   - Remoção física prevista: 2025-10-31
 *   - Ações restantes: remover adapters dependentes e migrar exemplos finais.
 * Após 31/10 este arquivo deverá ser excluído do repositório.
 */
export const DEPRECATED = true; // Migrar para unifiedEventTracker
(() => { if (typeof console !== 'undefined' && !(globalThis as any).__DEP_LOG_CORE_ANALYTICS) { (globalThis as any).__DEP_LOG_CORE_ANALYTICS = true; console.warn('[DEPRECATED][AnalyticsService] Use unifiedEventTracker (src/analytics/UnifiedEventTracker.ts).'); } })();

import { QUIZ_STEPS, getStepById, STRATEGIC_ANSWER_TO_OFFER_KEY } from '@/data/quizSteps';
import { styleConfigGisele } from '@/data/styles';
import type { QuizStep } from '@/data/quizSteps';

// ===============================
// 🎯 INTERFACES DE ANALYTICS
// ===============================

export interface UserEvent {
    id: string;
    // Adicionado 'performance' porque o serviço em vários locais rastreia analyticsService.trackEvent('performance', ...)
    type: 'page_view' | 'question_answer' | 'step_navigation' | 'editor_action' | 'completion' | 'error' | 'performance';
    timestamp: string;
    userId?: string;
    sessionId: string;
    data: any;
    metadata?: {
        userAgent?: string;
        viewport?: { width: number; height: number };
        referrer?: string;
        timeOnPage?: number;
    };
}

export interface QuizMetrics {
    totalSessions: number;
    completionRate: number;
    averageTimeToComplete: number;
    dropOffPoints: Record<string, number>;
    popularAnswers: Record<string, number>;
    styleDistribution: Record<string, number>;
    performanceMetrics: {
        averageLoadTime: number;
        averageResponseTime: number;
        errorRate: number;
    };
}

export interface UserSession {
    id: string;
    startTime: string;
    endTime?: string;
    currentStep: string;
    answers: Record<string, any>;
    timePerStep: Record<string, number>;
    completionStatus: 'active' | 'completed' | 'abandoned';
    userProfile: {
        isReturning: boolean;
        deviceType: 'desktop' | 'tablet' | 'mobile';
        browser: string;
    };
}

export interface PerformanceMetric {
    id: string;
    type: 'load_time' | 'response_time' | 'memory_usage' | 'bundle_size';
    value: number;
    timestamp: string;
    context?: string;
}

// ===============================
// 📊 ANALYTICS SERVICE PRINCIPAL
// ===============================

export class AnalyticsService {
    private static instance: AnalyticsService;
    private events: UserEvent[] = [];
    private sessions: Map<string, UserSession> = new Map();
    private metrics: QuizMetrics;
    private listeners: Array<(event: UserEvent) => void> = [];
    private performanceObserver?: PerformanceObserver;

    private constructor() {
        this.metrics = this.initializeMetrics();
        this.initializePerformanceTracking();
        this.startSessionTracking();
    }

    public static getInstance(): AnalyticsService {
        if (!AnalyticsService.instance) {
            AnalyticsService.instance = new AnalyticsService();
        }
        return AnalyticsService.instance;
    }

    // ===============================
    // 🎯 TRACKING DE EVENTOS
    // ===============================

    /**
     * Registra um evento do usuário
     */
    public trackEvent(type: UserEvent['type'], data: any, userId?: string): void {
        const event: UserEvent = {
            id: this.generateEventId(),
            type,
            timestamp: new Date().toISOString(),
            userId,
            sessionId: this.getCurrentSessionId(),
            data,
            metadata: this.collectMetadata()
        };

        this.events.push(event);
        this.updateMetrics(event);
        this.notifyListeners(event);

        // Persistir eventos críticos
        if (['completion', 'error'].includes(type)) {
            this.persistEvent(event);
        }

        console.log('📊 Analytics Event:', event);
    }

    /**
     * Tracked específico para navegação entre steps
     */
    public trackStepNavigation(fromStep: string, toStep: string, timeSpent: number): void {
        this.trackEvent('step_navigation', {
            fromStep,
            toStep,
            timeSpent,
            stepData: getStepById(toStep)
        });

        this.updateSessionStepTime(fromStep, timeSpent);
    }

    /**
     * Tracking para respostas do quiz
     */
    public trackQuizAnswer(stepId: string, questionId: string, answer: any, isStrategic: boolean = false): void {
        this.trackEvent('question_answer', {
            stepId,
            questionId,
            answer,
            isStrategic,
            answerType: typeof answer,
            timestamp: new Date().toISOString()
        });

        this.updateAnswerStats(questionId, answer);
    }

    /**
     * Tracking para ações do editor
     */
    public trackEditorAction(action: string, data: any): void {
        this.trackEvent('editor_action', {
            action,
            editorData: data,
            context: 'quiz-editor-mode'
        });
    }

    /**
     * Tracking para completion do quiz
     */
    public trackQuizCompletion(finalStyle: string, secondaryStyles: string[], completionTime: number): void {
        this.trackEvent('completion', {
            finalStyle,
            secondaryStyles,
            completionTime,
            totalSteps: Object.keys(QUIZ_STEPS).length,
            strategicAnswers: this.getStrategicAnswersFromSession()
        });

        this.completeCurrentSession();
    }

    // ===============================
    // 📈 MÉTRICAS E ANÁLISES
    // ===============================

    /**
     * Retorna métricas em tempo real
     */
    public getRealTimeMetrics(): QuizMetrics {
        this.calculateCurrentMetrics();
        return { ...this.metrics };
    }

    /**
     * Análise de drop-off por etapa
     */
    public getDropOffAnalysis(): Record<string, { dropRate: number; avgTimeSpent: number }> {
        const stepStats: Record<string, { entries: number; exits: number; totalTime: number }> = {};

        this.events.forEach(event => {
            if (event.type === 'step_navigation') {
                const { fromStep, toStep, timeSpent } = event.data;

                if (!stepStats[fromStep]) {
                    stepStats[fromStep] = { entries: 0, exits: 0, totalTime: 0 };
                }

                stepStats[fromStep].exits++;
                stepStats[fromStep].totalTime += timeSpent || 0;

                if (!stepStats[toStep]) {
                    stepStats[toStep] = { entries: 0, exits: 0, totalTime: 0 };
                }
                stepStats[toStep].entries++;
            }
        });

        const analysis: Record<string, { dropRate: number; avgTimeSpent: number }> = {};

        Object.entries(stepStats).forEach(([stepId, stats]) => {
            analysis[stepId] = {
                dropRate: stats.entries > 0 ? (stats.entries - stats.exits) / stats.entries : 0,
                avgTimeSpent: stats.exits > 0 ? stats.totalTime / stats.exits : 0
            };
        });

        return analysis;
    }

    /**
     * Análise de performance de estilos
     */
    public getStylePerformanceAnalysis(): Record<string, { frequency: number; avgCompletionTime: number }> {
        const completions = this.events.filter(e => e.type === 'completion');
        const styleStats: Record<string, { count: number; totalTime: number }> = {};

        completions.forEach(event => {
            const { finalStyle, completionTime } = event.data;
            if (!styleStats[finalStyle]) {
                styleStats[finalStyle] = { count: 0, totalTime: 0 };
            }
            styleStats[finalStyle].count++;
            styleStats[finalStyle].totalTime += completionTime || 0;
        });

        const analysis: Record<string, { frequency: number; avgCompletionTime: number }> = {};

        Object.entries(styleStats).forEach(([style, stats]) => {
            analysis[style] = {
                frequency: stats.count,
                avgCompletionTime: stats.count > 0 ? stats.totalTime / stats.count : 0
            };
        });

        return analysis;
    }

    /**
     * Heatmap de respostas mais populares
     */
    public getAnswerHeatmap(): Record<string, Record<string, number>> {
        const answerEvents = this.events.filter(e => e.type === 'question_answer');
        const heatmap: Record<string, Record<string, number>> = {};

        answerEvents.forEach(event => {
            const { questionId, answer } = event.data;
            if (!heatmap[questionId]) {
                heatmap[questionId] = {};
            }

            const answerKey = JSON.stringify(answer);
            heatmap[questionId][answerKey] = (heatmap[questionId][answerKey] || 0) + 1;
        });

        return heatmap;
    }

    // ===============================
    // 🔧 MÉTODOS AUXILIARES
    // ===============================

    private initializeMetrics(): QuizMetrics {
        return {
            totalSessions: 0,
            completionRate: 0,
            averageTimeToComplete: 0,
            dropOffPoints: {},
            popularAnswers: {},
            styleDistribution: {},
            performanceMetrics: {
                averageLoadTime: 0,
                averageResponseTime: 0,
                errorRate: 0
            }
        };
    }

    private initializePerformanceTracking(): void {
        if (typeof window === 'undefined') return;

        // Performance Observer para métricas de navegação
        if ('PerformanceObserver' in window) {
            this.performanceObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    this.trackPerformanceMetric(entry);
                });
            });

            this.performanceObserver.observe({ entryTypes: ['navigation', 'resource', 'measure'] });
        }

        // Métricas de Web Vitals
        this.trackWebVitals();
    }

    private trackWebVitals(): void {
        // Simular tracking de Core Web Vitals
        setTimeout(() => {
            this.trackEvent('performance', {
                metric: 'LCP',
                value: performance.now(),
                good: performance.now() < 2500
            });
        }, 1000);
    }

    private trackPerformanceMetric(entry: PerformanceEntry): void {
        const metric: PerformanceMetric = {
            id: this.generateEventId(),
            type: this.getPerformanceType(entry),
            value: entry.duration || entry.startTime,
            timestamp: new Date().toISOString(),
            context: entry.name
        };

        this.updatePerformanceMetrics(metric);
    }

    private startSessionTracking(): void {
        const sessionId = this.getCurrentSessionId();
        const session: UserSession = {
            id: sessionId,
            startTime: new Date().toISOString(),
            currentStep: 'step-1',
            answers: {},
            timePerStep: {},
            completionStatus: 'active',
            userProfile: {
                isReturning: this.isReturningUser(),
                deviceType: this.getDeviceType(),
                browser: this.getBrowser()
            }
        };

        this.sessions.set(sessionId, session);
    }

    private updateMetrics(event: UserEvent): void {
        switch (event.type) {
            case 'page_view':
                this.metrics.totalSessions++;
                break;
            case 'completion':
                this.updateCompletionMetrics(event);
                break;
            case 'question_answer':
                this.updateAnswerMetrics(event);
                break;
        }
    }

    private updateCompletionMetrics(event: UserEvent): void {
        const { finalStyle, completionTime } = event.data;

        // Atualizar distribuição de estilos
        this.metrics.styleDistribution[finalStyle] =
            (this.metrics.styleDistribution[finalStyle] || 0) + 1;

        // Atualizar tempo médio
        const completions = this.events.filter(e => e.type === 'completion').length;
        const currentAvg = this.metrics.averageTimeToComplete;
        this.metrics.averageTimeToComplete =
            (currentAvg * (completions - 1) + completionTime) / completions;

        // Atualizar taxa de conclusão
        this.metrics.completionRate = completions / this.metrics.totalSessions;
    }

    private updateAnswerMetrics(event: UserEvent): void {
        const { questionId, answer } = event.data;
        const answerKey = `${questionId}:${JSON.stringify(answer)}`;
        this.metrics.popularAnswers[answerKey] =
            (this.metrics.popularAnswers[answerKey] || 0) + 1;
    }

    private updateSessionStepTime(stepId: string, timeSpent: number): void {
        const sessionId = this.getCurrentSessionId();
        const session = this.sessions.get(sessionId);

        if (session) {
            session.timePerStep[stepId] = timeSpent;
            session.currentStep = stepId;
            this.sessions.set(sessionId, session);
        }
    }

    private completeCurrentSession(): void {
        const sessionId = this.getCurrentSessionId();
        const session = this.sessions.get(sessionId);

        if (session) {
            session.endTime = new Date().toISOString();
            session.completionStatus = 'completed';
            this.sessions.set(sessionId, session);
            this.persistSession(session);
        }
    }

    private updateAnswerStats(questionId: string, answer: any): void {
        // Implementação específica para estatísticas de respostas
    }

    private updatePerformanceMetrics(metric: PerformanceMetric): void {
        const { performanceMetrics } = this.metrics;

        switch (metric.type) {
            case 'load_time':
                performanceMetrics.averageLoadTime =
                    (performanceMetrics.averageLoadTime + metric.value) / 2;
                break;
            case 'response_time':
                performanceMetrics.averageResponseTime =
                    (performanceMetrics.averageResponseTime + metric.value) / 2;
                break;
        }
    }

    private calculateCurrentMetrics(): void {
        // Recalcula métricas em tempo real
        const totalEvents = this.events.length;
        const completions = this.events.filter(e => e.type === 'completion').length;

        if (this.metrics.totalSessions > 0) {
            this.metrics.completionRate = completions / this.metrics.totalSessions;
        }
    }

    private collectMetadata() {
        if (typeof window === 'undefined') return {};

        return {
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            referrer: document.referrer,
            timeOnPage: performance.now()
        };
    }

    private getStrategicAnswersFromSession(): Record<string, any> {
        const sessionId = this.getCurrentSessionId();
        const session = this.sessions.get(sessionId);
        return session?.answers || {};
    }

    private getCurrentSessionId(): string {
        if (typeof window === 'undefined') return 'server-session';

        let sessionId = sessionStorage.getItem('quiz-session-id');
        if (!sessionId) {
            sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem('quiz-session-id', sessionId);
        }
        return sessionId;
    }

    private generateEventId(): string {
        return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private getPerformanceType(entry: PerformanceEntry): PerformanceMetric['type'] {
        if (entry.entryType === 'navigation') return 'load_time';
        if (entry.entryType === 'resource') return 'response_time';
        return 'load_time';
    }

    private isReturningUser(): boolean {
        return localStorage.getItem('quiz-returning-user') === 'true';
    }

    private getDeviceType(): 'desktop' | 'tablet' | 'mobile' {
        if (typeof window === 'undefined') return 'desktop';

        const width = window.innerWidth;
        if (width < 768) return 'mobile';
        if (width < 1024) return 'tablet';
        return 'desktop';
    }

    private getBrowser(): string {
        if (typeof window === 'undefined') return 'unknown';
        return navigator.userAgent.split(' ')[0] || 'unknown';
    }

    private persistEvent(event: UserEvent): void {
        console.log('💾 Persisting critical event:', event);
    }

    private persistSession(session: UserSession): void {
        console.log('💾 Persisting completed session:', session);
    }

    private notifyListeners(event: UserEvent): void {
        this.listeners.forEach(listener => listener(event));
    }

    // ===============================
    // 🎧 EVENT LISTENERS
    // ===============================

    public addEventListener(listener: (event: UserEvent) => void): void {
        this.listeners.push(listener);
    }

    public removeEventListener(listener: (event: UserEvent) => void): void {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    // ===============================
    // 📊 EXPORT UTILITIES
    // ===============================

    public exportMetricsAsJSON(): string {
        return JSON.stringify({
            metrics: this.metrics,
            events: this.events,
            sessions: Array.from(this.sessions.values())
        }, null, 2);
    }

    public getEventsInTimeRange(startTime: string, endTime: string): UserEvent[] {
        return this.events.filter(event =>
            event.timestamp >= startTime && event.timestamp <= endTime
        );
    }
}

// ===============================
// 🎯 SINGLETON EXPORT
// ===============================

export const analyticsService = AnalyticsService.getInstance();
export default analyticsService;
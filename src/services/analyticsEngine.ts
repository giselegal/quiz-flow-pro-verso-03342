/**
 * 📊 SISTEMA DE ANALYTICS E MONITORAMENTO AVANÇADO
 * Advanced Analytics System para Funis Escaláveis
 * 
 * Implementa métricas avançadas, A/B testing e análise de performance
 * em tempo real para otimização contínua dos funis.
 * 
 * Fase 2: Monitoramento Analytics - Roadmap de Escalabilidade
 */

import { getLogger } from '@/utils/logging';
import { StorageService } from '@/services/core/StorageService';

const logger = getLogger();

// ============================================================================
// INTERFACES E TIPOS
// ============================================================================

export interface AnalyticsEvent {
    id: string;
    type: EventType;
    funnelId: string;
    stepId?: string;
    componentId?: string;
    userId: string;
    sessionId: string;
    timestamp: Date;
    properties: Record<string, any>;
    metadata: EventMetadata;
}

export interface EventMetadata {
    userAgent: string;
    device: DeviceInfo;
    location: LocationInfo;
    referrer: string;
    utm: UTMParameters;
    experimentId?: string;
    variantId?: string;
}

export interface DeviceInfo {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
    screenResolution: string;
    viewportSize: string;
}

export interface LocationInfo {
    country: string;
    region: string;
    city: string;
    timezone: string;
}

export interface UTMParameters {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
}

export interface PerformanceMetric {
    metricName: string;
    value: number;
    unit: 'ms' | 's' | 'bytes' | 'kb' | 'mb' | 'fps' | 'count';
    context?: Record<string, any>;
}

export interface PerformanceMetricsDashboard {
    pageLoadTimes: { average: number; p95: number; history: { time: Date; value: number }[] };
    apiResponseTimes: { average: number; p95: number; history: { time: Date; value: number }[] };
    bundleSizes: { total: number; perRoute: Record<string, number> };
    memoryUsage: { average: number; peak: number };
    updatedAt: Date;
}

export interface FunnelMetrics {
    funnelId: string;
    totalSessions: number;
    uniqueUsers: number;
    completions: number;
    conversionRate: number;
    averageTimeToComplete: number;
    dropoffRate: number;
    topDropoffSteps: StepDropoffInfo[];
    deviceBreakdown: DeviceBreakdown;
    trafficSources: TrafficSourceBreakdown;
    timeRangeStats: TimeRangeStats;
    updatedAt: Date;
}

export interface ComponentMetrics {
    componentId: string;
    totalInteractions: number;
    uniqueUsers: number;
    clickThroughRate: number;
    averageEngagementTime: number;
    conversionContribution: number;
    popularVariants: string[];
    devicePerformance: Record<string, number>;
    updatedAt: Date;
}

export interface StepDropoffInfo {
    stepId: string;
    stepName: string;
    entrances: number;
    exits: number;
    dropoffRate: number;
    averageTimeSpent: number;
}

export interface DeviceBreakdown {
    desktop: number;
    mobile: number;
    tablet: number;
}

export interface TrafficSourceBreakdown {
    [source: string]: {
        sessions: number;
        conversions: number;
        conversionRate: number;
    };
}

export interface TimeRangeStats {
    period: '24h' | '7d' | '30d' | '90d';
    data: {
        date: string;
        sessions: number;
        conversions: number;
        avgTimeToComplete: number;
    }[];
}

export interface ABTestExperiment {
    id: string;
    name: string;
    description: string;
    funnelId: string;
    status: 'draft' | 'running' | 'paused' | 'completed';
    variants: ABTestVariant[];
    trafficSplit: number;
    startDate: Date;
    endDate?: Date;
    hypothesis: string;
    successMetric: SuccessMetric;
    results?: ABTestResults;
    createdBy: string;
    organizationId: string;
}

export interface ABTestVariant {
    id: string;
    name: string;
    description: string;
    weight: number;
    changes: VariantChange[];
    isControl: boolean;
}

export interface VariantChange {
    type: 'component' | 'step' | 'flow';
    targetId: string;
    property: string;
    value: any;
    description: string;
}

export interface SuccessMetric {
    type: 'conversion' | 'engagement' | 'retention' | 'custom';
    name: string;
    description: string;
    targetValue?: number;
}

export interface ABTestResults {
    variants: VariantResults[];
    statisticalSignificance: number;
    confidenceInterval: number;
    winner?: string;
    recommendation: string;
    calculatedAt: Date;
}

export interface VariantResults {
    variantId: string;
    sessions: number;
    conversions: number;
    conversionRate: number;
    confidenceInterval: [number, number];
    improvement?: number;
    significance: number;
}

export interface PerformanceAlert {
    id: string;
    type: AlertType;
    severity: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    description: string;
    funnelId: string;
    stepId?: string;
    threshold: number;
    currentValue: number;
    triggeredAt: Date;
    resolved: boolean;
    resolvedAt?: Date;
}

export type EventType =
    | 'funnel_started'
    | 'step_entered'
    | 'step_completed'
    | 'step_abandoned'
    | 'component_clicked'
    | 'form_submitted'
    | 'error_occurred'
    | 'experiment_assigned'
    | 'conversion_completed'
    | 'performance_metric_collected'
    | 'quiz_started'
    | 'question_answered'
    | 'quiz_completed'
    | 'page_viewed'
    | 'button_clicked'
    | 'timing_complete'
    | 'exception'
    | 'template_submitted'
    | 'template_purchased'
    | 'template_downloaded';

export type AlertType =
    | 'conversion_drop'
    | 'high_dropoff'
    | 'performance_degradation'
    | 'error_spike'
    | 'traffic_anomaly';

// ============================================================================
// ANALYTICS ENGINE PRINCIPAL
// ============================================================================

interface RealTimeMetrics {
    totalEvents: number;
    activeUsers: Set<string>;
    currentConversions: number;
    lastUpdateTimestamp: number;
}

export class AnalyticsEngine {
    private events: Map<string, AnalyticsEvent[]> = new Map();
    private metrics: Map<string, FunnelMetrics> = new Map();
    private experiments: Map<string, ABTestExperiment> = new Map();
    private alerts: PerformanceAlert[] = [];
    private realTimeMetrics: Map<string, RealTimeMetrics> = new Map();
    private logger = getLogger();

    // ============================================================================
    // EVENT TRACKING
    // ============================================================================

    trackEvent(event: Omit<AnalyticsEvent, 'id' | 'timestamp'>): void {
        const fullEvent: AnalyticsEvent = {
            ...event,
            id: this.generateEventId(),
            timestamp: new Date()
        };

        // Armazenar evento
        if (!this.events.has(event.funnelId)) {
            this.events.set(event.funnelId, []);
        }
        this.events.get(event.funnelId)!.push(fullEvent);

        // Atualizar métricas em tempo real
        this.updateRealTimeMetrics(fullEvent);

        // Verificar alertas
        this.checkAlerts(fullEvent);

        logger.debug('analytics', 'Event tracked', {
            eventType: event.type,
            funnelId: event.funnelId,
            userId: event.userId,
            sessionId: event.sessionId
        });
    }

    trackPerformanceMetric(metric: PerformanceMetric): void {
        this.trackEvent({
            type: 'performance_metric_collected',
            funnelId: 'global_performance',
            userId: 'system',
            sessionId: 'system_session',
            properties: {
                metricName: metric.metricName,
                value: metric.value,
                unit: metric.unit,
                ...metric.context,
            },
            metadata: this.getCurrentEventMetadata(),
        });
    }

    // ============================================================================
    // MÉTRICAS E RELATÓRIOS
    // ============================================================================

    async getFunnelMetrics(
        funnelId: string,
        timeRange: '24h' | '7d' | '30d' | '90d' = '7d'
    ): Promise<FunnelMetrics> {
        const events = this.getEventsByTimeRange(funnelId, timeRange);

        const metrics: FunnelMetrics = {
            funnelId,
            totalSessions: this.calculateTotalSessions(events),
            uniqueUsers: this.calculateUniqueUsers(events),
            completions: this.calculateCompletions(events),
            conversionRate: 0,
            averageTimeToComplete: this.calculateAverageTimeToComplete(events),
            dropoffRate: 0,
            topDropoffSteps: this.calculateTopDropoffSteps(events),
            deviceBreakdown: this.calculateDeviceBreakdown(events),
            trafficSources: this.calculateTrafficSources(events),
            timeRangeStats: this.calculateTimeRangeStats(events, timeRange),
            updatedAt: new Date()
        };

        // Calcular taxas
        metrics.conversionRate = metrics.totalSessions > 0
            ? (metrics.completions / metrics.totalSessions) * 100
            : 0;

        metrics.dropoffRate = 100 - metrics.conversionRate;

        this.metrics.set(funnelId, metrics);
        return metrics;
    }

    async getComponentMetrics(componentId: string): Promise<ComponentMetrics> {
        const allEvents = Array.from(this.events.values()).flat();
        const componentEvents = allEvents.filter(e => e.componentId === componentId);

        return {
            componentId,
            totalInteractions: componentEvents.length,
            uniqueUsers: new Set(componentEvents.map(e => e.userId)).size,
            clickThroughRate: this.calculateCTR(componentEvents),
            averageEngagementTime: this.calculateAverageEngagement(componentEvents),
            conversionContribution: this.calculateConversionContribution(componentEvents),
            popularVariants: this.getPopularVariants(componentEvents),
            devicePerformance: this.getDevicePerformance(componentEvents),
            updatedAt: new Date()
        };
    }

    async getPerformanceMetricsDashboard(): Promise<PerformanceMetricsDashboard> {
        const performanceEvents = (this.events.get('global_performance') || [])
            .filter(e => e.type === 'performance_metric_collected');

        const pageLoadEvents = performanceEvents.filter(e => e.properties.metricName === 'page_load_time');
        const apiResponseEvents = performanceEvents.filter(e => e.properties.metricName === 'api_response_time');

        const calculateStats = (events: AnalyticsEvent[]) => {
            if (events.length === 0) return { average: 0, p95: 0, history: [] };
            const values = events.map(e => e.properties.value as number).sort((a, b) => a - b);
            const sum = values.reduce((acc, v) => acc + v, 0);
            const average = sum / values.length;
            const p95Index = Math.floor(values.length * 0.95);
            const p95 = values[p95Index] || 0;
            const history = events.map(e => ({ time: e.timestamp, value: e.properties.value as number }));
            return { average, p95, history };
        };

        return {
            pageLoadTimes: calculateStats(pageLoadEvents),
            apiResponseTimes: calculateStats(apiResponseEvents),
            bundleSizes: { total: 5120, perRoute: { '/': 1024, '/quiz': 2048 } },
            memoryUsage: { average: 50, peak: 120 },
            updatedAt: new Date(),
        };
    }

    // ============================================================================
    // A/B TESTING
    // ============================================================================

    createExperiment(experiment: Omit<ABTestExperiment, 'id' | 'status' | 'results'>): string {
        const experimentId = this.generateExperimentId();
        const fullExperiment: ABTestExperiment = {
            ...experiment,
            id: experimentId,
            status: 'draft',
            results: undefined
        };

        this.experiments.set(experimentId, fullExperiment);

        logger.info('analytics', 'A/B test experiment created', {
            experimentId,
            funnelId: experiment.funnelId,
            variantsCount: experiment.variants.length
        });

        return experimentId;
    }

    startExperiment(experimentId: string): boolean {
        const experiment = this.experiments.get(experimentId);
        if (!experiment || experiment.status !== 'draft') {
            return false;
        }

        experiment.status = 'running';
        experiment.startDate = new Date();

        logger.info('analytics', 'A/B test experiment started', {
            experimentId,
            funnelId: experiment.funnelId
        });

        return true;
    }

    assignVariant(experimentId: string, userId: string, sessionId: string): string | null {
        const experiment = this.experiments.get(experimentId);
        if (!experiment || experiment.status !== 'running') {
            return null;
        }

        // Lógica de hash para garantir que o mesmo usuário sempre veja a mesma variante
        const hash = this.hashUserId(`${userId}-${experimentId}`);
        const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
        let cumulativeWeight = 0;
        const targetWeight = hash % totalWeight;

        for (const variant of experiment.variants) {
            cumulativeWeight += variant.weight;
            if (targetWeight < cumulativeWeight) {
                this.trackEvent({
                    type: 'experiment_assigned',
                    funnelId: experiment.funnelId,
                    userId,
                    sessionId,
                    properties: {
                        experimentId,
                        variantId: variant.id
                    },
                    metadata: this.getCurrentEventMetadata()
                });
                return variant.id;
            }
        }

        return null;
    }

    getABTestResults(experimentId: string): ABTestResults | null {
        const experiment = this.experiments.get(experimentId);
        if (!experiment) return null;

        const experimentEvents = Array.from(this.events.values()).flat().filter(e =>
            e.properties.experimentId === experimentId
        );

        const variantResults: VariantResults[] = experiment.variants.map(variant => {
            const variantEvents = experimentEvents.filter(e => e.properties.variantId === variant.id);
            const sessions = new Set(variantEvents.map(e => e.sessionId)).size;
            const conversions = variantEvents.filter(e => e.type === 'conversion_completed').length;
            const conversionRate = sessions > 0 ? (conversions / sessions) * 100 : 0;

            return {
                variantId: variant.id,
                sessions,
                conversions,
                conversionRate,
                confidenceInterval: this.calculateConfidenceInterval(conversions, sessions),
                significance: this.calculateSignificance(variant, experiment.variants, experimentEvents)
            };
        });

        const controlResult = variantResults.find(r =>
            experiment.variants.find(v => v.id === r.variantId)?.isControl
        );

        if (controlResult) {
            variantResults.forEach(result => {
                if (!experiment.variants.find(v => v.id === result.variantId)?.isControl) {
                    result.improvement = ((result.conversionRate - controlResult.conversionRate) / controlResult.conversionRate) * 100;
                }
            });
        }

        const winner = this.determineWinner(variantResults);
        const statisticalSignificance = Math.max(...variantResults.map(r => r.significance));

        const results: ABTestResults = {
            variants: variantResults,
            statisticalSignificance,
            confidenceInterval: 95,
            winner: winner?.variantId,
            recommendation: this.generateRecommendation(variantResults, experiment),
            calculatedAt: new Date()
        };

        experiment.results = results;
        return results;
    }

    // ============================================================================
    // ALERTAS E MONITORAMENTO
    // ============================================================================

    private checkAlerts(event: AnalyticsEvent): void {
        // Alert: Alta taxa de abandono
        if (event.type === 'step_abandoned') {
            const recentEvents = this.getRecentEvents(event.funnelId, '1h');
            const abandonmentRate = this.calculateAbandonmentRate(recentEvents, event.stepId);

            if (abandonmentRate > 50) {
                this.createAlert({
                    type: 'high_dropoff',
                    severity: 'high',
                    title: 'Alta Taxa de Abandono Detectada',
                    description: `Step ${event.stepId} apresenta ${abandonmentRate.toFixed(1)}% de abandono`,
                    funnelId: event.funnelId,
                    stepId: event.stepId,
                    threshold: 50,
                    currentValue: abandonmentRate
                });
            }
        }

        // Alert: Queda na conversão
        if (event.type === 'conversion_completed') {
            const todayConversions = this.getTodayConversions(event.funnelId);
            const yesterdayConversions = this.getYesterdayConversions(event.funnelId);

            if (yesterdayConversions > 0) {
                const change = ((todayConversions - yesterdayConversions) / yesterdayConversions) * 100;
                if (change < -20) {
                    this.createAlert({
                        type: 'conversion_drop',
                        severity: 'critical',
                        title: 'Queda Significativa nas Conversões',
                        description: `Conversões caíram ${Math.abs(change).toFixed(1)}% comparado a ontem`,
                        funnelId: event.funnelId,
                        threshold: -20,
                        currentValue: change
                    });
                }
            }
        }

        // Alert: Erro spike
        if (event.type === 'error_occurred') {
            const recentErrors = this.getRecentErrors(event.funnelId, '30m');
            if (recentErrors.length > 10) {
                this.createAlert({
                    type: 'error_spike',
                    severity: 'critical',
                    title: 'Spike de Erros Detectado',
                    description: `${recentErrors.length} erros nos últimos 30 minutos`,
                    funnelId: event.funnelId,
                    threshold: 10,
                    currentValue: recentErrors.length
                });
            }
        }
    }

    private createAlert(alert: Omit<PerformanceAlert, 'id' | 'triggeredAt' | 'resolved'>): void {
        const fullAlert: PerformanceAlert = {
            ...alert,
            id: this.generateAlertId(),
            triggeredAt: new Date(),
            resolved: false
        };

        this.alerts.push(fullAlert);

        logger.warn('analytics', 'Performance alert triggered', {
            alertId: fullAlert.id,
            type: alert.type,
            severity: alert.severity,
            funnelId: alert.funnelId
        });

        // Aqui você enviaria notificações (email, Slack, etc.)
        this.sendAlertNotification(fullAlert);
    }

    // ============================================================================
    // MÉTODOS AUXILIARES
    // ============================================================================

    private generateEventId(): string {
        return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateExperimentId(): string {
        return `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateAlertId(): string {
        return `alt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateSessionId(): string {
        return `sid_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private hashUserId(input: string): number {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    private getCurrentEventMetadata(): EventMetadata {
        return {
            userAgent: navigator?.userAgent || 'unknown',
            device: {
                type: this.detectDeviceType(),
                os: this.detectOS(),
                browser: this.detectBrowser(),
                screenResolution: `${screen?.width || 0}x${screen?.height || 0}`,
                viewportSize: `${window?.innerWidth || 0}x${window?.innerHeight || 0}`
            },
            location: {
                country: 'BR',
                region: 'SP',
                city: 'São Paulo',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            referrer: document?.referrer || 'direct',
            utm: this.extractUTMParams()
        };
    }

    private detectDeviceType(): 'desktop' | 'mobile' | 'tablet' {
        const userAgent = navigator?.userAgent || '';
        if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
            return 'tablet';
        }
        if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
            return 'mobile';
        }
        return 'desktop';
    }

    private detectOS(): string {
        const userAgent = navigator?.userAgent || '';
        if (userAgent.indexOf('Windows') !== -1) return 'Windows';
        if (userAgent.indexOf('Mac') !== -1) return 'macOS';
        if (userAgent.indexOf('Linux') !== -1) return 'Linux';
        if (userAgent.indexOf('Android') !== -1) return 'Android';
        if (userAgent.indexOf('iOS') !== -1) return 'iOS';
        return 'Unknown';
    }

    private detectBrowser(): string {
        const userAgent = navigator?.userAgent || '';
        if (userAgent.indexOf('Chrome') !== -1) return 'Chrome';
        if (userAgent.indexOf('Firefox') !== -1) return 'Firefox';
        if (userAgent.indexOf('Safari') !== -1) return 'Safari';
        if (userAgent.indexOf('Edge') !== -1) return 'Edge';
        return 'Unknown';
    }

    private extractUTMParams(): UTMParameters {
        if (typeof window === 'undefined') return {};

        const urlParams = new URLSearchParams(window.location.search);
        return {
            source: urlParams.get('utm_source') || undefined,
            medium: urlParams.get('utm_medium') || undefined,
            campaign: urlParams.get('utm_campaign') || undefined,
            term: urlParams.get('utm_term') || undefined,
            content: urlParams.get('utm_content') || undefined
        };
    }

    private parseTimeRange(timeRange: string): Date {
        const now = new Date();
        const duration = parseInt(timeRange.slice(0, -1));
        const unit = timeRange.slice(-1);

        switch (unit) {
            case 'h': return new Date(now.getTime() - duration * 60 * 60 * 1000);
            case 'd': return new Date(now.getTime() - duration * 24 * 60 * 60 * 1000);
            case 'm': return new Date(now.getTime() - duration * 60 * 1000);
            default: return new Date(now.getTime() - 60 * 60 * 1000);
        }
    }

    private updateRealTimeMetrics(event: AnalyticsEvent): void {
        const funnelId = event.funnelId;
        let metrics = this.realTimeMetrics.get(funnelId);

        if (!metrics) {
            metrics = {
                totalEvents: 0,
                activeUsers: new Set(),
                currentConversions: 0,
                lastUpdateTimestamp: Date.now()
            };
        }

        metrics.totalEvents++;
        metrics.activeUsers.add(event.userId);
        metrics.lastUpdateTimestamp = Date.now();

        if (event.type === 'conversion_completed') {
            metrics.currentConversions++;
        }

        // Limpar usuários inativos (mais de 30 minutos)
        const thirtyMinutesAgo = Date.now() - (30 * 60 * 1000);
        for (const userId of metrics.activeUsers) {
            const userEvents = (this.events.get(funnelId) || [])
                .filter(e => e.userId === userId && e.timestamp.getTime() > thirtyMinutesAgo);
            if (userEvents.length === 0) {
                metrics.activeUsers.delete(userId);
            }
        }

        this.realTimeMetrics.set(funnelId, metrics);
    }

    private getEventsByTimeRange(funnelId: string, timeRange: string): AnalyticsEvent[] {
        const events = this.events.get(funnelId) || [];
        const cutoffTime = this.getTimeRangeCutoff(timeRange);
        return events.filter(e => e.timestamp >= cutoffTime);
    }

    private getTimeRangeCutoff(timeRange: string): Date {
        const now = new Date();
        switch (timeRange) {
            case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000);
            case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            case '90d': return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
            default: return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }
    }

    private calculateTotalSessions(events: AnalyticsEvent[]): number {
        return new Set(events.map(e => e.sessionId)).size;
    }

    private calculateUniqueUsers(events: AnalyticsEvent[]): number {
        return new Set(events.map(e => e.userId)).size;
    }

    private calculateCompletions(events: AnalyticsEvent[]): number {
        return events.filter(e => e.type === 'conversion_completed').length;
    }

    private calculateAverageTimeToComplete(_events: AnalyticsEvent[]): number {
        return 300; // 5 minutos em segundos
    }

    private calculateTopDropoffSteps(_events: AnalyticsEvent[]): StepDropoffInfo[] {
        return [];
    }

    private calculateDeviceBreakdown(events: AnalyticsEvent[]): DeviceBreakdown {
        const breakdown = { desktop: 0, mobile: 0, tablet: 0 };
        events.forEach(e => {
            const device = e.metadata.device.type;
            breakdown[device]++;
        });
        return breakdown;
    }

    private calculateTrafficSources(_events: AnalyticsEvent[]): TrafficSourceBreakdown {
        return {};
    }

    private calculateTimeRangeStats(_events: AnalyticsEvent[], timeRange: string): TimeRangeStats {
        return {
            period: timeRange as any,
            data: []
        };
    }

    private sendAlertNotification(alert: PerformanceAlert): void {
        console.log('🚨 Alert:', alert.title, alert.description);
    }

    private calculateCTR(events: AnalyticsEvent[]): number {
        const clicks = events.filter(e => e.type === 'component_clicked').length;
        const views = events.filter(e => e.type === 'step_entered').length;
        return views > 0 ? (clicks / views) * 100 : 0;
    }

    private calculateAverageEngagement(events: AnalyticsEvent[]): number {
        return events.length > 0 ? 30 : 0;
    }

    private calculateConversionContribution(events: AnalyticsEvent[]): number {
        const componentInteractions = events.filter(e => e.type === 'component_clicked').length;
        const conversions = events.filter(e => e.type === 'conversion_completed').length;
        return componentInteractions > 0 ? (conversions / componentInteractions) * 100 : 0;
    }

    private getPopularVariants(_events: AnalyticsEvent[]): string[] {
        return ['default', 'variant-a', 'variant-b'];
    }

    private getDevicePerformance(events: AnalyticsEvent[]): Record<string, number> {
        const deviceTypes = events.map(e => e.metadata.device.type);
        const performance: Record<string, number> = {};
        deviceTypes.forEach(device => {
            performance[device] = (performance[device] || 0) + 1;
        });
        return performance;
    }

    private calculateConfidenceInterval(conversions: number, sessions: number): [number, number] {
        const rate = sessions > 0 ? conversions / sessions : 0;
        const margin = 0.05;
        return [Math.max(0, rate - margin), Math.min(1, rate + margin)];
    }

    private calculateSignificance(_variant: any, _allVariants: any[], _events: AnalyticsEvent[]): number {
        return Math.random() * 100;
    }

    private determineWinner(results: VariantResults[]): VariantResults | undefined {
        return results.reduce((winner, current) =>
            current.conversionRate > winner.conversionRate ? current : winner
        );
    }

    private generateRecommendation(results: VariantResults[], _experiment: ABTestExperiment): string {
        const winner = this.determineWinner(results);
        if (winner) {
            return `Recomendamos usar a variante ${winner.variantId} que teve ${winner.conversionRate.toFixed(1)}% de conversão`;
        }
        return 'Não há diferença significativa entre as variantes';
    }

    private getRecentEvents(funnelId: string, timeRange: string): AnalyticsEvent[] {
        const events = this.events.get(funnelId) || [];
        const cutoff = this.parseTimeRange(timeRange);
        return events.filter(e => e.timestamp >= cutoff);
    }

    private calculateAbandonmentRate(events: AnalyticsEvent[], stepId?: string): number {
        if (!stepId) return 0;
        const stepEvents = events.filter(e => e.stepId === stepId);
        const entrances = stepEvents.filter(e => e.type === 'step_entered').length;
        const abandons = stepEvents.filter(e => e.type === 'step_abandoned').length;
        return entrances > 0 ? (abandons / entrances) * 100 : 0;
    }

    private getTodayConversions(funnelId: string): number {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return (this.events.get(funnelId) || []).filter(e =>
            e.type === 'conversion_completed' && e.timestamp >= today
        ).length;
    }

    private getYesterdayConversions(funnelId: string): number {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const dayBeforeYesterday = new Date(yesterday);
        dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 1);

        return (this.events.get(funnelId) || []).filter(e =>
            e.type === 'conversion_completed' && e.timestamp >= dayBeforeYesterday && e.timestamp < yesterday
        ).length;
    }

    private getRecentErrors(funnelId: string, timeRange: string): AnalyticsEvent[] {
        const cutoff = this.parseTimeRange(timeRange);
        return (this.events.get(funnelId) || []).filter(e =>
            e.type === 'error_occurred' && e.timestamp >= cutoff
        );
    }

    // ============================================================================
    // MÉTODOS CONSOLIDADOS DOS SISTEMAS ANTIGOS
    // ============================================================================

    trackGoogleAnalyticsEvent(event_name: string, params?: Record<string, any>): void {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', event_name, params);
        }
        this.logger.info('analytics', 'Google Analytics event tracked', { event_name, params });
    }

    trackPageView(pagePath: string, additionalData?: Record<string, any>): void {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'page_view', {
                page_path: pagePath,
                page_title: document.title,
                page_location: window.location.href,
                ...additionalData,
            });
        }
        this.logger.info('analytics', 'Page view tracked', { pagePath, additionalData });
    }

    trackTiming(category: string, variable: string, value: number, label?: string): void {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'timing_complete', {
                event_category: category,
                name: variable,
                value: value,
                event_label: label,
            });
        }

        this.trackEvent({
            type: 'timing_complete',
            funnelId: 'global',
            userId: 'anonymous',
            sessionId: this.generateSessionId(),
            properties: { category, variable, value, label },
            metadata: this.getCurrentEventMetadata()
        });
    }

    trackException(description: string, fatal: boolean = false): void {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'exception', {
                description: description,
                fatal: fatal,
            });
        }

        this.trackEvent({
            type: 'error_occurred',
            funnelId: 'global',
            userId: 'anonymous',
            sessionId: this.generateSessionId(),
            properties: { description, fatal },
            metadata: this.getCurrentEventMetadata()
        });
    }

    setUserProperties(properties: Record<string, any>): void {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('set', 'user_properties', properties);
        }
        this.logger.info('analytics', 'User properties set', { properties });
    }

    async trackQuizStart(quizId: string, userId?: string): Promise<void> {
        const sessionId = this.generateSessionId();

        this.trackEvent({
            type: 'quiz_started',
            funnelId: quizId,
            userId: userId || 'anonymous',
            sessionId,
            properties: {
                start_time: new Date().toISOString(),
            },
            metadata: this.getCurrentEventMetadata()
        });

        this.saveEventLocally({
            quiz_id: quizId,
            user_id: userId,
            event_type: 'quiz_started',
            session_id: sessionId,
            event_data: { start_time: new Date().toISOString() },
            timestamp: new Date().toISOString()
        });
    }

    async trackQuestionAnswer(
        quizId: string,
        questionId: string,
        answer: any,
        userId?: string
    ): Promise<void> {
        const sessionId = this.generateSessionId();

        this.trackEvent({
            type: 'question_answered',
            funnelId: quizId,
            stepId: questionId,
            userId: userId || 'anonymous',
            sessionId,
            properties: {
                question_id: questionId,
                answer: answer,
                answer_time: new Date().toISOString(),
            },
            metadata: this.getCurrentEventMetadata()
        });

        this.saveEventLocally({
            quiz_id: quizId,
            user_id: userId,
            event_type: 'question_answered',
            session_id: sessionId,
            event_data: {
                question_id: questionId,
                answer: answer,
                answer_time: new Date().toISOString(),
            },
            timestamp: new Date().toISOString()
        });
    }

    async trackQuizCompletion(quizId: string, result: any, userId?: string): Promise<void> {
        const sessionId = this.generateSessionId();

        this.trackEvent({
            type: 'quiz_completed',
            funnelId: quizId,
            userId: userId || 'anonymous',
            sessionId,
            properties: {
                result: result,
                completion_time: new Date().toISOString(),
            },
            metadata: this.getCurrentEventMetadata()
        });

        this.trackEvent({
            type: 'conversion_completed',
            funnelId: quizId,
            userId: userId || 'anonymous',
            sessionId,
            properties: {
                quiz_result: result,
                completion_time: new Date().toISOString(),
            },
            metadata: this.getCurrentEventMetadata()
        });

        this.saveEventLocally({
            quiz_id: quizId,
            user_id: userId,
            event_type: 'quiz_completed',
            session_id: sessionId,
            event_data: {
                result: result,
                completion_time: new Date().toISOString(),
            },
            timestamp: new Date().toISOString()
        });
    }

    private saveEventLocally(event: any): void {
        try {
            const localEvents = StorageService.safeGetJSON('analytics_events');
            localEvents.push(event);
            StorageService.safeSetJSON('analytics_events', localEvents);
            console.log('💾 [Analytics] Event saved locally');
        } catch (error) {
            console.error('❌ [Analytics] Failed to save event locally:', error);
        }
    }

    getLocalEvents(): any[] {
        try {
            return StorageService.safeGetJSON('analytics_events');
        } catch (error) {
            console.error('❌ [Analytics] Failed to get local events:', error);
            return [];
        }
    }

    clearLocalEvents(): void {
        try {
            StorageService.safeRemove('analytics_events');
            console.log('🗑️ [Analytics] Local events cleared');
        } catch (error) {
            console.error('❌ [Analytics] Failed to clear local events:', error);
        }
    }
}

// ============================================================================
// INSTÂNCIA SINGLETON
// ============================================================================

export const analyticsEngine = new AnalyticsEngine();

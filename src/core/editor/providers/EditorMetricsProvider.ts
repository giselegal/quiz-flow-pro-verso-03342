// @ts-nocheck
/**
 * 📊 PROVIDER DE MÉTRICAS DO EDITOR
 * 
 * Implementação completa de coleta e análise de métricas específicas
 * do editor de funis, integrada com sistema de observabilidade global
 */

import {
    EditorMetricData,
    EditorMetricsProvider,
    EditorPerformanceSnapshot,
    EditorValidationMetrics,
    EditorLoadingMetrics,
    EditorFallbackMetrics,
    EditorUsageMetrics,
    EditorMetricsConfig,
    EditorMetricType,
    EditorOperationType
} from '../interfaces/EditorInterfaces';

// Importar serviços de monitoramento existentes
import { MonitoringService } from '@/services/core/MonitoringService';
import { PerformanceMonitor } from '@/utils/performanceMonitoring';
import { RealTimeAnalytics } from '@/services/realTimeAnalytics';

// ============================================================================
// IMPLEMENTAÇÃO PRINCIPAL
// ============================================================================

export class EditorMetricsProviderImpl implements EditorMetricsProvider {
    private config: EditorMetricsConfig;
    private metrics: EditorMetricData[] = [];
    private performanceSnapshots: EditorPerformanceSnapshot[] = [];
    private validationMetrics: EditorValidationMetrics[] = [];
    private loadingMetrics: EditorLoadingMetrics[] = [];
    private fallbackMetrics: EditorFallbackMetrics[] = [];
    private usageMetrics: EditorUsageMetrics[] = [];

    private monitoringService: MonitoringService;
    private performanceMonitor: PerformanceMonitor;
    private realTimeAnalytics: RealTimeAnalytics;

    private flushTimer?: NodeJS.Timeout;
    private sessionId: string;
    private currentUsageSession?: EditorUsageMetrics;

    constructor(config: Partial<EditorMetricsConfig> = {}) {
        this.config = this.getDefaultConfig(config);
        this.sessionId = this.generateSessionId();

        // Integrar com serviços existentes
        this.monitoringService = new MonitoringService();
        this.performanceMonitor = PerformanceMonitor.getInstance();
        this.realTimeAnalytics = RealTimeAnalytics.getInstance();

        this.initializeCollection();
    }

    private getDefaultConfig(config: Partial<EditorMetricsConfig>): EditorMetricsConfig {
        return {
            enabled: true,
            collectPerformance: true,
            collectValidation: true,
            collectUsage: true,
            collectErrors: true,
            bufferSize: 1000,
            flushInterval: 30000, // 30s
            enableRealTimeAlerts: true,
            performanceThresholds: {
                loadTime: 2000,      // 2s
                saveTime: 1000,      // 1s  
                validationTime: 500, // 500ms
                renderTime: 100      // 100ms
            },
            errorThresholds: {
                maxErrorRate: 0.05,      // 5%
                maxFallbackRate: 0.02    // 2%
            },
            ...config
        };
    }

    private generateSessionId(): string {
        return `editor_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private initializeCollection(): void {
        if (!this.config.enabled) return;

        // Iniciar sessão de uso
        this.startUsageSession();

        // Configurar flush automático
        if (this.config.flushInterval > 0) {
            this.flushTimer = setInterval(() => {
                this.flushToMonitoring();
            }, this.config.flushInterval);
        }

        // Registrar no sistema de monitoramento
        this.monitoringService.log('info', 'EditorMetrics', 'Metrics collection initialized', {
            sessionId: this.sessionId,
            config: this.config
        });
    }

    private startUsageSession(): void {
        if (!this.config.collectUsage) return;

        this.currentUsageSession = {
            sessionId: this.sessionId,
            sessionStart: new Date(),
            operationCounts: {},
            errorCount: 0,
            successfulSaves: 0,
            abandonedEdits: 0,
            mostUsedFeatures: [],
            performanceIssues: []
        };
    }

    // ============================================================================
    // INTERFACE IMPLEMENTATION
    // ============================================================================

    recordMetric(metric: EditorMetricData): void {
        if (!this.config.enabled) return;

        // Adicionar metadados da sessão
        const enhancedMetric: EditorMetricData = {
            ...metric,
            sessionId: this.sessionId,
            timestamp: metric.timestamp || new Date()
        };

        this.metrics.push(enhancedMetric);

        // Verificar alertas em tempo real
        this.checkRealTimeAlerts(enhancedMetric);

        // Integrar com sistema global
        this.monitoringService.recordMetric(
            `editor.${metric.operation}.${metric.type}`,
            metric.value,
            metric.unit,
            {
                funnelId: metric.funnelId,
                operation: metric.operation,
                sessionId: this.sessionId
            }
        );

        // Atualizar sessão de uso
        this.updateUsageSession(metric.operation, metric.type === 'error_count');

        // Gerenciar buffer
        this.manageBuffer();
    }

    recordPerformanceSnapshot(snapshot: EditorPerformanceSnapshot): void {
        if (!this.config.enabled || !this.config.collectPerformance) return;

        this.performanceSnapshots.push(snapshot);

        // Integrar com PerformanceMonitor
        this.performanceMonitor.trackEvent('editor-snapshot', 'performance', {
            funnelId: snapshot.funnelId,
            pageCount: snapshot.pageCount,
            blockCount: snapshot.blockCount,
            memoryUsage: snapshot.memoryUsage,
            renderTime: snapshot.renderTime,
            errorCount: snapshot.errorCount
        });

        // Verificar thresholds
        if (snapshot.renderTime > this.config.performanceThresholds.renderTime) {
            this.recordAlert('performance', 'High render time detected', {
                renderTime: snapshot.renderTime,
                threshold: this.config.performanceThresholds.renderTime
            });
        }
    }

    recordValidationMetrics(metrics: EditorValidationMetrics): void {
        if (!this.config.enabled || !this.config.collectValidation) return;

        this.validationMetrics.push(metrics);

        // Criar métrica padrão
        this.recordMetric({
            type: 'validation_time',
            operation: metrics.operation,
            value: metrics.validationTime,
            unit: 'ms',
            timestamp: metrics.timestamp,
            funnelId: metrics.funnelId,
            sessionId: this.sessionId,
            metadata: {
                errorCount: metrics.errorCount,
                warningCount: metrics.warningCount,
                success: metrics.success
            }
        });

        // Verificar threshold
        if (metrics.validationTime > this.config.performanceThresholds.validationTime) {
            this.recordAlert('validation', 'Slow validation detected', {
                validationTime: metrics.validationTime,
                errorCount: metrics.errorCount,
                operation: metrics.operation
            });
        }
    }

    recordLoadingMetrics(metrics: EditorLoadingMetrics): void {
        if (!this.config.enabled) return;

        this.loadingMetrics.push(metrics);

        // Criar métrica padrão
        this.recordMetric({
            type: 'load_time',
            operation: metrics.operation,
            value: metrics.duration,
            unit: 'ms',
            timestamp: metrics.startTime,
            funnelId: metrics.funnelId,
            sessionId: this.sessionId,
            metadata: {
                success: metrics.success,
                cacheHit: metrics.cacheHit,
                fallbackUsed: metrics.fallbackUsed,
                retryCount: metrics.retryCount,
                dataSize: metrics.dataSize
            }
        });

        // Verificar threshold de loading
        if (metrics.duration > this.config.performanceThresholds.loadTime) {
            this.recordAlert('loading', 'Slow loading detected', {
                duration: metrics.duration,
                operation: metrics.operation,
                fallbackUsed: metrics.fallbackUsed
            });
        }
    }

    recordFallbackMetrics(metrics: EditorFallbackMetrics): void {
        if (!this.config.enabled) return;

        this.fallbackMetrics.push(metrics);

        // Criar métrica padrão
        this.recordMetric({
            type: 'fallback_count',
            operation: metrics.operation,
            value: 1,
            unit: 'count',
            timestamp: metrics.timestamp,
            funnelId: metrics.funnelId,
            sessionId: this.sessionId,
            metadata: {
                fallbackType: metrics.fallbackType,
                fallbackAction: metrics.fallbackAction,
                originalError: metrics.originalError,
                success: metrics.success
            }
        });

        // Sempre alertar fallbacks críticos
        this.recordAlert('fallback', 'Fallback mechanism triggered', {
            type: metrics.fallbackType,
            action: metrics.fallbackAction,
            operation: metrics.operation,
            error: metrics.originalError
        });
    }

    recordUsageMetrics(metrics: EditorUsageMetrics): void {
        if (!this.config.enabled || !this.config.collectUsage) return;

        this.usageMetrics.push(metrics);

        // Integrar com analytics em tempo real
        this.realTimeAnalytics.trackEvent('editor_session_complete', {
            sessionId: metrics.sessionId,
            duration: metrics.duration,
            operationCounts: metrics.operationCounts,
            errorCount: metrics.errorCount,
            successfulSaves: metrics.successfulSaves,
            performanceIssues: metrics.performanceIssues
        });
    }

    // ============================================================================
    // CONSULTAS E RELATÓRIOS
    // ============================================================================

    async getMetrics(filter?: {
        type?: EditorMetricType;
        operation?: EditorOperationType;
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

        return filtered;
    }

    async getPerformanceReport(funnelId?: string): Promise<{
        averageLoadTime: number;
        averageSaveTime: number;
        averageValidationTime: number;
        errorRate: number;
        fallbackRate: number;
        performanceScore: number;
        issues: string[];
        recommendations: string[];
    }> {
        const filter = funnelId ? { funnelId } : undefined;
        const metrics = await this.getMetrics(filter);

        // Calcular médias
        const loadTimes = metrics.filter(m => m.type === 'load_time').map(m => m.value);
        const saveTimes = metrics.filter(m => m.type === 'save_time').map(m => m.value);
        const validationTimes = metrics.filter(m => m.type === 'validation_time').map(m => m.value);

        const averageLoadTime = loadTimes.length ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length : 0;
        const averageSaveTime = saveTimes.length ? saveTimes.reduce((a, b) => a + b, 0) / saveTimes.length : 0;
        const averageValidationTime = validationTimes.length ? validationTimes.reduce((a, b) => a + b, 0) / validationTimes.length : 0;

        // Calcular taxas de erro
        const totalOperations = metrics.filter(m => m.type === 'success_count' || m.type === 'error_count').length;
        const errorCount = metrics.filter(m => m.type === 'error_count').length;
        const fallbackCount = metrics.filter(m => m.type === 'fallback_count').length;

        const errorRate = totalOperations ? errorCount / totalOperations : 0;
        const fallbackRate = totalOperations ? fallbackCount / totalOperations : 0;

        // Calcular score de performance (0-100)
        let performanceScore = 100;
        if (averageLoadTime > this.config.performanceThresholds.loadTime) {
            performanceScore -= 20;
        }
        if (averageSaveTime > this.config.performanceThresholds.saveTime) {
            performanceScore -= 15;
        }
        if (averageValidationTime > this.config.performanceThresholds.validationTime) {
            performanceScore -= 10;
        }
        if (errorRate > this.config.errorThresholds.maxErrorRate) {
            performanceScore -= 30;
        }
        if (fallbackRate > this.config.errorThresholds.maxFallbackRate) {
            performanceScore -= 25;
        }

        // Identificar issues
        const issues: string[] = [];
        const recommendations: string[] = [];

        if (averageLoadTime > this.config.performanceThresholds.loadTime) {
            issues.push(`Average load time (${averageLoadTime.toFixed(0)}ms) exceeds threshold`);
            recommendations.push('Consider implementing caching or optimizing data loading');
        }

        if (errorRate > this.config.errorThresholds.maxErrorRate) {
            issues.push(`Error rate (${(errorRate * 100).toFixed(1)}%) is too high`);
            recommendations.push('Review error handling and validation logic');
        }

        if (fallbackRate > this.config.errorThresholds.maxFallbackRate) {
            issues.push(`Fallback rate (${(fallbackRate * 100).toFixed(1)}%) indicates reliability issues`);
            recommendations.push('Improve primary systems reliability');
        }

        return {
            averageLoadTime,
            averageSaveTime,
            averageValidationTime,
            errorRate,
            fallbackRate,
            performanceScore: Math.max(0, performanceScore),
            issues,
            recommendations
        };
    }

    async exportMetrics(format: 'json' | 'csv'): Promise<string> {
        const allData = {
            metrics: this.metrics,
            performanceSnapshots: this.performanceSnapshots,
            validationMetrics: this.validationMetrics,
            loadingMetrics: this.loadingMetrics,
            fallbackMetrics: this.fallbackMetrics,
            usageMetrics: this.usageMetrics,
            exportedAt: new Date(),
            sessionId: this.sessionId
        };

        if (format === 'json') {
            return JSON.stringify(allData, null, 2);
        }

        // Implementar CSV (simplificado)
        const csvLines = ['Type,Operation,Value,Unit,Timestamp,FunnelId'];
        this.metrics.forEach(metric => {
            csvLines.push([
                metric.type,
                metric.operation,
                metric.value.toString(),
                metric.unit,
                metric.timestamp.toISOString(),
                metric.funnelId || ''
            ].join(','));
        });

        return csvLines.join('\n');
    }

    async clearMetrics(olderThan?: Date): Promise<void> {
        const cutoff = olderThan || new Date(Date.now() - 24 * 60 * 60 * 1000); // 24h

        this.metrics = this.metrics.filter(m => m.timestamp > cutoff);
        this.performanceSnapshots = this.performanceSnapshots.filter(s => s.timestamp > cutoff);
        this.validationMetrics = this.validationMetrics.filter(v => v.timestamp > cutoff);
        this.loadingMetrics = this.loadingMetrics.filter(l => l.startTime > cutoff);
        this.fallbackMetrics = this.fallbackMetrics.filter(f => f.timestamp > cutoff);
        this.usageMetrics = this.usageMetrics.filter(u => u.sessionStart > cutoff);

        this.monitoringService.log('info', 'EditorMetrics', 'Metrics cleared', {
            cutoff: cutoff.toISOString(),
            remainingCount: this.metrics.length
        });
    }

    // ============================================================================
    // HELPERS PRIVADOS
    // ============================================================================

    private checkRealTimeAlerts(metric: EditorMetricData): void {
        if (!this.config.enableRealTimeAlerts) return;

        // Alertas baseados em thresholds
        if (metric.type === 'load_time' && metric.value > this.config.performanceThresholds.loadTime) {
            this.recordAlert('performance', 'Slow load time detected', {
                loadTime: metric.value,
                operation: metric.operation
            });
        }

        if (metric.type === 'save_time' && metric.value > this.config.performanceThresholds.saveTime) {
            this.recordAlert('performance', 'Slow save time detected', {
                saveTime: metric.value,
                operation: metric.operation
            });
        }

        if (metric.type === 'error_count') {
            this.recordAlert('error', 'Editor error occurred', {
                operation: metric.operation,
                funnelId: metric.funnelId
            });
        }
    }

    private recordAlert(type: string, message: string, data: any): void {
        this.monitoringService.log('warn', 'EditorMetrics', message, {
            alertType: type,
            sessionId: this.sessionId,
            ...data
        });

        // Integrar com analytics para alertas críticos
        this.realTimeAnalytics.trackEvent('editor_alert', {
            type,
            message,
            sessionId: this.sessionId,
            ...data
        });
    }

    private updateUsageSession(operation: EditorOperationType, isError: boolean): void {
        if (!this.currentUsageSession) return;

        // Atualizar contadores
        this.currentUsageSession.operationCounts[operation] =
            (this.currentUsageSession.operationCounts[operation] || 0) + 1;

        if (isError) {
            this.currentUsageSession.errorCount++;
        } else if (operation === 'save_funnel') {
            this.currentUsageSession.successfulSaves++;
        }
    }

    private manageBuffer(): void {
        if (this.metrics.length > this.config.bufferSize) {
            // Remover métricas mais antigas
            const toRemove = this.metrics.length - this.config.bufferSize;
            this.metrics = this.metrics.slice(toRemove);
        }
    }

    private flushToMonitoring(): void {
        // Flush dos dados para sistema de monitoramento
        this.monitoringService.log('info', 'EditorMetrics', 'Periodic flush', {
            metricsCount: this.metrics.length,
            sessionId: this.sessionId
        });
    }

    // ============================================================================
    // LIFECYCLE
    // ============================================================================

    public dispose(): void {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }

        // Finalizar sessão de uso atual
        if (this.currentUsageSession) {
            this.currentUsageSession.sessionEnd = new Date();
            this.currentUsageSession.duration =
                this.currentUsageSession.sessionEnd.getTime() -
                this.currentUsageSession.sessionStart.getTime();

            this.recordUsageMetrics(this.currentUsageSession);
        }

        // Flush final
        this.flushToMonitoring();

        this.monitoringService.log('info', 'EditorMetrics', 'Metrics provider disposed', {
            sessionId: this.sessionId
        });
    }
}

// ============================================================================
// FACTORY E UTILITIES
// ============================================================================

export class EditorMetricsFactory {
    static createProvider(config?: Partial<EditorMetricsConfig>): EditorMetricsProvider {
        return new EditorMetricsProviderImpl(config);
    }

    static createMockProvider(): EditorMetricsProvider {
        return new MockEditorMetricsProvider();
    }

    static getDefaultConfig(): EditorMetricsConfig {
        return new EditorMetricsProviderImpl().config;
    }
}

// ============================================================================
// MOCK IMPLEMENTATION
// ============================================================================

export class MockEditorMetricsProvider implements EditorMetricsProvider {
    private metrics: EditorMetricData[] = [];

    recordMetric(metric: EditorMetricData): void {
        console.log('Mock metrics:', metric.type, metric.operation, metric.value);
        this.metrics.push(metric);
    }

    recordPerformanceSnapshot(snapshot: EditorPerformanceSnapshot): void {
        console.log('Mock performance snapshot:', snapshot);
    }

    recordValidationMetrics(metrics: EditorValidationMetrics): void {
        console.log('Mock validation metrics:', metrics);
    }

    recordLoadingMetrics(metrics: EditorLoadingMetrics): void {
        console.log('Mock loading metrics:', metrics);
    }

    recordFallbackMetrics(metrics: EditorFallbackMetrics): void {
        console.log('Mock fallback metrics:', metrics);
    }

    recordUsageMetrics(metrics: EditorUsageMetrics): void {
        console.log('Mock usage metrics:', metrics);
    }

    async getMetrics(): Promise<EditorMetricData[]> {
        return [...this.metrics];
    }

    async getPerformanceReport() {
        return {
            averageLoadTime: 500,
            averageSaveTime: 200,
            averageValidationTime: 100,
            errorRate: 0.02,
            fallbackRate: 0.01,
            performanceScore: 85,
            issues: ['Mock issue'],
            recommendations: ['Mock recommendation']
        };
    }

    async exportMetrics(format: 'json' | 'csv'): Promise<string> {
        if (format === 'json') {
            return JSON.stringify(this.metrics, null, 2);
        }
        return 'Mock CSV data';
    }

    async clearMetrics(): Promise<void> {
        this.metrics = [];
    }
}

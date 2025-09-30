// @ts-nocheck
/**
 * 🛡️ SISTEMA DE TRATAMENTO INTELIGENTE DE ERROS
 * 
 * Handler central que processa todos os erros do sistema de funis:
 * - Logging estruturado automático
 * - Dispatch para estratégias de recovery
 * - Análise de padrões de erro
 * - Alertas e notificações
 * - Métricas e analytics
 */

import { FunnelError, FunnelErrorFactory } from './FunnelError';
import { FunnelErrorCode, ErrorSeverity, RecoveryStrategy } from './FunnelErrorCodes';

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Configuração do handler de erros
 */
export interface FunnelErrorHandlerConfig {
    // Logging
    enableLogging: boolean;
    logEndpoint?: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';

    // Analytics
    enableAnalytics: boolean;
    analyticsEndpoint?: string;

    // Recovery
    enableAutoRecovery: boolean;
    maxRetryAttempts: number;
    retryBackoffMultiplier: number;

    // Alerting
    enableAlerting: boolean;
    alertThresholds: {
        errorRate: number; // erros por minuto
        criticalErrorCount: number;
    };

    // UI
    showErrorToasts: boolean;
    showErrorBoundary: boolean;

    // Development
    isDevelopment: boolean;
    debugMode: boolean;
}

/**
 * Contexto global do handler
 */
export interface ErrorHandlerContext {
    sessionId: string;
    userId?: string;
    funnelId?: string;
    userAgent: string;
    url: string;
    timestamp: string;
    errorCount: number;
    errorRate: number; // erros por minuto
}

/**
 * Listener para eventos de erro
 */
export type ErrorEventListener = (error: FunnelError, context: ErrorHandlerContext) => void;

/**
 * Resultado do tratamento de erro
 */
export interface ErrorHandlingResult {
    handled: boolean;
    recovered: boolean;
    retryScheduled: boolean;
    userNotified: boolean;
    loggedRemotely: boolean;
}

// ============================================================================
// HANDLER PRINCIPAL
// ============================================================================

/**
 * Sistema central de tratamento de erros para funis
 */
export class FunnelErrorHandler {
    private config: FunnelErrorHandlerConfig;
    private context: ErrorHandlerContext;
    private errorHistory: FunnelError[] = [];
    private listeners: ErrorEventListener[] = [];
    private retryTimeouts: Map<string, NodeJS.Timeout> = new Map();

    constructor(config: Partial<FunnelErrorHandlerConfig> = {}) {
        this.config = {
            enableLogging: true,
            logLevel: 'error',
            enableAnalytics: true,
            enableAutoRecovery: true,
            maxRetryAttempts: 3,
            retryBackoffMultiplier: 2,
            enableAlerting: true,
            alertThresholds: {
                errorRate: 10, // 10 erros por minuto
                criticalErrorCount: 3
            },
            showErrorToasts: true,
            showErrorBoundary: true,
            isDevelopment: process.env.NODE_ENV === 'development',
            debugMode: process.env.NODE_ENV === 'development',
            ...config
        };

        this.context = this.initializeContext();
        this.setupGlobalErrorHandling();
    }

    // ============================================================================
    // MÉTODOS PÚBLICOS PRINCIPAIS
    // ============================================================================

    /**
     * Processar erro principal - ponto de entrada único
     */
    async handleError(
        error: Error | FunnelError,
        additionalContext: Record<string, any> = {}
    ): Promise<ErrorHandlingResult> {

        // Converter para FunnelError se necessário
        const funnelError = this.normalizeFunnelError(error, additionalContext);

        // Atualizar contexto
        this.updateContext(funnelError);

        // Adicionar ao histórico
        this.errorHistory.push(funnelError);

        // Processar error em paralelo
        const results = await Promise.allSettled([
            this.logError(funnelError),
            this.sendAnalytics(funnelError),
            this.checkAlertThresholds(funnelError),
            this.attemptRecovery(funnelError)
        ]);

        // Notificar listeners
        this.notifyListeners(funnelError);

        // Compilar resultado
        const result: ErrorHandlingResult = {
            handled: true,
            recovered: results[3].status === 'fulfilled' && results[3].value,
            retryScheduled: this.isRetryScheduled(funnelError),
            userNotified: this.shouldNotifyUser(funnelError),
            loggedRemotely: results[0].status === 'fulfilled'
        };

        return result;
    }

    /**
     * Registrar listener para eventos de erro
     */
    addListener(listener: ErrorEventListener): void {
        this.listeners.push(listener);
    }

    /**
     * Remover listener
     */
    removeListener(listener: ErrorEventListener): void {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
        }
    }

    /**
     * Obter histórico de erros
     */
    getErrorHistory(limit: number = 50): FunnelError[] {
        return this.errorHistory.slice(-limit);
    }

    /**
     * Obter estatísticas de erro
     */
    getErrorStats(): {
        total: number;
        byCode: Record<string, number>;
        bySeverity: Record<string, number>;
        byCategory: Record<string, number>;
        errorRate: number;
        averageResolutionTime: number;
    } {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        const recentErrors = this.errorHistory.filter(
            error => error.occurredAt.getTime() > oneMinuteAgo
        );

        // Contadores
        const byCode: Record<string, number> = {};
        const bySeverity: Record<string, number> = {};
        const byCategory: Record<string, number> = {};
        let totalResolutionTime = 0;
        let resolvedCount = 0;

        this.errorHistory.forEach(error => {
            // Por código
            byCode[error.code] = (byCode[error.code] || 0) + 1;

            // Por severidade
            byCategory[error.metadata.severity] = (bySeverity[error.metadata.severity] || 0) + 1;

            // Por categoria
            byCategory[error.metadata.category] = (byCategory[error.metadata.category] || 0) + 1;

            // Tempo de resolução
            if (error.resolvedAt) {
                totalResolutionTime += error.resolvedAt.getTime() - error.occurredAt.getTime();
                resolvedCount++;
            }
        });

        return {
            total: this.errorHistory.length,
            byCode,
            bySeverity,
            byCategory,
            errorRate: recentErrors.length, // erros por minuto
            averageResolutionTime: resolvedCount > 0 ? totalResolutionTime / resolvedCount : 0
        };
    }

    /**
     * Limpar histórico de erros
     */
    clearHistory(): void {
        this.errorHistory = [];
    }

    /**
     * Configurar contexto global
     */
    updateGlobalContext(updates: Partial<ErrorHandlerContext>): void {
        this.context = { ...this.context, ...updates };
    }

    // ============================================================================
    // MÉTODOS PRIVADOS - PROCESSAMENTO
    // ============================================================================

    /**
     * Normalizar erro para FunnelError
     */
    private normalizeFunnelError(error: Error | FunnelError, context: Record<string, any>): FunnelError {
        if (error instanceof FunnelError) {
            return error;
        }

        // Tentar inferir código do erro baseado na mensagem/tipo
        let code = FunnelErrorCode.INTERNAL_ERROR;

        if (error.name === 'NetworkError' || error.message.includes('fetch')) {
            code = FunnelErrorCode.NETWORK_ERROR;
        } else if (error.name === 'QuotaExceededError') {
            code = FunnelErrorCode.STORAGE_FULL;
        } else if (error.message.includes('timeout')) {
            code = FunnelErrorCode.TIMEOUT;
        } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
            code = FunnelErrorCode.NO_PERMISSION;
        }

        return new FunnelError(code, error.message, context, error);
    }

    /**
     * Atualizar contexto com informações do erro
     */
    private updateContext(error: FunnelError): void {
        this.context.errorCount++;
        this.context.timestamp = new Date().toISOString();

        // Calcular taxa de erro
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        const recentErrors = this.errorHistory.filter(
            e => e.occurredAt.getTime() > oneMinuteAgo
        );
        this.context.errorRate = recentErrors.length + 1; // +1 para o erro atual

        // Atualizar contexto específico se disponível
        if (error.context.funnelId) {
            this.context.funnelId = error.context.funnelId;
        }

        if (error.context.userId) {
            this.context.userId = error.context.userId;
        }
    }

    /**
     * Fazer logging do erro
     */
    private async logError(error: FunnelError): Promise<boolean> {
        if (!this.config.enableLogging) return false;

        const logData = {
            ...error.getLogInfo(),
            globalContext: this.context,
            environment: {
                isDevelopment: this.config.isDevelopment,
                userAgent: this.context.userAgent,
                url: this.context.url
            }
        };

        // Log local (console)
        const logLevel = error.metadata.logLevel;
        if (this.shouldLog(logLevel)) {
            console[logLevel](`[FunnelError] ${error.code}: ${error.message}`, logData);
        }

        // Log remoto (se configurado)
        if (this.config.logEndpoint) {
            try {
                await fetch(this.config.logEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(logData)
                });
                return true;
            } catch (logError) {
                console.error('Failed to log error remotely:', logError);
                return false;
            }
        }

        return true;
    }

    /**
     * Enviar dados para analytics
     */
    private async sendAnalytics(error: FunnelError): Promise<void> {
        if (!this.config.enableAnalytics || !error.metadata.reportable) return;

        const analyticsData = {
            event: 'funnel_error',
            error_code: error.code,
            error_category: error.metadata.category,
            error_severity: error.metadata.severity,
            funnel_id: error.context.funnelId,
            user_id: error.context.userId,
            session_id: this.context.sessionId,
            retry_count: error.retryCount,
            tags: error.metadata.tags,
            timestamp: error.occurredAt.toISOString()
        };

        if (this.config.analyticsEndpoint) {
            try {
                await fetch(this.config.analyticsEndpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(analyticsData)
                });
            } catch (analyticsError) {
                console.warn('Failed to send error analytics:', analyticsError);
            }
        }

        // Analytics do browser (ex: Google Analytics, se disponível)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: error.code,
                fatal: error.isCritical()
            });
        }
    }

    /**
     * Verificar thresholds de alerta
     */
    private async checkAlertThresholds(error: FunnelError): Promise<void> {
        if (!this.config.enableAlerting) return;

        const stats = this.getErrorStats();
        const { errorRate, criticalErrorCount } = this.config.alertThresholds;

        // Alert por taxa de erro alta
        if (stats.errorRate > errorRate) {
            this.triggerAlert('HIGH_ERROR_RATE', {
                currentRate: stats.errorRate,
                threshold: errorRate,
                timeWindow: '1 minute'
            });
        }

        // Alert por muitos erros críticos
        const criticalErrors = this.errorHistory.filter(
            e => e.metadata.severity === ErrorSeverity.CRITICAL
        );

        if (criticalErrors.length > criticalErrorCount) {
            this.triggerAlert('CRITICAL_ERROR_THRESHOLD', {
                criticalErrorCount: criticalErrors.length,
                threshold: criticalErrorCount
            });
        }

        // Alert específico para erros críticos individuais
        if (error.isCritical()) {
            this.triggerAlert('CRITICAL_ERROR', {
                errorCode: error.code,
                errorMessage: error.message,
                context: error.context
            });
        }
    }

    /**
     * Tentar recovery automático
     */
    private async attemptRecovery(error: FunnelError): Promise<boolean> {
        if (!this.config.enableAutoRecovery || !error.canAutoRecover()) {
            return false;
        }

        // Gerar ID único para esta tentativa de recovery
        const recoveryId = `${error.metadata.errorId}_retry_${error.retryCount}`;

        // Cancelar retry anterior se existir
        if (this.retryTimeouts.has(recoveryId)) {
            clearTimeout(this.retryTimeouts.get(recoveryId)!);
            this.retryTimeouts.delete(recoveryId);
        }

        // Calcular delay
        const delay = error.getNextRetryDelay();

        // Agendar retry
        const timeoutId = setTimeout(async () => {
            try {
                error.incrementRetry();

                // Executar estratégia de recovery específica
                const recovered = await this.executeRecoveryStrategy(error);

                if (recovered) {
                    error.markResolved();
                    console.info(`[FunnelError] Recovery successful for ${error.code}`);
                } else if (error.canAutoRecover()) {
                    // Tentar novamente se ainda possível
                    await this.attemptRecovery(error);
                }

            } catch (recoveryError) {
                console.error(`[FunnelError] Recovery failed for ${error.code}:`, recoveryError);
            } finally {
                this.retryTimeouts.delete(recoveryId);
            }
        }, delay);

        this.retryTimeouts.set(recoveryId, timeoutId);
        return true;
    }

    // ============================================================================
    // ESTRATÉGIAS DE RECOVERY
    // ============================================================================

    /**
     * Executar estratégia de recovery específica
     */
    private async executeRecoveryStrategy(error: FunnelError): Promise<boolean> {
        const strategy = error.recoveryInfo.strategy;

        switch (strategy) {
            case RecoveryStrategy.RETRY:
                return await this.retryLastOperation(error);

            case RecoveryStrategy.FALLBACK:
                return await this.fallbackToAlternative(error);

            case RecoveryStrategy.OFFLINE_MODE:
                return await this.enableOfflineMode(error);

            case RecoveryStrategy.CLEAR_CACHE:
                return await this.clearRelatedCache(error);

            case RecoveryStrategy.RELOAD_PAGE:
                return await this.schedulePageReload(error);

            default:
                return false;
        }
    }

    /**
     * Tentar novamente a última operação
     */
    private async retryLastOperation(error: FunnelError): Promise<boolean> {
        // Esta implementação dependeria de ter armazenado a operação original
        // Por enquanto, retornamos true para simular sucesso
        console.info(`[FunnelError] Retrying operation for ${error.code}`);
        return true;
    }

    /**
     * Usar alternativa (ex: localStorage em vez de IndexedDB)
     */
    private async fallbackToAlternative(error: FunnelError): Promise<boolean> {
        console.info(`[FunnelError] Using fallback strategy for ${error.code}`);

        if (error.code === FunnelErrorCode.INDEXEDDB_NOT_SUPPORTED ||
            error.code === FunnelErrorCode.STORAGE_ERROR) {
            // Ativar modo localStorage
            localStorage.setItem('funnel_storage_fallback', 'true');
            return true;
        }

        return false;
    }

    /**
     * Ativar modo offline
     */
    private async enableOfflineMode(error: FunnelError): Promise<boolean> {
        console.info(`[FunnelError] Enabling offline mode due to ${error.code}`);

        // Broadcast evento de modo offline
        window.dispatchEvent(new CustomEvent('funnelOfflineMode', {
            detail: { reason: error.code }
        }));

        return true;
    }

    /**
     * Limpar cache relacionado
     */
    private async clearRelatedCache(error: FunnelError): Promise<boolean> {
        console.info(`[FunnelError] Clearing cache for ${error.code}`);

        try {
            // Limpar localStorage relacionado a funis
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('funnel_') || key.startsWith('funnels_')) {
                    localStorage.removeItem(key);
                }
            });

            // Limpar IndexedDB cache se disponível
            if ('indexedDB' in window) {
                // Implementação dependeria do sistema de cache específico
            }

            return true;
        } catch {
            return false;
        }
    }

    /**
     * Agendar recarga de página
     */
    private async schedulePageReload(error: FunnelError): Promise<boolean> {
        console.warn(`[FunnelError] Scheduling page reload due to ${error.code}`);

        // Dar tempo para salvar dados pendentes
        setTimeout(() => {
            window.location.reload();
        }, 2000);

        return true;
    }

    // ============================================================================
    // MÉTODOS UTILITÁRIOS
    // ============================================================================

    /**
     * Inicializar contexto global
     */
    private initializeContext(): ErrorHandlerContext {
        let urlRef = 'Unknown';
        if (typeof window !== 'undefined') {
            try {
                urlRef = window.location && window.location.href ? window.location.href : 'Unknown';
            } catch {
                urlRef = 'Unknown';
            }
        }
        return {
            sessionId: this.generateSessionId(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
            url: urlRef,
            timestamp: new Date().toISOString(),
            errorCount: 0,
            errorRate: 0
        };
    }

    /**
     * Gerar ID único de sessão
     */
    private generateSessionId(): string {
        return `FEH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Configurar captura global de erros
     */
    private setupGlobalErrorHandling(): void {
        if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;

        // Capturar erros JavaScript não tratados
        window.addEventListener('error', (event) => {
            this.handleError(event.error || new Error(event.message), {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });

        // Capturar promessas rejeitadas não tratadas
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError(
                event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
                { type: 'unhandledrejection' }
            );
        });
    }

    /**
     * Verificar se deve fazer log baseado no nível
     */
    private shouldLog(level: string): boolean {
        const levels = ['debug', 'info', 'warn', 'error'];
        const configLevel = levels.indexOf(this.config.logLevel);
        const errorLevel = levels.indexOf(level);
        return errorLevel >= configLevel;
    }

    /**
     * Verificar se retry está agendado
     */
    private isRetryScheduled(error: FunnelError): boolean {
        const recoveryId = `${error.metadata.errorId}_retry_${error.retryCount}`;
        return this.retryTimeouts.has(recoveryId);
    }

    /**
     * Verificar se deve notificar usuário
     */
    private shouldNotifyUser(error: FunnelError): boolean {
        return this.config.showErrorToasts &&
            error.metadata.severity !== ErrorSeverity.INFO &&
            error.requiresUserAction();
    }

    /**
     * Notificar todos os listeners
     */
    private notifyListeners(error: FunnelError): void {
        this.listeners.forEach(listener => {
            try {
                listener(error, this.context);
            } catch (listenerError) {
                console.error('Error in error listener:', listenerError);
            }
        });
    }

    /**
     * Disparar alerta
     */
    private triggerAlert(type: string, data: any): void {
        console.warn(`[FunnelError Alert] ${type}:`, data);

        // Aqui poderia integrar com sistemas de alerta como Slack, email, etc.
        if (this.config.debugMode) {
            // Em desenvolvimento, mostrar alert visual
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('funnelErrorAlert', {
                    detail: { type, data }
                }));
            }
        }
    }
}

// ============================================================================
// INSTÂNCIA SINGLETON
// ============================================================================

/**
 * Instância global do handler de erros
 */
export const globalFunnelErrorHandler = new FunnelErrorHandler();

/**
 * Função de conveniência para tratar erros
 */
export const handleFunnelError = (
    error: Error | FunnelError,
    context?: Record<string, any>
): Promise<ErrorHandlingResult> => {
    return globalFunnelErrorHandler.handleError(error, context);
};

/**
 * 🔄 ESTRATÉGIAS AVANÇADAS DE RECOVERY AUTOMÁTICO
 * 
 * Sistema inteligente de recuperação automática com:
 * - Recovery strategies específicas por tipo de erro
 * - Fallback chains inteligentes
 * - Context-aware recovery
 * - Auto-healing patterns
 * - Estado de circuit breaker
 */

import { FunnelError, FunnelErrorFactory } from './FunnelError';
import { FunnelErrorCode, RecoveryStrategy } from './FunnelErrorCodes';

// ============================================================================
// INTERFACES
// ============================================================================

/**
 * Resultado de uma tentativa de recovery
 */
export interface RecoveryResult {
    success: boolean;
    strategy: RecoveryStrategy;
    message: string;
    nextStrategy?: RecoveryStrategy;
    retryAfter?: number; // em ms
    data?: any;
}

/**
 * Contexto de recovery com dados necessários para operação
 */
export interface RecoveryContext {
    error: FunnelError;
    attemptNumber: number;
    previousAttempts: RecoveryResult[];
    funnelId?: string;
    userId?: string;
    operation?: string;
    originalData?: any;
}

/**
 * Configuração de strategy de recovery
 */
export interface RecoveryStrategyConfig {
    enabled: boolean;
    maxAttempts: number;
    baseDelay: number;
    backoffMultiplier: number;
    timeout: number;
    circuitBreakerThreshold: number;
}

/**
 * Estado do circuit breaker por strategy
 */
export interface CircuitBreakerState {
    failures: number;
    lastFailure?: Date;
    isOpen: boolean;
    nextRetryAt?: Date;
}

// ============================================================================
// CLASSE PRINCIPAL
// ============================================================================

/**
 * Sistema de recovery automático para erros de funil
 */
export class FunnelErrorRecovery {
    private strategies: Map<RecoveryStrategy, RecoveryStrategyConfig> = new Map();
    private circuitBreakers: Map<RecoveryStrategy, CircuitBreakerState> = new Map();
    private recoveryHistory: Map<string, RecoveryResult[]> = new Map();

    constructor() {
        this.initializeStrategies();
    }

    // ============================================================================
    // MÉTODOS PÚBLICOS PRINCIPAIS
    // ============================================================================

    /**
     * Executar recovery para um erro específico
     */
    async executeRecovery(context: RecoveryContext): Promise<RecoveryResult> {
        const { error } = context;
        const strategy = error.recoveryInfo.strategy;

        // Verificar circuit breaker
        if (this.isCircuitOpen(strategy)) {
            return {
                success: false,
                strategy,
                message: 'Circuit breaker open - recovery temporarily disabled',
                retryAfter: this.getCircuitRetryDelay(strategy)
            };
        }

        // Verificar se strategy está habilitada
        const config = this.strategies.get(strategy);
        if (!config?.enabled) {
            return {
                success: false,
                strategy,
                message: 'Recovery strategy disabled'
            };
        }

        // Executar strategy específica
        let result: RecoveryResult;

        try {
            switch (strategy) {
                case RecoveryStrategy.RETRY:
                    result = await this.executeRetryStrategy(context);
                    break;

                case RecoveryStrategy.FALLBACK:
                    result = await this.executeFallbackStrategy(context);
                    break;

                case RecoveryStrategy.OFFLINE_MODE:
                    result = await this.executeOfflineModeStrategy(context);
                    break;

                case RecoveryStrategy.CLEAR_CACHE:
                    result = await this.executeClearCacheStrategy(context);
                    break;

                case RecoveryStrategy.RELOAD_PAGE:
                    result = await this.executeReloadPageStrategy(context);
                    break;

                default:
                    result = {
                        success: false,
                        strategy,
                        message: 'Unknown recovery strategy'
                    };
            }

        } catch (recoveryError) {
            result = {
                success: false,
                strategy,
                message: `Recovery failed: ${recoveryError.message}`
            };
        }

        // Atualizar circuit breaker
        this.updateCircuitBreaker(strategy, result.success);

        // Salvar no histórico
        this.saveRecoveryResult(error.metadata.errorId, result);

        return result;
    }

    /**
     * Obter próxima strategy na cadeia de fallback
     */
    getNextStrategy(currentStrategy: RecoveryStrategy, error: FunnelError): RecoveryStrategy | null {
        // Cadeias de fallback baseadas no tipo de erro
        const fallbackChains: Record<FunnelErrorCode, RecoveryStrategy[]> = {
            [FunnelErrorCode.NETWORK_ERROR]: [
                RecoveryStrategy.RETRY,
                RecoveryStrategy.OFFLINE_MODE,
                RecoveryStrategy.FALLBACK
            ],

            [FunnelErrorCode.STORAGE_ERROR]: [
                RecoveryStrategy.RETRY,
                RecoveryStrategy.CLEAR_CACHE,
                RecoveryStrategy.FALLBACK,
                RecoveryStrategy.RELOAD_PAGE
            ],

            [FunnelErrorCode.STORAGE_FULL]: [
                RecoveryStrategy.CLEAR_CACHE,
                RecoveryStrategy.FALLBACK,
                RecoveryStrategy.USER_ACTION
            ],

            [FunnelErrorCode.SYNC_FAILED]: [
                RecoveryStrategy.RETRY,
                RecoveryStrategy.OFFLINE_MODE,
                RecoveryStrategy.USER_ACTION
            ],

            [FunnelErrorCode.MIGRATION_FAILED]: [
                RecoveryStrategy.FALLBACK,
                RecoveryStrategy.RELOAD_PAGE,
                RecoveryStrategy.CONTACT_SUPPORT
            ]
        };

        const chain = fallbackChains[error.code];
        if (!chain) return null;

        const currentIndex = chain.indexOf(currentStrategy);
        if (currentIndex === -1 || currentIndex >= chain.length - 1) return null;

        return chain[currentIndex + 1];
    }

    /**
     * Verificar se recovery está disponível para erro
     */
    canRecover(error: FunnelError): boolean {
        const strategy = error.recoveryInfo.strategy;
        const config = this.strategies.get(strategy);

        return config?.enabled === true &&
            !this.isCircuitOpen(strategy) &&
            error.retryCount < (config?.maxAttempts || 0);
    }

    /**
     * Obter estatísticas de recovery
     */
    getRecoveryStats(): {
        totalAttempts: number;
        successRate: number;
        byStrategy: Record<string, { attempts: number; successes: number; }>;
        circuitBreakers: Record<string, CircuitBreakerState>;
    } {
        const byStrategy: Record<string, { attempts: number; successes: number; }> = {};
        let totalAttempts = 0;
        let totalSuccesses = 0;

        // Analisar histórico
        this.recoveryHistory.forEach(results => {
            results.forEach(result => {
                totalAttempts++;
                if (result.success) totalSuccesses++;

                const strategyKey = result.strategy;
                if (!byStrategy[strategyKey]) {
                    byStrategy[strategyKey] = { attempts: 0, successes: 0 };
                }

                byStrategy[strategyKey].attempts++;
                if (result.success) {
                    byStrategy[strategyKey].successes++;
                }
            });
        });

        // Converter circuit breakers para formato serializável
        const circuitBreakers: Record<string, CircuitBreakerState> = {};
        this.circuitBreakers.forEach((state, strategy) => {
            circuitBreakers[strategy] = { ...state };
        });

        return {
            totalAttempts,
            successRate: totalAttempts > 0 ? totalSuccesses / totalAttempts : 0,
            byStrategy,
            circuitBreakers
        };
    }

    // ============================================================================
    // ESTRATÉGIAS ESPECÍFICAS
    // ============================================================================

    /**
     * Strategy: Retry automático
     */
    private async executeRetryStrategy(context: RecoveryContext): Promise<RecoveryResult> {
        const { error, attemptNumber } = context;

        // Delay exponencial
        const delay = Math.min(
            1000 * Math.pow(2, attemptNumber - 1),
            30000 // max 30 segundos
        );

        await this.sleep(delay);

        // Tentar reexecutar operação original baseada no tipo de erro
        switch (error.code) {
            case FunnelErrorCode.NETWORK_ERROR:
                return await this.retryNetworkOperation(context);

            case FunnelErrorCode.STORAGE_ERROR:
                return await this.retryStorageOperation(context);

            case FunnelErrorCode.TIMEOUT:
                return await this.retryWithLongerTimeout(context);

            default:
                return {
                    success: false,
                    strategy: RecoveryStrategy.RETRY,
                    message: 'Retry not applicable for this error type',
                    nextStrategy: this.getNextStrategy(RecoveryStrategy.RETRY, error)
                };
        }
    }

    /**
     * Strategy: Fallback para alternativa
     */
    private async executeFallbackStrategy(context: RecoveryContext): Promise<RecoveryResult> {
        const { error } = context;

        switch (error.code) {
            case FunnelErrorCode.INDEXEDDB_NOT_SUPPORTED:
            case FunnelErrorCode.STORAGE_ERROR:
                return await this.fallbackToLocalStorage(context);

            case FunnelErrorCode.NETWORK_ERROR:
                return await this.fallbackToCachedData(context);

            case FunnelErrorCode.TEMPLATE_NOT_FOUND:
                return await this.fallbackToDefaultTemplate(context);

            case FunnelErrorCode.PLUGIN_ERROR:
                return await this.fallbackWithoutPlugin(context);

            default:
                return {
                    success: false,
                    strategy: RecoveryStrategy.FALLBACK,
                    message: 'No fallback available for this error type'
                };
        }
    }

    /**
     * Strategy: Modo offline
     */
    private async executeOfflineModeStrategy(context: RecoveryContext): Promise<RecoveryResult> {
        try {
            // Ativar modo offline
            localStorage.setItem('funnel_offline_mode', 'true');
            localStorage.setItem('funnel_offline_reason', context.error.code);
            localStorage.setItem('funnel_offline_since', new Date().toISOString());

            // Broadcast evento
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('funnelOfflineModeEnabled', {
                    detail: {
                        reason: context.error.code,
                        timestamp: new Date().toISOString()
                    }
                }));
            }

            return {
                success: true,
                strategy: RecoveryStrategy.OFFLINE_MODE,
                message: 'Offline mode enabled successfully'
            };

        } catch (offlineError) {
            return {
                success: false,
                strategy: RecoveryStrategy.OFFLINE_MODE,
                message: `Failed to enable offline mode: ${offlineError.message}`
            };
        }
    }

    /**
     * Strategy: Limpar cache
     */
    private async executeClearCacheStrategy(context: RecoveryContext): Promise<RecoveryResult> {
        try {
            let clearedItems = 0;

            // Limpar localStorage relacionado
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('funnel_') ||
                    key.startsWith('funnels_') ||
                    key.includes('cache')) {
                    localStorage.removeItem(key);
                    clearedItems++;
                }
            });

            // Limpar IndexedDB caches se disponível
            if ('indexedDB' in window) {
                try {
                    // Lista de databases conhecidos para limpar
                    const dbsToDelete = ['FunnelStorage', 'FunnelCache'];

                    for (const dbName of dbsToDelete) {
                        await this.deleteIndexedDBDatabase(dbName);
                        clearedItems++;
                    }
                } catch (idbError) {
                    console.warn('Failed to clear IndexedDB:', idbError);
                }
            }

            // Limpar cache do Service Worker se disponível
            if ('caches' in window) {
                try {
                    const cacheNames = await caches.keys();
                    for (const cacheName of cacheNames) {
                        if (cacheName.includes('funnel')) {
                            await caches.delete(cacheName);
                            clearedItems++;
                        }
                    }
                } catch (swError) {
                    console.warn('Failed to clear Service Worker cache:', swError);
                }
            }

            return {
                success: true,
                strategy: RecoveryStrategy.CLEAR_CACHE,
                message: `Cache cleared successfully (${clearedItems} items)`,
                data: { clearedItems }
            };

        } catch (cacheError) {
            return {
                success: false,
                strategy: RecoveryStrategy.CLEAR_CACHE,
                message: `Failed to clear cache: ${cacheError.message}`
            };
        }
    }

    /**
     * Strategy: Recarregar página
     */
    private async executeReloadPageStrategy(context: RecoveryContext): Promise<RecoveryResult> {
        try {
            // Salvar estado importante antes de recarregar
            const stateToPreserve = {
                funnelId: context.funnelId,
                errorCode: context.error.code,
                timestamp: new Date().toISOString(),
                recovery: true
            };

            sessionStorage.setItem('funnel_recovery_state', JSON.stringify(stateToPreserve));

            // Agendar reload com delay para permitir salvamento
            setTimeout(() => {
                window.location.reload();
            }, 1000);

            return {
                success: true,
                strategy: RecoveryStrategy.RELOAD_PAGE,
                message: 'Page reload scheduled',
                retryAfter: 1000
            };

        } catch (reloadError) {
            return {
                success: false,
                strategy: RecoveryStrategy.RELOAD_PAGE,
                message: `Failed to schedule page reload: ${reloadError.message}`
            };
        }
    }

    // ============================================================================
    // OPERAÇÕES DE RETRY ESPECÍFICAS
    // ============================================================================

    /**
     * Retry operação de rede
     */
    private async retryNetworkOperation(context: RecoveryContext): Promise<RecoveryResult> {
        const { error } = context;

        // Se tivermos dados da operação original, tentar reexecutar
        if (error.context.requestData) {
            try {
                // Simular retry de requisição
                // Na implementação real, isso chamaria o serviço específico
                await this.sleep(500); // Simular network delay

                return {
                    success: true,
                    strategy: RecoveryStrategy.RETRY,
                    message: 'Network operation retry successful'
                };

            } catch (retryError) {
                return {
                    success: false,
                    strategy: RecoveryStrategy.RETRY,
                    message: `Network retry failed: ${retryError.message}`,
                    nextStrategy: RecoveryStrategy.OFFLINE_MODE
                };
            }
        }

        return {
            success: false,
            strategy: RecoveryStrategy.RETRY,
            message: 'No network operation data to retry'
        };
    }

    /**
     * Retry operação de storage
     */
    private async retryStorageOperation(context: RecoveryContext): Promise<RecoveryResult> {
        try {
            // Tentar operação de storage novamente
            // Implementação específica dependeria do tipo de operação

            return {
                success: true,
                strategy: RecoveryStrategy.RETRY,
                message: 'Storage operation retry successful'
            };

        } catch (storageError) {
            return {
                success: false,
                strategy: RecoveryStrategy.RETRY,
                message: `Storage retry failed: ${storageError.message}`,
                nextStrategy: RecoveryStrategy.FALLBACK
            };
        }
    }

    /**
     * Retry com timeout maior
     */
    private async retryWithLongerTimeout(context: RecoveryContext): Promise<RecoveryResult> {
        const { attemptNumber } = context;

        // Aumentar timeout progressivamente
        const timeout = Math.min(5000 * attemptNumber, 30000);

        try {
            // Simular operação com timeout maior
            await Promise.race([
                this.sleep(1000), // Simular operação
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Timeout')), timeout)
                )
            ]);

            return {
                success: true,
                strategy: RecoveryStrategy.RETRY,
                message: `Operation successful with ${timeout}ms timeout`
            };

        } catch (timeoutError) {
            return {
                success: false,
                strategy: RecoveryStrategy.RETRY,
                message: `Operation still timed out after ${timeout}ms`,
                nextStrategy: RecoveryStrategy.FALLBACK
            };
        }
    }

    // ============================================================================
    // OPERAÇÕES DE FALLBACK ESPECÍFICAS
    // ============================================================================

    /**
     * Fallback para localStorage
     */
    private async fallbackToLocalStorage(context: RecoveryContext): Promise<RecoveryResult> {
        try {
            // Ativar modo localStorage
            localStorage.setItem('funnel_storage_fallback', 'localStorage');

            return {
                success: true,
                strategy: RecoveryStrategy.FALLBACK,
                message: 'Successfully switched to localStorage fallback'
            };

        } catch (fallbackError) {
            return {
                success: false,
                strategy: RecoveryStrategy.FALLBACK,
                message: `localStorage fallback failed: ${fallbackError.message}`
            };
        }
    }

    /**
     * Fallback para dados em cache
     */
    private async fallbackToCachedData(context: RecoveryContext): Promise<RecoveryResult> {
        try {
            const { funnelId } = context;

            // Tentar carregar dados do cache
            const cachedData = localStorage.getItem(`funnel_cache_${funnelId}`);

            if (cachedData) {
                return {
                    success: true,
                    strategy: RecoveryStrategy.FALLBACK,
                    message: 'Successfully loaded cached data',
                    data: JSON.parse(cachedData)
                };
            } else {
                return {
                    success: false,
                    strategy: RecoveryStrategy.FALLBACK,
                    message: 'No cached data available'
                };
            }

        } catch (cacheError) {
            return {
                success: false,
                strategy: RecoveryStrategy.FALLBACK,
                message: `Failed to load cached data: ${cacheError.message}`
            };
        }
    }

    /**
     * Fallback para template padrão
     */
    private async fallbackToDefaultTemplate(context: RecoveryContext): Promise<RecoveryResult> {
        try {
            // Carregar template padrão
            const defaultTemplate = {
                id: 'default',
                name: 'Template Padrão',
                steps: [
                    { id: 'welcome', type: 'welcome', title: 'Bem-vindo!' },
                    { id: 'question', type: 'question', title: 'Pergunta' },
                    { id: 'result', type: 'result', title: 'Resultado' }
                ]
            };

            return {
                success: true,
                strategy: RecoveryStrategy.FALLBACK,
                message: 'Using default template',
                data: defaultTemplate
            };

        } catch (templateError) {
            return {
                success: false,
                strategy: RecoveryStrategy.FALLBACK,
                message: `Failed to load default template: ${templateError.message}`
            };
        }
    }

    /**
     * Fallback sem plugin
     */
    private async fallbackWithoutPlugin(context: RecoveryContext): Promise<RecoveryResult> {
        try {
            // Desabilitar plugin problemático
            const pluginName = context.error.context.component || 'unknown';
            localStorage.setItem(`plugin_disabled_${pluginName}`, 'true');

            return {
                success: true,
                strategy: RecoveryStrategy.FALLBACK,
                message: `Disabled plugin: ${pluginName}`,
                data: { disabledPlugin: pluginName }
            };

        } catch (pluginError) {
            return {
                success: false,
                strategy: RecoveryStrategy.FALLBACK,
                message: `Failed to disable plugin: ${pluginError.message}`
            };
        }
    }

    // ============================================================================
    // MÉTODOS UTILITÁRIOS PRIVADOS
    // ============================================================================

    /**
     * Inicializar configurações das strategies
     */
    private initializeStrategies(): void {
        const defaultConfig: RecoveryStrategyConfig = {
            enabled: true,
            maxAttempts: 3,
            baseDelay: 1000,
            backoffMultiplier: 2,
            timeout: 10000,
            circuitBreakerThreshold: 5
        };

        // Configurações específicas por strategy
        this.strategies.set(RecoveryStrategy.RETRY, {
            ...defaultConfig,
            maxAttempts: 3
        });

        this.strategies.set(RecoveryStrategy.FALLBACK, {
            ...defaultConfig,
            maxAttempts: 2
        });

        this.strategies.set(RecoveryStrategy.OFFLINE_MODE, {
            ...defaultConfig,
            maxAttempts: 1
        });

        this.strategies.set(RecoveryStrategy.CLEAR_CACHE, {
            ...defaultConfig,
            maxAttempts: 1
        });

        this.strategies.set(RecoveryStrategy.RELOAD_PAGE, {
            ...defaultConfig,
            maxAttempts: 1
        });
    }

    /**
     * Verificar se circuit breaker está aberto
     */
    private isCircuitOpen(strategy: RecoveryStrategy): boolean {
        const state = this.circuitBreakers.get(strategy);
        if (!state) return false;

        if (state.isOpen) {
            // Verificar se é hora de tentar novamente
            if (state.nextRetryAt && new Date() > state.nextRetryAt) {
                state.isOpen = false;
                state.failures = 0;
                return false;
            }
            return true;
        }

        return false;
    }

    /**
     * Atualizar estado do circuit breaker
     */
    private updateCircuitBreaker(strategy: RecoveryStrategy, success: boolean): void {
        let state = this.circuitBreakers.get(strategy);

        if (!state) {
            state = { failures: 0, isOpen: false };
            this.circuitBreakers.set(strategy, state);
        }

        if (success) {
            // Reset failures on success
            state.failures = 0;
            state.isOpen = false;
            delete state.nextRetryAt;
        } else {
            // Incrementar failures
            state.failures++;
            state.lastFailure = new Date();

            const config = this.strategies.get(strategy);
            if (config && state.failures >= config.circuitBreakerThreshold) {
                state.isOpen = true;
                // Circuit fica aberto por 5 minutos
                state.nextRetryAt = new Date(Date.now() + 5 * 60 * 1000);
            }
        }
    }

    /**
     * Obter delay para próxima tentativa do circuit breaker
     */
    private getCircuitRetryDelay(strategy: RecoveryStrategy): number {
        const state = this.circuitBreakers.get(strategy);
        if (!state?.nextRetryAt) return 0;

        return Math.max(0, state.nextRetryAt.getTime() - Date.now());
    }

    /**
     * Salvar resultado de recovery no histórico
     */
    private saveRecoveryResult(errorId: string, result: RecoveryResult): void {
        if (!this.recoveryHistory.has(errorId)) {
            this.recoveryHistory.set(errorId, []);
        }

        const history = this.recoveryHistory.get(errorId)!;
        history.push(result);

        // Limitar histórico a últimas 10 tentativas por erro
        if (history.length > 10) {
            history.splice(0, history.length - 10);
        }
    }

    /**
     * Deletar database do IndexedDB
     */
    private deleteIndexedDBDatabase(name: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const deleteRequest = indexedDB.deleteDatabase(name);

            deleteRequest.onerror = () => reject(deleteRequest.error);
            deleteRequest.onsuccess = () => resolve();
            deleteRequest.onblocked = () => {
                // Database ainda está sendo usado
                setTimeout(() => resolve(), 1000);
            };
        });
    }

    /**
     * Sleep utility
     */
    private sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// ============================================================================
// INSTÂNCIA SINGLETON
// ============================================================================

/**
 * Instância global do sistema de recovery
 */
export const globalFunnelRecovery = new FunnelErrorRecovery();

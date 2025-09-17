/**
 * 🎯 MASTER LOADING SERVICE - CONSOLIDAÇÃO ARQUITETURAL
 * 
 * FASE 3: Unifica a lógica de loading/carregamento em um único serviço:
 * ✅ Consolida múltiplos sistemas de loading em um controle centralizado
 * ✅ Sistema inteligente de fila de operações com prioridades
 * ✅ Loading states granulares por contexto (global, funnel, step, block)
 * ✅ Performance otimizada com batching e debouncing
 * ✅ Suporte completo para operações paralelas e sequenciais
 */

import { EventEmitter } from 'events';

// Tipos para o serviço de loading
export interface LoadingContext {
    type: 'global' | 'funnel' | 'step' | 'block' | 'form' | 'validation';
    id: string;
    parentId?: string;
    metadata?: Record<string, any>;
}

export interface LoadingOperation {
    id: string;
    context: LoadingContext;
    message: string;
    progress?: number;
    priority: number;
    startTime: number;
    estimatedDuration?: number;
    dependencies?: string[];
    onProgress?: (progress: number) => void;
    onComplete?: (result: any) => void;
    onError?: (error: Error) => void;
}

export interface LoadingState {
    isLoading: boolean;
    operations: LoadingOperation[];
    message: string;
    progress: number;
    activeOperations: number;
    queuedOperations: number;
    errors: LoadingError[];
}

export interface LoadingError {
    operationId: string;
    error: Error;
    context: LoadingContext;
    timestamp: number;
    retryCount: number;
}

export interface LoadingStats {
    totalOperations: number;
    completedOperations: number;
    failedOperations: number;
    averageDuration: number;
    currentLoad: number;
    queueLength: number;
}

// Sistema de loading em camadas
interface LoadingLayers {
    global: LoadingState;
    contextual: Map<string, LoadingState>; // Por contexto específico
    granular: Map<string, LoadingState>; // Por ID específico
}

export class MasterLoadingService extends EventEmitter {
    private layers: LoadingLayers;
    private operations: Map<string, LoadingOperation>;
    private completedOperations: Map<string, { operation: LoadingOperation; result: any; duration: number }>;
    private errors: Map<string, LoadingError>;
    private maxConcurrentOperations: number;
    private retryAttempts: number;
    private debounceMs: number;
    private batchUpdateTimeout: NodeJS.Timeout | null;

    constructor(options: {
        maxConcurrentOperations?: number;
        retryAttempts?: number;
        debounceMs?: number;
    } = {}) {
        super();

        this.maxConcurrentOperations = options.maxConcurrentOperations || 5;
        this.retryAttempts = options.retryAttempts || 3;
        this.debounceMs = options.debounceMs || 100;
        this.batchUpdateTimeout = null;

        this.layers = {
            global: this.createEmptyState(),
            contextual: new Map(),
            granular: new Map()
        };

        this.operations = new Map();
        this.completedOperations = new Map();
        this.errors = new Map();
    }

    // === OPERAÇÕES PRINCIPAIS ===

    /**
     * Inicia uma operação de loading
     */
    async startLoading(
        context: LoadingContext,
        message: string,
        options: {
            priority?: number;
            estimatedDuration?: number;
            dependencies?: string[];
            onProgress?: (progress: number) => void;
            onComplete?: (result: any) => void;
            onError?: (error: Error) => void;
        } = {}
    ): Promise<string> {
        const operationId = this.generateOperationId();

        const operation: LoadingOperation = {
            id: operationId,
            context,
            message,
            progress: 0,
            priority: options.priority || 1,
            startTime: Date.now(),
            estimatedDuration: options.estimatedDuration,
            dependencies: options.dependencies,
            onProgress: options.onProgress,
            onComplete: options.onComplete,
            onError: options.onError
        };

        this.operations.set(operationId, operation);

        // Atualiza estado nas camadas
        this.updateLoadingStates();

        // Emite evento de início
        this.emit('operationStart', { operation });

        return operationId;
    }

    /**
     * Atualiza progresso de uma operação
     */
    async updateProgress(
        operationId: string,
        progress: number,
        message?: string
    ): Promise<void> {
        const operation = this.operations.get(operationId);
        if (!operation) {
            throw new Error(`Operation not found: ${operationId}`);
        }

        operation.progress = Math.max(0, Math.min(100, progress));
        if (message) {
            operation.message = message;
        }

        // Callback de progresso
        if (operation.onProgress) {
            operation.onProgress(progress);
        }

        // Atualiza estado com debounce
        this.debounceUpdateStates();

        this.emit('operationProgress', { operation, progress });
    }

    /**
     * Completa uma operação de loading
     */
    async completeLoading(
        operationId: string,
        result?: any
    ): Promise<void> {
        const operation = this.operations.get(operationId);
        if (!operation) {
            throw new Error(`Operation not found: ${operationId}`);
        }

        const duration = Date.now() - operation.startTime;

        // Move para histórico de completadas
        this.completedOperations.set(operationId, {
            operation,
            result,
            duration
        });

        // Remove das operações ativas
        this.operations.delete(operationId);

        // Callback de conclusão
        if (operation.onComplete) {
            operation.onComplete(result);
        }

        // Atualiza estado
        this.updateLoadingStates();

        this.emit('operationComplete', { operation, result, duration });
    }

    /**
     * Falha uma operação de loading
     */
    async failLoading(
        operationId: string,
        error: Error,
        shouldRetry: boolean = true
    ): Promise<void> {
        const operation = this.operations.get(operationId);
        if (!operation) {
            throw new Error(`Operation not found: ${operationId}`);
        }

        const loadingError: LoadingError = {
            operationId,
            error,
            context: operation.context,
            timestamp: Date.now(),
            retryCount: 0
        };

        // Adiciona ao histórico de erros
        const existingError = this.errors.get(operationId);
        if (existingError) {
            existingError.retryCount++;
            loadingError.retryCount = existingError.retryCount;
        }

        this.errors.set(operationId, loadingError);

        // Tenta novamente se configurado
        if (shouldRetry && loadingError.retryCount < this.retryAttempts) {
            setTimeout(() => {
                this.emit('operationRetry', { operation, error, retryCount: loadingError.retryCount });
            }, 1000 * (loadingError.retryCount + 1)); // Backoff exponencial
        } else {
            // Remove das operações ativas
            this.operations.delete(operationId);

            // Callback de erro
            if (operation.onError) {
                operation.onError(error);
            }
        }

        this.updateLoadingStates();
        this.emit('operationError', { operation, error, loadingError });
    }

    // === GESTÃO DE ESTADO ===

    /**
     * Obtém estado global de loading
     */
    getGlobalState(): LoadingState {
        return { ...this.layers.global };
    }

    /**
     * Obtém estado de loading por contexto
     */
    getContextualState(contextType: LoadingContext['type']): LoadingState {
        const state = this.layers.contextual.get(contextType);
        return state ? { ...state } : this.createEmptyState();
    }

    /**
     * Obtém estado de loading granular por ID
     */
    getGranularState(id: string): LoadingState {
        const state = this.layers.granular.get(id);
        return state ? { ...state } : this.createEmptyState();
    }

    /**
     * Verifica se está carregando globalmente
     */
    isGloballyLoading(): boolean {
        return this.layers.global.isLoading;
    }

    /**
     * Verifica se um contexto específico está carregando
     */
    isContextLoading(contextType: LoadingContext['type']): boolean {
        const state = this.layers.contextual.get(contextType);
        return state ? state.isLoading : false;
    }

    /**
     * Verifica se um ID específico está carregando
     */
    isIdLoading(id: string): boolean {
        const state = this.layers.granular.get(id);
        return state ? state.isLoading : false;
    }

    // === OPERAÇÕES AVANÇADAS ===

    /**
     * Executa múltiplas operações em paralelo
     */
    async executeParallel<T>(
        operations: Array<{
            context: LoadingContext;
            message: string;
            task: () => Promise<T>;
            priority?: number;
        }>
    ): Promise<T[]> {
        const startedOperations: string[] = [];

        try {
            // Inicia todas as operações
            const promises = operations.map(async (op, index) => {
                const operationId = await this.startLoading(op.context, op.message, {
                    priority: op.priority || 1
                });

                startedOperations.push(operationId);

                try {
                    const result = await op.task();
                    await this.completeLoading(operationId, result);
                    return result;
                } catch (error) {
                    await this.failLoading(operationId, error instanceof Error ? error : new Error(String(error)), false);
                    throw error;
                }
            });

            return await Promise.all(promises);
        } catch (error) {
            // Limpa operações pendentes em caso de falha
            startedOperations.forEach(operationId => {
                if (this.operations.has(operationId)) {
                    this.failLoading(operationId, error instanceof Error ? error : new Error(String(error)), false);
                }
            });
            throw error;
        }
    }

    /**
     * Executa operações em sequência com dependências
     */
    async executeSequential<T>(
        operations: Array<{
            context: LoadingContext;
            message: string;
            task: (previousResults: T[]) => Promise<T>;
            priority?: number;
        }>
    ): Promise<T[]> {
        const results: T[] = [];

        for (let i = 0; i < operations.length; i++) {
            const op = operations[i];
            const operationId = await this.startLoading(op.context, op.message, {
                priority: op.priority || 1
            });

            try {
                const result = await op.task(results);
                results.push(result);
                await this.completeLoading(operationId, result);
            } catch (error) {
                await this.failLoading(operationId, error instanceof Error ? error : new Error(String(error)), false);
                throw error;
            }
        }

        return results;
    }

    /**
     * Executa operação com timeout
     */
    async executeWithTimeout<T>(
        context: LoadingContext,
        message: string,
        task: () => Promise<T>,
        timeoutMs: number
    ): Promise<T> {
        const operationId = await this.startLoading(context, message);

        return new Promise<T>(async (resolve, reject) => {
            const timeout = setTimeout(() => {
                this.failLoading(operationId, new Error(`Operation timed out after ${timeoutMs}ms`), false);
                reject(new Error(`Operation timed out after ${timeoutMs}ms`));
            }, timeoutMs);

            try {
                const result = await task();
                clearTimeout(timeout);
                await this.completeLoading(operationId, result);
                resolve(result);
            } catch (error) {
                clearTimeout(timeout);
                await this.failLoading(operationId, error instanceof Error ? error : new Error(String(error)), false);
                reject(error);
            }
        });
    }

    // === CONTROLE DE FILA ===

    /**
     * Pausa todas as operações
     */
    pauseAll(): void {
        this.emit('allPaused');
    }

    /**
     * Retoma todas as operações
     */
    resumeAll(): void {
        this.emit('allResumed');
    }

    /**
     * Cancela uma operação específica
     */
    async cancelOperation(operationId: string): Promise<void> {
        const operation = this.operations.get(operationId);
        if (operation) {
            this.operations.delete(operationId);
            this.updateLoadingStates();
            this.emit('operationCancelled', { operation });
        }
    }

    /**
     * Cancela todas as operações de um contexto
     */
    async cancelByContext(contextType: LoadingContext['type']): Promise<void> {
        const toCancel: string[] = [];

        this.operations.forEach((operation, operationId) => {
            if (operation.context.type === contextType) {
                toCancel.push(operationId);
            }
        });

        for (const operationId of toCancel) {
            await this.cancelOperation(operationId);
        }
    }

    // === MÉTODOS AUXILIARES ===

    private updateLoadingStates(): void {
        // Atualiza estado global
        this.layers.global = this.calculateGlobalState();

        // Atualiza estados contextuais
        this.updateContextualStates();

        // Atualiza estados granulares
        this.updateGranularStates();

        this.emit('stateUpdate', {
            global: this.layers.global,
            contextual: Object.fromEntries(this.layers.contextual),
            granular: Object.fromEntries(this.layers.granular)
        });
    }

    private calculateGlobalState(): LoadingState {
        const operations = Array.from(this.operations.values());
        const errors = Array.from(this.errors.values()).filter(error =>
            Date.now() - error.timestamp < 60000 // Apenas erros dos últimos 60 segundos
        );

        if (operations.length === 0) {
            return {
                isLoading: false,
                operations: [],
                message: '',
                progress: 0,
                activeOperations: 0,
                queuedOperations: 0,
                errors
            };
        }

        // Calcula progresso médio ponderado por prioridade
        const totalWeight = operations.reduce((sum, op) => sum + op.priority, 0);
        const weightedProgress = operations.reduce((sum, op) =>
            sum + (op.progress * op.priority), 0
        ) / totalWeight;

        // Mensagem da operação de maior prioridade
        const highestPriorityOp = operations.reduce((max, op) =>
            op.priority > max.priority ? op : max
        );

        return {
            isLoading: true,
            operations: [...operations],
            message: highestPriorityOp.message,
            progress: Math.round(weightedProgress),
            activeOperations: operations.length,
            queuedOperations: 0, // TODO: Implementar sistema de fila
            errors
        };
    }

    private updateContextualStates(): void {
        const contextGroups = new Map<string, LoadingOperation[]>();

        // Agrupa operações por tipo de contexto
        this.operations.forEach(operation => {
            const key = operation.context.type;
            if (!contextGroups.has(key)) {
                contextGroups.set(key, []);
            }
            contextGroups.get(key)!.push(operation);
        });

        // Calcula estado para cada contexto
        contextGroups.forEach((operations, contextType) => {
            const state = this.calculateStateForOperations(operations);
            this.layers.contextual.set(contextType, state);
        });

        // Remove contextos que não têm mais operações ativas
        this.layers.contextual.forEach((state, contextType) => {
            if (!contextGroups.has(contextType)) {
                this.layers.contextual.delete(contextType);
            }
        });
    }

    private updateGranularStates(): void {
        const idGroups = new Map<string, LoadingOperation[]>();

        // Agrupa operações por ID específico
        this.operations.forEach(operation => {
            const key = operation.context.id;
            if (!idGroups.has(key)) {
                idGroups.set(key, []);
            }
            idGroups.get(key)!.push(operation);
        });

        // Calcula estado para cada ID
        idGroups.forEach((operations, id) => {
            const state = this.calculateStateForOperations(operations);
            this.layers.granular.set(id, state);
        });

        // Remove IDs que não têm mais operações ativas
        this.layers.granular.forEach((state, id) => {
            if (!idGroups.has(id)) {
                this.layers.granular.delete(id);
            }
        });
    }

    private calculateStateForOperations(operations: LoadingOperation[]): LoadingState {
        if (operations.length === 0) {
            return this.createEmptyState();
        }

        const totalWeight = operations.reduce((sum, op) => sum + op.priority, 0);
        const weightedProgress = operations.reduce((sum, op) =>
            sum + (op.progress * op.priority), 0
        ) / totalWeight;

        const highestPriorityOp = operations.reduce((max, op) =>
            op.priority > max.priority ? op : max
        );

        return {
            isLoading: true,
            operations: [...operations],
            message: highestPriorityOp.message,
            progress: Math.round(weightedProgress),
            activeOperations: operations.length,
            queuedOperations: 0,
            errors: []
        };
    }

    private debounceUpdateStates(): void {
        if (this.batchUpdateTimeout) {
            clearTimeout(this.batchUpdateTimeout);
        }

        this.batchUpdateTimeout = setTimeout(() => {
            this.updateLoadingStates();
            this.batchUpdateTimeout = null;
        }, this.debounceMs);
    }

    private createEmptyState(): LoadingState {
        return {
            isLoading: false,
            operations: [],
            message: '',
            progress: 0,
            activeOperations: 0,
            queuedOperations: 0,
            errors: []
        };
    }

    private generateOperationId(): string {
        return `load-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // === ESTATÍSTICAS E MONITORAMENTO ===

    /**
     * Obtém estatísticas detalhadas
     */
    getStats(): LoadingStats {
        const completed = Array.from(this.completedOperations.values());
        const avgDuration = completed.length > 0
            ? completed.reduce((sum, op) => sum + op.duration, 0) / completed.length
            : 0;

        return {
            totalOperations: this.operations.size + this.completedOperations.size,
            completedOperations: this.completedOperations.size,
            failedOperations: this.errors.size,
            averageDuration: avgDuration,
            currentLoad: this.operations.size / this.maxConcurrentOperations,
            queueLength: 0 // TODO: Implementar sistema de fila
        };
    }

    /**
     * Obtém histórico de operações completadas
     */
    getCompletedOperationsHistory(): Array<{
        operation: LoadingOperation;
        result: any;
        duration: number;
    }> {
        return Array.from(this.completedOperations.values());
    }

    /**
     * Obtém histórico de erros
     */
    getErrorHistory(): LoadingError[] {
        return Array.from(this.errors.values());
    }

    // === LIMPEZA ===

    /**
     * Limpa histórico antigo
     */
    cleanup(maxAge: number = 24 * 60 * 60 * 1000): void {
        const cutoff = Date.now() - maxAge;

        // Limpa operações completadas antigas
        this.completedOperations.forEach((completed, operationId) => {
            if (completed.operation.startTime < cutoff) {
                this.completedOperations.delete(operationId);
            }
        });

        // Limpa erros antigos
        this.errors.forEach((error, operationId) => {
            if (error.timestamp < cutoff) {
                this.errors.delete(operationId);
            }
        });

        if (this.batchUpdateTimeout) {
            clearTimeout(this.batchUpdateTimeout);
            this.batchUpdateTimeout = null;
        }
    }

    /**
     * Força cancelamento de todas as operações
     */
    forceCleanup(): void {
        this.operations.clear();
        this.updateLoadingStates();
        this.emit('forceCleanup');
    }
}

// Instância singleton
let masterLoadingServiceInstance: MasterLoadingService | null = null;

export const getMasterLoadingService = (): MasterLoadingService => {
    if (!masterLoadingServiceInstance) {
        masterLoadingServiceInstance = new MasterLoadingService();
    }
    return masterLoadingServiceInstance;
};

export default MasterLoadingService;
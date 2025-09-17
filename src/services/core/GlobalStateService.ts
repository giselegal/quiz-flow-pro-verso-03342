/**
 * 🎯 GLOBAL STATE SERVICE - CONSOLIDAÇÃO ARQUITETURAL
 * 
 * FASE 3: Unifica a lógica de estado global em um único serviço:
 * ✅ Consolida ConfigurationService + sessionService + contextualFunnelService
 * ✅ Estado centralizado com persistência automática
 * ✅ Sincronização cross-tab com localStorage/sessionStorage
 * ✅ Sistema de eventos para mudanças de estado
 * ✅ Performance otimizada com debouncing e batching
 */

import {
    GlobalAppConfig,
    GlobalUIState,
    GlobalFunnelState,
    GlobalUserState,
    AppTheme,
    UIMode
} from '@/hooks/core/useGlobalState';
import { EventEmitter } from 'events';

// Tipos para o serviço de estado global
export interface StateChangeEvent {
    type: 'config' | 'ui' | 'funnel' | 'user';
    key: string;
    oldValue: any;
    newValue: any;
    timestamp: number;
}

export interface StatePersistenceConfig {
    localStorage: string[];
    sessionStorage: string[];
    memory: string[];
    debounceMs: number;
    batchSize: number;
}

export interface StateSubscription {
    id: string;
    callback: (event: StateChangeEvent) => void;
    filter?: (event: StateChangeEvent) => boolean;
}

export interface StateSnapshot {
    config: Partial<GlobalAppConfig>;
    ui: Partial<GlobalUIState>;
    funnel: Partial<GlobalFunnelState>;
    user: Partial<GlobalUserState>;
    timestamp: number;
}

// Cache e persistência de estado
interface StateCache {
    config: GlobalAppConfig;
    ui: GlobalUIState;
    funnel: GlobalFunnelState;
    user: GlobalUserState;
    lastSync: number;
    isDirty: boolean;
}

export class GlobalStateService extends EventEmitter {
    private cache: StateCache;
    private subscriptions: Map<string, StateSubscription>;
    private persistenceConfig: StatePersistenceConfig;
    private debounceTimeouts: Map<string, NodeJS.Timeout>;
    private batchedUpdates: StateChangeEvent[];
    private syncInterval: NodeJS.Timeout | null;

    constructor(persistenceConfig?: Partial<StatePersistenceConfig>) {
        super();

        this.subscriptions = new Map();
        this.debounceTimeouts = new Map();
        this.batchedUpdates = [];
        this.syncInterval = null;

        // Configuração padrão de persistência
        this.persistenceConfig = {
            localStorage: ['config', 'user'],
            sessionStorage: ['ui', 'funnel'],
            memory: [],
            debounceMs: 300,
            batchSize: 10,
            ...persistenceConfig
        };

        // Inicializa o estado
        this.initializeState();

        // Inicia sincronização automática
        this.startAutoSync();

        // Escuta eventos de storage para sync cross-tab
        this.setupStorageListeners();
    }

    // === OPERAÇÕES DE CONFIGURAÇÃO ===

    /**
     * Atualiza configuração global
     */
    async updateConfig(updates: Partial<GlobalAppConfig>): Promise<void> {
        const oldConfig = { ...this.cache.config };
        const newConfig = { ...oldConfig, ...updates };

        this.cache.config = newConfig;
        this.markDirty();

        // Emite eventos para cada propriedade alterada
        Object.keys(updates).forEach(key => {
            if (oldConfig[key as keyof GlobalAppConfig] !== updates[key as keyof GlobalAppConfig]) {
                this.emitStateChange({
                    type: 'config',
                    key,
                    oldValue: oldConfig[key as keyof GlobalAppConfig],
                    newValue: updates[key as keyof GlobalAppConfig],
                    timestamp: Date.now()
                });
            }
        });

        await this.persistState('config');
    }

    /**
     * Obtém configuração atual
     */
    getConfig(): GlobalAppConfig {
        return { ...this.cache.config };
    }

    /**
     * Redefine configuração para padrões
     */
    async resetConfig(): Promise<void> {
        const defaultConfig: GlobalAppConfig = {
            theme: 'light',
            language: 'pt-BR',
            timezone: 'America/Sao_Paulo',
            analytics: {
                enabled: true,
                trackingId: '',
                events: []
            },
            features: {
                aiAssistant: true,
                advancedTemplates: true,
                realTimeCollaboration: false
            },
            performance: {
                enableCache: true,
                cacheTimeout: 300000,
                lazyLoading: true,
                preloadSteps: 3
            }
        };

        await this.updateConfig(defaultConfig);
    }

    // === OPERAÇÕES DE UI ===

    /**
     * Atualiza estado da UI
     */
    async updateUI(updates: Partial<GlobalUIState>): Promise<void> {
        const oldUI = { ...this.cache.ui };
        const newUI = { ...oldUI, ...updates };

        this.cache.ui = newUI;
        this.markDirty();

        Object.keys(updates).forEach(key => {
            if (oldUI[key as keyof GlobalUIState] !== updates[key as keyof GlobalUIState]) {
                this.emitStateChange({
                    type: 'ui',
                    key,
                    oldValue: oldUI[key as keyof GlobalUIState],
                    newValue: updates[key as keyof GlobalUIState],
                    timestamp: Date.now()
                });
            }
        });

        await this.persistState('ui');
    }

    /**
     * Alterna modo da UI
     */
    async toggleUIMode(mode: UIMode): Promise<void> {
        await this.updateUI({ mode });
    }

    /**
     * Atualiza tema
     */
    async setTheme(theme: AppTheme): Promise<void> {
        await this.updateConfig({ theme });
        await this.updateUI({ theme });
    }

    // === OPERAÇÕES DE FUNNEL ===

    /**
     * Define funnel ativo
     */
    async setActiveFunnel(funnelId: string, stepId?: string): Promise<void> {
        const updates: Partial<GlobalFunnelState> = {
            activeFunnelId: funnelId,
            lastUpdated: Date.now()
        };

        if (stepId) {
            updates.activeStepId = stepId;
        }

        await this.updateFunnel(updates);
    }

    /**
     * Atualiza estado do funnel
     */
    async updateFunnel(updates: Partial<GlobalFunnelState>): Promise<void> {
        const oldFunnel = { ...this.cache.funnel };
        const newFunnel = { ...oldFunnel, ...updates };

        this.cache.funnel = newFunnel;
        this.markDirty();

        Object.keys(updates).forEach(key => {
            if (oldFunnel[key as keyof GlobalFunnelState] !== updates[key as keyof GlobalFunnelState]) {
                this.emitStateChange({
                    type: 'funnel',
                    key,
                    oldValue: oldFunnel[key as keyof GlobalFunnelState],
                    newValue: updates[key as keyof GlobalFunnelState],
                    timestamp: Date.now()
                });
            }
        });

        await this.persistState('funnel');
    }

    // === OPERAÇÕES DE USUÁRIO ===

    /**
     * Atualiza dados do usuário
     */
    async updateUser(updates: Partial<GlobalUserState>): Promise<void> {
        const oldUser = { ...this.cache.user };
        const newUser = { ...oldUser, ...updates };

        this.cache.user = newUser;
        this.markDirty();

        Object.keys(updates).forEach(key => {
            if (oldUser[key as keyof GlobalUserState] !== updates[key as keyof GlobalUserState]) {
                this.emitStateChange({
                    type: 'user',
                    key,
                    oldValue: oldUser[key as keyof GlobalUserState],
                    newValue: updates[key as keyof GlobalUserState],
                    timestamp: Date.now()
                });
            }
        });

        await this.persistState('user');
    }

    /**
     * Faz logout do usuário
     */
    async logout(): Promise<void> {
        await this.updateUser({
            id: null,
            email: null,
            name: null,
            isAuthenticated: false,
            permissions: []
        });
    }

    // === SISTEMA DE EVENTOS E SUBSCRIPTIONS ===

    /**
     * Adiciona listener para mudanças de estado
     */
    subscribe(
        callback: (event: StateChangeEvent) => void,
        filter?: (event: StateChangeEvent) => boolean
    ): string {
        const id = this.generateSubscriptionId();
        const subscription: StateSubscription = { id, callback, filter };

        this.subscriptions.set(id, subscription);

        return id;
    }

    /**
     * Remove listener
     */
    unsubscribe(id: string): void {
        this.subscriptions.delete(id);
    }

    /**
     * Emite evento de mudança de estado
     */
    private emitStateChange(event: StateChangeEvent): void {
        // Adiciona ao batch de eventos
        this.batchedUpdates.push(event);

        // Processa batch se atingiu o limite
        if (this.batchedUpdates.length >= this.persistenceConfig.batchSize) {
            this.processBatchedUpdates();
        } else {
            // Agenda processamento com debounce
            this.debounceBatchProcessing();
        }

        // Notifica subscribers imediatamente
        this.subscriptions.forEach(subscription => {
            if (!subscription.filter || subscription.filter(event)) {
                subscription.callback(event);
            }
        });
    }

    private debounceBatchProcessing(): void {
        if (this.debounceTimeouts.has('batch')) {
            clearTimeout(this.debounceTimeouts.get('batch')!);
        }

        const timeout = setTimeout(() => {
            this.processBatchedUpdates();
        }, this.persistenceConfig.debounceMs);

        this.debounceTimeouts.set('batch', timeout);
    }

    private processBatchedUpdates(): void {
        if (this.batchedUpdates.length === 0) return;

        // Emite evento batch
        this.emit('batchUpdate', this.batchedUpdates);

        // Limpa batch
        this.batchedUpdates = [];

        // Remove timeout se existir
        if (this.debounceTimeouts.has('batch')) {
            clearTimeout(this.debounceTimeouts.get('batch')!);
            this.debounceTimeouts.delete('batch');
        }
    }

    // === PERSISTÊNCIA E SINCRONIZAÇÃO ===

    /**
     * Persiste estado específico
     */
    private async persistState(type: 'config' | 'ui' | 'funnel' | 'user'): Promise<void> {
        const data = this.cache[type];

        // LocalStorage
        if (this.persistenceConfig.localStorage.includes(type)) {
            localStorage.setItem(`globalState.${type}`, JSON.stringify(data));
        }

        // SessionStorage
        if (this.persistenceConfig.sessionStorage.includes(type)) {
            sessionStorage.setItem(`globalState.${type}`, JSON.stringify(data));
        }

        this.cache.lastSync = Date.now();
    }

    /**
     * Carrega estado persistido
     */
    private loadPersistedState(): Partial<StateCache> {
        const loaded: Partial<StateCache> = {};

        // Carrega de localStorage
        this.persistenceConfig.localStorage.forEach(type => {
            const data = localStorage.getItem(`globalState.${type}`);
            if (data) {
                try {
                    loaded[type as keyof StateCache] = JSON.parse(data);
                } catch (error) {
                    console.warn(`Failed to parse localStorage data for ${type}:`, error);
                }
            }
        });

        // Carrega de sessionStorage
        this.persistenceConfig.sessionStorage.forEach(type => {
            const data = sessionStorage.getItem(`globalState.${type}`);
            if (data) {
                try {
                    loaded[type as keyof StateCache] = JSON.parse(data);
                } catch (error) {
                    console.warn(`Failed to parse sessionStorage data for ${type}:`, error);
                }
            }
        });

        return loaded;
    }

    // === SNAPSHOT E BACKUP ===

    /**
     * Cria snapshot do estado atual
     */
    createSnapshot(): StateSnapshot {
        return {
            config: { ...this.cache.config },
            ui: { ...this.cache.ui },
            funnel: { ...this.cache.funnel },
            user: { ...this.cache.user },
            timestamp: Date.now()
        };
    }

    /**
     * Restaura estado de um snapshot
     */
    async restoreFromSnapshot(snapshot: StateSnapshot): Promise<void> {
        if (snapshot.config) await this.updateConfig(snapshot.config);
        if (snapshot.ui) await this.updateUI(snapshot.ui);
        if (snapshot.funnel) await this.updateFunnel(snapshot.funnel);
        if (snapshot.user) await this.updateUser(snapshot.user);
    }

    // === MÉTODOS AUXILIARES ===

    private initializeState(): void {
        // Estados padrão
        const defaultCache: StateCache = {
            config: {
                theme: 'light',
                language: 'pt-BR',
                timezone: 'America/Sao_Paulo',
                analytics: {
                    enabled: true,
                    trackingId: '',
                    events: []
                },
                features: {
                    aiAssistant: true,
                    advancedTemplates: true,
                    realTimeCollaboration: false
                },
                performance: {
                    enableCache: true,
                    cacheTimeout: 300000,
                    lazyLoading: true,
                    preloadSteps: 3
                }
            },
            ui: {
                mode: 'development',
                theme: 'light',
                sidebarOpen: true,
                propertiesPanelOpen: true,
                showGrid: true,
                zoom: 100,
                loading: false,
                loadingMessage: ''
            },
            funnel: {
                activeFunnelId: null,
                activeStepId: null,
                funnels: [],
                lastUpdated: Date.now()
            },
            user: {
                id: null,
                email: null,
                name: null,
                isAuthenticated: false,
                permissions: []
            },
            lastSync: 0,
            isDirty: false
        };

        // Carrega estado persistido e mescla com padrões
        const loaded = this.loadPersistedState();
        this.cache = { ...defaultCache, ...loaded };
    }

    private markDirty(): void {
        this.cache.isDirty = true;
    }

    private startAutoSync(): void {
        this.syncInterval = setInterval(async () => {
            if (this.cache.isDirty) {
                await this.syncAll();
            }
        }, 5000); // Sync a cada 5 segundos se houver mudanças
    }

    private async syncAll(): Promise<void> {
        await Promise.all([
            this.persistState('config'),
            this.persistState('ui'),
            this.persistState('funnel'),
            this.persistState('user')
        ]);

        this.cache.isDirty = false;
    }

    private setupStorageListeners(): void {
        window.addEventListener('storage', (event) => {
            if (event.key?.startsWith('globalState.')) {
                const type = event.key.replace('globalState.', '') as keyof StateCache;
                if (event.newValue) {
                    try {
                        const data = JSON.parse(event.newValue);
                        this.cache[type] = data;
                        this.emit('externalUpdate', { type, data });
                    } catch (error) {
                        console.warn(`Failed to sync external storage change for ${type}:`, error);
                    }
                }
            }
        });
    }

    private generateSubscriptionId(): string {
        return `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // === LIMPEZA ===

    /**
     * Limpa recursos e para sincronização
     */
    cleanup(): void {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }

        this.debounceTimeouts.forEach(timeout => clearTimeout(timeout));
        this.debounceTimeouts.clear();

        this.subscriptions.clear();
        this.removeAllListeners();
    }

    // === ESTATÍSTICAS E DEBUG ===

    /**
     * Obtém estatísticas do serviço
     */
    getStats(): Record<string, any> {
        return {
            subscriptionsCount: this.subscriptions.size,
            lastSync: new Date(this.cache.lastSync).toISOString(),
            isDirty: this.cache.isDirty,
            batchedUpdates: this.batchedUpdates.length,
            cacheSize: JSON.stringify(this.cache).length,
            activeFunnelId: this.cache.funnel.activeFunnelId,
            userAuthenticated: this.cache.user.isAuthenticated
        };
    }
}

// Instância singleton
let globalStateServiceInstance: GlobalStateService | null = null;

export const getGlobalStateService = (): GlobalStateService => {
    if (!globalStateServiceInstance) {
        globalStateServiceInstance = new GlobalStateService();
    }
    return globalStateServiceInstance;
};

export default GlobalStateService;
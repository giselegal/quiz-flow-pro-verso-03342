/**
 * 🎯 GLOBAL STATE SERVICE - SIMPLIFICADO
 * 
 * Serviço consolidado para gerenciamento de estado global
 * - Interface simplificada
 * - Sem dependências problemáticas
 * - Foco na funcionalidade essencial
 */

import {
    GlobalAppConfig,
    GlobalUIState,
    GlobalFunnelState
} from '@/hooks/core/useGlobalState';
import { EventEmitter } from 'events';

// Interfaces simplificadas
export interface StateSnapshot {
    config: Partial<GlobalAppConfig>;
    ui: Partial<GlobalUIState>;
    funnel: Partial<GlobalFunnelState>;
    timestamp: number;
}

interface StateCache {
    config: GlobalAppConfig;
    ui: GlobalUIState;
    funnel: GlobalFunnelState;
    lastSync: number;
    isDirty: boolean;
}

export class GlobalStateService extends EventEmitter {
    private static instance: GlobalStateService;
    private cache: StateCache;
    private subscribers: Map<string, Set<Function>> = new Map();
    private isInitialized = false;

    private constructor() {
        super();
        this.cache = this.createDefaultState();
    }

    static getInstance(): GlobalStateService {
        if (!GlobalStateService.instance) {
            GlobalStateService.instance = new GlobalStateService();
        }
        return GlobalStateService.instance;
    }

    /**
     * Inicializar o serviço
     */
    async initialize(): Promise<void> {
        if (this.isInitialized) return;

        try {
            // Carregar configurações padrão
            this.cache = this.createDefaultState();
            this.isInitialized = true;
            this.emit('initialized', this.cache);
        } catch (error) {
            console.error('Failed to initialize GlobalStateService:', error);
            throw error;
        }
    }

    /**
     * Atualizar configuração da aplicação
     */
    async updateConfig(updates: Partial<GlobalAppConfig>): Promise<void> {
        const oldConfig = { ...this.cache.config };
        this.cache.config = { ...oldConfig, ...updates };
        this.cache.lastSync = Date.now();
        this.cache.isDirty = true;

        this.emit('configChanged', {
            old: oldConfig,
            new: this.cache.config,
            changes: updates
        });

        this.notifySubscribers('config', this.cache.config);
    }

    /**
     * Atualizar estado da UI
     */
    async updateUI(updates: Partial<GlobalUIState>): Promise<void> {
        const oldUI = { ...this.cache.ui };
        this.cache.ui = { ...oldUI, ...updates };
        this.cache.lastSync = Date.now();
        this.cache.isDirty = true;

        this.emit('uiChanged', {
            old: oldUI,
            new: this.cache.ui,
            changes: updates
        });

        this.notifySubscribers('ui', this.cache.ui);
    }

    /**
     * Atualizar estado do funil
     */
    async updateFunnel(updates: Partial<GlobalFunnelState>): Promise<void> {
        const oldFunnel = { ...this.cache.funnel };
        this.cache.funnel = { ...oldFunnel, ...updates };
        this.cache.lastSync = Date.now();
        this.cache.isDirty = true;

        this.emit('funnelChanged', {
            old: oldFunnel,
            new: this.cache.funnel,
            changes: updates
        });

        this.notifySubscribers('funnel', this.cache.funnel);
    }

    /**
     * Obter snapshot do estado atual
     */
    getSnapshot(): StateSnapshot {
        return {
            config: { ...this.cache.config },
            ui: { ...this.cache.ui },
            funnel: { ...this.cache.funnel },
            timestamp: Date.now()
        };
    }

    /**
     * Obter configuração atual
     */
    getConfig(): GlobalAppConfig {
        return { ...this.cache.config };
    }

    /**
     * Obter estado da UI
     */
    getUIState(): GlobalUIState {
        return { ...this.cache.ui };
    }

    /**
     * Obter estado do funil
     */
    getFunnelState(): GlobalFunnelState {
        return { ...this.cache.funnel };
    }

    /**
     * Subscribe para mudanças em um tipo de estado
     */
    subscribe(stateType: 'config' | 'ui' | 'funnel', callback: Function): () => void {
        if (!this.subscribers.has(stateType)) {
            this.subscribers.set(stateType, new Set());
        }

        this.subscribers.get(stateType)!.add(callback);

        // Retornar função de unsubscribe
        return () => {
            this.subscribers.get(stateType)?.delete(callback);
        };
    }

    /**
     * Limpar todo o estado
     */
    clearState(): void {
        this.cache = this.createDefaultState();
        this.emit('stateCleared');
    }

    /**
     * Verificar se o serviço foi inicializado
     */
    isReady(): boolean {
        return this.isInitialized;
    }

    /**
     * Criar estado padrão
     */
    private createDefaultState(): StateCache {
        return {
            config: {
                theme: 'light' as const,
                language: 'pt-BR',
                debugMode: true,
                performanceMode: 'normal' as const,
                autoSave: true,
                autoSaveInterval: 30000
            },
            ui: {
                sidebarOpen: true,
                propertiesPanelOpen: true,
                previewMode: false,
                viewMode: 'desktop' as const,
                currentRoute: '/dashboard',
                isFullscreen: false
            },
            funnel: {
                activeFunnelId: null,
                activeFunnel: null,
                funnelHistory: [],
                recentFunnels: []
            },
            lastSync: Date.now(),
            isDirty: false
        };
    }

    /**
     * Notificar subscribers
     */
    private notifySubscribers(stateType: string, newState: any): void {
        const subscribers = this.subscribers.get(stateType);
        if (subscribers) {
            subscribers.forEach(callback => {
                try {
                    callback(newState);
                } catch (error) {
                    console.error(`Error in ${stateType} subscriber:`, error);
                }
            });
        }
    }
}

// Export singleton
export const globalStateService = GlobalStateService.getInstance();
export default globalStateService;
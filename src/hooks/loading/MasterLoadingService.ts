/**
 * 🎯 MASTER LOADING SERVICE - CONSOLIDAÇÃO LOADING HOOKS
 * 
 * Serviço unificado que consolida todos os loading hooks:
 * - useLoadingState.ts (loading local com timeout e error handling)
 * - useGlobalLoading.ts (loading global com context, progress e messages)
 * - FunnelLoadingState interfaces (useFunnelLoader.ts)
 * - Loading states específicos de componentes
 * 
 * ✅ BENEFÍCIOS:
 * - Interface única para todos os tipos de loading
 * - Sistema hierárquico: global > component > local
 * - Progress tracking consolidado
 * - Error handling unificado
 * - Context isolation mantido
 * - Performance otimizada com batching
 * - Compatibilidade com código existente
 */

import React, { createContext } from 'react';

// =============================================
// UNIFIED INTERFACES
// =============================================

export interface UnifiedLoadingState {
    // Basic state
    isLoading: boolean;
    error: string | null;

    // Global state
    message?: string;
    progress?: number;

    // Advanced state
    loadingId?: string;
    category?: LoadingCategory;
    priority?: LoadingPriority;
    timestamp?: Date;

    // Context
    componentId?: string;
    operationName?: string;
    metadata?: Record<string, any>;
}

export type LoadingCategory =
    | 'global'
    | 'component'
    | 'local'
    | 'template'
    | 'funnel'
    | 'quiz'
    | 'validation'
    | 'api';

export type LoadingPriority = 'low' | 'normal' | 'high' | 'critical';

export interface LoadingOptions {
    // Basic options
    initialState?: boolean;
    timeout?: number;

    // Advanced options
    category?: LoadingCategory;
    priority?: LoadingPriority;
    componentId?: string;
    operationName?: string;

    // Error handling
    retryCount?: number;
    retryDelay?: number;
    onError?: (error: string) => void;

    // Progress tracking
    trackProgress?: boolean;
    progressSteps?: number;

    // Batching
    batchUpdates?: boolean;
    debounceMs?: number;
}

export interface LoadingManager {
    // Basic operations
    setLoading: (loading: boolean, options?: Partial<LoadingOptions>) => void;
    setError: (error: string | null) => void;
    clearError: () => void;

    // Advanced operations
    setLoadingWithTimeout: (loading: boolean, timeoutMs?: number) => void;
    setProgress: (progress: number, message?: string) => void;
    updateMessage: (message: string) => void;

    // Batch operations
    batchUpdate: (updates: Partial<UnifiedLoadingState>) => void;

    // State getters
    getState: () => UnifiedLoadingState;
    isCurrentlyLoading: () => boolean;
    hasError: () => boolean;
}

// =============================================
// MASTER LOADING SERVICE CLASS
// =============================================

export class MasterLoadingService {
    private static instance: MasterLoadingService;

    // Global state management
    private globalState: UnifiedLoadingState = {
        isLoading: false,
        error: null,
        priority: 'normal',
        category: 'global',
        timestamp: new Date()
    };

    // Component states registry
    private componentStates = new Map<string, UnifiedLoadingState>();

    // Event listeners
    private listeners = new Set<(state: UnifiedLoadingState) => void>();

    // Batching system
    private batchTimer: NodeJS.Timeout | null = null;
    private pendingUpdates = new Map<string, Partial<UnifiedLoadingState>>();

    // Performance tracking
    private performanceMetrics = {
        totalLoadings: 0,
        averageLoadingTime: 0,
        errorCount: 0,
        longestLoadingTime: 0
    };

    private constructor() {
        this.initializeCleanupTimer();
    }

    static getInstance(): MasterLoadingService {
        if (!MasterLoadingService.instance) {
            MasterLoadingService.instance = new MasterLoadingService();
        }
        return MasterLoadingService.instance;
    }

    // =============================================
    // GLOBAL LOADING MANAGEMENT
    // =============================================

    /**
     * 🎯 SET GLOBAL LOADING STATE
     * Controls the main global loading state
     */
    setGlobalLoading(
        loading: boolean,
        message?: string,
        progress?: number,
        options?: Partial<LoadingOptions>
    ): void {
        const updates: Partial<UnifiedLoadingState> = {
            isLoading: loading,
            message,
            progress,
            category: 'global',
            priority: options?.priority || 'normal',
            timestamp: new Date(),
            operationName: options?.operationName,
            metadata: options ? { options } : undefined
        };

        if (!loading) {
            updates.error = null;
        }

        this.updateGlobalState(updates);
        this.notifyListeners();

        // Track performance
        if (loading) {
            this.performanceMetrics.totalLoadings++;
        }
    }

    /**
     * 🎯 SET GLOBAL PROGRESS
     * Updates only the progress without changing loading state
     */
    setGlobalProgress(progress: number, message?: string): void {
        this.updateGlobalState({
            progress,
            message: message || this.globalState.message,
            timestamp: new Date()
        });
        this.notifyListeners();
    }

    /**
     * 🎯 SET GLOBAL ERROR
     * Sets a global error and stops loading
     */
    setGlobalError(error: string): void {
        this.updateGlobalState({
            isLoading: false,
            error,
            timestamp: new Date()
        });
        this.performanceMetrics.errorCount++;
        this.notifyListeners();
    }

    /**
     * 🎯 CLEAR GLOBAL LOADING
     * Resets all global loading state
     */
    clearGlobalLoading(): void {
        this.globalState = {
            isLoading: false,
            error: null,
            priority: 'normal',
            category: 'global',
            timestamp: new Date()
        };
        this.notifyListeners();
    }

    // =============================================
    // COMPONENT LOADING MANAGEMENT
    // =============================================

    /**
     * 🎯 CREATE COMPONENT LOADING MANAGER
     * Creates a dedicated loading manager for a component
     */
    createComponentManager(componentId: string, options?: LoadingOptions): LoadingManager {
        const initialState: UnifiedLoadingState = {
            isLoading: options?.initialState || false,
            error: null,
            category: options?.category || 'component',
            priority: options?.priority || 'normal',
            componentId,
            operationName: options?.operationName,
            timestamp: new Date(),
            metadata: options ? { options } : undefined
        };

        this.componentStates.set(componentId, initialState);

        return {
            setLoading: (loading: boolean, updateOptions?: Partial<LoadingOptions>) => {
                this.setComponentLoading(componentId, loading, updateOptions);
            },

            setError: (error: string | null) => {
                this.setComponentError(componentId, error);
            },

            clearError: () => {
                this.setComponentError(componentId, null);
            },

            setLoadingWithTimeout: (loading: boolean, timeoutMs?: number) => {
                this.setComponentLoadingWithTimeout(componentId, loading, timeoutMs);
            },

            setProgress: (progress: number, message?: string) => {
                this.setComponentProgress(componentId, progress, message);
            },

            updateMessage: (message: string) => {
                this.updateComponentMessage(componentId, message);
            },

            batchUpdate: (updates: Partial<UnifiedLoadingState>) => {
                this.batchComponentUpdate(componentId, updates);
            },

            getState: () => {
                return this.componentStates.get(componentId) || initialState;
            },

            isCurrentlyLoading: () => {
                const state = this.componentStates.get(componentId);
                return state?.isLoading || false;
            },

            hasError: () => {
                const state = this.componentStates.get(componentId);
                return !!state?.error;
            }
        };
    }

    /**
     * 🎯 SET COMPONENT LOADING
     */
    private setComponentLoading(
        componentId: string,
        loading: boolean,
        options?: Partial<LoadingOptions>
    ): void {
        const currentState = this.componentStates.get(componentId);
        if (!currentState) return;

        const updates: Partial<UnifiedLoadingState> = {
            isLoading: loading,
            timestamp: new Date(),
            operationName: options?.operationName || currentState.operationName
        };

        if (!loading) {
            updates.error = null;
        }

        this.updateComponentState(componentId, updates);

        // Handle timeout
        if (loading && options?.timeout) {
            setTimeout(() => {
                const state = this.componentStates.get(componentId);
                if (state?.isLoading) {
                    this.setComponentLoading(componentId, false);
                }
            }, options.timeout);
        }
    }

    /**
     * 🎯 SET COMPONENT ERROR
     */
    private setComponentError(componentId: string, error: string | null): void {
        this.updateComponentState(componentId, {
            error,
            isLoading: error ? false : undefined, // Stop loading if error
            timestamp: new Date()
        });

        if (error) {
            this.performanceMetrics.errorCount++;
        }
    }

    /**
     * 🎯 SET COMPONENT LOADING WITH TIMEOUT
     */
    private setComponentLoadingWithTimeout(
        componentId: string,
        loading: boolean,
        timeoutMs?: number
    ): void {
        this.setComponentLoading(componentId, loading);

        if (loading && timeoutMs) {
            setTimeout(() => {
                this.setComponentLoading(componentId, false);
            }, timeoutMs);
        }
    }

    /**
     * 🎯 SET COMPONENT PROGRESS
     */
    private setComponentProgress(componentId: string, progress: number, message?: string): void {
        this.updateComponentState(componentId, {
            progress,
            message,
            timestamp: new Date()
        });
    }

    /**
     * 🎯 UPDATE COMPONENT MESSAGE
     */
    private updateComponentMessage(componentId: string, message: string): void {
        this.updateComponentState(componentId, {
            message,
            timestamp: new Date()
        });
    }

    /**
     * 🎯 BATCH COMPONENT UPDATE
     */
    private batchComponentUpdate(componentId: string, updates: Partial<UnifiedLoadingState>): void {
        if (this.batchTimer) {
            this.pendingUpdates.set(componentId, {
                ...this.pendingUpdates.get(componentId),
                ...updates,
                timestamp: new Date()
            });
            return;
        }

        this.batchTimer = setTimeout(() => {
            for (const [id, update] of this.pendingUpdates.entries()) {
                this.updateComponentState(id, update);
            }
            this.pendingUpdates.clear();
            this.batchTimer = null;
        }, 16); // ~60fps batching

        this.pendingUpdates.set(componentId, updates);
    }

    // =============================================
    // STATE MANAGEMENT HELPERS
    // =============================================

    private updateGlobalState(updates: Partial<UnifiedLoadingState>): void {
        this.globalState = { ...this.globalState, ...updates };
    }

    private updateComponentState(componentId: string, updates: Partial<UnifiedLoadingState>): void {
        const currentState = this.componentStates.get(componentId);
        if (!currentState) return;

        const newState = { ...currentState, ...updates };
        this.componentStates.set(componentId, newState);
        this.notifyListeners();
    }

    // =============================================
    // EVENT SYSTEM
    // =============================================

    subscribe(listener: (state: UnifiedLoadingState) => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    private notifyListeners(): void {
        // Notify with hierarchical state (global + highest priority component)
        const hierarchicalState = this.getHierarchicalState();
        this.listeners.forEach(listener => listener(hierarchicalState));
    }

    private getHierarchicalState(): UnifiedLoadingState {
        // Start with global state
        let state = { ...this.globalState };

        // If global is not loading, check component states
        if (!state.isLoading) {
            const loadingComponents = Array.from(this.componentStates.values())
                .filter(s => s.isLoading)
                .sort((a, b) => {
                    const priorityOrder = { critical: 4, high: 3, normal: 2, low: 1 };
                    return (priorityOrder[b.priority || 'normal'] - priorityOrder[a.priority || 'normal']);
                });

            if (loadingComponents.length > 0) {
                const highestPriority = loadingComponents[0];
                state = {
                    ...state,
                    isLoading: true,
                    message: highestPriority.message || state.message,
                    progress: highestPriority.progress || state.progress,
                    category: highestPriority.category || state.category,
                    priority: highestPriority.priority || state.priority,
                    componentId: highestPriority.componentId,
                    operationName: highestPriority.operationName
                };
            }
        }

        return state;
    }

    // =============================================
    // UTILITY METHODS
    // =============================================

    /**
     * Get current hierarchical loading state
     */
    getCurrentState(): UnifiedLoadingState {
        return this.getHierarchicalState();
    }

    /**
     * Check if any loading is currently active
     */
    isAnyLoading(): boolean {
        return this.globalState.isLoading ||
            Array.from(this.componentStates.values()).some(s => s.isLoading);
    }

    /**
     * Get all component states
     */
    getAllComponentStates(): Map<string, UnifiedLoadingState> {
        return new Map(this.componentStates);
    }

    /**
     * Remove component state
     */
    removeComponent(componentId: string): void {
        this.componentStates.delete(componentId);
        this.pendingUpdates.delete(componentId);
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics(): typeof this.performanceMetrics {
        return { ...this.performanceMetrics };
    }

    /**
     * Reset performance metrics
     */
    resetPerformanceMetrics(): void {
        this.performanceMetrics = {
            totalLoadings: 0,
            averageLoadingTime: 0,
            errorCount: 0,
            longestLoadingTime: 0
        };
    }

    /**
     * Clear all states
     */
    clearAllStates(): void {
        this.clearGlobalLoading();
        this.componentStates.clear();
        this.pendingUpdates.clear();

        if (this.batchTimer) {
            clearTimeout(this.batchTimer);
            this.batchTimer = null;
        }
    }

    private initializeCleanupTimer(): void {
        // Clean up old component states every 5 minutes
        setInterval(() => {
            const now = new Date();
            const maxAge = 5 * 60 * 1000; // 5 minutes

            for (const [componentId, state] of this.componentStates.entries()) {
                if (state.timestamp && (now.getTime() - state.timestamp.getTime() > maxAge)) {
                    this.removeComponent(componentId);
                }
            }
        }, 5 * 60 * 1000);
    }
}

// =============================================
// REACT CONTEXT INTEGRATION
// =============================================

const MasterLoadingContext = createContext<MasterLoadingService | undefined>(undefined);

export const MasterLoadingProvider = ({ children }: { children: React.ReactNode }) => {
    const service = MasterLoadingService.getInstance();

    return React.createElement(MasterLoadingContext.Provider, { value: service }, children);
};

// =============================================
// SINGLETON EXPORT
// =============================================
export const masterLoadingService = MasterLoadingService.getInstance();
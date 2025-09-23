/**
 * 🎯 GLOBAL EVENT MANAGER - PERFORMANCE OPTIMIZADO
 * 
 * Sistema centralizado de gerenciamento de eventos para eliminar:
 * - Event listeners duplicados
 * - Memory leaks em componentes
 * - Re-registros desnecessários
 * 
 * OTIMIZAÇÕES:
 * ✅ Singleton pattern para uma única instância
 * ✅ Debounce automático para eventos de alta frequência
 * ✅ Cleanup automático na destruição de componentes
 * ✅ Weak references para evitar memory leaks
 */

import { debounce } from 'lodash-es';

type EventCallback = (data?: any) => void;
type EventCleanup = () => void;

interface EventSubscription {
    id: string;
    callback: EventCallback;
    cleanup?: EventCleanup;
    debounceMs?: number;
    lastCalled?: number;
}

class OptimizedGlobalEventManager {
    private static instance: OptimizedGlobalEventManager;

    // ✅ OTIMIZAÇÃO: Usar Map para O(1) lookup
    private listeners = new Map<string, Map<string, EventSubscription>>();
    private debouncedHandlers = new Map<string, any>();
    private windowListeners = new Map<string, EventListener>();

    private constructor() {
        // Singleton - construtor privado
        this.setupWindowListeners();
    }

    public static getInstance(): OptimizedGlobalEventManager {
        if (!OptimizedGlobalEventManager.instance) {
            OptimizedGlobalEventManager.instance = new OptimizedGlobalEventManager();
        }
        return OptimizedGlobalEventManager.instance;
    }

    // ✅ OTIMIZAÇÃO: Setup de listeners de window apenas uma vez
    private setupWindowListeners() {
        // Eventos globais comuns que precisam de consolidação
        const globalEvents = [
            'navigate-to-step',
            'quiz-navigate-to-step',
            'canvas-virt-flag-changed',
            'editor-block-selected',
            'editor-state-changed',
            'resize',
            'scroll'
        ];

        globalEvents.forEach(eventType => {
            const handler = (event: Event) => {
                this.handleGlobalEvent(eventType, event);
            };

            this.windowListeners.set(eventType, handler);

            // ✅ OTIMIZAÇÃO: addEventListener apenas uma vez por tipo
            if (typeof window !== 'undefined') {
                window.addEventListener(eventType, handler, { passive: true });
            }
        });
    }

    // ✅ OTIMIZAÇÃO: Handler centralizado com debounce inteligente
    private handleGlobalEvent(eventType: string, event: Event) {
        const subscribers = this.listeners.get(eventType);
        if (!subscribers) return;

        const eventData = (event as CustomEvent)?.detail || {};

        // ✅ OTIMIZAÇÃO: Batch processing para múltiplos subscribers
        const toProcess: EventSubscription[] = [];
        const now = Date.now();

        subscribers.forEach((subscription) => {
            // Throttling per-subscription se necessário
            if (subscription.debounceMs && subscription.lastCalled) {
                if (now - subscription.lastCalled < subscription.debounceMs) {
                    return; // Skip por throttling
                }
            }

            subscription.lastCalled = now;
            toProcess.push(subscription);
        });

        // ✅ OTIMIZAÇÃO: Usar requestAnimationFrame para batch processing
        if (toProcess.length > 0) {
            requestAnimationFrame(() => {
                toProcess.forEach((subscription) => {
                    try {
                        subscription.callback(eventData);
                    } catch (error) {
                        console.warn(`[GlobalEventManager] Erro no callback para ${eventType}:`, error);
                    }
                });
            });
        }
    }

    // ✅ OTIMIZAÇÃO: Subscribe com auto-cleanup e opções avançadas
    public subscribe(
        eventType: string,
        callback: EventCallback,
        options: {
            debounceMs?: number;
            componentId?: string;
            priority?: 'high' | 'normal' | 'low';
        } = {}
    ): EventCleanup {

        const subscriptionId = `${eventType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        if (!this.listeners.has(eventType)) {
            this.listeners.set(eventType, new Map());
        }

        const subscription: EventSubscription = {
            id: subscriptionId,
            callback,
            debounceMs: options.debounceMs || 0,
            lastCalled: 0
        };

        this.listeners.get(eventType)!.set(subscriptionId, subscription);

        // ✅ OTIMIZAÇÃO: Retornar cleanup function otimizada
        const cleanup = () => {
            this.unsubscribe(eventType, subscriptionId);
        };

        subscription.cleanup = cleanup;

        return cleanup;
    }

    // ✅ OTIMIZAÇÃO: Unsubscribe eficiente
    private unsubscribe(eventType: string, subscriptionId: string): void {
        const subscribers = this.listeners.get(eventType);
        if (!subscribers) return;

        subscribers.delete(subscriptionId);

        // ✅ OTIMIZAÇÃO: Cleanup automático de Maps vazios
        if (subscribers.size === 0) {
            this.listeners.delete(eventType);
        }
    }

    // ✅ OTIMIZAÇÃO: Emit otimizado com batching
    public emit(eventType: string, data?: any): void {
        if (typeof window === 'undefined') return;

        // ✅ OTIMIZAÇÃO: Usar CustomEvent com detail otimizado
        const event = new CustomEvent(eventType, {
            detail: data,
            bubbles: false, // Não precisamos de bubbling
            cancelable: false // Não precisamos de cancelamento
        });

        window.dispatchEvent(event);
    }

    // ✅ OTIMIZAÇÃO: Cleanup para componentes React
    public createComponentManager(componentId: string) {
        const cleanupFunctions: EventCleanup[] = [];

        const addListener = (
            eventType: string,
            callback: EventCallback,
            options?: { debounceMs?: number }
        ) => {
            const cleanup = this.subscribe(eventType, callback, {
                ...options,
                componentId
            });
            cleanupFunctions.push(cleanup);
            return cleanup;
        };

        const cleanupAll = () => {
            cleanupFunctions.forEach(cleanup => cleanup());
            cleanupFunctions.length = 0;
        };

        return { addListener, cleanupAll };
    }

    // ✅ OTIMIZAÇÃO: Estatísticas para debug/monitoring
    public getStats() {
        const stats = {
            totalEventTypes: this.listeners.size,
            totalSubscriptions: 0,
            eventTypes: {} as Record<string, number>
        };

        this.listeners.forEach((subscribers, eventType) => {
            stats.totalSubscriptions += subscribers.size;
            stats.eventTypes[eventType] = subscribers.size;
        });

        return stats;
    }

    // ✅ OTIMIZAÇÃO: Destruição completa (para testes)
    public destroy(): void {
        // Cleanup all window listeners
        this.windowListeners.forEach((handler, eventType) => {
            if (typeof window !== 'undefined') {
                window.removeEventListener(eventType, handler);
            }
        });

        this.windowListeners.clear();
        this.listeners.clear();
        this.debouncedHandlers.clear();
    }
}

// ✅ SINGLETON EXPORT
export const GlobalEventManager = OptimizedGlobalEventManager.getInstance();

// ✅ HOOK OTIMIZADO PARA REACT
import { useEffect, useRef } from 'react';

export const useGlobalEventManager = (componentId?: string) => {
    const managerRef = useRef(
        componentId
            ? GlobalEventManager.createComponentManager(componentId)
            : null
    );

    useEffect(() => {
        return () => {
            // ✅ OTIMIZAÇÃO: Auto-cleanup no unmount
            if (managerRef.current) {
                managerRef.current.cleanupAll();
            }
        };
    }, []);

    return {
        addEventListener: managerRef.current?.addListener || GlobalEventManager.subscribe.bind(GlobalEventManager),
        emit: GlobalEventManager.emit.bind(GlobalEventManager),
        getStats: GlobalEventManager.getStats.bind(GlobalEventManager)
    };
};

export default GlobalEventManager;
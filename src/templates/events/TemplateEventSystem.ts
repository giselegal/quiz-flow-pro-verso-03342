/**
 * 🎯 TEMPLATE EVENT SYSTEM
 * Inspirado no React Email Editor (Unlayer) e Strapi
 * 
 * Sistema robusto de eventos para templates que permite:
 * - Escutar mudanças no template
 * - Hooks personalizados
 * - Validação em tempo real
 * - Plugins extensíveis
 */

export type TemplateEventType =
    | 'template:loaded'
    | 'template:changed'
    | 'template:saved'
    | 'template:error'
    | 'template:loading'
    | 'template:usage_incremented'
    | 'step:added'
    | 'step:removed'
    | 'step:reordered'
    | 'component:added'
    | 'component:removed'
    | 'component:updated'
    | 'validation:success'
    | 'validation:error'
    | 'validation:registered'
    | 'plugin:installed'
    | 'plugin:uninstalled'
    | 'plugin:activated'
    | 'plugin:deactivated'
    | 'form:update'
    | 'navigation:step'
    | 'notification:show'
    | 'cache:cleared'; export interface TemplateEvent<T = any> {
    type: TemplateEventType;
    payload: T;
    timestamp: number;
    templateId: string;
}

export type TemplateEventHandler<T = any> = (event: TemplateEvent<T>) => void;

/**
 * Sistema de eventos centralizado para templates
 */
class TemplateEventSystem {
    private listeners: Map<TemplateEventType, Set<TemplateEventHandler>> = new Map();
    private history: TemplateEvent[] = [];
    private maxHistorySize = 100;

    /**
     * Adicionar listener para eventos
     */
    addEventListener<T = any>(
        type: TemplateEventType,
        handler: TemplateEventHandler<T>
    ): () => void {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }

        this.listeners.get(type)!.add(handler);

        // Retornar função de cleanup
        return () => {
            this.listeners.get(type)?.delete(handler);
        };
    }

    /**
     * Emitir evento
     */
    emit<T = any>(
        type: TemplateEventType,
        payload: T,
        templateId: string
    ): void {
        const event: TemplateEvent<T> = {
            type,
            payload,
            timestamp: Date.now(),
            templateId
        };

        // Adicionar ao histórico
        this.history.unshift(event);
        if (this.history.length > this.maxHistorySize) {
            this.history.pop();
        }

        // Emitir para listeners
        const listeners = this.listeners.get(type);
        if (listeners) {
            listeners.forEach(handler => {
                try {
                    handler(event);
                } catch (error) {
                    console.error(`Erro no handler do evento ${type}:`, error);
                }
            });
        }

        // Log para desenvolvimento
        if (process.env.NODE_ENV === 'development') {
            console.log(`📡 Template Event [${type}]:`, event);
        }
    }

    /**
     * Remover todos os listeners de um tipo
     */
    removeAllListeners(type?: TemplateEventType): void {
        if (type) {
            this.listeners.delete(type);
        } else {
            this.listeners.clear();
        }
    }

    /**
     * Obter histórico de eventos
     */
    getHistory(templateId?: string): TemplateEvent[] {
        if (templateId) {
            return this.history.filter(event => event.templateId === templateId);
        }
        return [...this.history];
    }

    /**
     * Limpar histórico
     */
    clearHistory(): void {
        this.history = [];
    }
}

// Instância global do sistema de eventos
export const templateEventSystem = new TemplateEventSystem();

/**
 * Hook para usar o sistema de eventos em componentes React
 */
import { useEffect, useCallback } from 'react';

export function useTemplateEvents<T = any>(
    type: TemplateEventType,
    handler: TemplateEventHandler<T>,
    deps: React.DependencyList = []
) {
    const memoizedHandler = useCallback(handler, deps);

    useEffect(() => {
        const cleanup = templateEventSystem.addEventListener(type, memoizedHandler);
        return cleanup;
    }, [type, memoizedHandler]);
}

/**
 * Hook para emitir eventos
 */
export function useTemplateEventEmitter(templateId: string) {
    return useCallback(<T = any>(type: TemplateEventType, payload: T) => {
        templateEventSystem.emit(type, payload, templateId);
    }, [templateId]);
}
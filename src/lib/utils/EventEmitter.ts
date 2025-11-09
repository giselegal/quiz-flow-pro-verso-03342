/**
 * 🌐 BROWSER-COMPATIBLE EVENT EMITTER
 * 
 * Implementação de EventEmitter compatível com browser
 * para substituir o módulo 'events' do Node.js
 */

export interface EventEmitterListener {
    (...args: any[]): void;
}

export class EventEmitter {
    private events: Map<string, EventEmitterListener[]> = new Map();
    private maxListeners = 10;

    // Adicionar listener
    on(eventName: string, listener: EventEmitterListener): this {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }

        const listeners = this.events.get(eventName)!;
        listeners.push(listener);

        // Avisar se exceder o limite de listeners
        if (listeners.length > this.maxListeners) {
            console.warn(`MaxListenersExceededWarning: ${listeners.length} listeners added for event "${eventName}"`);
        }

        return this;
    }

    // Alias para on()
    addListener(eventName: string, listener: EventEmitterListener): this {
        return this.on(eventName, listener);
    }

    // Adicionar listener que será removido após primeira execução
    once(eventName: string, listener: EventEmitterListener): this {
        const onceWrapper = (...args: any[]) => {
            this.removeListener(eventName, onceWrapper);
            listener(...args);
        };

        return this.on(eventName, onceWrapper);
    }

    // Remover listener específico
    removeListener(eventName: string, listener: EventEmitterListener): this {
        const listeners = this.events.get(eventName);
        if (!listeners) return this;

        const index = listeners.indexOf(listener);
        if (index !== -1) {
            listeners.splice(index, 1);
            if (listeners.length === 0) {
                this.events.delete(eventName);
            }
        }

        return this;
    }

    // Alias para removeListener()
    off(eventName: string, listener: EventEmitterListener): this {
        return this.removeListener(eventName, listener);
    }

    // Remover todos os listeners de um evento
    removeAllListeners(eventName?: string): this {
        if (eventName) {
            this.events.delete(eventName);
        } else {
            this.events.clear();
        }
        return this;
    }

    // Emitir evento
    emit(eventName: string, ...args: any[]): boolean {
        const listeners = this.events.get(eventName);
        if (!listeners || listeners.length === 0) {
            return false;
        }

        // Executar todos os listeners
        listeners.forEach(listener => {
            try {
                listener(...args);
            } catch (error) {
                console.error(`Error in listener for event "${eventName}":`, error);
            }
        });

        return true;
    }

    // Obter listeners de um evento
    listeners(eventName: string): EventEmitterListener[] {
        return this.events.get(eventName)?.slice() || [];
    }

    // Contar listeners de um evento
    listenerCount(eventName: string): number {
        return this.events.get(eventName)?.length || 0;
    }

    // Obter nomes de todos os eventos
    eventNames(): string[] {
        return Array.from(this.events.keys());
    }

    // Definir limite máximo de listeners
    setMaxListeners(n: number): this {
        this.maxListeners = n;
        return this;
    }

    // Obter limite máximo de listeners
    getMaxListeners(): number {
        return this.maxListeners;
    }

    // Adicionar listener no início da lista
    prependListener(eventName: string, listener: EventEmitterListener): this {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }

        const listeners = this.events.get(eventName)!;
        listeners.unshift(listener);

        return this;
    }

    // Adicionar listener once no início da lista
    prependOnceListener(eventName: string, listener: EventEmitterListener): this {
        const onceWrapper = (...args: any[]) => {
            this.removeListener(eventName, onceWrapper);
            listener(...args);
        };

        return this.prependListener(eventName, onceWrapper);
    }
}

// Export default para compatibilidade
export default EventEmitter;
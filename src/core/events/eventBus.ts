// Implementação simples in-memory do Event Bus descrito nos contratos.
// Pode ser substituída futuramente por algo com replays, prioridade, etc.

import { IEventBus, QuizEvent } from '../../domain/quiz/contracts';

export class InMemoryEventBus implements IEventBus {
    private handlers: Map<QuizEvent['type'], Set<(e: any) => void>> = new Map();

    publish<T extends QuizEvent>(event: T): void {
        const set = this.handlers.get(event.type);
        if (set) {
            for (const handler of set) {
                try { handler(event); } catch (err) { /* eslint-disable no-console */ console.error('[EventBus] handler error', err); }
            }
        }
    }

    subscribe<T extends QuizEvent['type']>(type: T, handler: (e: Extract<QuizEvent, { type: T }>) => void): () => void {
        if (!this.handlers.has(type)) this.handlers.set(type, new Set());
        // @ts-expect-error narrow generics storage
        this.handlers.get(type)!.add(handler);
        return () => { this.handlers.get(type)?.delete(handler); };
    }
}

// Singleton básico (pode ser trocado por DI depois)
export const eventBus: IEventBus = new InMemoryEventBus();

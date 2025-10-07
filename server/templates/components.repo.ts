// In-memory repository para componentes (fase inicial)
import { AnyComponent } from './components';

const store = new Map<string, AnyComponent>();

export interface ComponentQuery {
    kinds?: string[];
    limit?: number;
}

export function saveComponent(c: AnyComponent): AnyComponent {
    store.set(c.id, c);
    return c;
}

export function getComponent(id: string): AnyComponent | undefined {
    return store.get(id);
}

export function listComponents(q: ComponentQuery = {}): AnyComponent[] {
    let items = Array.from(store.values());
    if (q.kinds && q.kinds.length) items = items.filter(c => q.kinds!.includes(c.kind));
    if (q.limit) items = items.slice(0, q.limit);
    return items;
}

export function deleteComponent(id: string): boolean {
    return store.delete(id);
}

export function clearAllComponents(): void {
    store.clear();
}

export function countComponents(): number {
    return store.size;
}

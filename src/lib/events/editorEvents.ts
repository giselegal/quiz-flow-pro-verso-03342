type Listener<T = any> = (payload: T) => void;

interface EventMap {
    EDITOR_BOOTSTRAP_PHASE: { phase: string };
    EDITOR_BOOTSTRAP_READY: { funnelId?: string | null };
    EDITOR_BOOTSTRAP_ERROR: { error: string };
    EDITOR_OPERATION_START: { key: string };
    EDITOR_OPERATION_END: { key: string; durationMs: number; error?: string };
    EDITOR_AUTOSAVE_START: { dirty: boolean };
    EDITOR_AUTOSAVE_SUCCESS: { savedAt: number };
    EDITOR_AUTOSAVE_ERROR: { error: string };
}

class EditorEventBus {
    private listeners: { [K in keyof EventMap]?: Listener<EventMap[K]>[] } = {};

    on<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>) {
        const currentListeners = this.listeners[event] as Listener<EventMap[K]>[] | undefined;
        this.listeners[event] = (currentListeners || []).concat(listener) as any;
        return () => this.off(event, listener);
    }

    off<K extends keyof EventMap>(event: K, listener: Listener<EventMap[K]>) {
        const arr = this.listeners[event] as Listener<EventMap[K]>[] | undefined;
        if (!arr) return;
        this.listeners[event] = arr.filter(l => l !== listener) as any;
    }

    emit<K extends keyof EventMap>(event: K, payload: EventMap[K]) {
        const arr = this.listeners[event];
        if (!arr || arr.length === 0) return;
        for (const l of arr) {
            try { l(payload); } catch (e) { console.warn('[editorEvents] listener error', e); }
        }
    }
}

export const editorEvents = new EditorEventBus();
export type EditorEventName = keyof EventMap;

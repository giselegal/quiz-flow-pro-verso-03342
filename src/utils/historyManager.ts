export interface HistoryState<T> {
    past: T[];
    present: T;
    future: T[];
}

export class HistoryManager<T> {
    private limit: number;
    private serializer: (s: T) => T;
    state: HistoryState<T>;

    constructor(initial: T, opts?: { limit?: number; serializer?: (s: T) => T }) {
        this.limit = opts?.limit || 100;
        this.serializer = opts?.serializer || (s => JSON.parse(JSON.stringify(s)) as T);
        this.state = { past: [], present: this.serializer(initial), future: [] };
    }

    push(next: T) {
        const snap = this.serializer(next);
        const past = [...this.state.past, this.state.present].slice(-this.limit);
        this.state = { past, present: snap, future: [] };
    }

    canUndo() { return this.state.past.length > 0; }
    canRedo() { return this.state.future.length > 0; }

    undo(): T | null {
        if (!this.canUndo()) return null;
        const past = [...this.state.past];
        const previous = past.pop()!;
        const future = [this.state.present, ...this.state.future];
        this.state = { past, present: previous, future };
        return this.serializer(this.state.present);
    }

    redo(): T | null {
        if (!this.canRedo()) return null;
        const [next, ...rest] = this.state.future;
        const past = [...this.state.past, this.state.present];
        this.state = { past, present: next, future: rest };
        return this.serializer(this.state.present);
    }
}

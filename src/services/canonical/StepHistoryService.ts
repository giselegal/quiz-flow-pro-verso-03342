export interface StepHistoryEntry<T = any> {
    id: string;
    stepId: string;
    prev: T;
    next: T;
    timestamp: number;
}

export class StepHistoryService<T = any> {
    private entries: StepHistoryEntry<T>[] = [];
    private pointer = -1;
    private limit: number;

    constructor(limit: number = 500) {
        this.limit = limit;
    }

    get canUndo() { return this.pointer >= 0; }
    get canRedo() { return this.pointer + 1 < this.entries.length; }
    clear() { this.entries = []; this.pointer = -1; }

    pushStepChange(stepId: string, prev: T, next: T) {
        // Trim futuro se necessário
        if (this.pointer < this.entries.length - 1) {
            this.entries = this.entries.slice(0, this.pointer + 1);
        }
        const entry: StepHistoryEntry<T> = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            stepId,
            prev: structuredClone(prev),
            next: structuredClone(next),
            timestamp: Date.now(),
        };
        this.entries.push(entry);
        // Enforce limit
        if (this.entries.length > this.limit) {
            const overflow = this.entries.length - this.limit;
            this.entries.splice(0, overflow);
        }
        this.pointer = this.entries.length - 1;
        return entry;
    }

    undoApply(applyFn: (entry: StepHistoryEntry<T>) => void) {
        if (!this.canUndo) return null;
        const entry = this.entries[this.pointer--];
        applyFn(entry); // aplica "prev"
        return entry;
    }

    redoApply(applyFn: (entry: StepHistoryEntry<T>) => void) {
        const idx = this.pointer + 1;
        if (idx >= this.entries.length) return null;
        const entry = this.entries[idx];
        applyFn(entry); // aplica "next"
        this.pointer = idx;
        return entry;
    }
}

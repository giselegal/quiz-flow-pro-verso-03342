// =============================================================
// FunnelEditingFacade - Contrato principal (fase 1)
// Objetivo: abstrair operações de edição de funis (inicialmente Quiz)
// Evolução futura: suportar múltiplos tipos mantendo API estável
// =============================================================

export type FunnelStepID = string;
export type FunnelBlockID = string;

export interface FunnelBlock {
    id: FunnelBlockID;
    type: string;              // ex: 'text', 'image', 'question'
    data: Record<string, any>; // payload específico
}

export interface FunnelStep {
    id: FunnelStepID;
    title: string;
    order: number;
    blocks: FunnelBlock[];
    meta?: Record<string, any>;
}

export interface FunnelSnapshotMeta {
    id?: string;
    templateId?: string;
    createdAt?: number;
    updatedAt?: number;
    // reservado para métricas / analytics / flags
    [k: string]: any;
}

export interface FunnelSnapshot {
    steps: FunnelStep[];
    meta: FunnelSnapshotMeta;
}

// ==============================
// Eventos padronizados da fachada
// ==============================
export type FunnelFacadeEventMap = {
    'steps/changed': { steps: FunnelStep[]; reason: 'add' | 'remove' | 'reorder' | 'update'; };
    'step/selected': { stepId: FunnelStepID | null; previous?: FunnelStepID | null; };
    'blocks/changed': { stepId: FunnelStepID; blocks: FunnelBlock[]; reason: 'add' | 'remove' | 'update' | 'reorder'; };
    'dirty/changed': { dirty: boolean; };
    'save/start': { timestamp: number; };
    'save/success': { timestamp: number; duration: number; };
    'save/error': { timestamp: number; error: string; };
};

export type FunnelFacadeEvent = keyof FunnelFacadeEventMap;

export interface IFunnelEditingFacade {
    // Estado base (read-only)
    getSteps(): FunnelStep[];
    getStep(stepId: FunnelStepID): FunnelStep | undefined;
    getSelectedStep(): FunnelStep | undefined;
    isDirty(): boolean;
    getMeta(): FunnelSnapshotMeta;

    // Navegação / seleção
    selectStep(stepId: FunnelStepID | null): void;

    // Persistência (fase 1: apenas stub save)
    save(): Promise<void>; // Internamente emitirá eventos save/start|success|error

    // Assinatura de eventos
    on<E extends FunnelFacadeEvent>(event: E, handler: (payload: FunnelFacadeEventMap[E]) => void): () => void;
    off<E extends FunnelFacadeEvent>(event: E, handler: (payload: FunnelFacadeEventMap[E]) => void): void;

    // Mutations (serão implementadas em fases posteriores)
    addStep(step: Omit<FunnelStep, 'order'> & Partial<Pick<FunnelStep, 'order'>>): FunnelStep;
    updateStep(stepId: FunnelStepID, patch: Partial<Omit<FunnelStep, 'id'>>): FunnelStep | undefined;
    removeStep(stepId: FunnelStepID): boolean;
    reorderSteps(newOrder: FunnelStepID[]): void;
    addBlock(stepId: FunnelStepID, block: Omit<FunnelBlock, 'id'> & { id?: string }): FunnelBlock | undefined;
    updateBlock(stepId: FunnelStepID, blockId: FunnelBlockID, patch: Partial<Omit<FunnelBlock, 'id'>>): FunnelBlock | undefined;
    removeBlock(stepId: FunnelStepID, blockId: FunnelBlockID): boolean;
    reorderBlocks(stepId: FunnelStepID, newOrder: FunnelBlockID[]): void;
}

// ==============================================================
// Implementação mínima (fase 1) - somente leitura + seleção + eventos básicos
// ==============================================================

interface InternalState {
    steps: FunnelStep[];
    selectedStepId: FunnelStepID | null;
    dirty: boolean;
    meta: FunnelSnapshotMeta;
}

export class QuizFunnelEditingFacade implements IFunnelEditingFacade {
    private state: InternalState;
    private listeners: { [K in FunnelFacadeEvent]?: Array<(p: any) => void> } = {};

    constructor(snapshot: FunnelSnapshot) {
        this.state = {
            steps: [...snapshot.steps].sort((a, b) => a.order - b.order),
            selectedStepId: snapshot.steps[0]?.id || null,
            dirty: false,
            meta: snapshot.meta || {}
        };
    }

    // -------------- helpers internos --------------
    private emit<E extends FunnelFacadeEvent>(event: E, payload: FunnelFacadeEventMap[E]) {
        this.listeners[event]?.forEach(h => {
            try { h(payload); } catch (err) { console.error('[FunnelFacade listener error]', event, err); }
        });
    }

    private setDirty(dirty: boolean) {
        if (this.state.dirty === dirty) return;
        this.state.dirty = dirty;
        this.emit('dirty/changed', { dirty });
    }

    // -------------- leitura --------------
    getSteps(): FunnelStep[] { return this.state.steps; }
    getStep(stepId: FunnelStepID): FunnelStep | undefined { return this.state.steps.find(s => s.id === stepId); }
    getSelectedStep(): FunnelStep | undefined { return this.state.steps.find(s => s.id === this.state.selectedStepId); }
    isDirty(): boolean { return this.state.dirty; }
    getMeta(): FunnelSnapshotMeta { return this.state.meta; }

    // -------------- seleção --------------
    selectStep(stepId: FunnelStepID | null): void {
        if (this.state.selectedStepId === stepId) return;
        const previous = this.state.selectedStepId;
        this.state.selectedStepId = stepId;
        this.emit('step/selected', { stepId, previous });
    }

    // -------------- persistência stub --------------
    async save(): Promise<void> {
        const start = Date.now();
        this.emit('save/start', { timestamp: start });
        try {
            // Fase 1: não persiste ainda, apenas simula (futuro: integrar useUnifiedCRUD.saveFunnel)
            await new Promise(r => setTimeout(r, 50));
            this.setDirty(false);
            const end = Date.now();
            this.emit('save/success', { timestamp: end, duration: end - start });
        } catch (e: any) {
            const end = Date.now();
            this.emit('save/error', { timestamp: end, error: String(e) });
            throw e;
        }
    }

    // -------------- eventos --------------
    on<E extends FunnelFacadeEvent>(event: E, handler: (payload: FunnelFacadeEventMap[E]) => void): () => void {
        (this.listeners[event] ||= []).push(handler as any);
        return () => this.off(event, handler as any);
    }
    off<E extends FunnelFacadeEvent>(event: E, handler: (payload: FunnelFacadeEventMap[E]) => void): void {
        const arr = this.listeners[event];
        if (!arr) return;
        const idx = arr.indexOf(handler as any);
        if (idx >= 0) arr.splice(idx, 1);
    }

    // -------------- mutations steps --------------
    addStep(step: Omit<FunnelStep, 'order'> & Partial<Pick<FunnelStep, 'order'>>): FunnelStep {
        const order = typeof step.order === 'number' ? step.order : this.state.steps.length;
        const newStep: FunnelStep = { ...step, order, blocks: step.blocks || [] } as FunnelStep;
        this.state.steps.push(newStep);
        // normalizar ordem
        this.state.steps.sort((a, b) => a.order - b.order).forEach((s, i) => s.order = i);
        this.setDirty(true);
        this.emit('steps/changed', { steps: this.state.steps.slice(), reason: 'add' });
        return newStep;
    }
    updateStep(stepId: FunnelStepID, patch: Partial<Omit<FunnelStep, 'id'>>): FunnelStep | undefined {
        const s = this.state.steps.find(st => st.id === stepId);
        if (!s) return undefined;
        Object.assign(s, patch);
        this.setDirty(true);
        this.emit('steps/changed', { steps: this.state.steps.slice(), reason: 'update' });
        return s;
    }
    removeStep(stepId: FunnelStepID): boolean {
        const idx = this.state.steps.findIndex(s => s.id === stepId);
        if (idx < 0) return false;
        this.state.steps.splice(idx, 1);
        this.state.steps.forEach((s, i) => s.order = i);
        if (this.state.selectedStepId === stepId) {
            this.state.selectedStepId = this.state.steps[0]?.id || null;
            this.emit('step/selected', { stepId: this.state.selectedStepId, previous: stepId });
        }
        this.setDirty(true);
        this.emit('steps/changed', { steps: this.state.steps.slice(), reason: 'remove' });
        return true;
    }
    reorderSteps(newOrder: FunnelStepID[]): void {
        const map = new Map(this.state.steps.map(s => [s.id, s] as const));
        const reordered: FunnelStep[] = [];
        newOrder.forEach(id => { const s = map.get(id); if (s) reordered.push(s); });
        // add any missing (safety)
        this.state.steps.forEach(s => { if (!reordered.includes(s)) reordered.push(s); });
        reordered.forEach((s, i) => s.order = i);
        this.state.steps = reordered;
        this.setDirty(true);
        this.emit('steps/changed', { steps: this.state.steps.slice(), reason: 'reorder' });
    }

    // -------------- mutations blocks --------------
    addBlock(stepId: FunnelStepID, block: Omit<FunnelBlock, 'id'> & { id?: string }): FunnelBlock | undefined {
        const step = this.state.steps.find(s => s.id === stepId);
        if (!step) return undefined;
        const newBlock: FunnelBlock = { id: block.id || `blk-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, type: block.type, data: block.data || {} };
        step.blocks.push(newBlock);
        this.setDirty(true);
        this.emit('blocks/changed', { stepId, blocks: step.blocks.slice(), reason: 'add' });
        return newBlock;
    }
    updateBlock(stepId: FunnelStepID, blockId: FunnelBlockID, patch: Partial<Omit<FunnelBlock, 'id'>>): FunnelBlock | undefined {
        const step = this.state.steps.find(s => s.id === stepId); if (!step) return undefined;
        const blk = step.blocks.find(b => b.id === blockId); if (!blk) return undefined;
        Object.assign(blk, patch);
        this.setDirty(true);
        this.emit('blocks/changed', { stepId, blocks: step.blocks.slice(), reason: 'update' });
        return blk;
    }
    removeBlock(stepId: FunnelStepID, blockId: FunnelBlockID): boolean {
        const step = this.state.steps.find(s => s.id === stepId); if (!step) return false;
        const idx = step.blocks.findIndex(b => b.id === blockId); if (idx < 0) return false;
        step.blocks.splice(idx, 1);
        this.setDirty(true);
        this.emit('blocks/changed', { stepId, blocks: step.blocks.slice(), reason: 'remove' });
        return true;
    }
    reorderBlocks(stepId: FunnelStepID, newOrder: FunnelBlockID[]): void {
        const step = this.state.steps.find(s => s.id === stepId); if (!step) return;
        const map = new Map(step.blocks.map(b => [b.id, b] as const));
        const reordered: FunnelBlock[] = [];
        newOrder.forEach(id => { const b = map.get(id); if (b) reordered.push(b); });
        step.blocks.forEach(b => { if (!reordered.includes(b)) reordered.push(b); });
        step.blocks = reordered;
        this.setDirty(true);
        this.emit('blocks/changed', { stepId, blocks: step.blocks.slice(), reason: 'reorder' });
    }
}

// ==============================================================
// Próximas fases:
// - Fase 2 (Mutations): add/update/remove step + blocks -> setDirty(true) + emitir eventos steps/changed ou blocks/changed
// - Fase 3 (Persistência real): integrar com CRUD: saveFunnel() e mapear snapshot
// - Fase 4 (Autosave): debounce + eventos reutilizando dirty/changed
// ==============================================================

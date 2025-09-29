/**
 * QuizEditingService
 * --------------------------------------------------------------
 * Camada orquestradora para tornar o /quiz-estilo editável no /editor.
 * - Carrega definição canônica (quiz-definition.json)
 * - Aplica overrides (memória + persistência opcional)
 * - Regera blocks via blockTemplateGenerator
 * - Emite eventos no eventBus
 * - Expõe API para alterar steps / blocks / propriedades
 */

import { eventBus } from '@/core/events/eventBus';
import canonicalDefinition from './quiz-definition.json';
import { buildCanonicalBlocksTemplate } from './blockTemplateGenerator';
import { QuizDefinition } from './types';
import { quizOverridesStorage } from './storage/QuizOverridesStorage';

// Tipo derivado para um step canônico
export type QuizStepLike = QuizDefinition['steps'][number];

interface QuizOverridesFile {
    version: number;
    updatedAt: string | null;
    steps: Record<string, Partial<QuizStepLike>>;
    blocks: Record<string, any>;
}

export interface AppliedQuizState {
    definition: QuizDefinition;
    steps: QuizStepLike[];
    blocks: Record<string, any[]>; // stepId -> blocks
    hash: string;
    overrides: QuizOverridesFile;
}

type Listener = (state: AppliedQuizState) => void;

function computeSimpleHash(obj: any): string {
    try {
        const json = JSON.stringify(obj);
        let h = 0, i = 0, len = json.length;
        while (i < len) h = (Math.imul(31, h) + json.charCodeAt(i++)) | 0;
        return 'h' + (h >>> 0).toString(16);
    } catch {
        return 'h0';
    }
}

// Mantido apenas para compat/localStorage legacy durante refatoração
const OVERRIDES_STORAGE_KEY = 'quiz-overrides-v1';

export class QuizEditingService {
    private static instance: QuizEditingService;
    private baseDefinition: QuizDefinition;
    private overrides: QuizOverridesFile;
    private state: AppliedQuizState | null = null;
    private listeners: Set<Listener> = new Set();
    private dirty = false;
    private persistenceEnabled: boolean;
    private initialized = false;

    private constructor() {
        this.baseDefinition = canonicalDefinition as unknown as QuizDefinition;
        this.persistenceEnabled = (import.meta as any).env?.VITE_QUIZ_EDITOR_PERSIST !== 'false';
        this.overrides = { version: 1, updatedAt: null, steps: {}, blocks: {} };
        // inicialização assíncrona
        this.initialize();
    }

    static getInstance() {
        if (!QuizEditingService.instance) {
            QuizEditingService.instance = new QuizEditingService();
        }
        return QuizEditingService.instance;
    }

    // ----------------------------------------------------------
    // Public API
    // ----------------------------------------------------------
    getState(): AppliedQuizState { return this.state!; }
    getOverrides(): QuizOverridesFile { return this.overrides; }

    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        // emitir snapshot inicial
        listener(this.state!);
        return () => this.listeners.delete(listener);
    }

    updateStep(stepId: string, patch: Partial<QuizStepLike>) {
        const original = this.findStep(stepId);
        if (!original) throw new Error(`Step ${stepId} não encontrado`);
        this.overrides.steps[stepId] = { ...(this.overrides.steps[stepId] || {}), ...patch };
        this.markDirty();
        this.recompute();
        eventBus.publish({ type: 'editor.step.modified', stepId, field: Object.keys(patch).join(','), ts: Date.now() });
    }

    resetStep(stepId: string) {
        if (this.overrides.steps[stepId]) {
            delete this.overrides.steps[stepId];
            this.markDirty();
            this.recompute();
            eventBus.publish({ type: 'quiz.definition.reload', hash: this.state?.hash || '', ts: Date.now() });
        }
    }

    updateBlock(stepId: string, blockIndex: number, patch: any) {
        // estratégia futura: block-level overrides; por ora aplicamos no step override
        const step = this.findStep(stepId);
        if (!step) throw new Error('Step inexistente');
        const stepOverride = this.overrides.steps[stepId] || {};
        const blocksOverride = Array.isArray((stepOverride as any).blocks) ? [...(stepOverride as any).blocks] : [];
        // garantir comprimento
        while (blocksOverride.length <= blockIndex) blocksOverride.push({});
        blocksOverride[blockIndex] = { ...blocksOverride[blockIndex], ...patch };
        (stepOverride as any).blocks = blocksOverride;
        this.overrides.steps[stepId] = stepOverride;
        this.markDirty();
        this.recompute();
        eventBus.publish({ type: 'editor.step.modified', stepId, field: `block:${blockIndex}`, ts: Date.now() });
    }

    save() {
        if (!this.dirty) return;
        this.persistOverrides();
        this.dirty = false;
        eventBus.publish({ type: 'quiz.definition.reload', hash: this.state?.hash || '', ts: Date.now() });
    }

    publish() {
        // Futuro: pipeline de versioning/snapshot; por ora só delega para save
        this.save();
        eventBus.publish({ type: 'version.published', version: this.state?.hash || 'draft', ts: Date.now() });
    }

    resetAll() {
        this.overrides = { version: 1, updatedAt: null, steps: {}, blocks: {} };
        this.markDirty();
        this.recompute();
        eventBus.publish({ type: 'quiz.definition.reload', hash: this.state?.hash || '', ts: Date.now() });
    }

    // ----------------------------------------------------------
    // Internal
    // ----------------------------------------------------------
    private findStep(stepId: string): QuizStepLike | undefined {
        return this.baseDefinition.steps.find(s => s.id === stepId);
    }

    private markDirty() { this.dirty = true; }

    private async initialize() {
        await quizOverridesStorage.init();
        const stored = quizOverridesStorage.get();
        this.overrides = {
            version: stored.version,
            updatedAt: stored.updatedAt,
            steps: stored.steps as Record<string, Partial<QuizStepLike>>,
            blocks: stored.blocks
        };
        this.initialized = true;
        this.recompute();
    }

    private persistOverrides() {
        this.overrides.updatedAt = new Date().toISOString();
        if (!this.persistenceEnabled) return;
        quizOverridesStorage.save(this.overrides).then(() => {
            eventBus.publish({ type: 'quiz.definition.reload', hash: this.state?.hash || '', ts: Date.now() });
        });
    }

    private applyOverrides(): QuizDefinition {
        const clone: QuizDefinition = JSON.parse(JSON.stringify(this.baseDefinition));
        for (const step of clone.steps) {
            const ov = this.overrides.steps[step.id];
            if (!ov) continue;
            Object.assign(step, ov, { id: step.id }); // manter id
            if ((ov as any).blocks) {
                // blocks overrides aplicados após geração (apenas sinalizamos aqui)
                (step as any).__blocksOverride = (ov as any).blocks;
            }
        }
        return clone;
    }

    private recompute() {
        const merged = this.applyOverrides();
        // buildCanonicalBlocksTemplate usa a definição canônica global;
        // se aceitarmos no futuro múltiplas definições, refatorar para aceitar param.
        const blocks = buildCanonicalBlocksTemplate();
        // aplicar overrides de blocks específicos (índice)
        for (const step of merged.steps) {
            const overrideBlocks = (step as any).__blocksOverride;
            if (overrideBlocks && Array.isArray(overrideBlocks)) {
                const stepBlocks = blocks[step.id] || [];
                overrideBlocks.forEach((patch: any, idx: number) => {
                    if (!patch) return;
                    if (!stepBlocks[idx]) return; // ignorar se não existe mais
                    stepBlocks[idx] = { ...stepBlocks[idx], properties: { ...stepBlocks[idx].properties, ...patch } };
                });
            }
        }
        const hash = computeSimpleHash({ merged, overrides: this.overrides });
        this.state = { definition: merged, steps: merged.steps, blocks, hash, overrides: this.overrides };
        this.notify();
        eventBus.publish({ type: 'quiz.definition.reload', hash, ts: Date.now() });
    }

    private notify() {
        if (!this.state) return;
        for (const l of this.listeners) {
            try { l(this.state); } catch {/* ignore */ }
        }
    }
}

export const quizEditingService = QuizEditingService.getInstance();

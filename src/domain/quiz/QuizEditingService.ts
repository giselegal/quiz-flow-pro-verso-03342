
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
import { logger } from '@/core/logging/StructuredLogger';
import canonicalDefinition from './quiz-definition';
import { buildCanonicalBlocksTemplate, buildBlocksForDefinition } from './blockTemplateGenerator';
import { invalidateQuizTemplate } from '@/templates/quiz21StepsAdapter';
import { QuizDefinition } from './types';
import { quizOverridesStorage } from './storage/QuizOverridesStorage';

// Tipo derivado para um step canônico
export type QuizStepLike = QuizDefinition['steps'][number];

interface QuizOverridesFile {
    version: number;
    updatedAt: string | null;
    steps: Record<string, Partial<QuizStepLike>>;
    blocks: Record<string, any>;
    root?: Partial<Pick<QuizDefinition, 'scoring' | 'progress' | 'offerMapping'>>; // novos overrides de nível raiz
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
        // emitir snapshot inicial somente se já houver estado computado
        if (this.state) listener(this.state);
        return () => this.listeners.delete(listener);
    }

    updateStep(stepId: string, patch: Partial<QuizStepLike>) {
        const original = this.findStep(stepId);
        if (!original) throw new Error(`Step ${stepId} não encontrado`);
        this.overrides.steps[stepId] = { ...(this.overrides.steps[stepId] || {}), ...patch };
        this.markDirty();
        invalidateQuizTemplate('updateStep');
        this.recompute([stepId]);
        logger.info('Step atualizado', { stepId, fields: Object.keys(patch) }, 'QuizEditingService');
        eventBus.publish({ type: 'editor.step.modified', stepId, field: Object.keys(patch).join(','), ts: Date.now() });
    }

    resetStep(stepId: string) {
        if (this.overrides.steps[stepId]) {
            delete this.overrides.steps[stepId];
            this.markDirty();
            invalidateQuizTemplate('resetStep');
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
        invalidateQuizTemplate('updateBlock');
        this.recompute([stepId]);
        logger.debug('Block atualizado', { stepId, blockIndex, patchKeys: Object.keys(patch) }, 'QuizEditingService');
        eventBus.publish({ type: 'editor.step.modified', stepId, field: `block:${blockIndex}`, ts: Date.now() });
    }

    // ---- Root-level updates (scoring, progress, offerMapping) ----
    private updateRoot(patch: Partial<Pick<QuizDefinition, 'scoring' | 'progress' | 'offerMapping'>>) {
        this.overrides.root = { ...(this.overrides.root || {}), ...patch };
        this.markDirty();
        // Root-level impacta potencialmente todos os steps (ex: progress). Regerar integral.
        this.recompute();
        // evento simplificado usando existente
        eventBus.publish({ type: 'quiz.definition.reload', hash: this.state?.hash || '', ts: Date.now() });
    }

    updateScoring(patch: Partial<QuizDefinition['scoring']>) {
        const current = this.overrides.root?.scoring || this.baseDefinition.scoring;
        this.updateRoot({ scoring: { ...current, ...patch } });
    }

    updateProgress(patch: Partial<QuizDefinition['progress']>) {
        const current = this.overrides.root?.progress || this.baseDefinition.progress;
        this.updateRoot({ progress: { ...current, ...patch } });
    }

    updateOfferMapping(patch: Partial<QuizDefinition['offerMapping']>) {
        const current = this.overrides.root?.offerMapping || this.baseDefinition.offerMapping;
        this.updateRoot({ offerMapping: { ...current, ...patch } });
    }

    save() {
        if (!this.dirty) return;
        this.persistOverrides();
        this.dirty = false;
        logger.success('Overrides salvos', { updatedAt: this.overrides.updatedAt }, 'QuizEditingService');
        eventBus.publish({ type: 'quiz.definition.reload', hash: this.state?.hash || '', ts: Date.now() });
    }

    publish() {
        // Futuro: pipeline de versioning/snapshot; por ora só delega para save
        this.save();
        logger.success('Versão publicada', { hash: this.state?.hash }, 'QuizEditingService');
        eventBus.publish({ type: 'version.published', version: this.state?.hash || 'draft', ts: Date.now() });
    }

    isDirty() { return this.dirty; }
    isInitialized() { return !!this.state; }

    resetAll() {
        this.overrides = { version: 1, updatedAt: null, steps: {}, blocks: {} };
        this.markDirty();
        invalidateQuizTemplate('resetAll');
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
            // Evento granular de persistência
            eventBus.publish({
                type: 'quiz.overrides.persisted',
                hash: this.state?.hash || '',
                ts: Date.now()
            } as any);
            logger.info('Persistência concluída', { medium: 'auto' }, 'QuizEditingService');
            eventBus.publish({ type: 'quiz.definition.reload', hash: this.state?.hash || '', ts: Date.now() });
        });
    }

    private applyOverrides(): QuizDefinition {
        const clone: QuizDefinition = JSON.parse(JSON.stringify(this.baseDefinition));
        // aplicar root overrides
        if (this.overrides.root) {
            if (this.overrides.root.scoring) clone.scoring = { ...clone.scoring, ...this.overrides.root.scoring };
            if (this.overrides.root.progress) clone.progress = { ...clone.progress, ...this.overrides.root.progress };
            if (this.overrides.root.offerMapping) clone.offerMapping = { ...clone.offerMapping, ...this.overrides.root.offerMapping };
        }
        for (const step of clone.steps) {
            const ov = this.overrides.steps[step.id];
            if (!ov) continue;
            Object.assign(step, ov, { id: step.id }); // manter id
            if ((ov as any).blocks) {
                (step as any).__blocksOverride = (ov as any).blocks;
            }
        }
        return clone;
    }

    private recompute(changedStepIds?: string[]) {
        const merged = this.applyOverrides();
        // Se ainda não temos estado ou não foram passados steps específicos, reconstruir tudo
        if (!this.state || !changedStepIds || changedStepIds.length === 0) {
            const fullBlocks = buildCanonicalBlocksTemplate();
            // aplicar overrides de propriedades em blocks
            for (const step of merged.steps) this.applyBlockOverrides(step, fullBlocks);
            const hash = computeSimpleHash({ merged, overrides: this.overrides });
            this.state = { definition: merged, steps: merged.steps, blocks: fullBlocks, hash, overrides: this.overrides };
            this.notify();
            eventBus.publish({ type: 'quiz.definition.reload', hash, ts: Date.now() });
            logger.debug('Rebuild completo', { steps: merged.steps.length }, 'QuizEditingService');
            return;
        }
        // Hot reload seletivo: reconstruir apenas steps alterados
        const partial = buildBlocksForDefinition(merged, changedStepIds);
        // Aplicar overrides de blocks a cada step afetado
        for (const step of merged.steps) {
            if (changedStepIds.includes(step.id)) this.applyBlockOverrides(step, partial);
        }
        // Mesclar no estado existente
        const nextBlocks = { ...(this.state.blocks || {}) };
        Object.assign(nextBlocks, partial);
        const hash = computeSimpleHash({ merged, overrides: this.overrides });
        this.state = { definition: merged, steps: merged.steps, blocks: nextBlocks, hash, overrides: this.overrides };
        this.notify();
        eventBus.publish({ type: 'quiz.definition.reload', hash, ts: Date.now(), changedSteps: changedStepIds });
        logger.debug('Rebuild seletivo', { changedSteps: changedStepIds }, 'QuizEditingService');
    }

    private applyBlockOverrides(step: any, blocksRecord: Record<string, any[]>) {
        const overrideBlocks = (step as any).__blocksOverride;
        if (!overrideBlocks || !Array.isArray(overrideBlocks)) return;
        const stepBlocks = blocksRecord[step.id] || [];
        overrideBlocks.forEach((patch: any, idx: number) => {
            if (!patch) return;
            if (!stepBlocks[idx]) return;
            stepBlocks[idx] = { ...stepBlocks[idx], properties: { ...stepBlocks[idx].properties, ...patch } };
        });
    }

    private notify() {
        if (!this.state) return;
        for (const l of this.listeners) {
            try { l(this.state); } catch {/* ignore */ }
        }
    }
}

export const quizEditingService = QuizEditingService.getInstance();

import { TemplateDraft, createBaseTemplate, Component, Stage, Outcome, ScoringConfig } from './models';
import { logger } from '../lib/logger';
import { nanoid } from 'nanoid';

// In-memory repository (MVP)
export interface ITemplateRepository {
    createFromBase(name: string, slug: string): TemplateDraft;
    cloneTemplate(sourceId: string, name: string, slug: string): TemplateDraft;
    get(id: string): TemplateDraft | undefined;
    save(template: TemplateDraft): void;
    appendHistory(template: TemplateDraft, entry: { op: string; details?: any;[k: string]: any }): void;
    list(): TemplateDraft[];
}

class TemplateRepository implements ITemplateRepository {
    private templates = new Map<string, TemplateDraft>();

    createFromBase(name: string, slug: string): TemplateDraft {
        const id = `tpl_${nanoid(8)}`;
        const t = createBaseTemplate(id, slug);
        t.name = name;
        this.templates.set(id, t);
        return structuredClone(t);
    }

    cloneTemplate(sourceId: string, name: string, slug: string): TemplateDraft {
        const src = this.templates.get(sourceId);
        if (!src) throw new Error('SOURCE_NOT_FOUND');
        const id = `tpl_${nanoid(8)}`;
        const cloned: TemplateDraft = {
            ...structuredClone(src),
            id,
            name,
            slug,
            status: 'draft',
            publishedSnapshot: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.templates.set(id, cloned);
        return structuredClone(cloned);
    }

    get(id: string): TemplateDraft | undefined {
        const t = this.templates.get(id);
        return t && structuredClone(t);
    }

    save(template: TemplateDraft) {
        template.updatedAt = new Date().toISOString();
        this.templates.set(template.id, structuredClone(template));
    }

    appendHistory(template: TemplateDraft, entry: Omit<any, 'id' | 'timestamp'> & { op: string; details?: any }) {
        const histEntry = { id: `h_${template.history.length}`, timestamp: new Date().toISOString(), ...entry };
        template.history.push(histEntry);
    }

    list(): TemplateDraft[] {
        return Array.from(this.templates.values()).map(t => structuredClone(t));
    }
}

export const templateRepo = new TemplateRepository();

// Runtime session in-memory (MVP)
export interface RuntimeSession {
    sessionId: string;
    templateId: string;
    publishId: string; // publishedAt
    currentStageId: string;
    answers: Record<string, string[]>; // stageId -> optionIds
    score: number;
    createdAt: string;
    updatedAt: string;
    completed: boolean;
}

export interface IRuntimeSessionRepository {
    create(template: TemplateDraft): RuntimeSession;
    get(sessionId: string): RuntimeSession | undefined;
    save(session: RuntimeSession): void;
}

class InMemoryRuntimeSessionRepository implements IRuntimeSessionRepository {
    private sessions = new Map<string, RuntimeSession>();
    create(template: TemplateDraft): RuntimeSession {
        if (!template.publishedSnapshot) throw new Error('NOT_PUBLISHED');
        const firstStage = template.publishedSnapshot.stages.find((s: any) => s.enabled !== false) || template.publishedSnapshot.stages[0];
        const sessionId = `sess_${nanoid(10)}`;
        const now = new Date().toISOString();
        const sess: RuntimeSession = {
            sessionId,
            templateId: template.id,
            publishId: template.publishedSnapshot.publishedAt,
            currentStageId: firstStage.id,
            answers: {},
            score: 0,
            createdAt: now,
            updatedAt: now,
            completed: false
        };
        this.sessions.set(sessionId, sess);
        return { ...sess };
    }
    get(sessionId: string): RuntimeSession | undefined {
        const s = this.sessions.get(sessionId);
        return s && { ...s };
    }
    save(s: RuntimeSession): void {
        s.updatedAt = new Date().toISOString();
        this.sessions.set(s.sessionId, { ...s });
    }
}

let selectedRuntimeRepo: IRuntimeSessionRepository;
if ((process.env.PERSIST_SESSIONS || '').toLowerCase() === 'sqlite') {
    // lazy import (CommonJS style not needed, using dynamic ESM import not ideal here; assume compiled bundler handles)
    try {
        // @ts-ignore
        const { SqliteRuntimeSessionRepository } = await import('../persistence/sqlite/runtimeSessionRepo.sqlite.js');
        selectedRuntimeRepo = new SqliteRuntimeSessionRepository();
    } catch (e) {
        console.warn('[persistence] Falling back to in-memory runtime sessions (erro ao carregar SQLite)', e);
        selectedRuntimeRepo = new InMemoryRuntimeSessionRepository();
    }
} else {
    selectedRuntimeRepo = new InMemoryRuntimeSessionRepository();
}
logger.info('persistence.runtimeSessions.driver', { driver: (process.env.PERSIST_SESSIONS || 'memory').toLowerCase() });
export const runtimeSessionRepo: IRuntimeSessionRepository = selectedRuntimeRepo;

// Simple scoring util
export function computeScore(template: TemplateDraft, answers: Record<string, string[]>) {
    const weights = template.logic.scoring.weights || {};
    let total = 0;
    for (const [stageId, opts] of Object.entries(answers)) {
        for (const opt of opts) {
            const key = `${stageId}:${opt}`;
            if (weights[key]) total += weights[key];
        }
    }
    if (template.logic.scoring.mode === 'average') {
        const count = Object.values(answers).reduce((acc, arr) => acc + arr.length, 0) || 1;
        total = total / count;
    }
    return total;
}

// Utility funcs
export function addStage(template: TemplateDraft, type: Stage['type']): Stage {
    const id = `stage_${template.stages.length}`;
    const stage: Stage = { id, type, order: template.stages.length, enabled: true, componentIds: [] };
    template.stages.push(stage);
    return stage;
}

export function addComponent(template: TemplateDraft, stageId: string, type: string, props: Record<string, any>): Component {
    const stage = template.stages.find(s => s.id === stageId);
    if (!stage) throw new Error('STAGE_NOT_FOUND');
    const id = `cmp_${nanoid(6)}`;
    const cmp: Component = { id, type, props };
    template.components[id] = cmp;
    stage.componentIds.push(id);
    return cmp;
}

export function updateScoring(template: TemplateDraft, cfg: Partial<ScoringConfig>) {
    template.logic.scoring = { ...template.logic.scoring, ...cfg } as ScoringConfig;
}

export function addOutcome(template: TemplateDraft, outcome: Omit<Outcome, 'id'> & { id?: string }) {
    const id = outcome.id || `out_${template.outcomes.length}`;
    template.outcomes.push({ ...outcome, id });
}

export function publishTemplate(template: TemplateDraft) {
    const snapshot = structuredClone({
        id: template.id,
        slug: template.slug,
        schemaVersion: template.schemaVersion,
        stages: template.stages,
        components: template.components,
        logic: template.logic,
        outcomes: template.outcomes,
        publishedAt: new Date().toISOString()
    });
    template.publishedSnapshot = snapshot;
    template.status = 'published';
}

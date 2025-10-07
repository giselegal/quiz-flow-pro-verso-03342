import { templateRepo } from './repo';
import { createBaseTemplate, deepClone, TemplateAggregate, TemplatePublishedSnapshot, genId, RuntimeSession, BranchingRule, ConditionTreeNode } from './models';
import { validateTemplate } from './validation';

// Armazena sessões em memória (MVP)
const runtimeSessions = new Map<string, RuntimeSession>();

function computeScore(aggregate: TemplateAggregate, answers: Record<string, string[]>): number {
    const weights = aggregate.draft.logic.scoring.weights;
    let total = 0;
    for (const [stageId, optionIds] of Object.entries(answers)) {
        for (const opt of optionIds) {
            const key = `${stageId}:${opt}`;
            if (weights[key]) total += weights[key];
        }
    }
    if (aggregate.draft.logic.scoring.mode === 'average') {
        // average simples: divide pelo número de respostas
        const count = Object.values(answers).reduce((acc, arr) => acc + arr.length, 0) || 1;
        total = total / count;
    }
    return total;
}

function resolveOutcome(aggregate: TemplateAggregate, score: number): string | undefined {
    for (const o of aggregate.draft.outcomes) {
        const min = o.minScore ?? -Infinity;
        const max = o.maxScore ?? Infinity;
        if (score >= min && score <= max) return o.id;
    }
    return undefined;
}

function interpolateOutcome(aggregate: TemplateAggregate, outcomeId: string | undefined, score: number): string | undefined {
    if (!outcomeId) return undefined;
    const o = aggregate.draft.outcomes.find(o => o.id === outcomeId);
    if (!o) return undefined;
    return o.template.replace(/{{\s*score\s*}}/g, String(score));
}

function evalPredicate(pred: any, ctx: { score: number; answers: Record<string, string[]> }): boolean {
    if (pred.scoreGte !== undefined) return ctx.score >= pred.scoreGte;
    if (pred.scoreLte !== undefined) return ctx.score <= pred.scoreLte;
    if (pred.answersCountGte !== undefined) {
        const totalAnswers = Object.values(ctx.answers).reduce((acc, arr) => acc + arr.length, 0);
        return totalAnswers >= pred.answersCountGte;
    }
    if (pred.answeredIncludes) {
        const { stageId, optionId } = pred.answeredIncludes;
        return (ctx.answers[stageId] || []).includes(optionId);
    }
    return false; // desconhecido
}

function evalConditionTree(node: ConditionTreeNode, ctx: { score: number; answers: Record<string, string[]> }): boolean {
    // Compatibilidade: alguns testes mandam objetos como { op:'AND', conditions:[ {scoreGte:10}, {scoreLte:20} ] }
    if (!node) return false;
    const op = node.op;
    const children = node.conditions || [];
    if (op === 'AND') {
        return children.every(ch => {
            if ((ch as any).op) return evalConditionTree(ch as any, ctx);
            return evalPredicate(ch, ctx);
        });
    }
    if (op === 'OR') {
        return children.some(ch => {
            if ((ch as any).op) return evalConditionTree(ch as any, ctx);
            return evalPredicate(ch, ctx);
        });
    }
    if (op === 'NOT') {
        if (children.length !== 1) return false;
        const ch = children[0];
        if ((ch as any).op) return !evalConditionTree(ch as any, ctx);
        return !evalPredicate(ch, ctx);
    }
    if (op === 'PREDICATE') {
        // Node explicit predicate container - assume single predicate-like shape in 'conditions'[0]
        if (children.length !== 1) return false;
        const p = children[0];
        return evalPredicate(p, ctx);
    }
    return false;
}

function resolveBranching(aggregate: TemplateAggregate, currentStageId: string, ctx: { score: number; answers: Record<string, string[]> }): { branched: boolean; nextStageId?: string } {
    const rules = aggregate.draft.logic.branching.filter(r => r.fromStageId === currentStageId);
    for (const rule of rules) {
        try {
            if (evalConditionTree(rule.conditionTree, ctx)) {
                return { branched: true, nextStageId: rule.toStageId };
            } else if (rule.fallbackStageId) {
                // fallback só aplicado se condição falha e não há outra regra que satisfaça; porém
                // se existir múltiplas regras, continuamos tentando as próximas antes de usar fallback.
                // Estratégia: guardar fallback para possível uso final.
                // Para simplicidade: se esta regra falha, mas tem fallback e nenhuma outra regra satisfizer, retornaremos fallback.
                // Implementação: continuamos loop e se nada satisfizer, retornamos fallback da primeira regra com fallback.
            }
        } catch {
            // erro em avaliação: ignora regra
        }
    }
    // caso nenhuma regra satisfeita, procurar primeiro fallback
    const fb = rules.find(r => r.fallbackStageId);
    if (fb) return { branched: true, nextStageId: fb.fallbackStageId };
    return { branched: false };
}

export const templateService = {
    createBase(name: string, slug: string): TemplateAggregate {
        const agg = createBaseTemplate(name, slug);
        templateRepo.create(agg);
        return agg;
    },

    updateMeta(id: string, metaPatch: Partial<{ name: string; description: string; tags: string[]; seo: any; tracking: any }>) {
        const agg = templateRepo.get(id);
        if (!agg) throw new Error('Template not found');
        Object.assign(agg.draft.meta, metaPatch);
        agg.draft.updatedAt = new Date().toISOString();
        agg.draft.draftVersion = (agg.draft.draftVersion || 1) + 1;
        templateRepo.save(agg);
        return agg.draft.meta;
    },

    addStage(id: string, stage: { type: string; afterStageId?: string; label?: string }) {
        const agg = templateRepo.get(id);
        if (!agg) throw new Error('Template not found');
        const newId = genId('stage');
        const stages = agg.draft.stages;
        let insertOrder = stages.length;
        if (stage.afterStageId) {
            const ref = stages.find(s => s.id === stage.afterStageId);
            if (ref) insertOrder = ref.order + 1;
        }
        stages.forEach(s => { if (s.order >= insertOrder) s.order += 1; });
        stages.push({ id: newId, type: stage.type as any, order: insertOrder, enabled: true, componentIds: [], meta: { description: stage.label } });
        stages.sort((a, b) => a.order - b.order).forEach((s, idx) => s.order = idx);
        agg.draft.updatedAt = new Date().toISOString();
        agg.draft.draftVersion = (agg.draft.draftVersion || 1) + 1;
        templateRepo.save(agg);
        return stages.find(s => s.id === newId)!;
    },

    updateStage(id: string, stageId: string, patch: Partial<{ type: string; enabled: boolean; meta: any }>) {
        const agg = templateRepo.get(id);
        if (!agg) throw new Error('Template not found');
        const st = agg.draft.stages.find(s => s.id === stageId);
        if (!st) throw new Error('Stage not found');
        Object.assign(st, patch);
        agg.draft.updatedAt = new Date().toISOString();
        agg.draft.draftVersion = (agg.draft.draftVersion || 1) + 1;
        templateRepo.save(agg);
        return st;
    },

    reorderStages(id: string, orderedIds: string[]) {
        const agg = templateRepo.get(id);
        if (!agg) throw new Error('Template not found');
        const map = new Set(orderedIds);
        if (map.size !== orderedIds.length) throw new Error('Duplicate IDs in reorder');
        if (agg.draft.stages.some(s => !map.has(s.id))) throw new Error('Missing stage ids');
        orderedIds.forEach((sid, idx) => { const st = agg.draft.stages.find(s => s.id === sid)!; st.order = idx; });
        agg.draft.stages.sort((a, b) => a.order - b.order);
        agg.draft.updatedAt = new Date().toISOString();
        agg.draft.draftVersion = (agg.draft.draftVersion || 1) + 1;
        templateRepo.save(agg);
        return agg.draft.stages;
    },

    // --- Component operations inside a stage ---
    addComponentToStage(templateId: string, stageId: string, input: { componentId?: string; component?: { type: string; props?: any; styleTokens?: any }; position?: number }) {
        const agg = templateRepo.get(templateId);
        if (!agg) throw new Error('Template not found');
        const stage = agg.draft.stages.find(s => s.id === stageId);
        if (!stage) throw new Error('Stage not found');
        let compId: string;
        if (input.componentId) {
            const existing = agg.draft.components[input.componentId];
            if (!existing) throw new Error('Component not found');
            if (stage.componentIds.includes(input.componentId)) throw new Error('Component already in stage');
            compId = input.componentId;
        } else if (input.component) {
            compId = genId('cmp');
            agg.draft.components[compId] = { id: compId, type: input.component.type, props: input.component.props || {}, styleTokens: input.component.styleTokens || {} };
        } else {
            throw new Error('componentId or component required');
        }
        const position = input.position !== undefined ? input.position : stage.componentIds.length;
        if (position < 0 || position > stage.componentIds.length) throw new Error('Invalid position');
        stage.componentIds.splice(position, 0, compId);
        agg.draft.updatedAt = new Date().toISOString();
        agg.draft.draftVersion = (agg.draft.draftVersion || 1) + 1;
        templateRepo.save(agg);
        return { stageId: stage.id, componentIds: stage.componentIds.slice(), component: agg.draft.components[compId] };
    },

    reorderStageComponents(templateId: string, stageId: string, orderedIds: string[]) {
        const agg = templateRepo.get(templateId);
        if (!agg) throw new Error('Template not found');
        const stage = agg.draft.stages.find(s => s.id === stageId);
        if (!stage) throw new Error('Stage not found');
        if (orderedIds.length !== stage.componentIds.length) throw new Error('Size mismatch');
        const set = new Set(orderedIds);
        if (set.size !== orderedIds.length) throw new Error('Duplicate component ids');
        for (const id of orderedIds) {
            if (!stage.componentIds.includes(id)) throw new Error('Unknown component id in reorder');
        }
        stage.componentIds = orderedIds.slice();
        agg.draft.updatedAt = new Date().toISOString();
        agg.draft.draftVersion = (agg.draft.draftVersion || 1) + 1;
        templateRepo.save(agg);
        return { stageId: stage.id, componentIds: stage.componentIds.slice() };
    },

    removeComponentFromStage(templateId: string, stageId: string, componentId: string) {
        const agg = templateRepo.get(templateId);
        if (!agg) throw new Error('Template not found');
        const stage = agg.draft.stages.find(s => s.id === stageId);
        if (!stage) throw new Error('Stage not found');
        const idx = stage.componentIds.indexOf(componentId);
        if (idx === -1) throw new Error('Component not in stage');
        stage.componentIds.splice(idx, 1);
        // remove component object if no other stage references
        const stillUsed = agg.draft.stages.some(s => s.componentIds.includes(componentId));
        if (!stillUsed) delete agg.draft.components[componentId];
        agg.draft.updatedAt = new Date().toISOString();
        agg.draft.draftVersion = (agg.draft.draftVersion || 1) + 1;
        templateRepo.save(agg);
        return { stageId: stage.id, componentIds: stage.componentIds.slice(), removed: componentId, deleted: !stillUsed };
    },

    removeStage(id: string, stageId: string) {
        const agg = templateRepo.get(id);
        if (!agg) throw new Error('Template not found');
        if (['stage_result'].includes(stageId)) throw new Error('Cannot remove base stage');
        const idx = agg.draft.stages.findIndex(s => s.id === stageId);
        if (idx === -1) throw new Error('Stage not found');
        agg.draft.stages.splice(idx, 1);
        agg.draft.stages.sort((a, b) => a.order - b.order).forEach((s, i) => s.order = i);
        agg.draft.updatedAt = new Date().toISOString();
        agg.draft.draftVersion = (agg.draft.draftVersion || 1) + 1;
        templateRepo.save(agg);
        return true;
    },

    setOutcomes(id: string, outcomes: { id?: string; minScore?: number; maxScore?: number; template: string }[]) {
        const agg = templateRepo.get(id);
        if (!agg) throw new Error('Template not found');
        agg.draft.outcomes = outcomes.map(o => ({ id: o.id || genId('out'), minScore: o.minScore, maxScore: o.maxScore, template: o.template }));
        agg.draft.updatedAt = new Date().toISOString();
        agg.draft.draftVersion = (agg.draft.draftVersion || 1) + 1;
        templateRepo.save(agg);
        return agg.draft.outcomes;
    },

    setScoring(id: string, scoring: Partial<{ mode: 'sum' | 'average'; weights: Record<string, number> }>) {
        const agg = templateRepo.get(id);
        if (!agg) throw new Error('Template not found');
        Object.assign(agg.draft.logic.scoring, scoring);
        agg.draft.updatedAt = new Date().toISOString();
        agg.draft.draftVersion = (agg.draft.draftVersion || 1) + 1;
        templateRepo.save(agg);
        return agg.draft.logic.scoring;
    },

    setBranching(id: string, rules: BranchingRule[]) {
        const agg = templateRepo.get(id);
        if (!agg) throw new Error('Template not found');
        agg.draft.logic.branching = deepClone(rules);
        agg.draft.updatedAt = new Date().toISOString();
        agg.draft.draftVersion = (agg.draft.draftVersion || 1) + 1;
        templateRepo.save(agg);
        return agg.draft.logic.branching;
    },

    validateDraft(id: string) {
        const agg = templateRepo.get(id);
        if (!agg) throw new Error('Template not found');
        return validateTemplate(agg);
    },

    startRuntimeDraft(id: string) {
        const agg = templateRepo.get(id);
        if (!agg) throw new Error('Template not found');
        const first = agg.draft.stages.filter(s => s.enabled).sort((a, b) => a.order - b.order)[0];
        if (!first) throw new Error('No enabled stages');
        const session: RuntimeSession = {
            sessionId: genId('sess'),
            templateId: agg.draft.id,
            slug: agg.draft.meta.slug + ':draft',
            currentStageId: first.id,
            answers: {},
            score: 0,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        runtimeSessions.set(session.sessionId, session);
        return { sessionId: session.sessionId, currentStageId: session.currentStageId };
    },

    answerRuntimeDraft(id: string, sessionId: string, stageId: string, optionIds: string[]) {
        const agg = templateRepo.get(id);
        if (!agg) throw new Error('Template not found');
        const session = runtimeSessions.get(sessionId);
        if (!session) throw new Error('Session not found');
        if (session.templateId !== agg.draft.id) throw new Error('Session/template mismatch');
        if (session.currentStageId !== stageId) throw new Error('Stage order mismatch');
        // registra respostas
        session.answers[stageId] = optionIds;
        // score usando draft
        session.score = computeScore(agg, session.answers);
        session.updatedAt = Date.now();
        const ordered = agg.draft.stages.filter(s => s.enabled).sort((a, b) => a.order - b.order);
        const idx = ordered.findIndex(s => s.id === stageId);
        // Branching draft (reutiliza mesma função com aggregate)
        const branch = resolveBranching(agg as any, stageId, { score: session.score, answers: session.answers });
        let nextStageId: string | undefined;
        let branched = false;
        if (branch.branched && branch.nextStageId) { nextStageId = branch.nextStageId; branched = true; }
        else if (idx >= 0 && idx < ordered.length - 1) { nextStageId = ordered[idx + 1].id; }
        if (nextStageId) session.currentStageId = nextStageId; else { session.completed = true; session.outcomeId = resolveOutcome(agg as any, session.score); }
        const outcomeText = interpolateOutcome(agg as any, session.outcomeId, session.score);
        return { branched, nextStageId, completed: session.completed || false, score: session.score, outcomeId: session.outcomeId, outcomeText };
    },

    publish(id: string): TemplatePublishedSnapshot {
        const agg = templateRepo.get(id);
        if (!agg) throw new Error('Template not found');
        const now = new Date().toISOString();
        const report = validateTemplate(agg);
        if (report.errors.length) {
            const msg = report.errors.map(e => `${e.code}`).join(', ');
            throw new Error(`Publish blocked: ${msg}`);
        }
        const snapshot: TemplatePublishedSnapshot = {
            ...deepClone(agg.draft),
            status: 'published',
            publishedAt: now,
            version: (agg.published?.version ?? 0) + 1
        };
        agg.published = snapshot;
        templateRepo.save(agg);
        return snapshot;
    },

    listDrafts() {
        return templateRepo.list().map(a => a.draft);
    },

    getDraft(id: string) { return templateRepo.get(id)?.draft; },
    getPublishedBySlug(slug: string) { return templateRepo.getBySlug(slug)?.published; },

    startRuntime(slug: string) {
        const agg = templateRepo.getBySlug(slug);
        if (!agg?.published) throw new Error('Published template not found');
        const first = agg.published.stages.filter(s => s.enabled).sort((a, b) => a.order - b.order)[0];
        if (!first) throw new Error('No enabled stages');
        const session: RuntimeSession = {
            sessionId: genId('sess'),
            templateId: agg.draft.id,
            slug: agg.published.meta.slug,
            currentStageId: first.id,
            answers: {},
            score: 0,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        runtimeSessions.set(session.sessionId, session);
        return { sessionId: session.sessionId, currentStageId: session.currentStageId };
    },

    answerRuntime(slug: string, sessionId: string, stageId: string, optionIds: string[]) {
        const agg = templateRepo.getBySlug(slug);
        if (!agg?.published) throw new Error('Published template not found');
        const session = runtimeSessions.get(sessionId);
        if (!session) throw new Error('Session not found');
        if (session.currentStageId !== stageId) throw new Error('Stage order mismatch');
        // registra respostas
        session.answers[stageId] = optionIds;
        session.score = computeScore(agg, session.answers);
        session.updatedAt = Date.now();
        const ordered = agg.published.stages.filter(s => s.enabled).sort((a, b) => a.order - b.order);
        const idx = ordered.findIndex(s => s.id === stageId);

        // Primeiro tenta branching
        const branch = resolveBranching(agg, stageId, { score: session.score, answers: session.answers });
        let nextStageId: string | undefined;
        let branched = false;
        if (branch.branched && branch.nextStageId) {
            nextStageId = branch.nextStageId;
            branched = true;
        } else {
            // fallback linear
            if (idx >= 0 && idx < ordered.length - 1) {
                nextStageId = ordered[idx + 1].id;
            }
        }
        if (nextStageId) {
            session.currentStageId = nextStageId;
        } else {
            session.completed = true;
            session.outcomeId = resolveOutcome(agg, session.score);
        }
        const outcomeText = interpolateOutcome(agg, session.outcomeId, session.score);
        return { branched, nextStageId, completed: session.completed || false, score: session.score, outcomeId: session.outcomeId, outcomeText };
    }
};


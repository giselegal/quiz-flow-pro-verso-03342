import { templateRepo } from './repo';
import { createBaseTemplate, deepClone, TemplateAggregate, TemplatePublishedSnapshot, genId, RuntimeSession, BranchingRule, ConditionTreeNode } from './models';

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

    publish(id: string): TemplatePublishedSnapshot {
        const agg = templateRepo.get(id);
        if (!agg) throw new Error('Template not found');
        const now = new Date().toISOString();
        // Validações mínimas
        if (!agg.draft.stages.some(s => s.type === 'result')) {
            throw new Error('Cannot publish without a result stage');
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
        return { branched, nextStageId, completed: session.completed || false, score: session.score, outcomeId: session.outcomeId };
    }
};


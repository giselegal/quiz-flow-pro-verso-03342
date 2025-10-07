import { templateRepo } from './repo';
import { createBaseTemplate, deepClone, TemplateAggregate, TemplatePublishedSnapshot, genId, RuntimeSession } from './models';

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
        // próximo stage linear (ignora branching MVP)
        const ordered = agg.published.stages.filter(s => s.enabled).sort((a, b) => a.order - b.order);
        const idx = ordered.findIndex(s => s.id === stageId);
        let nextStageId: string | undefined;
        if (idx >= 0 && idx < ordered.length - 1) {
            nextStageId = ordered[idx + 1].id;
            session.currentStageId = nextStageId;
        } else {
            // finaliza e resolve outcome
            session.completed = true;
            session.outcomeId = resolveOutcome(agg, session.score);
        }
        return {
            branched: false,
            nextStageId,
            completed: session.completed || false,
            score: session.score,
            outcomeId: session.outcomeId
        };
    }
};


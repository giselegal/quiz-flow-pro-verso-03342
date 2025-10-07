import { templateRepo, addStage, addComponent, updateScoring, addOutcome, publishTemplate, createRuntimeSession, getSession, saveSession, computeScore } from './repo';
import { TemplateDraft, ScoringConfig } from './models';

export class TemplateService {
    createBase(name: string, slug: string): TemplateDraft {
        return templateRepo.createFromBase(name, slug);
    }

    clone(sourceId: string, name: string, slug: string): TemplateDraft {
        return templateRepo.cloneTemplate(sourceId, name, slug);
    }

    get(id: string) {
        const t = templateRepo.get(id);
        if (!t) throw new Error('NOT_FOUND');
        return t;
    }

    addStage(id: string, type: TemplateDraft['stages'][number]['type']) {
        const t = this.get(id);
        addStage(t, type);
        templateRepo.appendHistory(t, { op: 'stage.add', details: { type } });
        templateRepo.save(t);
        return t;
    }

    addComponent(id: string, stageId: string, type: string, props: Record<string, any>) {
        const t = this.get(id);
        addComponent(t, stageId, type, props);
        templateRepo.appendHistory(t, { op: 'component.add', details: { stageId, type } });
        templateRepo.save(t);
        return t;
    }

    updateScoring(id: string, scoring: Partial<ScoringConfig>) {
        const t = this.get(id);
        updateScoring(t, scoring);
        templateRepo.appendHistory(t, { op: 'scoring.update', details: { scoring } });
        templateRepo.save(t);
        return t.logic.scoring;
    }

    setBranching(id: string, rules: any[]) {
        const t = this.get(id);
        // MVP: aceitar estrutura direta; futura validação
        t.logic.branching = Array.isArray(rules) ? rules : [];
        templateRepo.save(t);
        return t.logic.branching;
    }

    addOutcome(id: string, data: { scoreMin: number; scoreMax?: number; template: string }) {
        const t = this.get(id);
        addOutcome(t, { conditions: { scoreRange: { min: data.scoreMin, max: data.scoreMax } }, template: data.template });
        templateRepo.appendHistory(t, { op: 'outcome.add', details: { range: { min: data.scoreMin, max: data.scoreMax } } });
        templateRepo.save(t);
        return t.outcomes;
    }

    publish(id: string) {
        const t = this.get(id);
        // simple validation reuse
        const validation = this.validate(id);
        if (validation.status !== 'ok') {
            return { status: 'blocked', validation };
        }
        publishTemplate(t);
        templateRepo.appendHistory(t, { op: 'publish', details: { publishedAt: new Date().toISOString() } });
        templateRepo.save(t);
        return { status: 'published', publishId: t.publishedSnapshot.publishedAt, snapshot: t.publishedSnapshot };
    }

    getPublishedBySlug(slug: string) {
        const tpl = templateRepo.list().find(t => t.slug === slug && t.publishedSnapshot);
        return tpl || null;
    }

    startRuntime(slug: string) {
        const tpl = this.getPublishedBySlug(slug);
        if (!tpl) throw new Error('NOT_FOUND');
        const sess = createRuntimeSession(tpl);
        return { sessionId: sess.sessionId, currentStageId: sess.currentStageId };
    }

    answerRuntime(slug: string, sessionId: string, stageId: string, answers: string[]) {
        const tpl = this.getPublishedBySlug(slug);
        if (!tpl) throw new Error('NOT_FOUND');
        const sess = getSession(sessionId);
        if (!sess || sess.templateId !== tpl.id) throw new Error('SESSION_NOT_FOUND');
        if (sess.completed) throw new Error('ALREADY_COMPLETED');
        // store answers (replace for stage)
        sess.answers[stageId] = answers;
        sess.score = computeScore(tpl, sess.answers);
        // Branching simples: procurar regra matching fromStageId
        const rules = Array.isArray(tpl.logic.branching) ? tpl.logic.branching : [];
        const rule = rules.find((r: any) => r.fromStageId === stageId);
        let advancedByBranch = false;
        if (rule) {
            const cond = rule.conditionTree || {};
            let pass = true;
            if (cond.scoreGte !== undefined && !(sess.score >= cond.scoreGte)) pass = false;
            if (cond.scoreLte !== undefined && !(sess.score <= cond.scoreLte)) pass = false;
            if (pass) {
                const target = tpl.publishedSnapshot.stages.find((s: any) => s.id === rule.toStageId && s.enabled !== false);
                if (target) {
                    sess.currentStageId = target.id;
                    advancedByBranch = true;
                }
            } else if (rule.fallbackStageId) {
                const fb = tpl.publishedSnapshot.stages.find((s: any) => s.id === rule.fallbackStageId && s.enabled !== false);
                if (fb) {
                    sess.currentStageId = fb.id;
                    advancedByBranch = true;
                }
            }
        }
        if (!advancedByBranch) {
            // linear fallback
            const stages = tpl.publishedSnapshot.stages.filter((s: any) => s.enabled !== false);
            const currentIndex = stages.findIndex((s: any) => s.id === stageId);
            if (currentIndex >= 0 && currentIndex < stages.length - 1) {
                sess.currentStageId = stages[currentIndex + 1].id;
            }
        }
        saveSession(sess);
        return { nextStageId: sess.currentStageId, score: sess.score, branched: advancedByBranch };
    }

    completeRuntime(slug: string, sessionId: string) {
        const tpl = this.getPublishedBySlug(slug);
        if (!tpl) throw new Error('NOT_FOUND');
        const sess = getSession(sessionId);
        if (!sess || sess.templateId !== tpl.id) throw new Error('SESSION_NOT_FOUND');
        sess.completed = true;
        saveSession(sess);
        // pick first matching outcome by score
        const score = sess.score;
        const outcome = tpl.outcomes.find(o => {
            const r = o.conditions.scoreRange; if (!r) return false;
            const minOk = score >= r.min;
            const maxOk = r.max !== undefined ? score <= r.max : true;
            return minOk && maxOk;
        }) || tpl.outcomes[0];
        return { outcome: outcome && { id: outcome.id, template: outcome.template, score } };
    }

    validate(id: string) {
        const t = this.get(id);
        const errors: string[] = [];
        const warnings: string[] = [];

        // must have intro
        if (!t.stages.some(s => s.type === 'intro')) errors.push('MISSING_INTRO_STAGE');
        // question stage needs at least one OptionList component
        for (const s of t.stages.filter(s => s.type === 'question')) {
            const hasOptions = s.componentIds.some(cid => t.components[cid]?.type === 'OptionList');
            if (!hasOptions) warnings.push(`QUESTION_STAGE_NO_OPTIONS:${s.id}`);
        }
        // outcome gap detection (simple)
        const scoreRanges = t.outcomes.map(o => o.conditions.scoreRange).filter(Boolean) as { min: number; max?: number }[];
        const sorted = scoreRanges.sort((a, b) => a.min - b.min);
        for (let i = 0; i < sorted.length - 1; i++) {
            const cur = sorted[i]; const next = sorted[i + 1];
            if (cur.max !== undefined && cur.max < cur.min) errors.push('OUTCOME_INVALID_RANGE');
            if (cur.max !== undefined && next.min > cur.max + 1) warnings.push('OUTCOME_GAP');
            if (cur.max !== undefined && next.min <= cur.max) errors.push('OUTCOME_OVERLAP');
        }

        return { status: errors.length ? 'error' : 'ok', errors, warnings };
    }
}

export const templateService = new TemplateService();

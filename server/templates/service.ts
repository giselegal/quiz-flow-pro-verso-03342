import { templateRepo, addStage, addComponent, updateScoring, addOutcome, publishTemplate, computeScore, runtimeSessionRepo } from './repo';
import { TemplateDraft, ScoringConfig } from './models';
import { logger, withCorrelation } from '../lib/logger';

// ---------------- Condition Tree Evaluator (AND/OR + folhas simples) ----------------
// Estrutura suportada (exemplos):
// { scoreGte: 10 }
// { op: 'AND', conditions: [ { scoreGte: 10 }, { scoreLte: 30 } ] }
// { op: 'OR', conditions: [ { scoreGte: 50 }, { answeredIncludes: { stageId: 'stage_q1', optionId: 'optX' } } ] }
// Folhas disponíveis:
//  - scoreGte / scoreLte
//  - answersCountGte / answersCountLte (total de opções selecionadas em toda a sessão)
//  - answeredIncludes { stageId, optionId }
//  - stageAnswered stageId
//  - optionCountInStageGte / optionCountInStageLte { stageId, gte|lte }
// Observação: campos desconhecidos são ignorados (não invalidam a condição).

type ConditionNode = any; // Tipagem flexível para MVP

function evaluateConditionTree(node: ConditionNode, context: { score: number; answers: Record<string, string[]> }): boolean {
    if (!node || typeof node !== 'object') return true; // nó vazio -> true (permite fallback à lógica existente)

    // Operador composto
    if (node.op && Array.isArray(node.conditions)) {
        const op = String(node.op).toUpperCase();
        if (op === 'AND') {
            return node.conditions.every((c: any) => evaluateConditionTree(c, context));
        }
        if (op === 'OR') {
            return node.conditions.some((c: any) => evaluateConditionTree(c, context));
        }
        // Operador desconhecido -> falha segura
        return false;
    }

    // Folhas
    const { score } = context;
    if (node.scoreGte !== undefined && !(score >= node.scoreGte)) return false;
    if (node.scoreLte !== undefined && !(score <= node.scoreLte)) return false;

    const totalAnswers = Object.values(context.answers).reduce((acc, arr) => acc + arr.length, 0);
    if (node.answersCountGte !== undefined && !(totalAnswers >= node.answersCountGte)) return false;
    if (node.answersCountLte !== undefined && !(totalAnswers <= node.answersCountLte)) return false;

    if (node.answeredIncludes) {
        const { stageId, optionId } = node.answeredIncludes || {};
        if (stageId && optionId) {
            const list = context.answers[stageId] || [];
            if (!list.includes(optionId)) return false;
        }
    }

    if (node.stageAnswered) {
        const stageId = node.stageAnswered;
        if (!context.answers[stageId] || context.answers[stageId].length === 0) return false;
    }

    if (node.optionCountInStageGte) {
        const { stageId, gte } = node.optionCountInStageGte || {};
        if (stageId && typeof gte === 'number') {
            const count = (context.answers[stageId] || []).length;
            if (!(count >= gte)) return false;
        }
    }
    if (node.optionCountInStageLte) {
        const { stageId, lte } = node.optionCountInStageLte || {};
        if (stageId && typeof lte === 'number') {
            const count = (context.answers[stageId] || []).length;
            if (!(count <= lte)) return false;
        }
    }

    return true;
}

export class TemplateService {
    private repo: any;
    private sessionRepo: any;
    constructor(repo = templateRepo, sessionRepo = runtimeSessionRepo) {
        this.repo = repo;
        this.sessionRepo = sessionRepo;
    }
    createBase(name: string, slug: string): TemplateDraft {
        return this.repo.createFromBase(name, slug);
    }

    clone(sourceId: string, name: string, slug: string): TemplateDraft {
        return this.repo.cloneTemplate(sourceId, name, slug);
    }

    get(id: string) {
        const t = this.repo.get(id);
        if (!t) throw new Error('NOT_FOUND');
        return t;
    }

    addStage(id: string, type: TemplateDraft['stages'][number]['type']) {
        const t = this.get(id);
        addStage(t, type);
        this.repo.appendHistory(t, { op: 'stage.add', details: { type } });
        this.repo.save(t);
        return t;
    }

    addComponent(id: string, stageId: string, type: string, props: Record<string, any>) {
        const t = this.get(id);
        addComponent(t, stageId, type, props);
        this.repo.appendHistory(t, { op: 'component.add', details: { stageId, type } });
        this.repo.save(t);
        return t;
    }

    updateScoring(id: string, scoring: Partial<ScoringConfig>) {
        const t = this.get(id);
        updateScoring(t, scoring);
        this.repo.appendHistory(t, { op: 'scoring.update', details: { scoring } });
        this.repo.save(t);
        return t.logic.scoring;
    }

    setBranching(id: string, rules: any[]) {
        const t = this.get(id);
        // MVP: aceitar estrutura direta; futura validação
        t.logic.branching = Array.isArray(rules) ? rules : [];
        this.repo.save(t);
        return t.logic.branching;
    }

    addOutcome(id: string, data: { scoreMin: number; scoreMax?: number; template: string }) {
        const t = this.get(id);
        addOutcome(t, { conditions: { scoreRange: { min: data.scoreMin, max: data.scoreMax } }, template: data.template });
        this.repo.appendHistory(t, { op: 'outcome.add', details: { range: { min: data.scoreMin, max: data.scoreMax } } });
        this.repo.save(t);
        return t.outcomes;
    }

    publish(id: string) {
        const t = this.get(id);
        // simple validation reuse
        const validation = this.validate(id);
        if (validation.status !== 'ok') {
            logger.warn('template.publish.blocked', { templateId: t.id, slug: t.slug, errors: validation.errors, warnings: validation.warnings });
            return { status: 'blocked', validation };
        }
        publishTemplate(t);
        this.repo.appendHistory(t, { op: 'publish', details: { publishedAt: new Date().toISOString() } });
        this.repo.save(t);
        logger.info('template.published', { templateId: t.id, slug: t.slug, publishedAt: t.publishedSnapshot?.publishedAt });
        return { status: 'published', publishId: t.publishedSnapshot.publishedAt, snapshot: t.publishedSnapshot };
    }

    getPublishedBySlug(slug: string) {
        const tpl = this.repo.list().find((t: any) => t.slug === slug && t.publishedSnapshot);
        return tpl || null;
    }

    startRuntime(slug: string) {
        const tpl = this.getPublishedBySlug(slug);
        if (!tpl) throw new Error('NOT_FOUND');
        const sess = this.sessionRepo.create(tpl);
        logger.info('runtime.session.start', withCorrelation({ slug, templateId: tpl.id, sessionId: sess.sessionId, currentStageId: sess.currentStageId }, sess.sessionId));
        return { sessionId: sess.sessionId, currentStageId: sess.currentStageId };
    }

    answerRuntime(slug: string, sessionId: string, stageId: string, answers: string[]) {
        const tpl = this.getPublishedBySlug(slug);
        if (!tpl) throw new Error('NOT_FOUND');
        const sess = this.sessionRepo.get(sessionId);
        if (!sess || sess.templateId !== tpl.id) throw new Error('SESSION_NOT_FOUND');
        if (sess.completed) throw new Error('ALREADY_COMPLETED');
        // store answers (replace for stage)
        sess.answers[stageId] = answers;
        sess.score = computeScore(tpl, sess.answers);
        // Branching multi-regra: iterar todas as regras cujo fromStageId coincide e aplicar primeira que resulte em avanço
        const rules = Array.isArray(tpl.logic.branching) ? tpl.logic.branching.filter((r: any) => r.fromStageId === stageId) : [];
        let advancedByBranch = false;
        let appliedRule: any = null;
        for (const rule of rules) {
            const cond = rule.conditionTree || {};
            let pass = evaluateConditionTree(cond, { score: sess.score, answers: sess.answers });
            // (debug removido)
            if (pass) {
                const target = tpl.publishedSnapshot.stages.find((s: any) => s.id === rule.toStageId && s.enabled !== false);
                if (target) {
                    sess.currentStageId = target.id;
                    advancedByBranch = true;
                    appliedRule = { type: 'direct', toStageId: target.id, rule };
                    break; // primeira regra vencedora
                }
            } else if (rule.fallbackStageId) {
                const fb = tpl.publishedSnapshot.stages.find((s: any) => s.id === rule.fallbackStageId && s.enabled !== false);
                if (fb) {
                    sess.currentStageId = fb.id;
                    advancedByBranch = true;
                    appliedRule = { type: 'fallback', toStageId: fb.id, rule };
                    break;
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
        this.sessionRepo.save(sess);
        logger.info('runtime.advance', withCorrelation({
            mode: advancedByBranch ? 'branch' : 'linear',
            slug,
            sessionId,
            fromStageId: stageId,
            nextStageId: sess.currentStageId,
            score: sess.score,
            ruleApplied: appliedRule
        }, sessionId));
        return { nextStageId: sess.currentStageId, score: sess.score, branched: advancedByBranch };
    }

    completeRuntime(slug: string, sessionId: string) {
        const tpl = this.getPublishedBySlug(slug);
        if (!tpl) throw new Error('NOT_FOUND');
        const sess = this.sessionRepo.get(sessionId);
        if (!sess || sess.templateId !== tpl.id) throw new Error('SESSION_NOT_FOUND');
        if (sess.completed) throw new Error('ALREADY_COMPLETED');
        sess.completed = true;
        this.sessionRepo.save(sess);
        // pick first matching outcome by score
        const score = sess.score;
        const outcome = tpl.outcomes.find((o: any) => {
            const r = o.conditions.scoreRange; if (!r) return false;
            const minOk = score >= r.min;
            const maxOk = r.max !== undefined ? score <= r.max : true;
            return minOk && maxOk;
        }) || tpl.outcomes[0];
        logger.info('runtime.session.complete', withCorrelation({ slug, sessionId, score, outcomeId: outcome?.id }, sessionId));
        return { outcome: outcome && { id: outcome.id, template: outcome.template, score } };
    }

    validate(id: string) {
        const t = this.get(id);
        const errors: string[] = [];
        const warnings: string[] = [];

        // must have intro
        if (!t.stages.some((s: any) => s.type === 'intro')) errors.push('MISSING_INTRO_STAGE');
        // question stage needs at least one OptionList component
        for (const s of t.stages.filter((s: any) => s.type === 'question')) {
            const hasOptions = s.componentIds.some((cid: string) => t.components[cid]?.type === 'OptionList');
            if (!hasOptions) warnings.push(`QUESTION_STAGE_NO_OPTIONS:${s.id}`);
        }
        // outcome gap detection (simple)
        const scoreRanges = t.outcomes.map((o: any) => o.conditions.scoreRange).filter(Boolean) as { min: number; max?: number }[];
        const sorted = scoreRanges.sort((a, b) => a.min - b.min);
        for (let i = 0; i < sorted.length - 1; i++) {
            const cur = sorted[i]; const next = sorted[i + 1];
            if (cur.max !== undefined && cur.max < cur.min) errors.push('OUTCOME_INVALID_RANGE');
            if (cur.max !== undefined && next.min > cur.max + 1) warnings.push('OUTCOME_GAP');
            if (cur.max !== undefined && next.min <= cur.max) errors.push('OUTCOME_OVERLAP');
        }

        // ---------------- Branching graph analysis ----------------
        const rules = Array.isArray(t.logic.branching) ? t.logic.branching : [];
        // Build adjacency including fallbacks (directed edges)
        const adjacency: Record<string, Set<string>> = {};
        function addEdge(from: string, to?: string) {
            if (!to) return; if (!adjacency[from]) adjacency[from] = new Set(); adjacency[from].add(to);
        }
        for (const r of rules) {
            if (r.fromStageId) addEdge(r.fromStageId, r.toStageId);
            if (r.fromStageId && r.fallbackStageId) addEdge(r.fromStageId, r.fallbackStageId);
        }

        // Detect cycles via DFS
        const visiting = new Set<string>();
        const visited = new Set<string>();
        let cycleDetected = false;
        function dfs(node: string) {
            if (cycleDetected) return;
            visiting.add(node);
            const nexts = Array.from(adjacency[node] || []);
            for (const n of nexts) {
                if (visiting.has(n)) { cycleDetected = true; errors.push('CYCLE_DETECTED'); return; }
                if (!visited.has(n)) dfs(n);
            }
            visiting.delete(node);
            visited.add(node);
        }
        // Start DFS from every fromStageId to catch disconnected cycles in branching
        for (const from of Object.keys(adjacency)) {
            if (!visited.has(from)) dfs(from);
            if (cycleDetected) break;
        }

        // Reachability (linear + branching edges). Start from first enabled stage by order.
        const enabledStages = t.stages.filter((s: any) => s.enabled !== false);
        if (enabledStages.length) {
            const startStage = enabledStages[0];
            const reach = new Set<string>();
            function traverse(stageId: string) {
                if (reach.has(stageId)) return;
                reach.add(stageId);
                // linear next
                const current = enabledStages.find((s: any) => s.id === stageId);
                if (current) {
                    // Se há regras de branching que partem deste stage, assumimos que linear pode ser desviado
                    const hasBranch = adjacency[current.id] && adjacency[current.id].size > 0;
                    if (!hasBranch) {
                        const linearNext = enabledStages.find((s: any) => s.order === current.order + 1);
                        if (linearNext) traverse(linearNext.id);
                    }
                }
                // branching edges
                for (const to of Array.from(adjacency[stageId] || [])) traverse(to);
            }
            traverse(startStage.id);
            for (const s of enabledStages) {
                if (!reach.has(s.id)) warnings.push(`UNREACHABLE_STAGE:${s.id}`);
            }
        }

        return { status: errors.length ? 'error' : 'ok', errors, warnings };
    }
}

export const templateService = new TemplateService();

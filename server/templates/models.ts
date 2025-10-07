// Modelos base do Template Engine (MVP)
// Mantido enxuto para permitir evolução incremental.

export type UUID = string;

export interface TemplateMetaSEO {
    title?: string;
    description?: string;
    ogImage?: string;
    canonical?: string;
}

export interface TrackingPixelConfig {
    provider: 'meta' | 'ga4' | 'webhook' | 'custom';
    id: string;
    events?: string[]; // ex: ['start','answer','complete']
}

export interface TemplateTrackingMeta {
    pixels?: TrackingPixelConfig[];
}

export interface TemplateMeta {
    name: string;
    slug: string; // único entre templates publicados
    seo?: TemplateMetaSEO;
    tracking?: TemplateTrackingMeta;
    description?: string;
    tags?: string[];
}

export type StageType = 'intro' | 'question' | 'result' | 'transition' | 'custom';

export interface Stage {
    id: string;
    type: StageType;
    order: number;
    enabled: boolean;
    componentIds: string[];
    meta?: { stageSlug?: string; description?: string };
}

export interface ComponentBase {
    id: string;
    type: string; // registry key
    props: Record<string, any>;
    styleTokens?: Record<string, string | number>;
    validation?: Record<string, any>;
    visibilityRules?: any; // simplificado MVP
}

export interface ScoringConfig {
    mode: 'sum' | 'average'; // MVP (formula depois)
    weights: Record<string, number>; // key: stageId:optionId
    normalization?: { percent?: boolean };
}

// Predicados suportados no MVP avançado
export interface PredicateScoreGte { scoreGte: number; }
export interface PredicateScoreLte { scoreLte: number; }
export interface PredicateAnswersCountGte { answersCountGte: number; }
export interface PredicateAnsweredIncludes { answeredIncludes: { stageId: string; optionId: string } }
export type ConditionPredicate = PredicateScoreGte | PredicateScoreLte | PredicateAnswersCountGte | PredicateAnsweredIncludes;

export interface ConditionTreeNode {
    op: 'AND' | 'OR' | 'NOT' | 'PREDICATE';
    conditions?: ConditionTreeNode[]; // filhos para AND/OR/NOT
    // Para simplificar: quando op !== 'PREDICATE', usamos 'conditions'
    // Para compatibilidade com testes existentes: eles usam estrutura { op: 'AND', conditions: [ { scoreGte: 10 }, {...} ] }
    // Logo também permitimos predicados diretos como objetos plain (ConditionPredicate) em 'conditions'.
    // Para op = 'PREDICATE' não será usado neste estágio - mantemos para evolução.
    // Nota: Para testes atuais, não exigiremos chave 'op' nos objetos folha (predicados simples).
}

export interface BranchingRule {
    fromStageId: string;
    toStageId: string;
    fallbackStageId?: string;
    conditionTree: ConditionTreeNode; // árvore de condições
}

export interface LogicBlock {
    scoring: ScoringConfig;
    branching: BranchingRule[];
}

export interface Outcome {
    id: string;
    minScore?: number;
    maxScore?: number;
    template: string; // texto com variáveis
}

export interface HistoryEntry {
    id: string;
    timestamp: string;
    op: string;
    summary?: string;
}

export interface TemplateDraft {
    id: string;
    schemaVersion: string;
    meta: TemplateMeta;
    stages: Stage[];
    components: Record<string, ComponentBase>;
    logic: LogicBlock;
    outcomes: Outcome[];
    status: 'draft';
    history: HistoryEntry[];
    createdAt: string;
    updatedAt: string;
    draftVersion?: number; // incrementa a cada mutação persistida (controle de concorrência futuro)
}

export interface TemplatePublishedSnapshot extends Omit<TemplateDraft, 'status'> {
    status: 'published';
    publishedAt: string;
    version: number; // incremental
}

export interface TemplateAggregate {
    draft: TemplateDraft;
    published?: TemplatePublishedSnapshot;
}

export interface RuntimeSession {
    sessionId: string;
    templateId: string;
    slug: string; // slug publicado
    currentStageId: string;
    answers: Record<string, string[]>; // stageId -> optionIds[]
    score: number;
    createdAt: number;
    updatedAt: number;
    completed?: boolean;
    outcomeId?: string;
}

// Util simples para gerar IDs (não criptograficamente seguros)
export function genId(prefix: string = 'id'): string {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function timestamp(): string { return new Date().toISOString(); }

export function createBaseTemplate(name: string, slug: string): TemplateAggregate {
    const createdAt = timestamp();
    const draft: TemplateDraft = {
        id: genId('tpl'),
        schemaVersion: '1.0.0',
        meta: { name, slug, seo: {}, tracking: {}, description: '', tags: [] },
        stages: [
            { id: 'stage_intro', type: 'intro', order: 0, enabled: true, componentIds: [] },
            { id: 'stage_q1', type: 'question', order: 1, enabled: true, componentIds: [] },
            { id: 'stage_result', type: 'result', order: 2, enabled: true, componentIds: [] }
        ],
        components: {},
        logic: { scoring: { mode: 'sum', weights: {}, normalization: { percent: true } }, branching: [] },
        outcomes: [
            { id: 'out_low', minScore: 0, maxScore: 50, template: 'Resultado baixo: {{score}}' },
            { id: 'out_high', minScore: 51, maxScore: 9999, template: 'Resultado alto: {{score}}' }
        ],
        status: 'draft',
        history: [],
        createdAt,
        updatedAt: createdAt,
        draftVersion: 1
    };
    return { draft };
}

export function deepClone<T>(obj: T): T { return JSON.parse(JSON.stringify(obj)); }

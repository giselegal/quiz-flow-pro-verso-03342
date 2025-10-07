// Domain models (MVP subset) for Template Engine
// NOTE: Simplified first pass; will evolve with full schema alignment.

export type Status = 'draft' | 'published' | 'archived';
export type StageType = 'intro' | 'question' | 'result' | 'transition' | 'custom';

export interface Component {
    id: string;
    type: string;
    props: Record<string, any>;
    styleTokens?: Record<string, any>;
}

export interface Stage {
    id: string;
    type: StageType;
    order: number;
    enabled: boolean;
    componentIds: string[];
}

export interface ScoringConfig {
    mode: 'sum' | 'average'; // custom later
    weights: Record<string, number>; // key: stageId:optionId
    normalization?: {
        type: 'percent' | 'none';
        maxScore?: number;
    };
}

export interface BranchRule {
    fromStageId: string;
    toStageId: string;
    conditionTree?: any; // placeholder
    fallbackStageId?: string;
}

export interface Outcome {
    id: string;
    conditions: {
        scoreRange?: { min: number; max?: number };
    };
    template: string;
}

export interface TemplateDraft {
    id: string;
    name: string;
    slug: string;
    status: Status;
    schemaVersion: string;
    stages: Stage[];
    components: Record<string, Component>;
    logic: {
        scoring: ScoringConfig;
        branching: BranchRule[];
    };
    outcomes: Outcome[];
    history: any[]; // refine later
    createdAt: string;
    updatedAt: string;
    publishedSnapshot?: any;
}

export function createBaseTemplate(id: string, slug: string): TemplateDraft {
    const now = new Date().toISOString();
    return {
        id,
        name: 'Base Template',
        slug,
        status: 'draft',
        schemaVersion: '1.1.0',
        stages: [
            { id: 'stage_intro', type: 'intro', order: 0, enabled: true, componentIds: ['cmp_intro_title'] },
            { id: 'stage_q1', type: 'question', order: 1, enabled: true, componentIds: [] },
            { id: 'stage_result', type: 'result', order: 2, enabled: true, componentIds: [] }
        ],
        components: {
            cmp_intro_title: { id: 'cmp_intro_title', type: 'Heading', props: { text: 'Bem-vindo!' } }
        },
        logic: {
            scoring: { mode: 'sum', weights: {}, normalization: { type: 'none' } },
            branching: []
        },
        outcomes: [
            { id: 'out_default', conditions: { scoreRange: { min: 0 } }, template: 'Resultado padrão: {{score}}' }
        ],
        history: [],
        createdAt: now,
        updatedAt: now
    };
}

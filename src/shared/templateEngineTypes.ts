// Tipos compartilhados entre frontend e (parcial) backend para evitar import cruzado direto de server/
// Mantém apenas campos necessários no cliente. Quando backend evoluir, este arquivo deve ser sincronizado.

export type StageType = 'intro' | 'question' | 'result' | 'transition' | 'custom';

export interface StageShared {
    id: string;
    type: StageType;
    order: number;
    enabled: boolean;
    componentIds: string[];
}

export interface ComponentSharedBase {
    id: string;
    // Para compatibilidade transitória: componentes antigos usam 'type'; novos usam 'kind'
    type?: string;
    kind?: string;
    props: Record<string, any>;
    styleTokens?: Record<string, string | number>;
}

export interface TemplateMetaShared {
    name: string;
    slug: string;
    description?: string;
    tags?: string[];
}

export interface OutcomeShared { id: string; minScore?: number; maxScore?: number; template: string; }

export interface LogicShared { scoring: { mode: 'sum' | 'average'; weights: Record<string, number>; }; branching: any[]; }

export interface TemplateDraftShared {
    id: string;
    schemaVersion: string;
    meta: TemplateMetaShared;
    stages: StageShared[];
    components: Record<string, ComponentSharedBase>;
    logic: LogicShared;
    outcomes: OutcomeShared[];
    status: 'draft';
    createdAt: string;
    updatedAt: string;
    draftVersion?: number;
    // Campo opcional quando servidor inclui publicação em payload (se houver)
    published?: any;
}

export interface ValidationIssueShared { code: string; message: string; severity?: 'error' | 'warning'; field?: string; }
export interface ValidationReportShared { errors: ValidationIssueShared[]; warnings: ValidationIssueShared[]; }

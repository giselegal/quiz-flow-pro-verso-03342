// Tipos compartilhados para Template Engine frontend

export interface TemplateListItem {
  id: string;
  slug: string;
  name: string;
  updatedAt: string;
  draftVersion?: number;
}

export interface Stage {
  id: string;
  type: string;
  order: number;
  enabled: boolean;
  componentIds: string[];
  meta?: { stageSlug?: string; description?: string };
}

export interface Outcome {
  id: string;
  minScore?: number;
  maxScore?: number;
  template: string;
}

export interface ScoringConfig {
  mode: 'sum' | 'average';
  weights: Record<string, number>;
  normalization?: { percent?: boolean };
}

export interface BranchingRule {
  fromStageId: string;
  toStageId: string;
  fallbackStageId?: string;
  conditionTree: any;
}

export interface TemplateDraft {
  id: string;
  schemaVersion: string;
  meta: {
    name: string;
    slug: string;
    description?: string;
    tags?: string[];
    seo?: any;
    tracking?: any;
  };
  stages: Stage[];
  components: Record<string, any>;
  logic: { scoring: ScoringConfig; branching: BranchingRule[] };
  outcomes: Outcome[];
  status: 'draft';
  history: any[];
  createdAt: string;
  updatedAt: string;
  draftVersion?: number;
}

export interface ValidationIssue {
  code: string;
  message: string;
}

export interface ValidationReport {
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

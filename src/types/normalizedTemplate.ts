/**
 * Canonical schema para template normalizado (v3.0 blocks unified)
 * Este arquivo define a estrutura alvo para migrar todos os steps.
 */

export type CanonicalTemplateVersion = '3.0';

export interface BaseBlockConfig {
    id?: string;            // ID opcional interno do bloco
    variant?: string;       // Variante estilística
    className?: string;     // Classes utilitárias adicionais
}

export interface HeroBlockConfig extends BaseBlockConfig {
    titleHtml: string;
    subtitleHtml?: string;
    imageUrl?: string;
    imageAlt?: string;
    logoUrl?: string;
    logoAlt?: string;
}

export interface WelcomeFormBlockConfig extends BaseBlockConfig {
    questionLabel: string;
    placeholder?: string;
    buttonText: string;
    required?: boolean;
}

export interface QuestionBlockOption {
    id: string;
    text: string;
    image?: string;
}

export interface QuestionBlockConfig extends BaseBlockConfig {
    questionNumber?: string;
    questionText: string;
    requiredSelections: number; // Sempre explicitado após normalização
    options: QuestionBlockOption[];
}

export interface StrategicQuestionBlockConfig extends BaseBlockConfig {
    questionText: string;
    options: QuestionBlockOption[];
}

export interface TransitionBlockConfig extends BaseBlockConfig {
    title: string;
    text?: string;
    mode: 'analysis' | 'result' | 'generic';
    autoAdvanceMs?: number;
}

export interface ResultBlockConfig extends BaseBlockConfig {
    // Placeholder inicial – pode ser expandido com seções específicas
    sections?: string[]; // identificadores de sub-seções convertidas
}

export type BlockType =
    | 'hero-block'
    | 'welcome-form-block'
    | 'question-block'
    | 'strategic-question-block'
    | 'transition-block'
    | 'result-block';

export interface BlockDefinition<T = any> {
    type: BlockType;
    config: T;
}

export interface UnifiedStepMeta {
    order?: number;              // Índice (1..21)
    originalType?: string;       // Tipo original legacy para auditoria
    tags?: string[];
}

export interface UnifiedStep {
    id: string;                  // step-01
    type: 'intro' | 'question' | 'strategic-question' | 'transition' | 'transition-result' | 'result' | 'offer';
    templateVersion: CanonicalTemplateVersion;
    blocks: BlockDefinition[];   // Pelo menos 1 bloco após normalização
    meta?: UnifiedStepMeta;
}

export interface NormalizedTemplateMaster {
    templateId: string;
    version: CanonicalTemplateVersion;
    generatedAt: string;
    steps: Record<string, UnifiedStep>;
}

export function assertUnifiedStep(step: UnifiedStep): void {
    if (!step.id.startsWith('step-')) throw new Error('Step id inválido: ' + step.id);
    if (!Array.isArray(step.blocks) || !step.blocks.length) throw new Error('Step sem blocks: ' + step.id);
    if (step.templateVersion !== '3.0') throw new Error('Versão incorreta no step ' + step.id);
}

import definition from '@/domain/quiz/quiz-definition';

// Tipagens locais (reutilizamos apenas o necessário para montar componentes do funnel)
export interface CanonicalStepAny {
    id: string;
    type: string;
    title?: string;
    questionText?: string;
    formQuestion?: string;
    placeholder?: string;
    buttonText?: string;
    text?: string;
    image?: string;
    requiredSelections?: number;
    options?: Array<{ id: string; text: string; image?: string }>;
    next?: string;
    variants?: any[]; // offer variants
    matchQuestionId?: string; // offer mapping
}

export interface FunnelComponent {
    id: string;
    type: 'intro' | 'question' | 'strategic-question' | 'transition' | 'transition-result' | 'result' | 'offer';
    name: string;
    description: string;
    step: number; // posição (1-based) na sequência
    isEditable: boolean;
    properties: Record<string, any>;
    styles: Record<string, any>;
    content: Record<string, any>;
}

/**
 * Deriva um array de FunnelComponents a partir da definição canônica.
 * Mantém IDs e ordem exata, garantindo consistência entre editor e runtime.
 */
export function canonicalToFunnelComponents(def = definition): FunnelComponent[] {
    const steps = (def.steps as CanonicalStepAny[]) || [];
    return steps.map((s, index) => {
        const baseName = s.title || s.questionText || `Step ${index + 1}`;
        const name = truncate(stripHtml(baseName), 60);
        return {
            id: s.id,
            type: s.type as FunnelComponent['type'],
            name,
            description: name,
            step: index + 1,
            isEditable: true,
            properties: buildProperties(s),
            styles: {},
            content: buildContent(s)
        };
    });
}

function buildProperties(s: CanonicalStepAny) {
    const props: Record<string, any> = {};
    if (s.requiredSelections) props.requiredSelections = s.requiredSelections;
    if (s.matchQuestionId) props.matchQuestionId = s.matchQuestionId;
    if (s.next) props.next = s.next;
    // Guardar resto bruto para futura evolução sem perder dados
    props.__raw = {
        formQuestion: s.formQuestion,
        placeholder: s.placeholder,
        buttonText: s.buttonText,
        image: s.image,
        text: s.text
    };
    return props;
}

function buildContent(s: CanonicalStepAny) {
    const c: Record<string, any> = {};
    if (s.title) c.title = s.title;
    if (s.questionText) c.questionText = s.questionText;
    if (s.options) c.options = s.options.map(o => ({ id: o.id, text: o.text, image: o.image }));
    if (s.variants) c.variants = s.variants;
    if (s.buttonText) c.buttonText = s.buttonText;
    if (s.image) c.image = s.image;
    if (s.text) c.text = s.text;
    return c;
}

function stripHtml(html?: string) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function truncate(str: string, max: number) {
    return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

/** Conveniência: total de steps canônicos. */
export function getCanonicalTotalSteps() {
    return definition.steps.length;
}

/** Retorna ids de steps contados no progresso */
export function getProgressStepIds() {
    return (definition as any).progress?.countedStepIds || [];
}

/** Export default para possíveis usos rápidos */
export default {
    canonicalToFunnelComponents,
    getCanonicalTotalSteps,
    getProgressStepIds
};

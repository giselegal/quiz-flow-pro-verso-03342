import { getQuizDefinition } from './runtime';

// Tipos genéricos de Block (mantemos 'any' onde o tipo exato ainda não está centralizado)
export interface Block {
    id: string;
    type: string;
    order: number;
    content: any;
    properties?: any;
}

interface BuildContext {
    stepId: string;
    index: number;
    total: number;
    canonicalStep: any; // TODO: tipar com interface do contracts.ts
    previousStepId?: string;
    nextStepId?: string;
}

// ---------------- Section Registry (modular extensibility) ----------------
export type SectionPhase = 'result' | 'offer';
export type SectionBuilder = (ctx: { step: any; phase: SectionPhase }) => Block[];
const sectionRegistry: Record<string, SectionBuilder> = {};

export function registerSection(key: string, builder: SectionBuilder) {
    sectionRegistry[key] = builder;
}

function buildSections(step: any, phase: SectionPhase): Block[] {
    return Object.entries(sectionRegistry)
        .filter(([_, b]) => !!b)
        .flatMap(([_, b]) => b({ step, phase }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

// ----------- Default registered sections (can be toggled via simple conditions later) -----------
registerSection('result-style-summary', ({ step, phase }) => {
    if (phase !== 'result') return [];
    return [{
        id: `${step.id}-style-summary`,
        type: 'result-style-summary',
        order: 10,
        content: { description: 'Resumo de estilos secundários (placeholder)' },
        properties: { layout: 'tags' }
    }];
});

registerSection('result-testimonials', ({ step, phase }) => {
    if (phase !== 'result') return [];
    return [{
        id: `${step.id}-testimonials`,
        type: 'result-testimonials',
        order: 20,
        content: { items: [] },
        properties: { carousel: true }
    }];
});

registerSection('result-guarantee', ({ step, phase }) => {
    if (phase !== 'result') return [];
    return [{
        id: `${step.id}-guarantee`,
        type: 'result-guarantee',
        order: 30,
        content: { text: 'Garantia de satisfação (placeholder)' }
    }];
});

registerSection('offer-benefits', ({ step, phase }) => {
    if (phase !== 'offer') return [];
    return [{
        id: `${step.id}-benefits`,
        type: 'offer-benefits',
        order: 10,
        content: { items: [] }
    }];
});

registerSection('offer-testimonials', ({ step, phase }) => {
    if (phase !== 'offer') return [];
    const variantTestimonials = (step.variants || [])
        .map((v: any) => v?.testimonial)
        .filter(Boolean);
    return [{
        id: `${step.id}-testimonials`,
        type: 'offer-testimonials',
        order: 20,
        content: { items: variantTestimonials }
    }];
});

registerSection('offer-guarantee', ({ step, phase }) => {
    if (phase !== 'offer') return [];
    return [{
        id: `${step.id}-guarantee`,
        type: 'offer-guarantee',
        order: 30,
        content: { text: 'Garantia de satisfação (placeholder)' }
    }];
});

registerSection('offer-cta-secondary', ({ step, phase }) => {
    if (phase !== 'offer') return [];
    return [{
        id: `${step.id}-cta-secondary`,
        type: 'offer-cta-secondary',
        order: 40,
        content: { text: 'Quero rever os benefícios' }
    }];
});

// ---------------- Heurísticas e Overrides ----------------
export interface QuestionBlockOverride {
    stepId: string;
    layout?: 'grid' | 'list';
    columns?: number;
    optionStyle?: 'image-card' | 'text-card';
    extraBlocksBefore?: Block[];
    extraBlocksAfter?: Block[];
}

const questionOverrides: Record<string, QuestionBlockOverride> = {};

export function registerQuestionOverride(override: QuestionBlockOverride) {
    questionOverrides[override.stepId] = {
        ...(questionOverrides[override.stepId] || {}),
        ...override
    };
}

function deriveQuestionPresentation(step: any) {
    const options = step.options || [];
    const withImage = options.filter((o: any) => !!o.image);
    const imageRatio = options.length ? withImage.length / options.length : 0;
    let layout: 'grid' | 'list' = imageRatio >= 0.25 ? 'grid' : 'list';
    // Ajuste: se poucas opções (<=3) vira lista para evitar cards dispersos
    if (options.length <= 3) layout = 'list';

    let baseCols = 4;
    if (options.length <= 3) baseCols = 3;
    if (options.length === 2) baseCols = 2;
    if (options.length === 1) baseCols = 1;
    if (options.length >= 6) baseCols = 4;
    else if (options.length === 5) baseCols = 3;

    const optionStyle: 'image-card' | 'text-card' = imageRatio > 0.5 ? 'image-card' : (withImage.length >= 1 ? 'image-card' : 'text-card');

    const selectionMode = step.type === 'strategic-question' ? 'single' : 'multi';
    const required = step.requiredSelections || (selectionMode === 'single' ? 1 : undefined);
    const minSel = step.minSelections || required;
    const maxSel = step.maxSelections || required;

    return { layout, columns: baseCols, optionStyle, selectionMode, requiredSelections: required, minSelections: minSel, maxSelections: maxSel };
}

// Builders por tipo de step
function buildIntro(ctx: BuildContext): Block[] {
    const s = ctx.canonicalStep;
    return [
        {
            id: `${ctx.stepId}-header`,
            type: 'quiz-intro-header',
            order: 0,
            content: {
                showLogo: true,
                showProgress: false,
                showNavigation: false,
            },
            properties: {
                contentMaxWidth: 640,
                animation: 'fadeIn',
                animationDuration: '0.6s'
            }
        },
        {
            id: `${ctx.stepId}-title`,
            type: 'text',
            order: 1,
            content: { text: s.title },
            properties: {
                fontSize: 'text-3xl md:text-4xl',
                fontWeight: 'font-bold',
                textAlign: 'center'
            }
        },
        {
            id: `${ctx.stepId}-form`,
            type: 'single-input-form',
            order: 2,
            content: {
                label: s.formQuestion,
                placeholder: s.placeholder,
                buttonText: s.buttonText || 'Continuar'
            },
            properties: {
                width: '100%',
                maxWidth: 480
            }
        }
    ];
}

function buildQuestion(ctx: BuildContext): Block[] {
    const s = ctx.canonicalStep;
    const pres = deriveQuestionPresentation(s);
    const ov = questionOverrides[s.id];
    const finalLayout = ov?.layout || pres.layout;
    const finalColumns = ov?.columns || pres.columns;
    const finalOptionStyle = ov?.optionStyle || pres.optionStyle;

    const wrapperNeeded = finalLayout === 'grid';
    const wrapper: Block | null = wrapperNeeded ? {
        id: `${ctx.stepId}-question-wrapper`,
        type: 'question-grid-wrapper',
        order: 1,
        content: {
            stepId: ctx.stepId,
            questionNumber: s.questionNumber
        },
        properties: {
            columns: finalColumns,
            responsive: { md: Math.min(finalColumns - 1, 3), sm: 2, xs: 1 }
        }
    } : null;

    const header: Block = {
        id: `${ctx.stepId}-question-header`,
        type: 'quiz-intro-header',
        order: 0,
        content: {
            showLogo: false,
            showProgress: true,
            showNavigation: false
        },
        properties: {
            compact: true
        }
    };

    const mainBlock: Block = {
        id: `${ctx.stepId}-question`,
        type: pres.selectionMode === 'multi' ? 'multi-select-question' : 'single-select-question',
        order: 2,
        content: {
            question: s.questionText,
            options: s.options,
            questionNumber: s.questionNumber,
            requiredSelections: pres.requiredSelections,
            minSelections: pres.minSelections,
            maxSelections: pres.maxSelections,
            selectionMode: pres.selectionMode,
            ariaGroupLabel: s.questionText
        },
        properties: {
            layout: finalLayout,
            columns: finalLayout === 'grid' ? finalColumns : undefined,
            gap: 12,
            optionStyle: finalOptionStyle,
            responsive: {
                md: Math.min(finalColumns - 1, 3),
                sm: 2,
                xs: 1
            },
            enforceMinMax: !!(pres.minSelections || pres.maxSelections)
        }
    };

    return [
        header,
        ...(ov?.extraBlocksBefore || []),
        ...(wrapper ? [wrapper] : []),
        mainBlock,
        ...(ov?.extraBlocksAfter || [])
    ];
}

function buildStrategicQuestion(ctx: BuildContext): Block[] {
    const s = ctx.canonicalStep;
    const pres = deriveQuestionPresentation({ ...s, type: 'strategic-question' });
    const ov = questionOverrides[s.id];
    const finalLayout = ov?.layout || pres.layout;
    const finalColumns = ov?.columns || pres.columns;
    const finalOptionStyle = ov?.optionStyle || pres.optionStyle;
    const header: Block = {
        id: `${ctx.stepId}-strategic-header`,
        type: 'quiz-intro-header',
        order: 0,
        content: {
            showLogo: false,
            showProgress: true,
            showNavigation: false
        },
        properties: { compact: true }
    };
    const mainBlock: Block = {
        id: `${ctx.stepId}-strategic`,
        type: 'single-select-question',
        order: 1,
        content: {
            question: s.questionText,
            options: s.options,
            requiredSelections: 1,
            selectionMode: 'single',
            ariaGroupLabel: s.questionText
        },
        properties: {
            layout: finalLayout,
            columns: finalLayout === 'grid' ? finalColumns : undefined,
            gap: 8,
            optionStyle: finalOptionStyle,
            responsive: {
                md: Math.min(finalColumns - 1, 3),
                sm: 2,
                xs: 1
            },
            enforceMinMax: true
        }
    };
    return [
        header,
        ...(ov?.extraBlocksBefore || []),
        mainBlock,
        ...(ov?.extraBlocksAfter || [])
    ];
}

function buildTransition(ctx: BuildContext): Block[] {
    const s = ctx.canonicalStep;
    return [
        {
            id: `${ctx.stepId}-transition`,
            type: 'transition-info',
            order: 0,
            content: {
                title: s.title,
                text: s.text || 'Processando suas respostas...'
            },
            properties: {
                spinner: true,
                estimatedMs: 1200
            }
        }
    ];
}

function buildResult(ctx: BuildContext): Block[] {
    const core: Block[] = [
        {
            id: `${ctx.stepId}-result-header`,
            type: 'result-dynamic',
            order: 0,
            content: { titleTemplate: '{userName}, seu estilo predominante é:' },
            properties: { showShare: true }
        }
    ];
    const modular = buildSections(ctx.canonicalStep, 'result');
    return [...core, ...modular];
}

function buildOffer(ctx: BuildContext): Block[] {
    const s = ctx.canonicalStep;
    const core: Block[] = [
        {
            id: `${ctx.stepId}-offer-hero`,
            type: 'offer-dynamic',
            order: 0,
            content: {
                image: s.image,
                matchQuestionId: s.matchQuestionId,
                variants: s.variants
            },
            properties: { layout: 'vertical' }
        }
    ];
    const modular = buildSections(ctx.canonicalStep, 'offer');
    return [...core, ...modular];
}

const typeBuilders: Record<string, (ctx: BuildContext) => Block[]> = {
    intro: buildIntro,
    question: buildQuestion,
    'strategic-question': buildStrategicQuestion,
    transition: buildTransition,
    'transition-result': buildTransition,
    result: buildResult,
    offer: buildOffer
};

// Mapa de equivalência (legado -> dinâmico) para documentação interna e futura migração de referências
export const LEGACY_TYPE_EQUIVALENCE: Record<string, string> = {
    'options-grid': 'multi-select-question',
    'quiz-offer-cta-inline': 'offer-dynamic',
    'button-inline': 'offer-dynamic',
    'result-header-inline': 'result-dynamic',
    'urgency-timer-inline': 'result-urgency',
    'style-card-inline': 'result-style-card',
    'before-after-inline': 'result-before-after',
    'secondary-styles': 'result-style-summary',
    'bonus': 'offer-bonus',
    'testimonials': 'offer-testimonials',
    'guarantee': 'offer-guarantee',
    'value-anchoring': 'offer-value-anchor',
    'mentor-section-inline': 'offer-mentor',
    'quiz-intro-header': 'quiz-intro-header' // já mapeado 1:1
};

export function buildCanonicalBlocksTemplate(): Record<string, Block[]> {
    const definition = getQuizDefinition();
    if (!definition) return {};
    const steps = definition.steps;
    const total = steps.length;

    const template: Record<string, Block[]> = {};

    steps.forEach((step: any, index: number) => {
        const builder = typeBuilders[step.type];
        if (!builder) {
            // fallback mínimo para tipos ainda não mapeados
            template[step.id] = [{
                id: `${step.id}-raw`,
                type: 'raw-json-debug',
                order: 0,
                content: { step }
            }];
            return;
        }
        template[step.id] = builder({
            stepId: step.id,
            index,
            total,
            canonicalStep: step,
            previousStepId: index > 0 ? steps[index - 1].id : undefined,
            nextStepId: index < total - 1 ? steps[index + 1].id : undefined
        });
    });

    return template;
}

// Subset builder para migração incremental: somente steps >= 12
export function buildSubsetFrom(stepIdStart: string): Record<string, Block[]> {
    const definition = getQuizDefinition();
    if (!definition) return {};
    const steps = definition.steps;
    const startIndex = steps.findIndex((s: any) => s.id === stepIdStart);
    if (startIndex === -1) return {};
    const subset: Record<string, Block[]> = {};
    for (let i = startIndex; i < steps.length; i++) {
        const step = steps[i];
        const builder = typeBuilders[step.type];
        subset[step.id] = builder ? builder({
            stepId: step.id,
            index: i,
            total: steps.length,
            canonicalStep: step,
            previousStepId: i > 0 ? steps[i - 1].id : undefined,
            nextStepId: i < steps.length - 1 ? steps[i + 1].id : undefined
        }) : [{ id: `${step.id}-raw`, type: 'raw-json-debug', order: 0, content: { step } }];
    }
    return subset;
}

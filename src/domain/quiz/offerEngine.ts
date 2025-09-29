import { QuizDefinition, OfferStep } from './types';

export interface OfferResolution {
    variantTitle: string;
    description: string;
    buttonText: string;
    testimonial: { quote: string; author: string };
    matchValue: string;
}

/**
 * Resolve a variante de oferta com base em:
 * - Step estratégico final definido em offerMapping.strategicFinalStepId
 * - Resposta (id) armazenada em answers[stepId][0]
 * - Mapeia id -> text via options do step estratégico
 * - Compara text com variant.matchValue
 */
export function resolveOfferVariant(def: QuizDefinition, answers: Record<string, string[]>): OfferResolution | null {
    const finalStrategicId = def.offerMapping.strategicFinalStepId;
    const finalStrategicStep = def.steps.find(s => s.id === finalStrategicId && s.type === 'strategic-question') as any;
    if (!finalStrategicStep) return null;

    const selectedId = answers[finalStrategicId]?.[0];
    if (!selectedId) return null; // usuário ainda não respondeu

    const option = finalStrategicStep.options.find((o: any) => o.id === selectedId);
    if (!option) return null;

    const offerStep = def.steps.find(s => s.type === 'offer') as OfferStep | undefined;
    if (!offerStep) return null;

    const variant = offerStep.variants.find(v => v.matchValue === option.text) || offerStep.variants[0];
    if (!variant) return null;

    return {
        variantTitle: variant.title,
        description: variant.description,
        buttonText: variant.buttonText,
        testimonial: variant.testimonial,
        matchValue: variant.matchValue
    };
}

/** Obter chave de oferta (matchValue) apenas */
export function getOfferKey(def: QuizDefinition, answers: Record<string, string[]>): string | null {
    const res = resolveOfferVariant(def, answers);
    return res?.matchValue || null;
}

/**
 * Adaptador legacy -> canonical
 * Mantém a API histórica (QUIZ_STEPS, STEP_ORDER, getStepById, etc.) sem duplicar conteúdo.
 * Todos os dados agora são derivados de `quiz-definition.json` (fonte única de verdade).
 */
import canonicalDef from '../domain/quiz/quiz-definition.json';

export interface QuizOption { id: string; text: string; image?: string; }
export interface OfferContent { title: string; description: string; buttonText: string; testimonial: { quote: string; author: string }; }
export interface QuizStep {
    type: 'intro' | 'question' | 'strategic-question' | 'transition' | 'transition-result' | 'result' | 'offer';
    title?: string;
    questionNumber?: string; // Ex: "1 de 10" apenas para type=question
    questionText?: string;
    formQuestion?: string;
    placeholder?: string;
    buttonText?: string;
    text?: string;
    image?: string;
    requiredSelections?: number;
    options?: QuizOption[];
    nextStep?: string; // Mantido para compatibilidade (mapeado de canonical step.next)
    offerMap?: Record<string, OfferContent>; // Apenas presente na etapa final de oferta
}

// 1) Indexar números das perguntas de estilo (type=question)
const QUESTION_NUMBER_INDEX: Record<string, number> = {};
let totalQuestions = 0;
for (const s of canonicalDef.steps) {
    if (s.type === 'question') {
        totalQuestions += 1;
        QUESTION_NUMBER_INDEX[s.id] = totalQuestions;
    }
}

// 2) Construir estrutura legacy derivada
const QUIZ_STEPS: Record<string, QuizStep> = {};
for (const step of canonicalDef.steps) {
    const quizStep: QuizStep = {
        type: step.type as QuizStep['type'],
        title: (step as any).title,
        questionText: (step as any).questionText,
        questionNumber: step.type === 'question' ? `${QUESTION_NUMBER_INDEX[step.id]} de ${totalQuestions}` : undefined,
        formQuestion: (step as any).formQuestion,
        placeholder: (step as any).placeholder,
        buttonText: (step as any).buttonText,
        text: (step as any).text,
        image: (step as any).image,
        requiredSelections: (step as any).requiredSelections,
        options: (step as any).options,
        nextStep: (step as any).next
    };

    if (step.type === 'offer') {
        const variants = (step as any).variants || [];
        quizStep.offerMap = variants.reduce((acc: Record<string, OfferContent>, v: any) => {
            acc[v.matchValue] = {
                title: v.title,
                description: v.description,
                buttonText: v.buttonText,
                testimonial: v.testimonial
            };
            return acc;
        }, {});
    }

    QUIZ_STEPS[step.id] = quizStep;
}

// 3) Ordem das etapas exatamente como declaradas no canonical
export const STEP_ORDER = canonicalDef.steps.map(s => s.id);

// 4) Mapeamento de resposta estratégica final -> chave de oferta (matchValue)
const finalStrategicId = canonicalDef.offerMapping?.strategicFinalStepId;
const finalStrategic = canonicalDef.steps.find(s => s.id === finalStrategicId);
export const STRATEGIC_ANSWER_TO_OFFER_KEY = (() => {
    if (finalStrategic && (finalStrategic as any).options) {
        return (finalStrategic as any).options.reduce((acc: Record<string, string>, opt: any) => {
            acc[opt.id] = opt.text; // id da opção -> texto usado como matchValue nas variants
            return acc;
        }, {});
    }
    return {} as const;
})();

// 5) Funções utilitárias compatíveis
export { QUIZ_STEPS };
export const getStepById = (stepId: string): QuizStep | undefined => QUIZ_STEPS[stepId];
export const getAllSteps = (): { id: string; step: QuizStep }[] => Object.entries(QUIZ_STEPS).map(([id, step]) => ({ id, step }));
export const getNextStep = (currentStepId: string): string | undefined => QUIZ_STEPS[currentStepId]?.nextStep;

// Nota: Quando todas as chamadas diretas forem migradas para o runtime canonical,
// poderemos remover este adaptador ou reduzi-lo a re-exports mais simples.
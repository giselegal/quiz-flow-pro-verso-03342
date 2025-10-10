// Tipos mínimos compartilhados entre editores e runtime
export type StepKind = 'intro' | 'question' | 'strategic-question' | 'transition' | 'transition-result' | 'result' | 'offer';

export interface EditableQuizStepLite {
    id: string;
    type: StepKind | string;
    nextStep?: string;
    requiredSelections?: number;
    questionText?: string;
    questionNumber?: string;
    options?: Array<{ id: string; text: string; image?: string }>;
    formQuestion?: string;
    placeholder?: string;
    buttonText?: string;
    title?: string;
    text?: string;
    // Blocks em formato flexível (legacy: config, modular: properties/content)
    blocks?: Array<
        | { id: string; type: string; config?: Record<string, any> }
        | { id: string; type: string; properties?: Record<string, any>; content?: Record<string, any> }
    >;
    offerMap?: Record<string, any>;
}

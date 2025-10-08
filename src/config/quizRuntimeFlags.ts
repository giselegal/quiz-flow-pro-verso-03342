/**
 * Configuração padrão de flags de runtime do quiz.
 * Pode ser sobrescrita ao chamar useQuizState.
 */
export interface QuizRuntimeFlags {
    enableFormQuestion: boolean; // já ativo por padrão (fallback automático no validator)
    enableAutoAdvance: boolean;  // avança automaticamente após selecionar opção
    autoAdvanceDelayMs: number;  // atraso antes do avanço
    personalizeFinalStep: boolean; // substitui {nome} em campos textuais
}

export const DEFAULT_QUIZ_RUNTIME_FLAGS: QuizRuntimeFlags = {
    enableFormQuestion: true,
    enableAutoAdvance: true,
    autoAdvanceDelayMs: 300,
    personalizeFinalStep: true,
};

export function mergeRuntimeFlags(partial?: Partial<QuizRuntimeFlags>): QuizRuntimeFlags {
    return { ...DEFAULT_QUIZ_RUNTIME_FLAGS, ...(partial || {}) };
}

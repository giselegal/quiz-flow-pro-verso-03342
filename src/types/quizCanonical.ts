// Tipos canônicos para quiz (compatíveis com múltiplas fontes)

export type StyleScores = Record<string, number>;

export type QuestionKind = 'scored' | 'strategic';

export interface CanonicalOption {
    id: string;
    text: string;
    imageUrl?: string;
    // Para perguntas de pontuação
    score?: StyleScores;
    // Para perguntas estratégicas
    segment?: string;
}

export interface CanonicalQuestion {
    id: string;
    title?: string;
    text: string;
    kind: QuestionKind;
    options: CanonicalOption[];
    // Restrições de seleção normalizadas
    requiredSelections?: number;
    minSelections?: number;
    maxSelections?: number;
}

export interface CanonicalQuiz {
    id: string;
    title?: string;
    questions: CanonicalQuestion[];
}

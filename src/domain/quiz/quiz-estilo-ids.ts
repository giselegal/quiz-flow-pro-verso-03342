// Centralização de IDs relacionados ao Quiz Estilo
// Facilita unificação futura e evita literais espalhadas

export const QUIZ_ESTILO_TEMPLATE_ID = 'quiz-estilo-21-steps';
export const QUIZ_ESTILO_SEMANTIC_ID = 'quiz-estilo-pessoal';

export const ALL_QUIZ_ESTILO_ALIASES = [
    QUIZ_ESTILO_TEMPLATE_ID,
    QUIZ_ESTILO_SEMANTIC_ID,
    'quiz-estilo-completo',
    'quiz-estilo-otimizado',
    'quiz-estilo'
];

export function isQuizEstiloId(id?: string | null): boolean {
    if (!id) return false;
    return ALL_QUIZ_ESTILO_ALIASES.includes(id);
}

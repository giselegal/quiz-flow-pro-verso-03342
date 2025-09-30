// Centralização de IDs relacionados ao Quiz Estilo
// Facilita unificação futura e evita literais espalhadas

export const QUIZ_ESTILO_TEMPLATE_ID = 'quiz-estilo-21-steps';
export const QUIZ_ESTILO_SEMANTIC_ID = 'quiz-estilo-pessoal';

export const ALL_QUIZ_ESTILO_ALIASES = [
    QUIZ_ESTILO_TEMPLATE_ID,
    QUIZ_ESTILO_SEMANTIC_ID,
    'quiz-estilo-completo',
    'quiz-estilo-otimizado',
    'quiz-estilo',
    // 🔄 Alias legado antigo (deprecar e remover futuramente)
    'quiz21StepsComplete'
];

export function isQuizEstiloId(id?: string | null): boolean {
    if (!id) return false;
    return ALL_QUIZ_ESTILO_ALIASES.includes(id);
}

// Retorna ID canônico único para qualquer alias aceito
export function canonicalizeQuizEstiloId(id?: string | null): string | null {
    if (!id) return null;
    if (!isQuizEstiloId(id)) return id; // não é quiz-estilo
    // Qualquer alias retorna sempre o TEMPLATE_ID principal
    return QUIZ_ESTILO_TEMPLATE_ID;
}

// Utilitário para emitir aviso único de depreciação quando alias legado usado
let _deprecatedWarned = false;
export function warnIfDeprecatedQuizEstilo(id?: string | null) {
    if (!_deprecatedWarned && id === 'quiz21StepsComplete') {
        // eslint-disable-next-line no-console
        console.warn('[quiz-estilo] Alias legado "quiz21StepsComplete" detectado. Use o id canônico:', QUIZ_ESTILO_TEMPLATE_ID);
        _deprecatedWarned = true;
    }
}

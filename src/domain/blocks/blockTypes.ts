// Tipos básicos iniciais (expandiremos depois)
export type BlockType =
    | 'heading'
    | 'image'
    | 'input'
    | 'button'
    // Quiz-focused (fase 2 – inicial)
    | 'quiz-question-inline'
    | 'quiz-transition'
    | 'quiz-result'
    | 'quiz-offer';

export const CORE_BLOCK_TYPES: BlockType[] = [
    'heading',
    'image',
    'input',
    'button',
    'quiz-question-inline',
    'quiz-transition',
    'quiz-result',
    'quiz-offer'
];

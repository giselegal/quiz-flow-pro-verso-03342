/**
 * 🔄 BLOCK TYPE MAPPER
 *
 * Mapeia tipos de bloco do template v3.0 (sections) para tipos conhecidos pelo editor
 * sem alterar dados de conteúdo. Preserva o tipo original em properties._originalType
 */

export const BLOCK_TYPE_MAP: Record<string, string> = {
    // Intro blocks
    'intro-hero': 'container',
    'welcome-form': 'form-container',

    // Question blocks
    'question-hero': 'quiz-question-header',
    'options-grid': 'options-grid', // já existe

    // Transition blocks
    'transition-hero': 'transition-hero', // já existe no registry
    'transition-content': 'text',

    // Result blocks
    'result-header': 'result-header', // já existe no registry
    'result-content': 'text',
    'result-card': 'result-card', // container estilizado existente

    // Offer blocks
    'offer-hero': 'offer-hero', // já existe no registry
    'offer-cta': 'button',
};

export function mapBlockType(templateType: string): string {
    if (!templateType) return templateType;
    const key = String(templateType).trim();
    return BLOCK_TYPE_MAP[key] || key;
}

export function isCustomBlockType(type: string): boolean {
    return Object.prototype.hasOwnProperty.call(BLOCK_TYPE_MAP, type);
}

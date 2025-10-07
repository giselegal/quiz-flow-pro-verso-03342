/**
 * 🔤 Normalização de IDs de Estilo
 *
 * O sistema interno usa ids sem acento para pontos e respostas (ex: "contemporaneo", "romantico").
 * A base styleConfigGisele utiliza chaves/ids acentuadas em alguns casos (ex: "contemporâneo", "romântico").
 * Este utilitário centraliza a conversão em ambos os sentidos para evitar duplicação de mapeamentos.
 */

// Mapa de variantes sem acento -> com acento (canonical)
const ACCENTED_MAP: Record<string, string> = {
    classico: 'clássico', // Mantemos canonical existente no banco (se aplicável)
    contemporaneo: 'contemporâneo',
    romantico: 'romântico',
    dramatico: 'dramático'
};

// Inverso (com acento -> sem acento)
const UNACCENTED_MAP: Record<string, string> = Object.entries(ACCENTED_MAP)
    .reduce((acc, [plain, accented]) => {
        acc[accented] = plain;
        return acc;
    }, {} as Record<string, string>);

/**
 * Normaliza um id de estilo vindo de respostas (sem acento) para a forma canonical usada na styleConfig.
 * Caso já esteja canonical ou não haja mapeamento, retorna o valor original.
 */
export function resolveStyleId(id: string | undefined | null): string {
    if (!id) return '';
    return ACCENTED_MAP[id] || id;
}

/**
 * Remove acentos voltando para a variante simples utilizada nos objetos de pontuação internos.
 */
export function toUnaccentedStyleId(id: string | undefined | null): string {
    if (!id) return '';
    return UNACCENTED_MAP[id] || id;
}

/** Lista de estilos canônicos (com acentos onde aplicável). */
export const CANONICAL_STYLE_IDS = [
    'natural',
    'clássico',
    'contemporâneo',
    'elegante',
    'romântico',
    'sexy',
    'dramático',
    'criativo'
];

/** Lista de estilos sem acento (usar para estruturas de pontos). */
export const UNACCENTED_STYLE_IDS = [
    'natural',
    'classico',
    'contemporaneo',
    'elegante',
    'romantico',
    'sexy',
    'dramatico',
    'criativo'
];

export default {
    resolveStyleId,
    toUnaccentedStyleId,
    CANONICAL_STYLE_IDS,
    UNACCENTED_STYLE_IDS
};

/**
 * 🔧 STABLE ID GENERATOR
 * 
 * Resolve problemas de loop infinito causados por geração dinâmica de IDs
 * em componentes React que re-renderizam constantemente.
 */

// Cache global para IDs estáveis
const ID_CACHE = new Map<string, string>();
let idCounter = 0;

/**
 * Gera um ID estável baseado em uma chave
 * O mesmo key sempre retornará o mesmo ID
 */
export function generateStableId(key: string, prefix: string = 'id'): string {
    const cacheKey = `${prefix}_${key}`;

    if (ID_CACHE.has(cacheKey)) {
        return ID_CACHE.get(cacheKey)!;
    }

    // Gerar ID baseado no hash do key + contador
    const hash = hashString(key);
    const id = `${prefix}-${hash}-${++idCounter}`;

    ID_CACHE.set(cacheKey, id);
    return id;
}

/**
 * Gera um ID único mas determinístico baseado no conteúdo
 */
export function generateContentBasedId(content: any, prefix: string = 'content'): string {
    const contentString = typeof content === 'string' ? content : JSON.stringify(content);
    const key = `${prefix}_${contentString}`;
    return generateStableId(key, prefix);
}

/**
 * Gera um ID para um bloco baseado em suas propriedades
 */
export function generateBlockId(type: string, order: number, stepKey?: string): string {
    const key = stepKey ? `${stepKey}_${type}_${order}` : `${type}_${order}`;
    return generateStableId(key, 'block');
}

/**
 * Gera um ID para um step baseado no seu número
 */
export function generateStepId(stepNumber: number | string): string {
    return generateStableId(stepNumber.toString(), 'step');
}

/**
 * Função de hash simples para gerar IDs determinísticos
 */
function hashString(str: string): string {
    let hash = 0;
    if (str.length === 0) return hash.toString();

    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
    }

    return Math.abs(hash).toString(36);
}

/**
 * Limpa o cache de IDs (útil para testes)
 */
export function clearIdCache(): void {
    ID_CACHE.clear();
    idCounter = 0;
}

/**
 * Hook React para gerar IDs estáveis
 */
export function useStableId(key: string, prefix: string = 'id'): string {
    // Usar useMemo APENAS para memoizar, não para gerar
    const stableKey = React.useMemo(() => key, [key]);
    return generateStableId(stableKey, prefix);
}

// Importar React se disponível
let React: any;
try {
    React = require('react');
} catch {
    // React não disponível, useStableId não funcionará
}
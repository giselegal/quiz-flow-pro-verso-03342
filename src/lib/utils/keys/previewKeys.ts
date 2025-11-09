/**
 * Helper para gerar chaves estáveis de renderização em listas de preview.
 * Mantém estabilidade entre reordenações e pequenas alterações de conteúdo,
 * mas força remount quando o tipo do bloco muda (troca de componente).
 */
export type MinimalBlockLike = {
    id: string;
    type: any;
    metadata?: Record<string, any>;
};

export function getPreviewBlockKey(block: MinimalBlockLike): string {
    const typePart = typeof block.type === 'string'
        ? block.type
        : (block.type?.kind || block.type?.name || 'unknown');

    // Mantemos a chave independente da ordem e de mudanças de conteúdo para evitar remounts.
    // Remount apenas quando o tipo muda, garantindo troca limpa de componente.
    return `${block.id}:${typePart}`;
}

import type { Block } from '@/types/editor';

/**
 * Carrega blocos de um step a partir de JSON dinâmico no diretório public.
 * Tenta em /templates/quiz21-steps/<stepId>.json e aceita dois formatos:
 *  - Array<Block>
 *  - { blocks: Block[] }
 * Retorna null quando não encontrado (404) ou em erro.
 */
export async function loadStepFromJson(stepId: string): Promise<Block[] | null> {
  try {
    if (!stepId) return null;
    const url = `/templates/quiz21-steps/${stepId}.json`;
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) {
      // 404 ou outro status → tratar como não encontrado
      return null;
    }

    const data = await res.json();
    if (Array.isArray(data)) {
      return data as Block[];
    }
    if (data && Array.isArray((data as any).blocks)) {
      return (data as any).blocks as Block[];
    }
    // Formato inesperado
    return null;
  } catch {
    // Erros de rede/parse → não quebrar o fluxo
    return null;
  }
}

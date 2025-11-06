import type { Block } from '@/types/editor';

/**
 * Carrega blocos de um step a partir de JSON dinâmico no diretório public.
 * Tenta em /templates/quiz21-steps/<stepId>.json e aceita dois formatos:
 *  - Array<Block>
 *  - { blocks: Block[] }
 * Retorna null quando não encontrado (404) ou em erro.
 */
export async function loadStepFromJson(stepId: string): Promise<Block[] | null> {
  if (!stepId) return null;

  // Helper: tenta carregar e extrair blocks de diferentes formatos
  const tryUrl = async (url: string): Promise<Block[] | null> => {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) return null;
      const data = await res.json();
      if (Array.isArray(data)) return data as Block[];
      if (data && Array.isArray((data as any).blocks)) return (data as any).blocks as Block[];

      // quiz21-complete.json possui estrutura { steps: { [stepId]: { blocks: [...] } } }
      if (data && (data as any).steps && (data as any).steps[stepId]) {
        const stepObj = (data as any).steps[stepId];
        if (Array.isArray(stepObj)) return stepObj as Block[];
        if (Array.isArray(stepObj?.blocks)) return stepObj.blocks as Block[];
      }
      return null;
    } catch {
      return null;
    }
  };

  // Ordem de caminhos suportados (prioridade):
  // 1) Arquivos v3 por step (fonte principal)
  // 2) Novo padrão dedicado de blocks por step (fallback)
  // 3) Padrão legado quiz21-steps (fallback)
  // 4) Alternativo "-template.json" (fallback)
  // 5) Master JSON consolidado (fallback final)
  const paths: string[] = [
    // 1) Preferência: per-step v3 JSON (ex.: step-01-v3.json)
    `/templates/${stepId}-v3.json`,
    // 2) Fallback: per-step blocks (v3.1)
    `/templates/blocks/${stepId}.json`,
    // 3) Fallback legado citado em docs
    `/templates/quiz21-steps/${stepId}.json`,
    // 4) Fallback alternativo "-template.json"
    `/templates/${stepId}-template.json`,
    // 5) Fallback final: master JSON com todos os steps
    `/templates/quiz21-complete.json`,
  ];

  for (const url of paths) {
    const blocks = await tryUrl(url);
    if (blocks && blocks.length > 0) return blocks;
  }

  return null;
}

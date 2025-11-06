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

  // Ordens de caminhos suportados:
  // 1) Novo padrão dedicado
  const paths: string[] = [
    // Preferência: per-step blocks (v3.1)
    `/templates/blocks/${stepId}.json`,
    // Padrão legado citado em docs (pode não existir neste repo)
    `/templates/quiz21-steps/${stepId}.json`,
    // 2) Arquivos v3 existentes no repo (ex.: step-01-v3.json)
    `/templates/${stepId}-v3.json`,
    // 3) Alternativo "-template.json"
    `/templates/${stepId}-template.json`,
    // 4) Master JSON consolidado com todos os steps
    `/templates/quiz21-complete.json`,
  ];

  for (const url of paths) {
    const blocks = await tryUrl(url);
    if (blocks && blocks.length > 0) return blocks;
  }

  return null;
}

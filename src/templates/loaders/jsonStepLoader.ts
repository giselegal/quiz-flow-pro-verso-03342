import type { Block } from '@/types/editor';

/**
 * Carrega blocos de um step a partir de JSON dinâmico no diretório public.
 * 
 * @param stepId - ID do step (ex: "step-01")
 * @param templateId - ID do template/funnel (ex: "quiz21StepsComplete")
 * 
 * Tenta carregar de /templates/funnels/{templateId}/steps/{stepId}.json
 * Aceita dois formatos:
 *  - Array<Block>
 *  - { blocks: Block[] }
 * Retorna null quando não encontrado (404) ou em erro.
 */
export async function loadStepFromJson(
  stepId: string, 
  templateId: string = 'quiz21StepsComplete'
): Promise<Block[] | null> {
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

  // ✅ APÓS MIGRAÇÃO v3.1: Usando formato v3.1 individual por template
  // Path dinâmico baseado no templateId fornecido
  const paths: string[] = [
    `/templates/funnels/${templateId}/steps/${stepId}.json`,
  ];

  console.log(`🔍 [jsonStepLoader] Tentando carregar: ${paths[0]}`);

  for (const url of paths) {
    const blocks = await tryUrl(url);
    if (blocks && blocks.length > 0) {
      console.log(`✅ [jsonStepLoader] Carregado ${blocks.length} blocos de ${url}`);
      return blocks;
    }
  }

  console.warn(`⚠️ [jsonStepLoader] Nenhum bloco encontrado para ${stepId} no template ${templateId}`);
  return null;
}

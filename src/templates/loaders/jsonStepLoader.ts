import type { Block } from '@/types/editor';
import { appLogger } from '@/lib/utils/appLogger';

// ✅ G4 FIX: Cache de paths falhos para evitar requisições repetidas
const failedPathsCache = new Map<string, number>();
const FAILED_PATH_TTL = 5 * 60 * 1000; // 5 minutos

/**
 * Carrega blocos de um step a partir de JSON dinâmico (versão de template v3.2) no diretório public.
 * 
 * Versões suportadas:
 *  - v3.1 (legado, ainda presente em alguns arquivos gerados)
 *  - v3.2 (atual) → estrutura consolidada { blocks: Block[] } ou diretamente Array<Block>
 *
 * @param stepId - ID do step (ex: "step-01")
 * @param templateId - ID do template/funnel (ex: "quiz21StepsComplete")
 * 
 * Tenta carregar de /templates/funnels/{templateId}/steps/{stepId}.json
 * Formatos aceitos:
 *  - Array<Block>
 *  - { blocks: Block[] }
 *  - { steps: { [stepId]: { blocks: Block[] } } } (compatibilidade master agregador)
 * Retorna null quando não encontrado (404) ou em erro silencioso.
 */
export async function loadStepFromJson(
  stepId: string, 
  templateId: string = 'quiz21StepsComplete'
): Promise<Block[] | null> {
  if (!stepId) return null;

  // Helper: tenta carregar e extrair blocks de diferentes formatos
  let cacheMode: RequestCache = 'default';
  try {
    // @ts-ignore
    const env = (import.meta as any)?.env;
    if (env?.VITE_TEMPLATE_LIVE_EDIT === 'true') cacheMode = 'no-store';
  } catch {}

  const tryUrl = async (url: string): Promise<Block[] | null> => {
    // ✅ G4 FIX: Verificar se path já falhou recentemente
    const now = Date.now();
    const failedAt = failedPathsCache.get(url);
    if (failedAt && (now - failedAt) < FAILED_PATH_TTL) {
      appLogger.debug(`[jsonStepLoader] Pulando path falho (cache): ${url}`);
      return null;
    }

    try {
      const res = await fetch(url, { cache: cacheMode });
      if (!res.ok) {
        // Registrar falha no cache
        failedPathsCache.set(url, now);
        return null;
      }
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
      // Registrar falha no cache
      failedPathsCache.set(url, now);
      return null;
    }
  };

  // ✅ MIGRAÇÃO v3.2: Usando arquivos individuais por template (compatibilidade mantendo leitura v3.1)
  // Path dinâmico baseado no templateId fornecido
  // Em DEV, adicionar query param para bust de cache do navegador e proxies
  let bust = '';
  try {
    // @ts-ignore
    const env = (import.meta as any)?.env;
    const enableBust = env?.VITE_TEMPLATE_CACHE_BUST === 'true';
    const live = env?.VITE_TEMPLATE_LIVE_EDIT === 'true';
    if (live || enableBust) bust = `?t=${Date.now()}`;
  } catch {}

  // ✅ G4 FIX: Reordenar paths para testar caminho mais provável primeiro
  // Baseado em análise de uso, master.v3.json é o mais comum, depois steps individuais
  const paths: string[] = [
    `/templates/${templateId}/master.v3.json${bust}`, // Mais comum - agora primeiro
    `/templates/${templateId}/${stepId}.json${bust}`, // Path direto do step
    `/templates/funnels/${templateId}/steps/${stepId}.json${bust}`, // Path menos comum - agora último
  ];

  appLogger.info(`🔍 [jsonStepLoader] Tentando carregar: ${paths[0]}`);

  for (const url of paths) {
    const blocks = await tryUrl(url);
    if (blocks && blocks.length > 0) {
      // 🔍 Validação simples DEV: garante shape mínimo dos blocos evitando crashes silenciosos
      try {
        // @ts-ignore
        if ((import.meta as any)?.env?.DEV) {
          const originalLen = blocks.length;
          const filtered = blocks.filter((b: any) => b && typeof b.id === 'string' && typeof b.type === 'string');
          if (filtered.length !== originalLen) {
            appLogger.warn(`[jsonStepLoader] ${originalLen - filtered.length} blocos descartados por shape inválido (DEV) em ${stepId}`);
          }
          appLogger.info(`[jsonStepLoader] Validação DEV concluída para ${stepId}: ${filtered.length}/${originalLen} válidos`);
          return filtered as Block[];
        }
      } catch (e) {
        appLogger.warn(`[jsonStepLoader] Falha na validação DEV: ${(e as any)?.message}`);
      }
      appLogger.info(`✅ [jsonStepLoader] Carregado ${blocks.length} blocos de ${url}`);
      return blocks;
    }
  }

  appLogger.warn(`⚠️ [jsonStepLoader] Nenhum bloco encontrado para ${stepId} no template ${templateId}`);
  return null;
}

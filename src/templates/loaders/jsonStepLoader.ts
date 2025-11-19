import type { Block } from '@/types/editor';
import { appLogger } from '@/lib/utils/appLogger';
import { cacheManager } from '@/lib/cache/CacheManager';

// ✅ G4 FIX: Cache de paths falhos para evitar requisições repetidas
const failedPathsCache = new Map<string, number>();
const FAILED_PATH_TTL = 30 * 60 * 1000; // 30 minutos (FASE 2: aumentado de 5min)

// ✅ FASE 2: TTL do cache aumentado (2 horas para steps, 1 hora para dev mode)
const STEP_CACHE_TTL = (import.meta as any)?.env?.DEV ? 60 * 60 * 1000 : 120 * 60 * 1000;

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

  // ✅ WAVE 2: Verificar cache primeiro (L1 Memory + L2 IndexedDB)
  const cacheKey = `step:${templateId}:${stepId}`;
  const cached = await cacheManager.get<Block[]>(cacheKey, 'steps');
  if (cached) {
    appLogger.debug(`[jsonStepLoader] 🎯 Cache hit: ${cacheKey}`);
    return cached;
  }

  // Helper: tenta carregar e extrair blocks de diferentes formatos
  let cacheMode: RequestCache = 'default';
  try {
    // @ts-ignore
    const env = (import.meta as any)?.env;
    if (env?.VITE_TEMPLATE_LIVE_EDIT === 'true') cacheMode = 'no-store';
  } catch { }

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
  } catch { }

  // ✅ WAVE 1 CRÍTICO: Path order ajustado para reduzir 404s e usar master consolidado quando disponível
  // Estratégia: tentar carregar o master consolidado primeiro (1 request para 21 steps),
  // depois tentar o passo individual. Isso reduz tráfego e TTI quando o master está presente.
  const paths: string[] = [
    // 🎯 PRIORIDADE #1: Master consolidado na raiz public (carrega todas as etapas em 1 request)
    `/templates/quiz21-complete.json${bust}`,

    // 🎯 PRIORIDADE #2: Steps individuais (fallback se master não estiver presente)
    `/templates/funnels/${templateId}/steps/${stepId}.json${bust}`,

    // 🎯 PRIORIDADE #3: Master no diretório do template (fallback adicional)
    `/templates/funnels/${templateId}/master.v3.json${bust}`,
  ];

  appLogger.info(`🔍 [jsonStepLoader] Tentando carregar (ordem): ${paths.join(' , ')}`);

  for (const url of paths) {
    const blocks = await tryUrl(url);
    if (blocks && blocks.length > 0) {
      // 🔍 Validação simples DEV: garante shape mínimo dos blocos evitando crashes silenciosos
      let validatedBlocks = blocks;
      try {
        // @ts-ignore
        if ((import.meta as any)?.env?.DEV) {
          const originalLen = blocks.length;
          const filtered = blocks.filter((b: any) => b && typeof b.id === 'string' && typeof b.type === 'string');
          if (filtered.length !== originalLen) {
            appLogger.warn(`[jsonStepLoader] ${originalLen - filtered.length} blocos descartados por shape inválido (DEV) em ${stepId}`);
          }
          appLogger.info(`[jsonStepLoader] Validação DEV concluída para ${stepId}: ${filtered.length}/${originalLen} válidos`);
          validatedBlocks = filtered as Block[];
        }
      } catch (e) {
        appLogger.warn(`[jsonStepLoader] Falha na validação DEV: ${(e as any)?.message}`);
      }

      // ✅ WAVE 2: Armazenar no cache (L1 + L2)
      await cacheManager.set(cacheKey, validatedBlocks, STEP_CACHE_TTL, 'steps');

      appLogger.info(`✅ [jsonStepLoader] Carregado ${validatedBlocks.length} blocos de ${url}`);
      return validatedBlocks;
    }
  }

  appLogger.warn(`⚠️ [jsonStepLoader] Nenhum bloco encontrado para ${stepId} no template ${templateId}`);
  return null;
}

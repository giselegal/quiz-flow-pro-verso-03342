import type { Block } from '@/types/editor';
import { appLogger } from '@/lib/utils/appLogger';
import { cacheManager } from '@/lib/cache/CacheManager';
import { cacheService } from '@/services/canonical';
import { getGlobalTheme } from '@/config/globalTheme';
import { ASSETS } from '@/config/assets';

// Legacy templateCache API wrapper
const templateCache = {
  get: (key: string) => {
    const result = cacheService.get(key, 'templates');
    return result.success ? result.data : null;
  },
  set: (key: string, value: any, ttl?: number) => cacheService.set(key, value, { store: 'templates', ttl }),
  has: (key: string) => cacheService.has(key, 'templates'),
  clear: () => {
    const result = cacheService.clearStore('templates');
    return result;
  },
};

// ✅ G4 FIX: Cache de paths falhos para evitar requisições repetidas
const failedPathsCache = new Map<string, number>();
const FAILED_PATH_TTL = 30 * 60 * 1000; // 30 minutos (FASE 2: aumentado de 5min)

// ✅ WAVE 2.6: TTL diferenciado por tipo de step (otimização de cache inteligente)
// Steps críticos (alta frequência de acesso): 2 horas
// Steps regulares: 30 minutos
// DEV mode: 1 hora para facilitar desenvolvimento
const STEP_CACHE_TTL_MAP: Record<string, number> = {
  // Critical steps (high usage - intro, key questions, results)
  'step-01': 2 * 60 * 60 * 1000, // 2h - Introdução
  'step-12': 2 * 60 * 60 * 1000, // 2h - Mid-point key question
  'step-19': 2 * 60 * 60 * 1000, // 2h - Pre-result transition
  'step-20': 2 * 60 * 60 * 1000, // 2h - Result display
  'step-21': 2 * 60 * 60 * 1000, // 2h - Offer/CTA
};

// Default TTL para steps não especificados
const DEFAULT_STEP_TTL = 30 * 60 * 1000; // 30min

// Helper: obter TTL apropriado para o step
const getStepCacheTTL = (stepId: string): number => {
  try {
    const env = (import.meta as any)?.env;
    // DEV mode: TTL reduzido para facilitar testes
    if (env?.DEV) return 60 * 60 * 1000; // 1h
  } catch { }
  
  // Produção: usar TTL diferenciado
  return STEP_CACHE_TTL_MAP[stepId] || DEFAULT_STEP_TTL;
};

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

  // 🚀 FASE 2: Verificar TemplateCache inteligente PRIMEIRO (mais rápido)
  const cachedStep = templateCache.get(stepId, templateId);
  if (cachedStep) {
    appLogger.debug(`✅ [jsonStepLoader] TemplateCache hit: ${stepId}`);
    return cachedStep;
  }

  // Tentar obter do master cache (quiz21-complete.json já carregado)
  const stepFromMaster = templateCache.getStepFromMaster(stepId, templateId);
  if (stepFromMaster) {
    appLogger.debug(`✅ [jsonStepLoader] Step obtido do master cache: ${stepId}`);
    return stepFromMaster;
  }

  // ✅ WAVE 2: Verificar cache legado (L1 Memory + L2 IndexedDB) - compatibilidade
  const cacheKey = `step:${templateId}:${stepId}`;
  const cached = await cacheManager.get<Block[]>(cacheKey, 'steps');
  if (cached) {
    appLogger.debug(`[jsonStepLoader] 🎯 CacheManager hit: ${cacheKey}`);
    // Migrar para novo cache
    templateCache.set(stepId, cached, templateId);
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
      appLogger.info(`🔍 [jsonStepLoader] Tentando URL: ${url}`);
      const res = await fetch(url, { cache: cacheMode });
      if (!res.ok) {
        appLogger.info(`❌ [jsonStepLoader] Resposta não OK (${res.status}): ${url}`);
        // Registrar falha no cache
        failedPathsCache.set(url, now);
        return null;
      }
      const data = await res.json();
      appLogger.info(`📥 [jsonStepLoader] JSON carregado de ${url}, verificando estrutura...`);
      
      if (Array.isArray(data)) {
        appLogger.info(`✅ [jsonStepLoader] Estrutura Array direta: ${data.length} blocos`);
        return data as Block[];
      }
      if (data && Array.isArray((data as any).blocks)) {
        appLogger.info(`✅ [jsonStepLoader] Estrutura {blocks: []}: ${(data as any).blocks.length} blocos`);
        return (data as any).blocks as Block[];
      }

      // quiz21-complete.json possui estrutura { steps: { [stepId]: { blocks: [...] } } }
      if (data && (data as any).steps) {
        // 🚀 FASE 2: Cachear todo o master template para acesso futuro instantâneo
        const masterSteps: Record<string, Block[]> = {};
        let totalSteps = 0;

        for (const [key, value] of Object.entries((data as any).steps)) {
          if (Array.isArray(value)) {
            masterSteps[key] = value as Block[];
            totalSteps++;
          } else if (value && Array.isArray((value as any).blocks)) {
            masterSteps[key] = (value as any).blocks as Block[];
            totalSteps++;
          }
        }

        if (totalSteps > 0) {
          templateCache.setMaster(templateId, masterSteps);
          appLogger.info(`💾 [jsonStepLoader] Master template cacheado: ${totalSteps} steps disponíveis`);
        }

        // Retornar step específico solicitado
        const stepObj = (data as any).steps[stepId];
        if (stepObj) {
          appLogger.info(`✅ [jsonStepLoader] Estrutura {steps: {${stepId}: ...}} encontrada`);
          if (Array.isArray(stepObj)) {
            appLogger.info(`✅ [jsonStepLoader] Step como array: ${stepObj.length} blocos`);
            return stepObj as Block[];
          }
          if (Array.isArray(stepObj?.blocks)) {
            appLogger.info(`✅ [jsonStepLoader] Step com .blocks: ${stepObj.blocks.length} blocos`);
            return stepObj.blocks as Block[];
          }
        }
      }
      appLogger.warn(`⚠️ [jsonStepLoader] Estrutura não reconhecida em ${url}`);
      return null;
    } catch (error) {
      appLogger.error(`❌ [jsonStepLoader] Erro ao carregar ${url}:`, error);
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

  // ✅ FASE 2 CRÍTICO: Reordenar paths para eliminar 404 iniciais
  // ORDEM OTIMIZADA: Master consolidado PRIMEIRO para evitar 84 requisições 404
  // Reduz latência de 4,2s para ~0,3s colocando o arquivo que REALMENTE existe como prioridade #1
  const paths: string[] = [
    // 🎯 PRIORIDADE #1: Master consolidado (ÚNICO ARQUIVO QUE EXISTE - elimina 84 404s!)
    `/templates/quiz21-complete.json${bust}`,

    // 🎯 PRIORIDADE #2: Arquivo direto da etapa versão v3 (fallback)
    `/templates/${stepId}-v3.json${bust}`,

    // 🎯 PRIORIDADE #3: Path individual por template (fallback)
    `/templates/funnels/${templateId}/steps/${stepId}.json${bust}`,

    // 🎯 PRIORIDADE #4: Master dentro do diretório do template (fallback adicional)
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

      // 🚀 FASE 2: Armazenar no novo TemplateCache inteligente
      templateCache.set(stepId, validatedBlocks, templateId);

      // ✅ WAVE 2.6: Também manter no cache legado (compatibilidade)
      const ttl = getStepCacheTTL(stepId);
      await cacheManager.set(cacheKey, validatedBlocks, ttl, 'steps');
      appLogger.debug(`[jsonStepLoader] Cache TTL para ${stepId}: ${ttl / 1000 / 60}min`);

      appLogger.info(`✅ [jsonStepLoader] Carregado ${validatedBlocks.length} blocos de ${url}`);
      
      // 🔄 FASE 2: Pré-carregar steps adjacentes em background (melhora navegação)
      const stepNumber = parseInt(stepId.replace('step-', ''), 10);
      if (!isNaN(stepNumber)) {
        templateCache.preloadAdjacent(stepNumber, templateId).catch(() => {
          // Ignorar erros de pré-carregamento
        });
      }

      return validatedBlocks;
    }
  }

  appLogger.warn(`⚠️ [jsonStepLoader] Nenhum bloco encontrado para ${stepId} no template ${templateId}`);
  return null;
}

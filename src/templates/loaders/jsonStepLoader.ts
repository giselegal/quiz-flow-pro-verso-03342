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
const FAILED_PATH_TTL = 30 * 60 * 1000; // 30 minutos

// Steps críticos com TTL maior
const STEP_CACHE_TTL_MAP: Record<string, number> = {
  'step-01': 2 * 60 * 60 * 1000, // 2h - Introdução
  'step-12': 2 * 60 * 60 * 1000, // 2h - Mid-point
  'step-19': 2 * 60 * 60 * 1000, // 2h - Pre-result
  'step-20': 2 * 60 * 60 * 1000, // 2h - Result
  'step-21': 2 * 60 * 60 * 1000, // 2h - Offer
};

const DEFAULT_STEP_TTL = 30 * 60 * 1000; // 30min

const getStepCacheTTL = (stepId: string): number => {
  try {
    const env = (import.meta as any)?.env;
    if (env?.DEV) return 60 * 60 * 1000; // 1h em DEV
  } catch { }
  return STEP_CACHE_TTL_MAP[stepId] || DEFAULT_STEP_TTL;
};

/**
 * 🎨 RESOLVER DE TOKENS (Quick Win Fase 1)
 * Resolve tokens {{theme.colors.primary}}, {{asset.logo}} em strings de blocos.
 */
function resolveTokens<T>(obj: T): T {
  if (!obj) return obj;
  
  const theme = getGlobalTheme();
  
  const resolveString = (str: string): string => {
    if (typeof str !== 'string') return str;
    
    // Resolver {{theme.colors.primary}} etc
    let resolved = str.replace(/\{\{theme\.colors\.(\w+)\}\}/g, (match, colorKey) => {
      return (theme.colors as any)[colorKey] || match;
    });
    
    // Resolver {{theme.fonts.heading}} etc
    resolved = resolved.replace(/\{\{theme\.fonts\.(\w+)\}\}/g, (match, fontKey) => {
      return (theme.fonts as any)[fontKey] || match;
    });
    
    // Resolver {{asset.logo}} etc
    resolved = resolved.replace(/\{\{asset\.(\w+)\}\}/g, (match, assetKey) => {
      return (ASSETS as any)[assetKey] || match;
    });
    
    return resolved;
  };
  
  if (typeof obj === 'string') {
    return resolveString(obj) as T;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => resolveTokens(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const resolved: any = {};
    for (const [key, value] of Object.entries(obj)) {
      resolved[key] = resolveTokens(value);
    }
    return resolved as T;
  }
  
  return obj;
}

/**
 * Carrega blocos de um step a partir de JSON dinâmico (v3.2+v4).
 * 
 * @param stepId - ID do step (ex: "step-01")
 * @param templateId - ID do template/funnel (ex: "quiz21StepsComplete")
 */
export async function loadStepFromJson(
  stepId: string,
  templateId: string = 'quiz21StepsComplete'
): Promise<Block[] | null> {
  if (!stepId) return null;

  // Verificar TemplateCache
  const cachedStep = templateCache.get(stepId);
  if (cachedStep) {
    appLogger.debug(`✅ [jsonStepLoader] TemplateCache hit: ${stepId}`);
    return cachedStep;
  }

  // Verificar cache legado (L1 Memory + L2 IndexedDB)
  const cacheKey = `step:${templateId}:${stepId}`;
  const cached = await cacheManager.get<Block[]>(cacheKey, 'steps');
  if (cached) {
    appLogger.debug(`[jsonStepLoader] CacheManager hit: ${cacheKey}`);
    templateCache.set(stepId, cached);
    return cached;
  }

  // Cache mode
  let cacheMode: RequestCache = 'default';
  try {
    const env = (import.meta as any)?.env;
    if (env?.VITE_TEMPLATE_LIVE_EDIT === 'true') cacheMode = 'no-store';
  } catch { }

  const tryUrl = async (url: string): Promise<Block[] | null> => {
    // Verificar se path já falhou recentemente
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
        failedPathsCache.set(url, now);
        return null;
      }
      const data = await res.json();
      appLogger.info(`📥 [jsonStepLoader] JSON carregado de ${url}`);
      
      if (Array.isArray(data)) {
        appLogger.info(`✅ [jsonStepLoader] Array direta: ${data.length} blocos`);
        return data as Block[];
      }
      if (data && Array.isArray((data as any).blocks)) {
        appLogger.info(`✅ [jsonStepLoader] {blocks: []}: ${(data as any).blocks.length} blocos`);
        return (data as any).blocks as Block[];
      }

      // Master template com múltiplos steps
      if (data && (data as any).steps) {
        let totalSteps = 0;

        for (const [key, value] of Object.entries((data as any).steps)) {
          let blocks: Block[] | null = null;
          if (Array.isArray(value)) {
            blocks = value as Block[];
          } else if (value && Array.isArray((value as any).blocks)) {
            blocks = (value as any).blocks as Block[];
          }
          
          if (blocks) {
            // Cache individual por step
            templateCache.set(key, blocks);
            totalSteps++;
          }
        }

        if (totalSteps > 0) {
          appLogger.info(`💾 [jsonStepLoader] Master template cacheado: ${totalSteps} steps`);
        }

        // Retornar step solicitado
        const stepObj = (data as any).steps[stepId];
        if (stepObj) {
          if (Array.isArray(stepObj)) {
            return stepObj as Block[];
          }
          if (Array.isArray(stepObj?.blocks)) {
            return stepObj.blocks as Block[];
          }
        }
      }
      appLogger.warn(`⚠️ [jsonStepLoader] Estrutura não reconhecida em ${url}`);
      return null;
    } catch (error) {
      appLogger.error(`❌ [jsonStepLoader] Erro ao carregar ${url}:`, error);
      failedPathsCache.set(url, now);
      return null;
    }
  };

  // Query param para bust de cache
  let bust = '';
  try {
    const env = (import.meta as any)?.env;
    const enableBust = env?.VITE_TEMPLATE_CACHE_BUST === 'true';
    const live = env?.VITE_TEMPLATE_LIVE_EDIT === 'true';
    if (live || enableBust) bust = `?t=${Date.now()}`;
  } catch { }

  // Paths ordenados por prioridade
  const paths: string[] = [
    `/templates/quiz21-complete.json${bust}`, // Master consolidado
    `/templates/${stepId}-v3.json${bust}`, // Step individual v3
    `/templates/funnels/${templateId}/steps/${stepId}.json${bust}`, // Path por template
    `/templates/funnels/${templateId}/master.v3.json${bust}`, // Master por template
  ];

  appLogger.info(`🔍 [jsonStepLoader] Tentando carregar: ${paths.join(' , ')}`);

  for (const url of paths) {
    const blocks = await tryUrl(url);
    if (blocks && blocks.length > 0) {
      // Validação DEV
      let validatedBlocks = blocks;
      try {
        if ((import.meta as any)?.env?.DEV) {
          const originalLen = blocks.length;
          const filtered = blocks.filter((b: any) => b && typeof b.id === 'string' && typeof b.type === 'string');
          if (filtered.length !== originalLen) {
            appLogger.warn(`[jsonStepLoader] ${originalLen - filtered.length} blocos descartados (shape inválido) em ${stepId}`);
          }
          validatedBlocks = filtered as Block[];
        }
      } catch (e) {
        appLogger.warn(`[jsonStepLoader] Falha na validação DEV: ${(e as any)?.message}`);
      }

      // 🎨 FASE 1: Resolver tokens {{theme.*}} e {{asset.*}}
      const resolvedBlocks = resolveTokens(validatedBlocks);
      appLogger.debug(`[jsonStepLoader] Tokens resolvidos para ${stepId}`);

      // Armazenar no cache
      templateCache.set(stepId, resolvedBlocks);

      const ttl = getStepCacheTTL(stepId);
      await cacheManager.set(cacheKey, resolvedBlocks, ttl, 'steps');
      appLogger.debug(`[jsonStepLoader] Cache TTL para ${stepId}: ${ttl / 1000 / 60}min`);

      appLogger.info(`✅ [jsonStepLoader] Carregado ${resolvedBlocks.length} blocos de ${url}`);

      return resolvedBlocks;
    }
  }

  appLogger.warn(`⚠️ [jsonStepLoader] Nenhum bloco encontrado para ${stepId} no template ${templateId}`);
  return null;
}

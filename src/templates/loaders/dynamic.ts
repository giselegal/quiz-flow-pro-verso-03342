/**
 * 🔥 LAZY LOADING DINÂMICO DE FUNIS
 * 
 * Sistema de carregamento sob demanda para templates de funis.
 * Reduz bundle principal em ~70% carregando apenas o necessário.
 */

import type { Funnel } from '../schemas';
import { validateFunnel } from '../schemas';

// ============================================================================
// REGISTRY DE LOADERS
// ============================================================================

type FunnelLoader = () => Promise<{ default: Funnel } | Funnel>;

/**
 * Registry de todos os funis disponíveis para lazy loading
 * 
 * IMPORTANTE: Adicione novos funis aqui ao criá-los
 */
const FUNNEL_LOADERS: Record<string, FunnelLoader> = {
  // Funnel principal (21 steps)
  'quiz21StepsComplete': () => import('../funnels/quiz21Steps'),
  'quiz-21-steps': () => import('../funnels/quiz21Steps'), // Alias
  
  // Outros funis (adicionar conforme migração)
  // 'embedded': () => import('../funnels/embedded'),
  // 'short-quiz': () => import('../funnels/shortQuiz'),
};

// ============================================================================
// CACHE DE FUNIS CARREGADOS
// ============================================================================

const loadedFunnels = new Map<string, Funnel>();

/**
 * Limpa o cache de funis (útil para testes)
 */
export function clearFunnelCache(): void {
  loadedFunnels.clear();
}

/**
 * Obtém um funnel já carregado do cache de forma síncrona
 * Retorna undefined se ainda não estiver em cache
 */
export function getLoadedFunnelSync(funnelId: string): Funnel | undefined {
  return loadedFunnels.get(funnelId);
}

/**
 * Pré-carrega um funnel em background (opcional)
 */
export function preloadFunnel(funnelId: string): void {
  if (!loadedFunnels.has(funnelId) && FUNNEL_LOADERS[funnelId]) {
    loadFunnel(funnelId).catch(err => {
      console.warn(`[Preload] Failed to preload funnel "${funnelId}":`, err);
    });
  }
}

// ============================================================================
// LAZY LOADER PRINCIPAL
// ============================================================================

/**
 * Carrega um funnel de forma lazy (sob demanda)
 * 
 * @param funnelId - ID único do funnel
 * @param options - Opções de carregamento
 * @returns Promise com o funnel validado
 * 
 * @example
 * ```ts
 * const funnel = await loadFunnel('quiz21StepsComplete');
 * console.log(funnel.metadata.name); // "Quiz 21 Steps Complete"
 * ```
 */
export async function loadFunnel(
  funnelId: string,
  options: {
    validate?: boolean; // Validar com Zod (default: true)
    useCache?: boolean; // Usar cache (default: true)
  } = {}
): Promise<Funnel> {
  const { validate = true, useCache = true } = options;

  // 1. Verificar cache
  if (useCache && loadedFunnels.has(funnelId)) {
    return loadedFunnels.get(funnelId)!;
  }

  // 2. Verificar se loader existe
  const loader = FUNNEL_LOADERS[funnelId];
  if (!loader) {
    const availableFunnels = Object.keys(FUNNEL_LOADERS).join(', ');
    throw new Error(
      `Funnel "${funnelId}" not found. Available funnels: ${availableFunnels}`
    );
  }

  try {
    // 3. Carregar funnel dinamicamente
    const module = await loader();
    const funnel = 'default' in module ? module.default : module;

    // 4. Validar com Zod (se habilitado)
    if (validate) {
      const validation = validateFunnel(funnel);
      if (!validation.valid) {
        console.error(`[LoadFunnel] Validation failed for "${funnelId}":`, validation.errors);
        console.error('[LoadFunnel] Funnel structure:', {
          hasMetadata: !!funnel.metadata,
          hasTheme: !!funnel.theme,
          hasSettings: !!funnel.settings,
          hasSteps: !!funnel.steps,
          stepsType: typeof funnel.steps,
          metadataKeys: funnel.metadata ? Object.keys(funnel.metadata) : [],
        });
        throw new Error(
          `Funnel "${funnelId}" failed validation. Check console for details.`
        );
      }
    }

    // 5. Adicionar ao cache
    if (useCache) {
      loadedFunnels.set(funnelId, funnel);
    }

    return funnel;
  } catch (error) {
    console.error(`[LoadFunnel] Failed to load funnel "${funnelId}":`, error);
    throw error;
  }
}

// ============================================================================
// UTILIDADES
// ============================================================================

/**
 * Lista todos os funis disponíveis
 */
export function listAvailableFunnels(): string[] {
  return Object.keys(FUNNEL_LOADERS);
}

/**
 * Verifica se um funnel existe no registry
 */
export function hasFunnel(funnelId: string): boolean {
  return funnelId in FUNNEL_LOADERS;
}

/**
 * Obtém estatísticas do cache
 */
export function getCacheStats() {
  return {
    loaded: loadedFunnels.size,
    available: Object.keys(FUNNEL_LOADERS).length,
    funnels: Array.from(loadedFunnels.keys()),
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default loadFunnel;

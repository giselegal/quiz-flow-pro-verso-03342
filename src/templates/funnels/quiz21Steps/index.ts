/**
 * 🎯 QUIZ 21 STEPS COMPLETE - Funnel Principal
 * 
 * Template completo do quiz de estilo pessoal com 21 etapas.
 * 
 * ⚡ LAZY LOADING ATIVADO
 * Steps são carregados sob demanda para reduzir bundle principal.
 * 
 * 📊 Performance:
 * - Bundle inicial: ~50KB (apenas config + step01)
 * - Steps adicionais: ~30KB cada (carregados dinamicamente)
 * - Total: ~680KB (vs 2MB da versão antiga)
 * 
 * @example
 * ```ts
 * // Carregar funnel completo (não recomendado)
 * import { quiz21StepsComplete } from '@/templates/funnels/quiz21Steps';
 * 
 * // Lazy loading (recomendado)
 * import { loadFunnel } from '@/templates/loaders/dynamic';
 * const funnel = await loadFunnel('quiz21StepsComplete');
 * 
 * // Carregar step individual
 * import { loadStep } from '@/templates/funnels/quiz21Steps/config';
 * const step = await loadStep(1);
 * ```
 */

import type { Funnel } from '../../schemas';
import { config, loadStep, theme, settings, assets } from './config';
import metadata from './metadata.json';

// ============================================================================
// CACHE DE STEPS
// ============================================================================

const stepsCache = new Map<number, any>();

/**
 * Carrega um step com cache
 */
export async function getStep(stepNumber: number) {
  if (stepsCache.has(stepNumber)) {
    return stepsCache.get(stepNumber);
  }

  const step = await loadStep(stepNumber);
  stepsCache.set(stepNumber, step);
  return step;
}

/**
 * Limpa cache de steps (útil para testes)
 */
export function clearStepsCache() {
  stepsCache.clear();
}

// ============================================================================
// FUNNEL COMPLETO (Sem Steps - Lazy Loading)
// ============================================================================

/**
 * Configuração do funnel sem steps carregados
 * 
 * IMPORTANTE: Use loadStep() para carregar steps sob demanda
 */
export const quiz21StepsComplete: Funnel = {
  metadata: {
    ...metadata,
    // Assets separados (não mesclados no metadata para evitar conflitos com schema)
  } as any,
  theme,
  settings,
  steps: {}, // Steps carregados via loadStep()
  // Assets disponíveis como propriedade extra
  assets,
} as Funnel;

// ============================================================================
// HELPERS DE COMPATIBILIDADE (Legacy Support)
// ============================================================================

/**
 * @deprecated Use loadStep() com await para lazy loading
 * 
 * Função legada para compatibilidade com código antigo
 */
export function getStepTemplate(stepId: string) {
  const stepNumber = parseInt(stepId.replace('step-', ''), 10);
  console.warn(
    `[Deprecated] getStepTemplate() foi descontinuado. Use loadStep(${stepNumber}) com await (lazy loading).`
  );
  // Retorna null para forçar migração para async
  return null;
}

/**
 * @deprecated Use loadFunnel() do loader dinâmico
 * 
 * Template completo legado (carrega TODOS os steps - pesado!)
 */
export const QUIZ_STYLE_21_STEPS_TEMPLATE: Record<string, any> = {
  // Vazio por padrão. Use loadStep() para carregar dinamicamente.
};

// ============================================================================
// EXPORTS
// ============================================================================

export { config, theme, settings, assets, metadata, loadStep };
export default quiz21StepsComplete;

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
import step01 from './steps/step01';

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
    ...assets,
  },
  theme,
  settings,
  steps: {}, // Steps carregados via loadStep()
};

// ============================================================================
// VERSÃO COM STEP 01 PRÉ-CARREGADO (Para inicialização rápida)
// ============================================================================

/**
 * Versão do funnel com apenas step01 pré-carregado
 * 
 * Útil para renderização inicial sem delay
 */
export const quiz21StepsCompleteWithStep01: Funnel = {
  ...quiz21StepsComplete,
  steps: {
    'step-01': step01,
  },
};

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
  
  if (stepNumber === 1) {
    return step01;
  }

  console.warn(
    `[Deprecated] getStepTemplate() is deprecated. Use loadStep(${stepNumber}) instead.`
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
  'step-01': step01,
  // Outros steps carregados via loadStep()
};

// ============================================================================
// EXPORTS
// ============================================================================

export { config, theme, settings, assets, metadata, loadStep };
export default quiz21StepsComplete;

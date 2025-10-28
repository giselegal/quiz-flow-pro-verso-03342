/**
 * 🎯 CONFIGURAÇÃO DE NAVEGAÇÃO DO QUIZ
 * 
 * Controla quais steps são opcionais/obrigatórios e extensibilidade
 */

/**
 * Configuração de steps opcionais
 */
export const QUIZ_NAV_CONFIG = {
  /**
   * Se true, exibe step-21 (oferta) após o resultado
   * Se false, step-20 (resultado) é o step terminal
   * 
   * @default true
   */
  ENABLE_OFFER_STEP: typeof import.meta !== 'undefined' && import.meta.env?.VITE_ENABLE_OFFER_STEP !== 'false',

  /**
   * Permite adicionar steps customizados além do step-21
   * Útil para upsells, checkout, thank you pages, etc.
   * 
   * @default false
   */
  CUSTOM_STEPS_ENABLED: typeof import.meta !== 'undefined' && import.meta.env?.VITE_CUSTOM_STEPS_ENABLED === 'true',

  /**
   * Step ID da oferta (pode ser customizado)
   * 
   * @default 'step-21'
   */
  OFFER_STEP_ID: 'step-21',

  /**
   * Step ID do resultado (sempre obrigatório)
   * 
   * @default 'step-20'
   */
  RESULT_STEP_ID: 'step-20',
} as const;

/**
 * Estrutura de steps do quiz
 */
export const QUIZ_STRUCTURE = {
  /**
   * Steps obrigatórios do núcleo do funil (1-20)
   */
  CORE_STEPS: [
    'step-01', // Intro
    'step-02', 'step-03', 'step-04', 'step-05', 'step-06', // Questions 1-5
    'step-07', 'step-08', 'step-09', 'step-10', 'step-11', // Questions 6-10
    'step-12', // Transition
    'step-13', 'step-14', 'step-15', 'step-16', 'step-17', 'step-18', // Strategic 1-6
    'step-19', // Transition-Result
    'step-20', // Result (TERMINAL se oferta desabilitada)
  ] as const,

  /**
   * Steps opcionais que podem ser habilitados/desabilitados
   */
  OPTIONAL_STEPS: [
    'step-21', // Offer
  ] as const,

  /**
   * Steps customizados (podem ser adicionados via extensão)
   */
  CUSTOM_STEPS: [
    // 'step-22', // Upsell
    // 'step-23', // Checkout
    // 'step-24', // Thank You
  ] as const,
} as const;

/**
 * Retorna o nextStep apropriado para um step baseado na configuração
 */
export function getConfiguredNextStep(currentStepId: string, defaultNextStep: string | null): string | null {
  // Step-20: resultado
  if (currentStepId === QUIZ_NAV_CONFIG.RESULT_STEP_ID) {
    // Se oferta está habilitada, vai para step-21
    if (QUIZ_NAV_CONFIG.ENABLE_OFFER_STEP) {
      return QUIZ_NAV_CONFIG.OFFER_STEP_ID;
    }
    // Se não, step-20 é terminal
    return null;
  }

  // Step-21: oferta
  if (currentStepId === QUIZ_NAV_CONFIG.OFFER_STEP_ID) {
    // Se steps customizados estão habilitados, pode ter próximo step
    if (QUIZ_NAV_CONFIG.CUSTOM_STEPS_ENABLED) {
      return defaultNextStep; // Usa o nextStep definido no QUIZ_STEPS
    }
    // Se não, step-21 é terminal
    return null;
  }

  // Outros steps: usa o nextStep padrão
  return defaultNextStep;
}

/**
 * Verifica se um step é opcional baseado na configuração
 */
export function isOptionalStep(stepId: string): boolean {
  // Step-21 é opcional se a oferta está desabilitada
  if (stepId === QUIZ_NAV_CONFIG.OFFER_STEP_ID) {
    return !QUIZ_NAV_CONFIG.ENABLE_OFFER_STEP;
  }

  // Steps customizados são sempre opcionais
  if ((QUIZ_STRUCTURE.CUSTOM_STEPS as readonly string[]).includes(stepId)) {
    return true;
  }

  return false;
}

/**
 * Retorna todos os steps habilitados (core + opcionais ativos)
 */
export function getEnabledSteps(): string[] {
  const enabled: string[] = [...QUIZ_STRUCTURE.CORE_STEPS];

  // Adiciona step-21 se habilitado
  if (QUIZ_NAV_CONFIG.ENABLE_OFFER_STEP) {
    enabled.push(QUIZ_NAV_CONFIG.OFFER_STEP_ID);
  }

  // Adiciona steps customizados se habilitados
  if (QUIZ_NAV_CONFIG.CUSTOM_STEPS_ENABLED) {
    enabled.push(...(QUIZ_STRUCTURE.CUSTOM_STEPS as readonly string[]));
  }

  return enabled;
}

/**
 * Valida se um step existe e está habilitado
 */
export function isStepEnabled(stepId: string): boolean {
  return getEnabledSteps().includes(stepId);
}

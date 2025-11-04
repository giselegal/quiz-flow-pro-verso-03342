/**
 * 🎚️ FEATURE FLAGS - Controle de Funcionalidades
 * 
 * Permite ativar/desativar features gradualmente
 */

export const FEATURES = {
  /**
   * 🆕 FASE 5.1: Sistema 100% JSON-Driven
   * 
   * Quando true: Prioriza templates JSON sobre TSX components
   * Quando false: Usa apenas TSX components (comportamento atual)
   * 
   * Default: true (ativado para gradual rollout)
   */
  USE_JSON_DRIVEN: import.meta.env.VITE_USE_JSON_DRIVEN !== 'false',

  /**
   * V3.0: Renderização via V3Renderer (hardcoded templates)
   * 
   * DEPRECATED: Será removido após migração completa para JSON
   */
  ENABLE_V3_RENDER: import.meta.env.VITE_ENABLE_V3_RENDER === 'true',

  /**
   * Debug mode: Logs detalhados no console
   */
  DEBUG_MODE: import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true',

  /**
   * Analytics: Rastreamento de eventos
   */
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false',
} as const;

/**
 * Helper para verificar se está em modo de desenvolvimento
 */
export const isDevelopment = () => import.meta.env.DEV;

/**
 * Helper para verificar se está em modo de produção
 */
export const isProduction = () => import.meta.env.PROD;

/**
 * 🚀 PERFORMANCE CONSTANTS - Fase 5 Gargalos
 * 
 * Constantes de configuração para otimização de performance.
 * 
 * @version 2.0.0
 */

// ============================================================================
// VIRTUALIZATION
// ============================================================================

/** Número mínimo de items para ativar virtualização de blocos */
export const VIRTUALIZATION_THRESHOLD = 20;

/** Steps: número mínimo para ativar virtualização */
export const STEPS_VIRTUALIZATION_THRESHOLD = 15;

/** Overscan padrão (itens extras renderizados fora do viewport) */
export const OVERSCAN_DEFAULT = 5;

/** Overscan durante edição (mais itens para scroll suave) */
export const OVERSCAN_EDITING = 8;

/** Altura estimada de um step no navegador */
export const ESTIMATED_STEP_HEIGHT = 80;

/** Altura estimada de um bloco no canvas */
export const ESTIMATED_BLOCK_HEIGHT = 140;

// ============================================================================
// LAZY LOADING
// ============================================================================

/** Margem do root para IntersectionObserver (pré-carregamento) */
export const LAZY_ROOT_MARGIN = '200px';

/** Threshold para trigger de visibilidade (0-1) */
export const LAZY_THRESHOLD = 0.1;

/** Número de blocos para renderizar imediatamente (above the fold) */
export const IMMEDIATE_RENDER_COUNT = 3;

// ============================================================================
// DEBOUNCE / THROTTLE
// ============================================================================

/** Debounce para auto-save de drafts (ms) */
export const AUTOSAVE_DEBOUNCE_MS = 1000;

/** Debounce para search/filter (ms) */
export const SEARCH_DEBOUNCE_MS = 300;

/** Throttle para scroll events (ms) */
export const SCROLL_THROTTLE_MS = 100;

// ============================================================================
// PREFETCH
// ============================================================================

/** Delay antes de iniciar prefetch do próximo step (ms) */
export const PREFETCH_DELAY_MS = 500;

/** Número de steps adjacentes para prefetch */
export const PREFETCH_ADJACENT_STEPS = 2;

// ============================================================================
// CACHE
// ============================================================================

/** TTL padrão para cache de templates (ms) - 5 minutos */
export const TEMPLATE_CACHE_TTL = 5 * 60 * 1000;

/** Tamanho máximo do cache LRU */
export const LRU_CACHE_SIZE = 100;

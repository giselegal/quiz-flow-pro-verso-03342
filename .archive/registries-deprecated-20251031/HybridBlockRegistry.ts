/**
 * 🔄 BLOCK REGISTRY ADAPTER - FASE 2.3 ETAPA 3
 * 
 * Adapter pattern para integrar gradualmente DynamicBlockRegistry
 * com EnhancedBlockRegistry existente, mantendo compatibilidade.
 * 
 * FEATURES:
 * - Backwards compatible com getEnhancedBlockComponent()
 * - Progressive enhancement com lazy loading
 * - Automatic fallback para imports estáticos
 * - Cache unificado
 * - Performance monitoring
 * 
 * MIGRATION STRATEGY:
 * 1. Use este adapter para manter API existente
 * 2. Novos blocos usam DynamicBlockRegistry
 * 3. Blocos críticos mantêm import estático
 * 4. Gradualmente migrar blocos legacy
 */

import { ComponentType } from 'react';
import { dynamicBlockRegistry, BlockType } from '@/config/registry/DynamicBlockRegistry';
import { 
  ENHANCED_BLOCK_REGISTRY, 
  getEnhancedBlockComponent as getEnhancedBlockComponentOriginal,
  AVAILABLE_COMPONENTS, 
} from '@/components/editor/blocks/EnhancedBlockRegistry';

// ============================================================================
// ADAPTER INTERFACE
// ============================================================================

export interface BlockRegistryAdapter {
  getComponent(type: BlockType): ComponentType<any> | undefined;
  getComponentAsync(type: BlockType): Promise<ComponentType<any>>;
  hasComponent(type: BlockType): boolean;
  preloadBlock(type: BlockType): Promise<void>;
  getAvailableComponents(): Record<string, any>;
}

// ============================================================================
// STRATEGY SELECTION
// ============================================================================

/**
 * Determine if a block should use dynamic loading
 */
function shouldUseDynamicLoading(type: BlockType): boolean {
  // Critical blocks always use static imports (already in ENHANCED_BLOCK_REGISTRY)
  const criticalBlocks = [
    'text-inline',
    'button-inline',
    'image-inline',
    'form-input',
    'options-grid',
    'quiz-intro-header',
    'decorative-bar-inline',
    'legal-notice-inline',
  ];

  if (criticalBlocks.includes(type)) {
    return false;
  }

  // Blocks in static registry use static imports
  if (ENHANCED_BLOCK_REGISTRY[type]) {
    // Check if it's already a lazy component
    const component = ENHANCED_BLOCK_REGISTRY[type];
    if (component && (component as any)._payload) {
      // Already lazy - can benefit from dynamic registry
      return true;
    }
    return false; // Static import
  }

  // New blocks use dynamic loading
  return true;
}

// ============================================================================
// HYBRID BLOCK REGISTRY
// ============================================================================

export class HybridBlockRegistry implements BlockRegistryAdapter {
  private static instance: HybridBlockRegistry | null = null;
  
  private performanceMetrics = new Map<BlockType, {
    loads: number;
    avgLoadTime: number;
    errors: number;
  }>();

  private constructor() {}

  static getInstance(): HybridBlockRegistry {
    if (!HybridBlockRegistry.instance) {
      HybridBlockRegistry.instance = new HybridBlockRegistry();
    }
    return HybridBlockRegistry.instance;
  }

  /**
   * Get component synchronously (backwards compatible)
   */
  getComponent(type: BlockType): ComponentType<any> | undefined {
    // Try static registry first (fast path)
    const staticComponent = ENHANCED_BLOCK_REGISTRY[type];
    if (staticComponent) {
      return staticComponent;
    }

    // For dynamic blocks, return lazy component
    if (shouldUseDynamicLoading(type)) {
      try {
        return dynamicBlockRegistry.getLazyBlock(type);
      } catch (error) {
        console.warn(`[HybridBlockRegistry] Failed to get lazy block "${type}":`, error);
        return undefined;
      }
    }

    // Fallback to original function
    return getEnhancedBlockComponentOriginal(type);
  }

  /**
   * Get component asynchronously (new API)
   */
  async getComponentAsync(type: BlockType): Promise<ComponentType<any>> {
    const startTime = performance.now();

    try {
      // Try static registry first
      const staticComponent = ENHANCED_BLOCK_REGISTRY[type];
      if (staticComponent && !(staticComponent as any)._payload) {
        // Static import - return immediately
        this.recordMetric(type, performance.now() - startTime, false);
        return staticComponent;
      }

      // Use dynamic registry
      if (shouldUseDynamicLoading(type)) {
        const component = await dynamicBlockRegistry.getBlock(type);
        this.recordMetric(type, performance.now() - startTime, false);
        return component.default;
      }

      // Fallback
      const fallbackComponent = this.getComponent(type);
      if (!fallbackComponent) {
        throw new Error(`Block "${type}" not found`);
      }

      this.recordMetric(type, performance.now() - startTime, false);
      return fallbackComponent;

    } catch (error) {
      this.recordMetric(type, performance.now() - startTime, true);
      throw error;
    }
  }

  /**
   * Check if component exists
   */
  hasComponent(type: BlockType): boolean {
    // Check static registry
    if (ENHANCED_BLOCK_REGISTRY[type]) {
      return true;
    }

    // Check dynamic registry metadata
    if (dynamicBlockRegistry.getMetadata(type)) {
      return true;
    }

    return false;
  }

  /**
   * Preload block
   */
  async preloadBlock(type: BlockType): Promise<void> {
    if (shouldUseDynamicLoading(type)) {
      await dynamicBlockRegistry.getBlock(type);
    }
    // Static blocks are already loaded
  }

  /**
   * Get available components (backwards compatible)
   */
  getAvailableComponents(): Record<string, any> {
    return AVAILABLE_COMPONENTS;
  }

  /**
   * Record performance metric
   */
  private recordMetric(type: BlockType, loadTime: number, isError: boolean): void {
    const existing = this.performanceMetrics.get(type) || {
      loads: 0,
      avgLoadTime: 0,
      errors: 0,
    };

    existing.loads += 1;
    existing.avgLoadTime = (existing.avgLoadTime * (existing.loads - 1) + loadTime) / existing.loads;
    if (isError) {
      existing.errors += 1;
    }

    this.performanceMetrics.set(type, existing);
  }

  /**
   * Get performance stats
   */
  getPerformanceStats() {
    const stats: Record<string, any> = {};
    
    this.performanceMetrics.forEach((metric, type) => {
      stats[type] = {
        loads: metric.loads,
        avgLoadTime: Math.round(metric.avgLoadTime * 100) / 100,
        errors: metric.errors,
        errorRate: Math.round((metric.errors / metric.loads) * 100),
      };
    });

    return {
      blocks: stats,
      dynamicCache: dynamicBlockRegistry.getCacheStats(),
      staticBlocks: Object.keys(ENHANCED_BLOCK_REGISTRY).length,
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export const hybridBlockRegistry = HybridBlockRegistry.getInstance();

/**
 * Get block component (backwards compatible with getEnhancedBlockComponent)
 */
export function getBlockComponent(type: BlockType): ComponentType<any> | undefined {
  return hybridBlockRegistry.getComponent(type);
}

/**
 * Get block component async (new API)
 */
export function getBlockComponentAsync(type: BlockType): Promise<ComponentType<any>> {
  return hybridBlockRegistry.getComponentAsync(type);
}

/**
 * Preload multiple blocks
 */
export async function preloadBlocks(types: BlockType[]): Promise<void> {
  await Promise.all(types.map(type => hybridBlockRegistry.preloadBlock(type)));
}

/**
 * Check if block exists
 */
export function hasBlock(type: BlockType): boolean {
  return hybridBlockRegistry.hasComponent(type);
}

// Re-export for convenience
export { AVAILABLE_COMPONENTS, ENHANCED_BLOCK_REGISTRY };
export { dynamicBlockRegistry } from '@/config/registry/DynamicBlockRegistry';

/**
 * 🎣 USE DYNAMIC BLOCK HOOK
 * 
 * React hook for lazy loading blocks with suspense support
 * 
 * ✅ MIGRADO: Agora usa UnifiedBlockRegistry ao invés de DynamicBlockRegistry
 */

import { ComponentType, useMemo } from 'react';
import { blockRegistry, type BlockType, prefetchBlock, prefetchBlocks, getRegistryStats } from '@/registry/UnifiedBlockRegistry';

export interface UseDynamicBlockOptions {
  preload?: boolean;
}

/**
 * Hook to get a lazy-loaded block component
 */
export function useDynamicBlock(
  type: BlockType,
  options: UseDynamicBlockOptions = {},
): ComponentType<any> {
  const { preload = false } = options;

  // Preload if requested
  if (preload) {
    prefetchBlock(type).catch(err => {
      console.warn(`[useDynamicBlock] Preload failed for ${type}:`, err);
    });
  }

  // Return component from unified registry
  return useMemo(
    () => blockRegistry.getComponent(type) || (() => null),
    [type],
  );
}

/**
 * Hook to preload multiple blocks
 */
export function usePreloadBlocks(types: BlockType[]): void {
  useMemo(() => {
    prefetchBlocks(types);
  }, [types]);
}

/**
 * Hook to get registry stats
 */
export function useDynamicBlockStats() {
  return getRegistryStats();
}

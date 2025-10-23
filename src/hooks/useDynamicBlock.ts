/**
 * 🎣 USE DYNAMIC BLOCK HOOK
 * 
 * React hook for lazy loading blocks with suspense support
 */

import { ComponentType, useMemo } from 'react';
import { dynamicBlockRegistry, BlockType } from '@/config/registry/DynamicBlockRegistry';

export interface UseDynamicBlockOptions {
  preload?: boolean;
}

/**
 * Hook to get a lazy-loaded block component
 */
export function useDynamicBlock(
  type: BlockType,
  options: UseDynamicBlockOptions = {}
): ComponentType<any> {
  const { preload = false } = options;

  // Preload if requested
  if (preload) {
    dynamicBlockRegistry.getBlock(type).catch(err => {
      console.warn(`[useDynamicBlock] Preload failed for ${type}:`, err);
    });
  }

  // Return lazy component
  return useMemo(
    () => dynamicBlockRegistry.getLazyBlock(type),
    [type]
  );
}

/**
 * Hook to preload multiple blocks
 */
export function usePreloadBlocks(types: BlockType[]): void {
  useMemo(() => {
    dynamicBlockRegistry.preloadBlocks(types);
  }, [types]);
}

/**
 * Hook to get registry stats
 */
export function useDynamicBlockStats() {
  return dynamicBlockRegistry.getCacheStats();
}

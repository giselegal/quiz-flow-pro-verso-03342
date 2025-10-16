/**
 * 🎯 REAL-TIME SYNC HOOK
 * 
 * Sincroniza mudanças do editor com preview usando debounce
 */

import { useEffect, useCallback } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { BlockComponent } from '../types';

export interface UseRealTimeSyncOptions {
  delay?: number;
  enabled?: boolean;
}

export const useRealTimeSync = (
  blocks: BlockComponent[],
  onSync: (blocks: BlockComponent[]) => void,
  delay: number = 300
) => {
  const debouncedBlocks = useDebounce(blocks, delay);
  
  const isSyncing = blocks !== debouncedBlocks;
  
  useEffect(() => {
    if (!isSyncing) {
      onSync(debouncedBlocks);
    }
  }, [debouncedBlocks, isSyncing, onSync]);
  
  return { isSyncing };
};

export default useRealTimeSync;

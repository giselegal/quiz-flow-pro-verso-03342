/**
 * @deprecated Este hook está deprecated e será removido.
 * Use EditorStateProvider diretamente.
 */

import { appLogger } from '@/lib/utils/appLogger';
import type { Block } from '@/types/editor';

export function useSuperUnified() {
  appLogger.warn('⚠️ useSuperUnified está deprecated');
  
  return {
    getStepBlocks: (_step: number): Block[] => [],
    setStepBlocks: (_step: number, _blocks: Block[]): void => {},
    updateBlock: (_step: number, _blockId: string, _updates: Partial<Block>): void => {},
  };
}

export default useSuperUnified;

/**
 * 🛠️ UTILS BARREL EXPORT
 * 
 * Exporta todas as utilidades centrais para fácil importação
 */

// Block Data Adapter (Fase 2)
export {
  adaptBlockData,
  getBlockText,
  getBlockImage,
  getBlockOptions,
  getBlockColor,
  getBlockNumber,
  getBlockBoolean,
  getBlockConfig,
  type BlockDataSource,
  type NormalizedBlockData,
} from './blockDataAdapter';

// Block Config Merger (legado, mantido para compatibilidade)
export {
  normalizeOption,
  extractOptions,
  extractQuestionText,
  extractQuestionNumber,
} from './blockConfigMerger';

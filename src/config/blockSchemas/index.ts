/**
 * 📦 BLOCK SCHEMAS - Barrel Export
 * 
 * Módulos de schemas de blocos organizados por categoria.
 * Este arquivo substitui o monolítico blockPropertySchemas.ts (116KB)
 * 
 * @example
 * ```typescript
 * import { blockPropertySchemas, type BlockSchema } from '@/config/blockSchemas';
 * ```
 */

// Types
export type { FieldType, BlockFieldSchema, BlockSchema, BlockSchemaRecord } from './types';
export { COMMON_FIELDS } from './types';

// Category schemas
export { universalSchemas } from './universal';
export { introSchemas } from './intro';
export { contentSchemas } from './content';
export { questionSchemas } from './question';
export { resultSchemas } from './result';
export { offerSchemas } from './offer';
export { layoutSchemas } from './layout';
export { socialSchemas } from './social';

// Combined schemas (backward compatible)
import { universalSchemas } from './universal';
import { introSchemas } from './intro';
import { contentSchemas } from './content';
import { questionSchemas } from './question';
import { resultSchemas } from './result';
import { offerSchemas } from './offer';
import { layoutSchemas } from './layout';
import { socialSchemas } from './social';

/**
 * 🎯 COMBINED BLOCK SCHEMAS
 * Objeto único com todos os schemas para compatibilidade retroativa
 */
export const blockPropertySchemas = {
  ...universalSchemas,
  ...introSchemas,
  ...contentSchemas,
  ...questionSchemas,
  ...resultSchemas,
  ...offerSchemas,
  ...layoutSchemas,
  ...socialSchemas,
} as const;

export default blockPropertySchemas;

// Canonical entrypoint for block property schemas used by the Editor/Preview
// Prefer importing from here instead of touching individual sources directly.

import type { BlockSchema } from './blockPropertySchemas';
import { completeBlockSchemas, generateFallbackSchema } from './expandedBlockSchemas';

// Fonte canônica de schemas de propriedades
export const propertySchemas: Record<string, BlockSchema> = completeBlockSchemas;

// Helper: obtém schema por tipo com fallback dinâmico quando ausente
export function getPropertySchema(blockType: string): BlockSchema {
  return propertySchemas[blockType] || generateFallbackSchema(blockType);
}

export type { BlockSchema as PropertySchema } from './blockPropertySchemas';

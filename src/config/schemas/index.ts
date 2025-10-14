/**
 * 📚 SCHEMA SYSTEM - Exportação Principal
 * 
 * Sistema modular de schemas com lazy loading e presets reutilizáveis.
 * 
 * @example
 * ```typescript
 * // Usar presets para criar novo schema
 * import { createSchema, titleField, colorFields } from '@/config/schemas';
 * 
 * const mySchema = createSchema('my-block', 'Meu Bloco')
 *   .addField(titleField('content'))
 *   .addFields(...colorFields('style'))
 *   .build();
 * ```
 * 
 * @example
 * ```typescript
 * // Carregar schema dinamicamente
 * import { SchemaAPI } from '@/config/schemas';
 * 
 * const schema = await SchemaAPI.get('headline');
 * ```
 * 
 * @example
 * ```typescript
 * // Pré-carregar schemas críticos
 * import { SchemaAPI } from '@/config/schemas';
 * 
 * await SchemaAPI.preload('headline', 'button', 'options-grid');
 * ```
 */

// Base types and utilities
export * from './base';

// Dynamic registry
export {
  initializeSchemaRegistry,
  getSchema,
  getSchemaSync,
  preloadSchemas,
  hasSchema,
  listSchemaTypes,
  clearSchemaCache,
  getRegistryStats,
  SchemaAPI,
} from './dynamic';

// Exportar schemas individuais para uso direto (opcional)
export { headlineSchema } from './blocks/headline';
export { imageSchema } from './blocks/image';
export { buttonSchema } from './blocks/button';
export { optionsGridSchema } from './blocks/options-grid';
export { urgencyTimerInlineSchema } from './blocks/urgency-timer-inline';

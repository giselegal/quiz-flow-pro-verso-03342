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
// Nota: Para evitar conflitos de empacotamento (módulo importado dinamicamente e estaticamente),
// não exportamos mais schemas individuais diretamente aqui. Utilize o SchemaAPI:
//   const schema = await SchemaAPI.get('headline');
// Isso garante que o carregamento permaneça lazy e sem avisos do Vite.

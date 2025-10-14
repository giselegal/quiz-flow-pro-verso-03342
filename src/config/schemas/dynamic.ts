/**
 * 🔄 DYNAMIC SCHEMA REGISTRY
 * 
 * Sistema de registro de schemas com lazy loading para otimização de bundle.
 * Schemas são carregados sob demanda apenas quando necessários.
 */

import { BlockSchema, SchemaRegistry } from './base/types';

/**
 * Registry global de schemas com lazy loading
 */
const schemaRegistry: SchemaRegistry = new Map();

/**
 * Cache de schemas já carregados
 */
const schemaCache = new Map<string, BlockSchema>();

/**
 * Registra um schema com lazy loading
 */
export function registerSchema(type: string, loader: () => Promise<BlockSchema>): void {
  schemaRegistry.set(type, loader);
}

/**
 * Obtém um schema (carrega sob demanda se necessário)
 */
export async function getSchema(type: string): Promise<BlockSchema | null> {
  // Verifica cache primeiro
  if (schemaCache.has(type)) {
    return schemaCache.get(type)!;
  }

  // Carrega sob demanda
  const loader = schemaRegistry.get(type);
  if (!loader) {
    console.warn(`[SchemaRegistry] Schema não encontrado: ${type}`);
    return null;
  }

  try {
    const schema = await loader();
    schemaCache.set(type, schema);
    return schema;
  } catch (error) {
    console.error(`[SchemaRegistry] Erro ao carregar schema ${type}:`, error);
    return null;
  }
}

/**
 * Obtém schema de forma síncrona (apenas do cache)
 */
export function getSchemaSync(type: string): BlockSchema | null {
  return schemaCache.get(type) || null;
}

/**
 * Pré-carrega múltiplos schemas
 */
export async function preloadSchemas(...types: string[]): Promise<void> {
  await Promise.all(types.map(type => getSchema(type)));
}

/**
 * Verifica se um schema está registrado
 */
export function hasSchema(type: string): boolean {
  return schemaRegistry.has(type);
}

/**
 * Lista todos os tipos de schema registrados
 */
export function listSchemaTypes(): string[] {
  return Array.from(schemaRegistry.keys());
}

/**
 * Limpa o cache de schemas (útil para testes)
 */
export function clearSchemaCache(): void {
  schemaCache.clear();
}

/**
 * Obtém estatísticas do registry
 */
export function getRegistryStats() {
  return {
    registered: schemaRegistry.size,
    cached: schemaCache.size,
    types: listSchemaTypes(),
  };
}

// ============================================================================
// REGISTRO DE SCHEMAS COM LAZY LOADING
// ============================================================================

/**
 * Registra todos os schemas do sistema
 * Cada schema é registrado com uma função de importação dinâmica
 */
export function initializeSchemaRegistry(): void {
  // Blocos básicos
  registerSchema('headline', () => 
    import('./blocks/headline').then(m => m.headlineSchema)
  );
  
  registerSchema('image', () => 
    import('./blocks/image').then(m => m.imageSchema)
  );
  
  registerSchema('button', () => 
    import('./blocks/button').then(m => m.buttonSchema)
  );
  
  registerSchema('options-grid', () => 
    import('./blocks/options-grid').then(m => m.optionsGridSchema)
  );
  
  registerSchema('urgency-timer-inline', () => 
    import('./blocks/urgency-timer-inline').then(m => m.urgencyTimerInlineSchema)
  );

  // TODO: Adicionar mais schemas conforme criados
  // registerSchema('text', () => import('./blocks/text').then(m => m.textSchema));
  // registerSchema('divider', () => import('./blocks/divider').then(m => m.dividerSchema));
  // etc...
}

/**
 * Helper para uso direto em componentes
 */
export const SchemaAPI = {
  get: getSchema,
  getSync: getSchemaSync,
  preload: preloadSchemas,
  has: hasSchema,
  list: listSchemaTypes,
  stats: getRegistryStats,
  clearCache: clearSchemaCache,
};

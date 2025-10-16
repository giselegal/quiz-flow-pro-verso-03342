/**
 * 🔄 LAZY SCHEMA LOADER - SPRINT 3
 * 
 * Carrega schemas de blocos sob demanda para reduzir bundle inicial
 * 
 * ESTRATÉGIA:
 * - Cache em memória de schemas já carregados
 * - Carregamento assíncrono on-demand
 * - Preload de schemas comuns ao iniciar editor
 * 
 * @version 1.0.0
 * @date 2025-01-16
 */

type BlockType = string;

/**
 * Schema básico de bloco (interface simplificada)
 */
export interface BlockSchema {
  type: string;
  properties: Record<string, any>;
  groups: Array<{ name: string; properties: string[] }>;
}

/**
 * Cache global de schemas carregados
 */
const schemaCache = new Map<BlockType, BlockSchema>();

/**
 * Schemas sendo carregados (para evitar carregamento duplicado)
 */
const loadingPromises = new Map<BlockType, Promise<BlockSchema | null>>();

/**
 * Schemas comuns que devem ser preloaded
 */
const COMMON_SCHEMAS: BlockType[] = [
  'text-inline',
  'heading',
  'button-inline',
  'image',
  'quiz-options',
  'container'
];

/**
 * Carrega schema de um tipo de bloco
 */
export async function loadBlockSchema(blockType: BlockType): Promise<BlockSchema | null> {
  // 1. Verificar cache
  if (schemaCache.has(blockType)) {
    return schemaCache.get(blockType)!;
  }
  
  // 2. Verificar se já está sendo carregado
  if (loadingPromises.has(blockType)) {
    return loadingPromises.get(blockType)!;
  }
  
  // 3. Iniciar carregamento
  const loadPromise = loadSchemaFromRegistry(blockType);
  loadingPromises.set(blockType, loadPromise);
  
  try {
    const schema = await loadPromise;
    
    if (schema) {
      schemaCache.set(blockType, schema);
    }
    
    return schema;
  } finally {
    loadingPromises.delete(blockType);
  }
}

/**
 * Carrega schema do registry (simulação - seria import dinâmico)
 */
async function loadSchemaFromRegistry(blockType: BlockType): Promise<BlockSchema | null> {
  try {
    // TODO: Implementar import dinâmico real quando schemas forem modularizados
    // const schema = await import(`@/components/editor/quiz/schema/${blockType}.schema.ts`);
    
    console.log(`📦 Loading schema for: ${blockType}`);
    
    // Por enquanto retorna schema básico
    return {
      type: blockType,
      properties: {},
      groups: []
    };
  } catch (error) {
    console.warn(`⚠️ Failed to load schema for ${blockType}:`, error);
    return null;
  }
}

/**
 * Preload de schemas comuns
 */
export async function preloadCommonSchemas(): Promise<void> {
  console.log('🔄 Preloading common schemas...');
  
  const promises = COMMON_SCHEMAS.map(blockType => loadBlockSchema(blockType));
  
  await Promise.allSettled(promises);
  
  console.log(`✅ Preloaded ${schemaCache.size} schemas`);
}

/**
 * Carrega múltiplos schemas em batch
 */
export async function loadSchemaBatch(blockTypes: BlockType[]): Promise<Map<BlockType, BlockSchema | null>> {
  const results = new Map<BlockType, BlockSchema | null>();
  
  const promises = blockTypes.map(async (blockType) => {
    const schema = await loadBlockSchema(blockType);
    results.set(blockType, schema);
  });
  
  await Promise.allSettled(promises);
  
  return results;
}

/**
 * Retorna schema do cache (síncrono)
 */
export function getCachedSchema(blockType: BlockType): BlockSchema | null {
  return schemaCache.get(blockType) || null;
}

/**
 * Verifica se schema está em cache
 */
export function isSchemaLoaded(blockType: BlockType): boolean {
  return schemaCache.has(blockType);
}

/**
 * Clear de cache de schemas
 */
export function clearSchemaCache(): void {
  schemaCache.clear();
  loadingPromises.clear();
  console.log('🗑️ Schema cache cleared');
}

/**
 * Estatísticas de cache
 */
export function getCacheStats(): {
  cached: number;
  loading: number;
  hitRate: number;
} {
  return {
    cached: schemaCache.size,
    loading: loadingPromises.size,
    hitRate: 0 // TODO: Implementar tracking de hit rate
  };
}

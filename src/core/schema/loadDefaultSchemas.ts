/**
 * 🚀 LOAD DEFAULT SCHEMAS - Sistema de carregamento centralizado
 * 
 * Carrega todos os schemas padrão do sistema ao inicializar
 */

import { schemaInterpreter } from './SchemaInterpreter';
import defaultSchemas from './defaultSchemas.json';
import { loadEditorBlockSchemas } from './loadEditorBlockSchemas';

let isLoaded = false;

/**
 * Inicializa schemas padrão + schemas de blocos do editor
 */
export function loadDefaultSchemas(): void {
  if (isLoaded) return;

  console.log('[SchemaInterpreter] Carregando schemas padrão...');
  schemaInterpreter.loadSchema(defaultSchemas as any);
  
  // Carregar schemas de blocos do editor
  loadEditorBlockSchemas();
  
  isLoaded = true;

  console.log(`[SchemaInterpreter] ✅ ${Object.keys(defaultSchemas.blockTypes).length} tipos de blocos base + blocos do editor carregados`);
}

/**
 * Verifica se schemas estão carregados
 */
export function isSchemasLoaded(): boolean {
  return isLoaded;
}

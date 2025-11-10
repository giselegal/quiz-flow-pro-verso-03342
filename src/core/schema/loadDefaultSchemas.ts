/**
 * 🚀 LOAD DEFAULT SCHEMAS - Sistema de carregamento centralizado
 * 
 * Carrega todos os schemas padrão do sistema ao inicializar
 */

import { schemaInterpreter } from './SchemaInterpreter';
import defaultSchemas from './defaultSchemas.json';
import { loadEditorBlockSchemas } from './loadEditorBlockSchemas';
import { appLogger } from '@/lib/utils/appLogger';

let isLoaded = false;

/**
 * Inicializa schemas padrão + schemas de blocos do editor
 */
export function loadDefaultSchemas(): void {
  if (isLoaded) return;

  appLogger.info('[SchemaInterpreter] Carregando schemas padrão...');
  schemaInterpreter.loadSchema(defaultSchemas as any);
  
  // Carregar schemas de blocos do editor
  loadEditorBlockSchemas();
  
  isLoaded = true;

  appLogger.info(`[SchemaInterpreter] ✅ ${Object.keys(defaultSchemas.blockTypes).length} tipos de blocos base + blocos do editor carregados`);
}

/**
 * Verifica se schemas estão carregados
 */
export function isSchemasLoaded(): boolean {
  return isLoaded;
}

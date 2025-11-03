/**
 * Carrega schemas padrão do sistema
 */

import { schemaInterpreter } from './SchemaInterpreter';
import defaultSchemas from './defaultSchemas.json';

let isLoaded = false;

/**
 * Inicializa schemas padrão
 */
export function loadDefaultSchemas(): void {
  if (isLoaded) return;

  console.log('[SchemaInterpreter] Carregando schemas padrão...');
  schemaInterpreter.loadSchema(defaultSchemas as any);
  isLoaded = true;

  console.log(`[SchemaInterpreter] ✅ ${Object.keys(defaultSchemas.blockTypes).length} tipos de blocos carregados`);
}

/**
 * Verifica se schemas estão carregados
 */
export function isSchemasLoaded(): boolean {
  return isLoaded;
}

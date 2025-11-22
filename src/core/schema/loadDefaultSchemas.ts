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
  
  // Verificar se quiz-intro-header foi registrado (crítico para Properties Panel)
  const quizHeaderSchema = schemaInterpreter.getBlockSchema('quiz-intro-header');
  if (!quizHeaderSchema) {
    appLogger.error('❌ CRÍTICO: quiz-intro-header schema NÃO foi registrado!');
  } else {
    appLogger.info('✅ quiz-intro-header schema REGISTRADO com sucesso', {
      data: [{ 
        type: quizHeaderSchema.type,
        propertyCount: Object.keys(quizHeaderSchema.properties || {}).length,
        properties: Object.keys(quizHeaderSchema.properties || {})
      }],
    });
  }
}

/**
 * Verifica se schemas estão carregados
 */
export function isSchemasLoaded(): boolean {
  return isLoaded;
}

/**
 * 📦 LOAD EDITOR BLOCK SCHEMAS - FASE 5
 * 
 * Carrega schemas de blocos do editor para o SchemaInterpreter
 * Schemas criados para substituir hardcoded COMPONENT_LIBRARY
 */

import { schemaInterpreter } from './SchemaInterpreter';

// Importar schemas JSON
import introLogoSchema from '@/config/schemas/blocks/intro-logo.json';
import introTitleSchema from '@/config/schemas/blocks/intro-title.json';
import introDescriptionSchema from '@/config/schemas/blocks/intro-description.json';
import introImageSchema from '@/config/schemas/blocks/intro-image.json';
import introFormSchema from '@/config/schemas/blocks/intro-form.json';
import questionTitleSchema from '@/config/schemas/blocks/question-title.json';
import questionOptionsGridSchema from '@/config/schemas/blocks/question-options-grid.json';
import resultHeaderSchema from '@/config/schemas/blocks/result-header.json';
import resultDescriptionSchema from '@/config/schemas/blocks/result-description.json';
import resultCtaSchema from '@/config/schemas/blocks/result-cta.json';

/**
 * Carrega todos os schemas de blocos do editor
 */
export function loadEditorBlockSchemas(): void {
  const schemas = [
    introLogoSchema,
    introTitleSchema,
    introDescriptionSchema,
    introImageSchema,
    introFormSchema,
    questionTitleSchema,
    questionOptionsGridSchema,
    resultHeaderSchema,
    resultDescriptionSchema,
    resultCtaSchema,
  ];

  // Converter schemas individuais para formato esperado pelo SchemaInterpreter
  const blockTypes: Record<string, any> = {};
  
  schemas.forEach((schema: any) => {
    blockTypes[schema.type] = {
      type: schema.type,
      category: schema.category,
      label: schema.label,
      description: schema.description,
      properties: schema.properties,
      version: schema.version,
    };
  });

  // Carregar schemas no formato consolidado
  schemaInterpreter.loadSchema({
    version: '1.0.0',
    blockTypes,
  } as any);

  console.log(`[EditorBlockSchemas] ✅ ${schemas.length} schemas de blocos carregados`);
}

/**
 * Auto-load ao importar este módulo
 */
loadEditorBlockSchemas();

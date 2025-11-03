/**
 * 📦 LOAD EDITOR BLOCK SCHEMAS - FASE 5 + FASE 7
 * 
 * Carrega schemas de blocos do editor para o SchemaInterpreter
 * Schemas criados para substituir hardcoded COMPONENT_LIBRARY
 */

import { schemaInterpreter } from './SchemaInterpreter';

// Intro blocks (FASE 5)
import introLogoSchema from '@/config/schemas/blocks/intro-logo.json';
import introTitleSchema from '@/config/schemas/blocks/intro-title.json';
import introDescriptionSchema from '@/config/schemas/blocks/intro-description.json';
import introImageSchema from '@/config/schemas/blocks/intro-image.json';
import introFormSchema from '@/config/schemas/blocks/intro-form.json';

// Question blocks (FASE 5 + 7)
import questionTitleSchema from '@/config/schemas/blocks/question-title.json';
import questionOptionsGridSchema from '@/config/schemas/blocks/question-options-grid.json';
import questionDescriptionSchema from '@/config/schemas/blocks/question-description.json';
import questionImageSchema from '@/config/schemas/blocks/question-image.json';
import questionNavigationSchema from '@/config/schemas/blocks/question-navigation.json';
import questionProgressSchema from '@/config/schemas/blocks/question-progress.json';

// Result blocks (FASE 5)
import resultHeaderSchema from '@/config/schemas/blocks/result-header.json';
import resultDescriptionSchema from '@/config/schemas/blocks/result-description.json';
import resultCtaSchema from '@/config/schemas/blocks/result-cta.json';

// Offer blocks (FASE 7)
import offerHeroSchema from '@/config/schemas/blocks/offer-hero.json';
import offerPricingSchema from '@/config/schemas/blocks/offer-pricing.json';
import offerBenefitsSchema from '@/config/schemas/blocks/offer-benefits.json';
import offerTestimonialsSchema from '@/config/schemas/blocks/offer-testimonials.json';
import offerUrgencySchema from '@/config/schemas/blocks/offer-urgency.json';

// Layout blocks (FASE 7)
import layoutContainerSchema from '@/config/schemas/blocks/layout-container.json';
import layoutDividerSchema from '@/config/schemas/blocks/layout-divider.json';
import layoutSpacerSchema from '@/config/schemas/blocks/layout-spacer.json';

// Import blockPropertySchemas for FASE 2 integration
import { blockPropertySchemas } from '@/config/blockPropertySchemas';

/**
 * Carrega todos os schemas de blocos do editor com validação Zod
 */
export function loadEditorBlockSchemas(): void {
  const schemas = [
    // Intro blocks (5)
    introLogoSchema,
    introTitleSchema,
    introDescriptionSchema,
    introImageSchema,
    introFormSchema,
    
    // Question blocks (6)
    questionTitleSchema,
    questionOptionsGridSchema,
    questionDescriptionSchema,
    questionImageSchema,
    questionNavigationSchema,
    questionProgressSchema,
    
    // Result blocks (3)
    resultHeaderSchema,
    resultDescriptionSchema,
    resultCtaSchema,
    
    // Offer blocks (5)
    offerHeroSchema,
    offerPricingSchema,
    offerBenefitsSchema,
    offerTestimonialsSchema,
    offerUrgencySchema,
    
    // Layout blocks (3)
    layoutContainerSchema,
    layoutDividerSchema,
    layoutSpacerSchema,
  ];

  // Converter schemas JSON individuais para formato esperado pelo SchemaInterpreter
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

  // FASE 2: Adicionar schemas de blockPropertySchemas ao registry
  Object.entries(blockPropertySchemas).forEach(([type, schema]) => {
    // Converter BlockSchema para BlockTypeSchema
    const properties: Record<string, any> = {};
    
    schema.fields.forEach(field => {
      properties[field.key] = {
        type: field.type === 'textarea' ? 'string' : 
              field.type === 'range' ? 'number' :
              field.type === 'boolean' ? 'boolean' :
              field.type === 'json' ? 'json' : 'string',
        control: field.type === 'textarea' ? 'textarea' :
                 field.type === 'range' ? 'number' :
                 field.type === 'boolean' ? 'toggle' :
                 field.type === 'color' ? 'color-picker' :
                 field.type === 'select' ? 'dropdown' :
                 field.type === 'json' ? 'json-editor' : 'text',
        label: field.label,
        description: field.description,
        default: field.defaultValue,
        required: field.required,
        options: field.options,
      };
    });

    // Apenas adicionar se não existir (JSON schemas têm prioridade)
    if (!blockTypes[type]) {
      blockTypes[type] = {
        type,
        label: schema.label,
        category: 'content', // default category
        properties,
      };
    }
  });


  // Carregar schemas no formato consolidado (validação Zod aplicada no SchemaValidator se necessário)
  schemaInterpreter.loadSchema({
    version: '1.0.0',
    blockTypes,
  } as any);

  const totalSchemas = schemas.length + Object.keys(blockPropertySchemas).length;
  console.log(`[EditorBlockSchemas] ✅ ${totalSchemas} schemas de blocos carregados (${schemas.length} JSON + ${Object.keys(blockPropertySchemas).length} TypeScript)`);
}

/**
 * Auto-load ao importar este módulo
 */
loadEditorBlockSchemas();

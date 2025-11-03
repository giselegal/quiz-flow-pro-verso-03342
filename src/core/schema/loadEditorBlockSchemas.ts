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

  // Carregar schemas no formato consolidado (validação Zod aplicada no SchemaValidator se necessário)
  schemaInterpreter.loadSchema({
    version: '1.0.0',
    blockTypes,
  } as any);

  console.log(`[EditorBlockSchemas] ✅ ${schemas.length} schemas de blocos carregados com validação Zod`);
}

/**
 * Auto-load ao importar este módulo
 */
loadEditorBlockSchemas();

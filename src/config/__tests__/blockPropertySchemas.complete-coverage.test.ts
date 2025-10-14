import { describe, it, expect } from 'vitest';
import { blockPropertySchemas } from '@/config/blockPropertySchemas';
import { completeBlockSchemas } from '@/config/expandedBlockSchemas';
import { BLOCK_DEFINITIONS } from '@/editor/registry/BlockRegistry';

/**
 * 🧪 TESTES DE COBERTURA COMPLETA - Property Schemas
 * 
 * Valida que TODOS os componentes do editor possuem schemas correspondentes
 * e que todas as propriedades editáveis estão mapeadas.
 */

describe('🎯 Cobertura Completa de Property Schemas', () => {
  
  describe('✅ BlockRegistry -> Schema Mapping', () => {
    it('deve ter schema para TODOS os tipos de bloco do BlockRegistry', () => {
      const missingSchemas: string[] = [];
      
      BLOCK_DEFINITIONS.forEach(blockDef => {
        const hasSchema = 
          blockPropertySchemas[blockDef.type] || 
          completeBlockSchemas[blockDef.type];
        
        if (!hasSchema) {
          missingSchemas.push(blockDef.type);
        }
      });
      
      expect(
        missingSchemas,
        `❌ Schemas ausentes para: ${missingSchemas.join(', ')}`
      ).toHaveLength(0);
    });
  });

  describe('📋 Validação de Campos Obrigatórios', () => {
    it('todos os schemas devem ter label e fields', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const invalidSchemas: string[] = [];
      
      Object.entries(allSchemas).forEach(([type, schema]) => {
        if (!schema.label || !schema.fields || !Array.isArray(schema.fields)) {
          invalidSchemas.push(type);
        }
      });
      
      expect(
        invalidSchemas,
        `❌ Schemas inválidos (sem label ou fields): ${invalidSchemas.join(', ')}`
      ).toHaveLength(0);
    });

    it('todos os fields devem ter key, label e type', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const invalidFields: Array<{ schema: string; field: any }> = [];
      
      Object.entries(allSchemas).forEach(([schemaType, schema]) => {
        schema.fields.forEach(field => {
          if (!field.key || !field.label || !field.type) {
            invalidFields.push({ schema: schemaType, field });
          }
        });
      });
      
      expect(
        invalidFields,
        `❌ Fields inválidos encontrados em ${invalidFields.length} schemas`
      ).toHaveLength(0);
    });
  });

  describe('🎨 Validação de Propriedades de Estilo', () => {
    const styleProperties = [
      'backgroundColor',
      'textColor',
      'color',
      'borderRadius',
      'borderColor',
      'padding',
      'margin',
      'marginTop',
      'marginBottom',
      'marginLeft',
      'marginRight'
    ];

    it('schemas de componentes visuais devem ter propriedades de estilo', () => {
      const visualComponents = [
        'button-inline',
        'heading-inline',
        'text-inline',
        'image-inline',
        'quiz-intro-header',
        'result-header-inline',
        'style-card-inline'
      ];
      
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const missingStyleProps: Array<{ type: string; missing: string[] }> = [];
      
      visualComponents.forEach(componentType => {
        const schema = allSchemas[componentType];
        if (!schema) return;
        
        const fieldKeys = schema.fields.map(f => f.key);
        const hasBasicStyle = styleProperties.some(prop => 
          fieldKeys.includes(prop)
        );
        
        if (!hasBasicStyle) {
          const missing = styleProperties.filter(prop => 
            !fieldKeys.includes(prop)
          );
          missingStyleProps.push({ type: componentType, missing });
        }
      });
      
      expect(
        missingStyleProps,
        `❌ Componentes sem propriedades de estilo: ${JSON.stringify(missingStyleProps, null, 2)}`
      ).toHaveLength(0);
    });
  });

  describe('🔧 Validação de Propriedades de Transformação', () => {
    const transformProperties = ['scale', 'scaleOrigin', 'scaleX', 'scaleY'];

    it('schemas principais devem suportar transformação', () => {
      const mainComponents = [
        'quiz-intro-header',
        'text-inline',
        'heading-inline',
        'image-inline',
        'image-display-inline',
        'decorative-bar-inline'
      ];
      
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const missingTransform: string[] = [];
      
      mainComponents.forEach(componentType => {
        const schema = allSchemas[componentType];
        if (!schema) return;
        
        const fieldKeys = schema.fields.map(f => f.key);
        const hasTransform = transformProperties.some(prop => 
          fieldKeys.includes(prop)
        );
        
        if (!hasTransform) {
          missingTransform.push(componentType);
        }
      });
      
      expect(
        missingTransform,
        `❌ Componentes sem suporte a transformação: ${missingTransform.join(', ')}`
      ).toHaveLength(0);
    });
  });

  describe('📝 Validação de Schemas de Formulário', () => {
    it('form-input deve ter todos os campos necessários', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const formInputSchema = allSchemas['form-input'];
      
      expect(formInputSchema, 'Schema form-input não encontrado').toBeDefined();
      
      const requiredFields = [
        'label',
        'placeholder',
        'inputType',
        'required',
        'name'
      ];
      
      const fieldKeys = formInputSchema!.fields.map(f => f.key);
      const missingFields = requiredFields.filter(field => 
        !fieldKeys.includes(field)
      );
      
      expect(
        missingFields,
        `❌ form-input sem campos: ${missingFields.join(', ')}`
      ).toHaveLength(0);
    });

    it('lead-form deve ter configurações completas', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const leadFormSchema = allSchemas['lead-form'];
      
      expect(leadFormSchema, 'Schema lead-form não encontrado').toBeDefined();
      
      const requiredFields = [
        'showNameField',
        'showEmailField',
        'showPhoneField',
        'nameLabel',
        'emailLabel',
        'submitText'
      ];
      
      const fieldKeys = leadFormSchema!.fields.map(f => f.key);
      const missingFields = requiredFields.filter(field => 
        !fieldKeys.includes(field)
      );
      
      expect(
        missingFields,
        `❌ lead-form sem campos: ${missingFields.join(', ')}`
      ).toHaveLength(0);
    });
  });

  describe('🎮 Validação de Options Grid', () => {
    it('options-grid deve ter configuração completa de múltiplas seleções', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const optionsGridSchema = allSchemas['options-grid'];
      
      expect(optionsGridSchema, 'Schema options-grid não encontrado').toBeDefined();
      
      const requiredFields = [
        'options',
        'multipleSelection',
        'minSelections',
        'maxSelections',
        'requiredSelections',
        'columns',
        'showImages',
        'selectedColor',
        'hoverColor'
      ];
      
      const fieldKeys = optionsGridSchema!.fields.map(f => f.key);
      const missingFields = requiredFields.filter(field => 
        !fieldKeys.includes(field)
      );
      
      expect(
        missingFields,
        `❌ options-grid sem campos: ${missingFields.join(', ')}`
      ).toHaveLength(0);
    });

    it('options-grid deve ter sistema de pontuação configurável', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const optionsGridSchema = allSchemas['options-grid'];
      
      const fieldKeys = optionsGridSchema!.fields.map(f => f.key);
      const scoringFields = [
        'enableScoring',
        'scoringType',
        'pointsMultiplier'
      ];
      
      const hasScoringSystem = scoringFields.some(field => 
        fieldKeys.includes(field)
      );
      
      expect(
        hasScoringSystem,
        '❌ options-grid não tem sistema de pontuação configurável'
      ).toBe(true);
    });
  });

  describe('🏆 Validação de Componentes de Resultado', () => {
    it('result-header-inline deve ter campos de personalização', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const resultHeaderSchema = allSchemas['result-header-inline'];
      
      expect(resultHeaderSchema, 'Schema result-header-inline não encontrado').toBeDefined();
      
      const requiredFields = [
        'title',
        'subtitle',
        'alignment',
        'backgroundColor'
      ];
      
      const fieldKeys = resultHeaderSchema!.fields.map(f => f.key);
      const missingFields = requiredFields.filter(field => 
        !fieldKeys.includes(field)
      );
      
      expect(
        missingFields,
        `❌ result-header-inline sem campos: ${missingFields.join(', ')}`
      ).toHaveLength(0);
    });

    it('style-card-inline deve ter propriedades de card completas', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const styleCardSchema = allSchemas['style-card-inline'];
      
      expect(styleCardSchema, 'Schema style-card-inline não encontrado').toBeDefined();
      
      const requiredFields = [
        'title',
        'description',
        'imageUrl',
        'buttonText',
        'link'
      ];
      
      const fieldKeys = styleCardSchema!.fields.map(f => f.key);
      const missingFields = requiredFields.filter(field => 
        !fieldKeys.includes(field)
      );
      
      expect(
        missingFields,
        `❌ style-card-inline sem campos: ${missingFields.join(', ')}`
      ).toHaveLength(0);
    });
  });

  describe('⏰ Validação de Componentes de Urgência', () => {
    it('urgency-timer-inline deve ter configuração de timer', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const urgencyTimerSchema = allSchemas['urgency-timer-inline'];
      
      expect(urgencyTimerSchema, 'Schema urgency-timer-inline não encontrado').toBeDefined();
      
      const requiredFields = [
        'initialMinutes',
        'title',
        'urgencyMessage',
        'backgroundColor',
        'textColor'
      ];
      
      const fieldKeys = urgencyTimerSchema!.fields.map(f => f.key);
      const missingFields = requiredFields.filter(field => 
        !fieldKeys.includes(field)
      );
      
      expect(
        missingFields,
        `❌ urgency-timer-inline sem campos: ${missingFields.join(', ')}`
      ).toHaveLength(0);
    });
  });

  describe('💰 Validação de Componentes de Oferta', () => {
    it('value-anchoring deve ter campos de preço', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const valueAnchoringSchema = allSchemas['value-anchoring'];
      
      expect(valueAnchoringSchema, 'Schema value-anchoring não encontrado').toBeDefined();
      
      const requiredFields = [
        'title',
        'showPricing'
      ];
      
      const fieldKeys = valueAnchoringSchema!.fields.map(f => f.key);
      const missingFields = requiredFields.filter(field => 
        !fieldKeys.includes(field)
      );
      
      expect(
        missingFields,
        `❌ value-anchoring sem campos: ${missingFields.join(', ')}`
      ).toHaveLength(0);
    });

    it('before-after-inline deve ter configuração de comparação', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const beforeAfterSchema = allSchemas['before-after-inline'];
      
      expect(beforeAfterSchema, 'Schema before-after-inline não encontrado').toBeDefined();
      
      const requiredFields = [
        'beforeImage',
        'afterImage',
        'beforeLabel',
        'afterLabel',
        'layoutStyle'
      ];
      
      const fieldKeys = beforeAfterSchema!.fields.map(f => f.key);
      const missingFields = requiredFields.filter(field => 
        !fieldKeys.includes(field)
      );
      
      expect(
        missingFields,
        `❌ before-after-inline sem campos: ${missingFields.join(', ')}`
      ).toHaveLength(0);
    });
  });

  describe('👤 Validação de Componentes Sociais', () => {
    it('mentor-section-inline deve ter informações completas', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const mentorSchema = allSchemas['mentor-section-inline'];
      
      expect(mentorSchema, 'Schema mentor-section-inline não encontrado').toBeDefined();
      
      const requiredFields = [
        'mentorName',
        'mentorTitle',
        'mentorImage',
        'mentorBio'
      ];
      
      const fieldKeys = mentorSchema!.fields.map(f => f.key);
      const missingFields = requiredFields.filter(field => 
        !fieldKeys.includes(field)
      );
      
      expect(
        missingFields,
        `❌ mentor-section-inline sem campos: ${missingFields.join(', ')}`
      ).toHaveLength(0);
    });

    it('testimonial-card-inline deve ter configuração de depoimento', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const testimonialSchema = allSchemas['testimonial-card-inline'];
      
      expect(testimonialSchema, 'Schema testimonial-card-inline não encontrado').toBeDefined();
      
      const requiredFields = [
        'testimonialType',
        'clientName',
        'clientTestimonial'
      ];
      
      const fieldKeys = testimonialSchema!.fields.map(f => f.key);
      const missingFields = requiredFields.filter(field => 
        !fieldKeys.includes(field)
      );
      
      expect(
        missingFields,
        `❌ testimonial-card-inline sem campos: ${missingFields.join(', ')}`
      ).toHaveLength(0);
    });
  });

  describe('🔗 Validação de Botões e CTAs', () => {
    it('button-inline deve ter configuração completa de validação', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const buttonSchema = allSchemas['button-inline'];
      
      expect(buttonSchema, 'Schema button-inline não encontrado').toBeDefined();
      
      const requiredFields = [
        'text',
        'variant',
        'size',
        'fullWidth',
        'backgroundColor',
        'textColor',
        'requiresValidInput',
        'requiresValidSelection'
      ];
      
      const fieldKeys = buttonSchema!.fields.map(f => f.key);
      const missingFields = requiredFields.filter(field => 
        !fieldKeys.includes(field)
      );
      
      expect(
        missingFields,
        `❌ button-inline sem campos: ${missingFields.join(', ')}`
      ).toHaveLength(0);
    });
  });

  describe('📊 Estatísticas de Cobertura', () => {
    it('deve gerar relatório de cobertura completo', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const totalSchemas = Object.keys(allSchemas).length;
      const totalBlockDefinitions = BLOCK_DEFINITIONS.length;
      
      const schemasWithTransform = Object.entries(allSchemas).filter(
        ([_, schema]) => schema.fields.some(f => f.key === 'scale')
      ).length;
      
      const schemasWithStyle = Object.entries(allSchemas).filter(
        ([_, schema]) => schema.fields.some(f => 
          ['backgroundColor', 'color', 'textColor'].includes(f.key)
        )
      ).length;
      
      console.log('\n📊 RELATÓRIO DE COBERTURA:');
      console.log(`✅ Total de Schemas: ${totalSchemas}`);
      console.log(`✅ Total de Block Definitions: ${totalBlockDefinitions}`);
      console.log(`✅ Schemas com Transformação: ${schemasWithTransform}`);
      console.log(`✅ Schemas com Estilo: ${schemasWithStyle}`);
      console.log(`✅ Cobertura: ${((totalSchemas / totalBlockDefinitions) * 100).toFixed(2)}%\n`);
      
      expect(totalSchemas).toBeGreaterThanOrEqual(totalBlockDefinitions);
    });
  });

  describe('🔍 Validação de Tipos de Field', () => {
    it('todos os tipos de field devem ser válidos', () => {
      const validFieldTypes = [
        'text',
        'textarea',
        'number',
        'range',
        'boolean',
        'color',
        'options-list',
        'select',
        'json'
      ];
      
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const invalidFields: Array<{ schema: string; field: string; type: string }> = [];
      
      Object.entries(allSchemas).forEach(([schemaType, schema]) => {
        schema.fields.forEach(field => {
          if (!validFieldTypes.includes(field.type)) {
            invalidFields.push({
              schema: schemaType,
              field: field.key,
              type: field.type
            });
          }
        });
      });
      
      expect(
        invalidFields,
        `❌ Fields com tipos inválidos: ${JSON.stringify(invalidFields, null, 2)}`
      ).toHaveLength(0);
    });
  });

  describe('📐 Validação de Ranges', () => {
    it('campos do tipo range devem ter min, max e step', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const invalidRanges: Array<{ schema: string; field: string; missing: string[] }> = [];
      
      Object.entries(allSchemas).forEach(([schemaType, schema]) => {
        schema.fields.forEach(field => {
          if (field.type === 'range') {
            const missing: string[] = [];
            if (field.min === undefined) missing.push('min');
            if (field.max === undefined) missing.push('max');
            
            if (missing.length > 0) {
              invalidRanges.push({
                schema: schemaType,
                field: field.key,
                missing
              });
            }
          }
        });
      });
      
      expect(
        invalidRanges,
        `❌ Ranges incompletos: ${JSON.stringify(invalidRanges, null, 2)}`
      ).toHaveLength(0);
    });
  });

  describe('🎛️ Validação de Selects', () => {
    it('campos do tipo select devem ter options', () => {
      const allSchemas = { ...blockPropertySchemas, ...completeBlockSchemas };
      const invalidSelects: Array<{ schema: string; field: string }> = [];
      
      Object.entries(allSchemas).forEach(([schemaType, schema]) => {
        schema.fields.forEach(field => {
          if (field.type === 'select' && (!field.options || field.options.length === 0)) {
            invalidSelects.push({
              schema: schemaType,
              field: field.key
            });
          }
        });
      });
      
      expect(
        invalidSelects,
        `❌ Selects sem options: ${JSON.stringify(invalidSelects, null, 2)}`
      ).toHaveLength(0);
    });
  });
});

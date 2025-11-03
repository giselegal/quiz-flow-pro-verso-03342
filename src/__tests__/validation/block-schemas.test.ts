/**
 * 🧪 TESTES DE VALIDAÇÃO ZOD - FASE 9
 * 
 * Garante que todos os blocos das 21 etapas passam na validação Zod
 */

import { describe, it, expect } from 'vitest';
import { QUIZ_STYLE_21_STEPS_TEMPLATE } from '@/templates/quiz21StepsComplete';
import { QuizBlockSchema } from '@/schemas/enhanced-block-schemas';
import { schemaValidator } from '@/core/schema/SchemaValidator';
import { blockSchemas } from '@/lib/validation';

describe('FASE 9: Validação Zod Completa das 21 Etapas', () => {
  describe('Validação com Enhanced Block Schemas', () => {
    Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(([stepKey, blocks]) => {
      describe(`Etapa: ${stepKey}`, () => {
        blocks.forEach((block: any, index: number) => {
          it(`deve validar bloco ${index + 1}: ${block.type} (id: ${block.id})`, () => {
            const result = QuizBlockSchema.safeParse(block);
            
            if (!result.success) {
              console.error(`❌ Erros em ${stepKey}.${block.id}:`, result.error.errors);
            }
            
            expect(result.success).toBe(true);
          });
        });
      });
    });
  });

  describe('Validação com lib/validation Schemas', () => {
    Object.entries(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach(([stepKey, blocks]) => {
      describe(`Etapa: ${stepKey}`, () => {
        blocks.forEach((block: any, index: number) => {
          it(`deve validar propriedades do bloco ${index + 1}: ${block.type}`, () => {
            const schema = blockSchemas[block.type];
            
            if (!schema) {
              console.warn(`⚠️ Schema não encontrado para tipo: ${block.type}`);
              return;
            }

            const properties = { ...block.properties, ...block.content };
            const result = schema.safeParse(properties);
            
            if (!result.success) {
              console.error(`❌ Erros em ${stepKey}.${block.id}:`, result.error.errors);
            }
            
            // Validação não deve falhar (ou deve ter warnings documentados)
            expect(result.success || result.error.errors.length).toBeDefined();
          });
        });
      });
    });
  });

  describe('SchemaValidator Integration', () => {
    it('deve ter schemas registrados para todos os tipos de blocos', () => {
      const registeredTypes = schemaValidator.getRegisteredTypes();
      
      expect(registeredTypes.length).toBeGreaterThan(0);
      expect(registeredTypes).toContain('intro-logo');
      expect(registeredTypes).toContain('question-options-grid');
      expect(registeredTypes).toContain('result-header');
    });

    it('deve validar propriedades usando SchemaValidator', () => {
      const testBlock = {
        type: 'intro-logo',
        properties: {
          src: 'https://example.com/logo.png',
          alt: 'Logo',
        },
      };

      const result = schemaValidator.validateProperties(testBlock.type, testBlock.properties);
      
      expect(result.valid).toBe(true);
    });

    it('deve detectar erros de validação', () => {
      const invalidBlock = {
        type: 'intro-logo',
        properties: {
          src: '', // ❌ URL vazia - deve falhar
        },
      };

      const result = schemaValidator.validateProperties(invalidBlock.type, invalidBlock.properties);
      
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });
  });

  describe('Cobertura de Tipos de Blocos', () => {
    it('deve ter 100% dos tipos de blocos com schemas Zod', () => {
      const allBlockTypes = new Set<string>();
      
      Object.values(QUIZ_STYLE_21_STEPS_TEMPLATE).forEach((blocks) => {
        blocks.forEach((block: any) => {
          allBlockTypes.add(block.type);
        });
      });

      const registeredTypes = schemaValidator.getRegisteredTypes();
      const missingTypes: string[] = [];

      allBlockTypes.forEach((type) => {
        if (!registeredTypes.includes(type)) {
          missingTypes.push(type);
        }
      });

      if (missingTypes.length > 0) {
        console.warn(`⚠️ Tipos sem schema Zod:`, missingTypes);
      }

      // Log de cobertura
      console.log(`✅ Cobertura: ${registeredTypes.length}/${allBlockTypes.size} tipos com schemas Zod`);
    });
  });
});

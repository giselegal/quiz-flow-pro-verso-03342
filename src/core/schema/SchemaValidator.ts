/**
 * 🔒 SCHEMA VALIDATOR - FASE 9: Validação Zod Completa
 * 
 * Bridge entre SchemaInterpreter e Zod para validação em runtime
 * Garante que todos os blocos passem por validação antes de serem registrados
 */

import { schemaInterpreter } from './SchemaInterpreter';
import { QuizBlockSchema } from '@/schemas/enhanced-block-schemas';
import { blockSchemas } from '@/lib/validation';
import { z } from 'zod';

export interface ValidationResult {
  valid: boolean;
  errors?: Array<{
    path: string;
    message: string;
  }>;
}

/**
 * Validador de schemas com integração Zod
 */
export class SchemaValidator {
  /**
   * Valida um bloco usando Zod antes de registrar no SchemaInterpreter
   */
  validateAndRegister(blockData: any): ValidationResult {
    try {
      // Tentar validação com enhanced-block-schemas primeiro
      const enhancedValidation = QuizBlockSchema.safeParse(blockData);
      
      if (enhancedValidation.success) {
        // Registrar no SchemaInterpreter apenas se válido
        schemaInterpreter.loadSchema({ 
          version: '1.0.0',
          blockTypes: { [blockData.type]: enhancedValidation.data } 
        } as any);
        
        return { valid: true };
      }

      // Se falhou com enhanced, tentar com lib/validation schemas
      const specificSchema = blockSchemas[blockData.type];
      if (specificSchema) {
        const specificValidation = specificSchema.safeParse(blockData.properties || blockData);
        
        if (specificValidation.success) {
          schemaInterpreter.loadSchema({ 
            version: '1.0.0',
            blockTypes: { [blockData.type]: blockData } 
          } as any);
          
          return { valid: true };
        }

        return {
          valid: false,
          errors: specificValidation.error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
          })),
        };
      }

      // Se não encontrou schema específico, retornar erros do enhanced
      return {
        valid: false,
        errors: enhancedValidation.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    } catch (error) {
      return {
        valid: false,
        errors: [{ path: '', message: `Erro de validação: ${error}` }],
      };
    }
  }

  /**
   * Valida múltiplos blocos em lote
   */
  validateBatch(blocks: any[]): Array<ValidationResult & { blockType: string; blockId?: string }> {
    return blocks.map(block => ({
      ...this.validateAndRegister(block),
      blockType: block.type,
      blockId: block.id,
    }));
  }

  /**
   * Valida propriedades de um bloco sem registrar
   */
  validateProperties(blockType: string, properties: Record<string, any>): ValidationResult {
    const schema = blockSchemas[blockType];
    
    if (!schema) {
      return {
        valid: false,
        errors: [{ path: '', message: `Schema não encontrado para tipo: ${blockType}` }],
      };
    }

    try {
      const result = schema.safeParse(properties);
      
      if (result.success) {
        return { valid: true };
      }

      return {
        valid: false,
        errors: result.error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        })),
      };
    } catch (error) {
      return {
        valid: false,
        errors: [{ path: '', message: `Erro de validação: ${error}` }],
      };
    }
  }

  /**
   * Obtém schema Zod para um tipo de bloco
   */
  getSchema(blockType: string): z.ZodSchema | null {
    return blockSchemas[blockType] || null;
  }

  /**
   * Lista todos os tipos de blocos com schemas Zod registrados
   */
  getRegisteredTypes(): string[] {
    return Object.keys(blockSchemas);
  }
}

// Instância singleton
export const schemaValidator = new SchemaValidator();

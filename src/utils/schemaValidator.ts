// @ts-nocheck
/**
 * 🔄 CONSOLIDATION UPDATE:
 * - SchemaValidationError agora usa tipos unificados de @/types/core  
 * - Mantém funcionalidades existentes com tipos consolidados
 */
import { DetailedValidationError } from '@/types/core';

// Re-export for backward compatibility
export type SchemaValidationError = DetailedValidationError;

export class SchemaValidator {
  static validateFunnelPage(page: any): SchemaValidationError[] {
    const errors: SchemaValidationError[] = [];

    if (!page.id) {
      errors.push({
        field: 'id',
        message: 'ID da página é obrigatório',
        severity: 'error',
      });
    }

    if (!page.blocks || !Array.isArray(page.blocks)) {
      errors.push({
        field: 'blocks',
        message: 'Página deve conter array de blocos',
        severity: 'error',
      });
    }

    page.blocks?.forEach((block: any, index: number) => {
      if (!block.type) {
        errors.push({
          field: `blocks[${index}].type`,
          message: 'Tipo do bloco é obrigatório',
          severity: 'error',
        });
      }

      if (!block.id) {
        errors.push({
          field: `blocks[${index}].id`,
          message: 'ID do bloco é obrigatório',
          severity: 'error',
        });
      }
    });

    return errors;
  }

  static validateQuizData(quizData: any): SchemaValidationError[] {
    const errors: SchemaValidationError[] = [];

    if (!quizData.questions || quizData.questions.length === 0) {
      errors.push({
        field: 'questions',
        message: 'Quiz deve ter pelo menos uma questão',
        severity: 'error',
      });
    }

    return errors;
  }
}

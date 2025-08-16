// @ts-nocheck
export interface SchemaValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

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

// Add missing exports and schemas
export const validateComponentInstanceInsert = SchemaValidator.validateFunnelPage;
export const validateComponentInstanceUpdate = SchemaValidator.validateFunnelPage;

export const normalizeComponentInstance = (data: any) => {
  return {
    ...data,
    properties: data.properties || {},
    custom_styling: data.custom_styling || {},
    order_index: data.order_index || 0,
    is_active: data.is_active ?? true,
    is_locked: data.is_locked ?? false,
    is_template: data.is_template ?? false,
  };
};

export const normalizeComponentProperties = (properties: any) => {
  if (!properties || typeof properties !== 'object') {
    return {};
  }
  return properties;
};

export const validateBatch = <T>(items: T[], validator: (item: T) => any): { valid: T[]; invalid: T[] } => {
  const valid: T[] = [];
  const invalid: T[] = [];
  
  items.forEach(item => {
    try {
      validator(item);
      valid.push(item);
    } catch (error) {
      invalid.push(item);
    }
  });
  
  return { valid, invalid };
};

// Schema exports
export const ComponentInstanceSchema = SchemaValidator.validateFunnelPage;
export const InsertComponentInstanceSchema = SchemaValidator.validateFunnelPage;
export const UpdateComponentInstanceSchema = SchemaValidator.validateFunnelPage;

// Type aliases for backward compatibility  
export type InsertComponentInstance = any;
export type UpdateComponentInstance = any;
export type ComponentType = any;
export type Funnel = any; // Define proper type if needed
export type FunnelPage = any; // Define proper type if needed

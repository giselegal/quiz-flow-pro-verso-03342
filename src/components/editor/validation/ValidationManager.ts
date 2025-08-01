/**
 * Sistema de Validação de Tipos e Dados
 * Validação robusta para propriedades de blocos e dados do quiz
 */

import { BlockData } from '../../../types/blocks';

// Tipos de validação
export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
};

export type ValidationError = {
  field: string;
  message: string;
  code: string;
  severity: 'error' | 'warning';
};

export type ValidationWarning = {
  field: string;
  message: string;
  code: string;
  suggestion?: string;
};

// Esquemas de validação para diferentes tipos de bloco
export interface BlockValidationSchema {
  type: string;
  requiredFields: string[];
  optionalFields: string[];
  fieldValidators: Record<string, FieldValidator>;
  customValidators?: CustomValidator[];
}

export interface FieldValidator {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'url' | 'color' | 'email';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  allowedValues?: any[];
  customValidator?: (value: any) => boolean;
  errorMessage?: string;
}

export interface CustomValidator {
  name: string;
  validator: (block: BlockData) => ValidationResult;
  description: string;
}

/**
 * Classe principal para validação de dados
 */
export class ValidationManager {
  private static instance: ValidationManager;
  private schemas: Map<string, BlockValidationSchema> = new Map();
  
  private constructor() {
    this.initializeSchemas();
  }
  
  public static getInstance(): ValidationManager {
    if (!ValidationManager.instance) {
      ValidationManager.instance = new ValidationManager();
    }
    return ValidationManager.instance;
  }

  /**
   * Valida um bloco completo
   */
  public validateBlock(block: BlockData): ValidationResult {
    const schema = this.schemas.get(block.type);
    if (!schema) {
      return {
        isValid: false,
        errors: [{
          field: 'type',
          message: `Tipo de bloco desconhecido: ${block.type}`,
          code: 'UNKNOWN_BLOCK_TYPE',
          severity: 'error'
        }],
        warnings: []
      };
    }

    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Validar campos obrigatórios
    this.validateRequiredFields(block, schema, result);
    
    // Validar tipos e valores dos campos
    this.validateFieldTypes(block, schema, result);
    
    // Executar validadores customizados
    this.executeCustomValidators(block, schema, result);
    
    // Verificar se há erros
    result.isValid = result.errors.length === 0;
    
    return result;
  }

  /**
   * Valida múltiplos blocos
   */
  public validateBlocks(blocks: BlockData[]): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    blocks.forEach((block, index) => {
      const blockResult = this.validateBlock(block);
      
      // Adicionar prefixo do índice aos erros e avisos
      blockResult.errors.forEach(error => {
        result.errors.push({
          ...error,
          field: `blocks[${index}].${error.field}`
        });
      });
      
      blockResult.warnings.forEach(warning => {
        result.warnings.push({
          ...warning,
          field: `blocks[${index}].${warning.field}`
        });
      });
    });

    // Validações globais
    this.validateGlobalConstraints(blocks, result);
    
    result.isValid = result.errors.length === 0;
    return result;
  }

  /**
   * Valida um campo específico
   */
  public validateField(value: any, validator: FieldValidator): ValidationResult {
    const result: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Verificar se é obrigatório
    if (validator.required && (value === undefined || value === null || value === '')) {
      result.errors.push({
        field: 'value',
        message: validator.errorMessage || 'Campo obrigatório',
        code: 'REQUIRED_FIELD',
        severity: 'error'
      });
      result.isValid = false;
      return result;
    }

    // Se valor está vazio e não é obrigatório, pular validação
    if (value === undefined || value === null || value === '') {
      return result;
    }

    // Validar tipo
    if (!this.validateFieldType(value, validator.type)) {
      result.errors.push({
        field: 'value',
        message: validator.errorMessage || `Tipo inválido. Esperado: ${validator.type}`,
        code: 'INVALID_TYPE',
        severity: 'error'
      });
      result.isValid = false;
      return result;
    }

    // Validações específicas por tipo
    this.validateFieldConstraints(value, validator, result);
    
    result.isValid = result.errors.length === 0;
    return result;
  }

  /**
   * Registra um novo esquema de validação
   */
  public registerSchema(schema: BlockValidationSchema): void {
    this.schemas.set(schema.type, schema);
  }

  /**
   * Obtém um esquema de validação
   */
  public getSchema(blockType: string): BlockValidationSchema | undefined {
    return this.schemas.get(blockType);
  }

  /**
   * Inicializa os esquemas de validação padrão
   */
  private initializeSchemas(): void {
    // Schema para HeaderBlock
    this.registerSchema({
      type: 'HeaderBlock',
      requiredFields: ['title'],
      optionalFields: ['subtitle', 'alignment', 'titleColor', 'subtitleColor', 'backgroundColor', 'titleSize', 'subtitleSize', 'spacing'],
      fieldValidators: {
        title: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 200,
          errorMessage: 'Título deve ter entre 1 e 200 caracteres'
        },
        subtitle: {
          type: 'string',
          maxLength: 300,
          errorMessage: 'Subtítulo deve ter no máximo 300 caracteres'
        },
        alignment: {
          type: 'string',
          allowedValues: ['left', 'center', 'right'],
          errorMessage: 'Alinhamento deve ser left, center ou right'
        },
        titleColor: {
          type: 'color',
          errorMessage: 'Cor do título deve ser um valor hexadecimal válido'
        },
        subtitleColor: {
          type: 'color',
          errorMessage: 'Cor do subtítulo deve ser um valor hexadecimal válido'
        }
      }
    });

    // Schema para TextBlock
    this.registerSchema({
      type: 'TextBlock',
      requiredFields: ['content'],
      optionalFields: ['alignment', 'fontSize', 'color', 'backgroundColor', 'padding', 'maxWidth', 'margin'],
      fieldValidators: {
        content: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 5000,
          errorMessage: 'Conteúdo deve ter entre 1 e 5000 caracteres'
        },
        alignment: {
          type: 'string',
          allowedValues: ['left', 'center', 'right', 'justify'],
          errorMessage: 'Alinhamento deve ser left, center, right ou justify'
        },
        fontSize: {
          type: 'string',
          pattern: /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl)$/,
          errorMessage: 'Tamanho da fonte deve seguir o padrão Tailwind CSS'
        },
        color: {
          type: 'color',
          errorMessage: 'Cor deve ser um valor hexadecimal válido'
        }
      }
    });

    // Schema para ImageBlock
    this.registerSchema({
      type: 'ImageBlock',
      requiredFields: ['src', 'alt'],
      optionalFields: ['width', 'height', 'alignment', 'borderRadius', 'shadow', 'margin'],
      fieldValidators: {
        src: {
          type: 'url',
          required: true,
          errorMessage: 'URL da imagem é obrigatória e deve ser válida'
        },
        alt: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 200,
          errorMessage: 'Texto alternativo é obrigatório e deve ter entre 1 e 200 caracteres'
        },
        width: {
          type: 'string',
          pattern: /^\d+(px|%|rem|em)$/,
          errorMessage: 'Largura deve ser um valor CSS válido (ex: 300px, 50%, 20rem)'
        },
        height: {
          type: 'string',
          pattern: /^\d+(px|%|rem|em)$/,
          errorMessage: 'Altura deve ser um valor CSS válido (ex: 200px, 50%, 15rem)'
        }
      }
    });

    // Schema para ButtonBlock
    this.registerSchema({
      type: 'ButtonBlock',
      requiredFields: ['text'],
      optionalFields: ['color', 'hoverColor', 'textColor', 'size', 'borderRadius', 'alignment', 'action', 'url'],
      fieldValidators: {
        text: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 100,
          errorMessage: 'Texto do botão deve ter entre 1 e 100 caracteres'
        },
        color: {
          type: 'string',
          errorMessage: 'Cor deve ser uma classe CSS válida'
        },
        action: {
          type: 'string',
          allowedValues: ['next-step', 'previous-step', 'submit', 'external-link', 'custom'],
          errorMessage: 'Ação deve ser uma das opções válidas'
        },
        url: {
          type: 'url',
          errorMessage: 'URL deve ser válida quando especificada'
        }
      }
    });

    // Schema para QuizQuestionBlock
    this.registerSchema({
      type: 'QuizQuestionBlock',
      requiredFields: ['question', 'options'],
      optionalFields: ['questionNumber', 'totalQuestions', 'allowMultiple', 'required', 'buttonText', 'buttonColor'],
      fieldValidators: {
        question: {
          type: 'string',
          required: true,
          minLength: 5,
          maxLength: 500,
          errorMessage: 'Pergunta deve ter entre 5 e 500 caracteres'
        },
        options: {
          type: 'array',
          required: true,
          errorMessage: 'Opções são obrigatórias'
        },
        questionNumber: {
          type: 'number',
          min: 1,
          max: 100,
          errorMessage: 'Número da questão deve estar entre 1 e 100'
        },
        totalQuestions: {
          type: 'number',
          min: 1,
          max: 100,
          errorMessage: 'Total de questões deve estar entre 1 e 100'
        }
      },
      customValidators: [
        {
          name: 'validateOptions',
          description: 'Valida se as opções têm a estrutura correta',
          validator: (block: BlockData) => {
            const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
            const options = block.properties?.options;
            
            if (!Array.isArray(options) || options.length < 2) {
              result.errors.push({
                field: 'options',
                message: 'Deve haver pelo menos 2 opções',
                code: 'MIN_OPTIONS',
                severity: 'error'
              });
              result.isValid = false;
            }
            
            options?.forEach((option: any, index: number) => {
              if (!option.text || typeof option.text !== 'string') {
                result.errors.push({
                  field: `options[${index}].text`,
                  message: 'Texto da opção é obrigatório',
                  code: 'MISSING_OPTION_TEXT',
                  severity: 'error'
                });
                result.isValid = false;
              }
              
              if (!option.value) {
                result.errors.push({
                  field: `options[${index}].value`,
                  message: 'Valor da opção é obrigatório',
                  code: 'MISSING_OPTION_VALUE',
                  severity: 'error'
                });
                result.isValid = false;
              }
            });
            
            return result;
          }
        }
      ]
    });

    // Schema para NameInputBlock
    this.registerSchema({
      type: 'NameInputBlock',
      requiredFields: ['label', 'buttonText'],
      optionalFields: ['placeholder', 'required', 'buttonColor', 'buttonHoverColor', 'alignment', 'maxWidth', 'margin'],
      fieldValidators: {
        label: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 100,
          errorMessage: 'Label deve ter entre 1 e 100 caracteres'
        },
        buttonText: {
          type: 'string',
          required: true,
          minLength: 1,
          maxLength: 50,
          errorMessage: 'Texto do botão deve ter entre 1 e 50 caracteres'
        },
        placeholder: {
          type: 'string',
          maxLength: 100,
          errorMessage: 'Placeholder deve ter no máximo 100 caracteres'
        }
      }
    });
  }

  /**
   * Valida campos obrigatórios
   */
  private validateRequiredFields(block: BlockData, schema: BlockValidationSchema, result: ValidationResult): void {
    schema.requiredFields.forEach(field => {
      const value = block.properties?.[field];
      if (value === undefined || value === null || value === '') {
        result.errors.push({
          field,
          message: `Campo obrigatório: ${field}`,
          code: 'REQUIRED_FIELD',
          severity: 'error'
        });
      }
    });
  }

  /**
   * Valida tipos e valores dos campos
   */
  private validateFieldTypes(block: BlockData, schema: BlockValidationSchema, result: ValidationResult): void {
    if (!block.properties) return;

    Object.entries(block.properties).forEach(([field, value]) => {
      const validator = schema.fieldValidators[field];
      if (validator && value !== undefined && value !== null && value !== '') {
        const fieldResult = this.validateField(value, validator);
        
        fieldResult.errors.forEach(error => {
          result.errors.push({
            ...error,
            field
          });
        });
        
        fieldResult.warnings.forEach(warning => {
          result.warnings.push({
            ...warning,
            field
          });
        });
      }
    });
  }

  /**
   * Executa validadores customizados
   */
  private executeCustomValidators(block: BlockData, schema: BlockValidationSchema, result: ValidationResult): void {
    if (!schema.customValidators) return;

    schema.customValidators.forEach(customValidator => {
      const customResult = customValidator.validator(block);
      result.errors.push(...customResult.errors);
      result.warnings.push(...customResult.warnings);
    });
  }

  /**
   * Valida tipo de campo
   */
  private validateFieldType(value: any, type: string): boolean {
    switch (type) {
      case 'string':
        return typeof value === 'string';
      case 'number':
        return typeof value === 'number' && !isNaN(value);
      case 'boolean':
        return typeof value === 'boolean';
      case 'array':
        return Array.isArray(value);
      case 'object':
        return typeof value === 'object' && value !== null && !Array.isArray(value);
      case 'url':
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      case 'color':
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      default:
        return true;
    }
  }

  /**
   * Valida restrições específicas do campo
   */
  private validateFieldConstraints(value: any, validator: FieldValidator, result: ValidationResult): void {
    // Validar comprimento mínimo/máximo para strings
    if (validator.type === 'string' && typeof value === 'string') {
      if (validator.minLength && value.length < validator.minLength) {
        result.errors.push({
          field: 'value',
          message: validator.errorMessage || `Comprimento mínimo: ${validator.minLength}`,
          code: 'MIN_LENGTH',
          severity: 'error'
        });
      }
      
      if (validator.maxLength && value.length > validator.maxLength) {
        result.errors.push({
          field: 'value',
          message: validator.errorMessage || `Comprimento máximo: ${validator.maxLength}`,
          code: 'MAX_LENGTH',
          severity: 'error'
        });
      }
    }

    // Validar valor mínimo/máximo para números
    if (validator.type === 'number' && typeof value === 'number') {
      if (validator.min !== undefined && value < validator.min) {
        result.errors.push({
          field: 'value',
          message: validator.errorMessage || `Valor mínimo: ${validator.min}`,
          code: 'MIN_VALUE',
          severity: 'error'
        });
      }
      
      if (validator.max !== undefined && value > validator.max) {
        result.errors.push({
          field: 'value',
          message: validator.errorMessage || `Valor máximo: ${validator.max}`,
          code: 'MAX_VALUE',
          severity: 'error'
        });
      }
    }

    // Validar padrão regex
    if (validator.pattern && typeof value === 'string') {
      if (!validator.pattern.test(value)) {
        result.errors.push({
          field: 'value',
          message: validator.errorMessage || 'Formato inválido',
          code: 'INVALID_PATTERN',
          severity: 'error'
        });
      }
    }

    // Validar valores permitidos
    if (validator.allowedValues && !validator.allowedValues.includes(value)) {
      result.errors.push({
        field: 'value',
        message: validator.errorMessage || `Valor deve ser um dos: ${validator.allowedValues.join(', ')}`,
        code: 'INVALID_VALUE',
        severity: 'error'
      });
    }

    // Validador customizado
    if (validator.customValidator && !validator.customValidator(value)) {
      result.errors.push({
        field: 'value',
        message: validator.errorMessage || 'Valor inválido',
        code: 'CUSTOM_VALIDATION_FAILED',
        severity: 'error'
      });
    }
  }

  /**
   * Valida restrições globais
   */
  private validateGlobalConstraints(blocks: BlockData[], result: ValidationResult): void {
    // Verificar IDs únicos
    const ids = new Set<string>();
    blocks.forEach((block, index) => {
      if (ids.has(block.id)) {
        result.errors.push({
          field: `blocks[${index}].id`,
          message: `ID duplicado: ${block.id}`,
          code: 'DUPLICATE_ID',
          severity: 'error'
        });
      }
      ids.add(block.id);
    });

    // Verificar ordem sequencial
    const orders = blocks.map(block => block.order).sort((a, b) => a - b);
    for (let i = 0; i < orders.length; i++) {
      if (orders[i] !== i) {
        result.warnings.push({
          field: 'blocks',
          message: 'Ordem dos blocos não é sequencial',
          code: 'NON_SEQUENTIAL_ORDER',
          suggestion: 'Considere reordenar os blocos para manter sequência'
        });
        break;
      }
    }
  }
}

// Exportar instância singleton
export const validationManager = ValidationManager.getInstance();
/**
 * ✅ STEP VALIDATOR
 * 
 * Sistema de validação para steps do editor.
 * Resolve GARGALO #6: Ausência de sistema de validação
 * 
 * BENEFÍCIOS:
 * ✅ Previne dados corrompidos
 * ✅ Feedback visual de erros
 * ✅ Validação em tempo real
 * ✅ Regras customizáveis por tipo
 */

import { z } from 'zod';
import type { EditorStep, SupportedStepType } from '../types/EditorStepTypes';

// 🎯 Resultado da validação
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
  code: string;
}

// 🔧 Schema base para todos os steps
const baseStepSchema = z.object({
  id: z.string().min(1, 'ID é obrigatório'),
  order: z.number().min(0, 'Ordem deve ser não-negativa'),
  type: z.string().min(1, 'Tipo é obrigatório'),
  meta: z.object({
    isLocked: z.boolean(),
    isVisible: z.boolean(),
    isCollapsed: z.boolean(),
    validationState: z.enum(['valid', 'invalid', 'warning', 'pending']),
    validationErrors: z.array(z.string()),
    lastModified: z.number(),
    hasUnsavedChanges: z.boolean()
  })
});

// 🎭 Schema para IntroStep
const introStepDataSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  buttonText: z.string().default('Começar'),
  image: z.string().url().optional(),
});

// ❓ Schema para QuestionStep
const questionStepDataSchema = z.object({
  title: z.string().min(1, 'Pergunta é obrigatória'),
  subtitle: z.string().optional(),
  options: z.array(z.object({
    id: z.string(),
    text: z.string().min(1, 'Texto da opção é obrigatório'),
    value: z.string(),
    scores: z.record(z.number()).optional()
  })).min(2, 'Pelo menos 2 opções são obrigatórias'),
  allowMultiple: z.boolean().default(false),
  required: z.boolean().default(true),
  randomizeOrder: z.boolean().default(false)
});

// 🏆 Schema para ResultStep
const resultStepDataSchema = z.object({
  title: z.string().min(1, 'Título do resultado é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  resultTypes: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, 'Título do tipo é obrigatório'),
    description: z.string().min(1, 'Descrição do tipo é obrigatória'),
    image: z.string().url().optional(),
    color: z.string().optional(),
    minScore: z.number().optional(),
    maxScore: z.number().optional()
  })).min(1, 'Pelo menos um tipo de resultado é obrigatório'),
  calculationMethod: z.enum(['score', 'percentage', 'category']).default('score'),
  showRestart: z.boolean().default(true),
  showShare: z.boolean().default(false)
});

// 🔄 Schema para TransitionStep
const transitionStepDataSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  buttonText: z.string().default('Continuar'),
  autoAdvance: z.boolean().default(false),
  delay: z.number().min(0).optional()
});

// 💰 Schema para OfferStep
const offerStepDataSchema = z.object({
  title: z.string().min(1, 'Título da oferta é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z.string().optional(),
  originalPrice: z.string().optional(),
  buttonText: z.string().default('Comprar Agora'),
  benefits: z.array(z.string()).optional(),
  testimonials: z.array(z.object({
    name: z.string(),
    text: z.string(),
    image: z.string().url().optional()
  })).optional()
});

// 🎯 Schema para StrategicQuestionStep
const strategicQuestionStepDataSchema = z.object({
  title: z.string().min(1, 'Pergunta estratégica é obrigatória'),
  subtitle: z.string().optional(),
  inputType: z.enum(['text', 'email', 'phone', 'select']).default('text'),
  placeholder: z.string().optional(),
  required: z.boolean().default(true),
  options: z.array(z.string()).optional()
});

// 🗂️ Mapeamento de schemas por tipo
const stepDataSchemas: Record<SupportedStepType, z.ZodSchema> = {
  intro: introStepDataSchema,
  question: questionStepDataSchema,
  result: resultStepDataSchema,
  transition: transitionStepDataSchema,
  offer: offerStepDataSchema,
  strategic_question: strategicQuestionStepDataSchema,
  email_capture: strategicQuestionStepDataSchema, // Reutiliza schema
  thank_you: transitionStepDataSchema // Reutiliza schema
};

// 🔍 Classe principal do validador
export class StepValidator {
  
  // ✅ Validar step completo
  validate(step: EditorStep): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    
    try {
      // Validar estrutura base
      baseStepSchema.parse(step);
      
      // Validar dados específicos do tipo
      const dataSchema = stepDataSchemas[step.type as SupportedStepType];
      if (dataSchema) {
        dataSchema.parse(step.data);
      } else {
        errors.push({
          field: 'type',
          message: `Tipo de step não suportado: ${step.type}`,
          severity: 'error',
          code: 'UNSUPPORTED_TYPE'
        });
      }
      
      // Validações adicionais por tipo
      this.validateTypeSpecific(step, errors, warnings);
      
      // Validações de consistência
      this.validateConsistency(step, errors, warnings);
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(zodError => {
          errors.push({
            field: zodError.path.join('.'),
            message: zodError.message,
            severity: 'error',
            code: 'VALIDATION_ERROR'
          });
        });
      } else {
        errors.push({
          field: 'general',
          message: 'Erro inesperado na validação',
          severity: 'error',
          code: 'UNEXPECTED_ERROR'
        });
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  // 🎯 Validações específicas por tipo
  private validateTypeSpecific(
    step: EditorStep, 
    errors: ValidationError[], 
    warnings: ValidationError[]
  ): void {
    switch (step.type) {
      case 'question':
        this.validateQuestionStep(step, errors, warnings);
        break;
      case 'result':
        this.validateResultStep(step, errors, warnings);
        break;
      case 'offer':
        this.validateOfferStep(step, errors, warnings);
        break;
    }
  }
  
  // ❓ Validar step de pergunta
  private validateQuestionStep(
    step: EditorStep, 
    errors: ValidationError[], 
    warnings: ValidationError[]
  ): void {
    const { options } = step.data;
    
    if (options) {
      // Verificar IDs únicos
      const ids = options.map((opt: any) => opt.id);
      const uniqueIds = new Set(ids);
      if (ids.length !== uniqueIds.size) {
        errors.push({
          field: 'options',
          message: 'IDs das opções devem ser únicos',
          severity: 'error',
          code: 'DUPLICATE_OPTION_IDS'
        });
      }
      
      // Avisar sobre muitas opções
      if (options.length > 6) {
        warnings.push({
          field: 'options',
          message: 'Muitas opções podem confundir o usuário',
          severity: 'warning',
          code: 'TOO_MANY_OPTIONS'
        });
      }
    }
  }
  
  // 🏆 Validar step de resultado
  private validateResultStep(
    step: EditorStep, 
    errors: ValidationError[], 
    warnings: ValidationError[]
  ): void {
    const { resultTypes, calculationMethod } = step.data;
    
    if (resultTypes && calculationMethod === 'score') {
      // Verificar se scores são consistentes
      const hasScores = resultTypes.some((type: any) => 
        type.minScore !== undefined || type.maxScore !== undefined
      );
      
      if (!hasScores) {
        warnings.push({
          field: 'resultTypes',
          message: 'Nenhum score definido para cálculo por pontuação',
          severity: 'warning',
          code: 'MISSING_SCORES'
        });
      }
    }
  }
  
  // 💰 Validar step de oferta
  private validateOfferStep(
    step: EditorStep, 
    errors: ValidationError[], 
    warnings: ValidationError[]
  ): void {
    const { price, originalPrice } = step.data;
    
    if (originalPrice && price) {
      // Converter para números para comparação
      const numPrice = parseFloat(price.replace(/[^\d.,]/g, ''));
      const numOriginalPrice = parseFloat(originalPrice.replace(/[^\d.,]/g, ''));
      
      if (numPrice >= numOriginalPrice) {
        warnings.push({
          field: 'price',
          message: 'Preço promocional deve ser menor que o original',
          severity: 'warning',
          code: 'INVALID_PROMOTION'
        });
      }
    }
  }
  
  // 🔗 Validações de consistência geral
  private validateConsistency(
    step: EditorStep, 
    errors: ValidationError[], 
    warnings: ValidationError[]
  ): void {
    // Verificar se meta está consistente com dados
    if (step.meta.validationState === 'valid' && step.meta.validationErrors.length > 0) {
      warnings.push({
        field: 'meta',
        message: 'Estado de validação inconsistente',
        severity: 'warning',
        code: 'INCONSISTENT_VALIDATION_STATE'
      });
    }
    
    // Verificar timestamp
    const now = Date.now();
    if (step.meta.lastModified > now) {
      warnings.push({
        field: 'meta.lastModified',
        message: 'Timestamp de modificação está no futuro',
        severity: 'warning',
        code: 'FUTURE_TIMESTAMP'
      });
    }
  }
  
  // 🚀 Validação rápida (apenas estrutura)
  validateQuick(step: EditorStep): boolean {
    try {
      baseStepSchema.parse(step);
      return true;
    } catch {
      return false;
    }
  }
  
  // 📋 Validar múltiplos steps
  validateMultiple(steps: EditorStep[]): Map<string, ValidationResult> {
    const results = new Map<string, ValidationResult>();
    
    steps.forEach(step => {
      results.set(step.id, this.validate(step));
    });
    
    return results;
  }
}

// 🌍 Instância global do validador
export const stepValidator = new StepValidator();

// 🎣 Hook para usar validação
export function useStepValidation(step: EditorStep) {
  const [validationResult, setValidationResult] = React.useState<ValidationResult>(() => 
    stepValidator.validate(step)
  );
  
  React.useEffect(() => {
    const result = stepValidator.validate(step);
    setValidationResult(result);
  }, [step]);
  
  return validationResult;
}
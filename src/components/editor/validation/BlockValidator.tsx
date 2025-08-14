import { Block } from '@/types/editor';
import { toast } from '@/hooks/use-toast';

/**
 * 🔍 SISTEMA DE VALIDAÇÃO EM TEMPO REAL
 * 
 * Valida propriedades de blocos e fornece feedback instantâneo
 * - Validação por tipo de componente
 * - Feedback visual em tempo real
 * - Sugestões de melhoria
 * - Score de qualidade
 */

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  score: number; // 0-100
  suggestions: ValidationSuggestion[];
};

export type ValidationError = {
  field: string;
  message: string;
  severity: 'error' | 'warning';
  code: string;
};

export type ValidationWarning = {
  field: string;
  message: string;
  suggestion: string;
  code: string;
};

export type ValidationSuggestion = {
  field: string;
  message: string;
  action?: string;
  code: string;
};

// Regras de validação por tipo de componente
const VALIDATION_RULES = {
  'text-inline': {
    required: ['content'],
    minLength: { content: 5 },
    maxLength: { content: 2000 },
    suggestions: [
      { field: 'content', message: 'Considere adicionar mais conteúdo para melhor SEO', minLength: 50 },
      { field: 'textAlign', message: 'Textos longos ficam melhor alinhados à esquerda', condition: (props: any) => props.content?.length > 200 && props.textAlign === 'center' }
    ]
  },
  'heading-inline': {
    required: ['content'],
    minLength: { content: 3 },
    maxLength: { content: 100 },
    suggestions: [
      { field: 'content', message: 'Títulos entre 30-60 caracteres são ideais para SEO', minLength: 30, maxLength: 60 },
      { field: 'level', message: 'Use apenas um H1 por página', condition: (props: any) => props.level === 'h1' }
    ]
  },
  'button-inline': {
    required: ['text', 'url'],
    minLength: { text: 3 },
    maxLength: { text: 50 },
    patterns: {
      url: /^(https?:\/\/|mailto:|tel:|#)/i
    },
    suggestions: [
      { field: 'text', message: 'Botões com verbos de ação convertem melhor', pattern: /^(baixar|comprar|assinar|cadastrar|começar|descobrir)/i },
      { field: 'url', message: 'Use HTTPS para melhor segurança', pattern: /^https:/ },
      { field: 'style', message: 'Botões primários chamam mais atenção', condition: (props: any) => props.style !== 'primary' }
    ]
  },
  'image-inline': {
    required: ['src', 'alt'],
    minLength: { alt: 5 },
    maxLength: { alt: 150 },
    patterns: {
      src: /\.(jpg|jpeg|png|webp|svg)$/i
    },
    suggestions: [
      { field: 'alt', message: 'Descrição mais detalhada melhora acessibilidade', minLength: 10 },
      { field: 'src', message: 'Use WebP para melhor performance', pattern: /\.webp$/i }
    ]
  },
  'quiz-question': {
    required: ['question', 'options'],
    minLength: { question: 10 },
    maxLength: { question: 200 },
    custom: [
      (props: any) => {
        if (!props.options || props.options.length < 2) {
          return { field: 'options', message: 'Questões precisam de pelo menos 2 opções', severity: 'error' as const };
        }
        return null;
      },
      (props: any) => {
        if (props.options && props.options.length > 6) {
          return { field: 'options', message: 'Muitas opções podem confundir o usuário', severity: 'warning' as const };
        }
        return null;
      }
    ],
    suggestions: [
      { field: 'question', message: 'Perguntas claras e diretas funcionam melhor', condition: (props: any) => props.question?.includes('?') },
      { field: 'options', message: 'Use 3-4 opções para melhor UX', condition: (props: any) => props.options?.length === 2 }
    ]
  }
};

/**
 * Valida um bloco individual
 */
export const validateBlock = (block: Block): ValidationResult => {
  const rules = VALIDATION_RULES[block.type as keyof typeof VALIDATION_RULES];
  
  if (!rules) {
    return {
      isValid: true,
      errors: [],
      warnings: [],
      score: 95,
      suggestions: []
    };
  }

  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const suggestions: ValidationSuggestion[] = [];
  let score = 100;

  const props = block.properties || {};

  // Validar campos obrigatórios
  if (rules.required) {
    rules.required.forEach(field => {
      if (!props[field] || (typeof props[field] === 'string' && props[field].trim() === '')) {
        errors.push({
          field,
          message: `Campo '${field}' é obrigatório`,
          severity: 'error',
          code: 'REQUIRED_FIELD'
        });
        score -= 20;
      }
    });
  }

  // Validar comprimento mínimo
  if (rules.minLength) {
    Object.entries(rules.minLength).forEach(([field, minLength]) => {
      const value = props[field];
      if (value && typeof value === 'string' && value.length < minLength) {
        errors.push({
          field,
          message: `'${field}' deve ter pelo menos ${minLength} caracteres`,
          severity: 'warning',
          code: 'MIN_LENGTH'
        });
        score -= 10;
      }
    });
  }

  // Validar comprimento máximo
  if (rules.maxLength) {
    Object.entries(rules.maxLength).forEach(([field, maxLength]) => {
      const value = props[field];
      if (value && typeof value === 'string' && value.length > maxLength) {
        warnings.push({
          field,
          message: `'${field}' muito longo (máximo ${maxLength} caracteres)`,
          suggestion: 'Considere texto mais conciso',
          code: 'MAX_LENGTH'
        });
        score -= 5;
      }
    });
  }

  // Validar padrões
  if (rules.patterns) {
    Object.entries(rules.patterns).forEach(([field, pattern]) => {
      const value = props[field];
      if (value && typeof value === 'string' && !pattern.test(value)) {
        errors.push({
          field,
          message: `'${field}' não está em formato válido`,
          severity: 'error',
          code: 'INVALID_PATTERN'
        });
        score -= 15;
      }
    });
  }

  // Validações customizadas
  if (rules.custom) {
    rules.custom.forEach(validator => {
      const result = validator(props);
      if (result) {
        if (result.severity === 'error') {
          errors.push({
            field: result.field,
            message: result.message,
            severity: 'error',
            code: 'CUSTOM_VALIDATION'
          });
          score -= 15;
        } else {
          warnings.push({
            field: result.field,
            message: result.message,
            suggestion: result.message,
            code: 'CUSTOM_WARNING'
          });
          score -= 5;
        }
      }
    });
  }

  // Gerar sugestões
  if (rules.suggestions) {
    rules.suggestions.forEach(suggestion => {
      let shouldSuggest = true;

      if (suggestion.minLength && props[suggestion.field]) {
        shouldSuggest = props[suggestion.field].length < suggestion.minLength;
      }
      
      if (suggestion.maxLength && props[suggestion.field]) {
        shouldSuggest = props[suggestion.field].length > suggestion.maxLength;
      }

      if (suggestion.pattern && props[suggestion.field]) {
        shouldSuggest = !suggestion.pattern.test(props[suggestion.field]);
      }

      if (suggestion.condition) {
        shouldSuggest = suggestion.condition(props);
      }

      if (shouldSuggest) {
        suggestions.push({
          field: suggestion.field,
          message: suggestion.message,
          code: 'SUGGESTION'
        });
        score -= 2;
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    score: Math.max(0, score),
    suggestions
  };
};

/**
 * Valida um conjunto de blocos (etapa completa)
 */
export const validateStage = (blocks: Block[]): ValidationResult => {
  const results = blocks.map(validateBlock);
  
  const allErrors = results.flatMap(r => r.errors);
  const allWarnings = results.flatMap(r => r.warnings);
  const allSuggestions = results.flatMap(r => r.suggestions);
  
  const avgScore = results.reduce((sum, r) => sum + r.score, 0) / Math.max(results.length, 1);

  // Validações específicas de etapa
  const stageErrors: ValidationError[] = [];
  const stageSuggestions: ValidationSuggestion[] = [];

  // Verificar se tem pelo menos um CTA
  const hasCTA = blocks.some(block => 
    block.type.includes('button') || 
    block.type.includes('cta') ||
    block.type.includes('form')
  );

  if (!hasCTA && blocks.length > 2) {
    stageSuggestions.push({
      field: 'stage',
      message: 'Considere adicionar uma chamada para ação nesta etapa',
      code: 'MISSING_CTA'
    });
  }

  // Verificar diversidade de conteúdo
  const blockTypes = new Set(blocks.map(b => b.type.split('-')[0]));
  if (blockTypes.size < 2 && blocks.length > 3) {
    stageSuggestions.push({
      field: 'stage',
      message: 'Varie os tipos de conteúdo para melhor engajamento',
      code: 'LOW_DIVERSITY'
    });
  }

  return {
    isValid: allErrors.length === 0,
    errors: [...allErrors, ...stageErrors],
    warnings: allWarnings,
    score: Math.round(avgScore),
    suggestions: [...allSuggestions, ...stageSuggestions]
  };
};

/**
 * Feedback visual para validação
 */
export const showValidationFeedback = (result: ValidationResult, blockId?: string) => {
  const prefix = blockId ? `Bloco ${blockId.slice(-8)}: ` : '';

  // Mostrar erros
  result.errors.forEach(error => {
    if (error.severity === 'error') {
      toast({
        title: `${prefix}Erro de Validação`,
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Mostrar avisos importantes
  result.warnings.slice(0, 2).forEach(warning => {
    toast({
      title: `${prefix}Atenção`,
      description: warning.message,
      variant: 'default',
    });
  });

  // Mostrar sugestões positivas se score for alto
  if (result.score >= 90 && result.suggestions.length > 0) {
    const suggestion = result.suggestions[0];
    toast({
      title: '💡 Dica de Melhoria',
      description: suggestion.message,
      variant: 'default',
    });
  }
};

/**
 * Relatório de qualidade da etapa
 */
export const getQualityReport = (blocks: Block[]): string => {
  const result = validateStage(blocks);
  
  let report = `📊 Relatório de Qualidade\n`;
  report += `Score: ${result.score}/100\n\n`;
  
  if (result.errors.length > 0) {
    report += `❌ Problemas (${result.errors.length}):\n`;
    result.errors.slice(0, 3).forEach(error => {
      report += `• ${error.message}\n`;
    });
    report += '\n';
  }
  
  if (result.suggestions.length > 0) {
    report += `💡 Sugestões (${result.suggestions.length}):\n`;
    result.suggestions.slice(0, 3).forEach(suggestion => {
      report += `• ${suggestion.message}\n`;
    });
  }
  
  return report;
};

export { ValidationResult, ValidationError, ValidationWarning, ValidationSuggestion };
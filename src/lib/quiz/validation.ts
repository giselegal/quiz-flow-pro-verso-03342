/**
 * Quiz Validation Module
 * Stub para exemplo Next.js - não usado no runtime atual
 */

export interface ValidationRule {
  required?: boolean;
  minSelections?: number;
  maxSelections?: number;
  custom?: (value: any) => boolean | string;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
}

/**
 * Valida resposta de uma pergunta do quiz
 */
export function validateQuizAnswer(
  answer: any,
  rules?: ValidationRule
): ValidationResult {
  if (!rules) {
    return { isValid: true };
  }

  const errors: string[] = [];

  if (rules.required && !answer) {
    errors.push('Esta pergunta é obrigatória');
  }

  if (rules.minSelections && Array.isArray(answer)) {
    if (answer.length < rules.minSelections) {
      errors.push(`Selecione pelo menos ${rules.minSelections} opções`);
    }
  }

  if (rules.maxSelections && Array.isArray(answer)) {
    if (answer.length > rules.maxSelections) {
      errors.push(`Selecione no máximo ${rules.maxSelections} opções`);
    }
  }

  if (rules.custom) {
    const customResult = rules.custom(answer);
    if (typeof customResult === 'string') {
      errors.push(customResult);
    } else if (customResult === false) {
      errors.push('Resposta inválida');
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  };
}

/**
 * Alias para compatibilidade com exemplo Next.js
 */
export const validateAnswer = validateQuizAnswer;

/**
 * Valida todas as respostas de um quiz
 */
export function validateAllAnswers(
  answers: Record<string, any>,
  rules: Record<string, ValidationRule>
): Record<string, ValidationResult> {
  const results: Record<string, ValidationResult> = {};

  for (const [key, rule] of Object.entries(rules)) {
    results[key] = validateQuizAnswer(answers[key], rule);
  }

  return results;
}

/**
 * Verifica se todas as validações passaram
 */
export function isAllValid(results: Record<string, ValidationResult>): boolean {
  return Object.values(results).every(result => result.isValid);
}

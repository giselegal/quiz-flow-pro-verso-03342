/**
 * 🛡️ TYPE GUARDS - Utilitários para verificação segura de tipos
 */

import { StyleResult, QuizResult, QuizOption } from '@/types/quiz';

export const isStyleResult = (obj: any): obj is StyleResult => {
  return obj && typeof obj === 'object' && 'id' in obj && 'name' in obj;
};

export const hasPercentage = (style: StyleResult | undefined): style is StyleResult & { percentage: number } => {
  return style !== undefined && style.percentage !== undefined;
};

export const hasCategory = (style: StyleResult | undefined): style is StyleResult & { category: string } => {
  return style !== undefined && style.category !== undefined;
};

export const hasPrimaryStyle = (result: QuizResult | any): result is QuizResult & { primaryStyle: StyleResult } => {
  return result?.primaryStyle && isStyleResult(result.primaryStyle);
};

export const hasSecondaryStyles = (result: QuizResult | any): result is QuizResult & { secondaryStyles: StyleResult[] } => {
  return result?.secondaryStyles && Array.isArray(result.secondaryStyles);
};

export const hasOptions = (question: any): question is { options: QuizOption[] } => {
  return question?.options && Array.isArray(question.options);
};

export const safeGet = <T>(obj: any, path: string, defaultValue?: T): T | undefined => {
  try {
    return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
  } catch {
    return defaultValue;
  }
};
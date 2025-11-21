/**
 * 🛡️ TYPE GUARDS - Utilitários para verificação segura de tipos
 */

import { StyleResult, QuizResult, QuizOption } from '@/types/quiz';

// Guard para arrays não vazios
export const isNonEmptyArray = <T>(value: any): value is T[] => Array.isArray(value) && value.length > 0;

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
  return Array.isArray(question?.options) && question.options.length > 0;
};

export const hasMultiSelect = (question: any): question is { multiSelect: number } => {
  return typeof question?.multiSelect === 'number' && question.multiSelect > 0;
};

export const safeGet = <T>(obj: any, path: string, defaultValue?: T): T | undefined => {
  try {
    return path.split('.').reduce((current, key) => current?.[key], obj) ?? defaultValue;
  } catch {
    return defaultValue;
  }
};
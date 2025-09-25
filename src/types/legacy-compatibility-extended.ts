/**
 * Extended Legacy Compatibility Types
 * Temporary bridge to fix TypeScript errors while maintaining functionality
 */

import type { StyleType, StyleResult } from './quiz';

// Legacy Style interface with all required properties
export interface LegacyStyle extends StyleResult {
  type: StyleType;
  score: number;
  characteristics: string[];
  recommendations: string[];
  images: string[];
}

// Helper to convert partial style objects to full StyleResult
export function createFullStyleResult(
  partialStyle: Partial<StyleResult> & { id: string; name: string; description: string }
): StyleResult {
  return {
    id: partialStyle.id,
    name: partialStyle.name,
    description: partialStyle.description,
    type: (partialStyle.type || partialStyle.category || 'natural') as StyleType,
    score: partialStyle.score || 0,
    characteristics: partialStyle.characteristics || [],
    recommendations: partialStyle.recommendations || [],
    colors: partialStyle.colors || [],
    images: partialStyle.images || [],
    imageUrl: partialStyle.imageUrl,
    guideImageUrl: partialStyle.guideImageUrl,
    keywords: partialStyle.keywords,
    category: partialStyle.category,
    percentage: partialStyle.percentage,
    style: partialStyle.style,
    points: partialStyle.points,
    rank: partialStyle.rank,
  };
}

// Legacy result objects
export const createLegacyStyleResult = (
  category: string,
  score: number,
  percentage: number,
  points: number,
  rank: number
): StyleResult => createFullStyleResult({
  id: category,
  name: category,
  description: `Estilo ${category}`,
  category,
  score,
  percentage,
  points,
  rank,
  type: category as StyleType,
});

// Type guard helpers
export function isValidStyleResult(obj: any): obj is StyleResult {
  return obj && typeof obj === 'object' && 
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.description === 'string';
}

export function ensureStyleResult(obj: any): StyleResult {
  if (isValidStyleResult(obj)) {
    return createFullStyleResult(obj);
  }
  
  return createFullStyleResult({
    id: obj?.category || obj?.id || 'unknown',
    name: obj?.name || obj?.category || 'Unknown',
    description: obj?.description || `Estilo ${obj?.category || 'desconhecido'}`,
    ...obj,
  });
}

// Safe null checks with defaults
export function safePercentage(value: number | undefined): number {
  return typeof value === 'number' ? value : 0;
}

export function safeString(value: string | undefined, defaultValue: string = ''): string {
  return typeof value === 'string' ? value : defaultValue;
}

export function safeCategory(value: string | undefined): string {
  return safeString(value, 'natural');
}
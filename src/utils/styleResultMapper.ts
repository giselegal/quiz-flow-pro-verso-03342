/**
 * 🎯 STYLE RESULT MAPPER - Utility para mapear objetos legados para StyleResult
 */

import { StyleResult, StyleType } from '@/types/quiz';

export interface LegacyStyleData {
  category?: string;
  style?: string;
  score?: number;
  percentage?: number;
  points?: number;
  rank?: number;
}

/**
 * Mapeia dados de estilo legados para o formato StyleResult
 */
export function mapToStyleResult(data: LegacyStyleData): StyleResult {
  const styleType = (data.category || data.style || 'natural') as StyleType;
  
  return {
    id: data.category || data.style || 'natural',
    name: capitalize(data.category || data.style || 'Natural'),
    description: `Estilo ${capitalize(data.category || data.style || 'Natural')}`,
    type: styleType,
    score: data.score || data.points || 0,
    characteristics: [],
    recommendations: [],
    colors: [],
    images: [],
    // Legacy compatibility
    category: data.category || data.style,
    percentage: data.percentage,
    style: data.style || data.category,
    points: data.points || data.score,
    rank: data.rank
  };
}

/**
 * Mapeia array de dados legados para array de StyleResult
 */
export function mapArrayToStyleResults(dataArray: LegacyStyleData[]): StyleResult[] {
  return dataArray.map(mapToStyleResult);
}

/**
 * Capitaliza primeira letra
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
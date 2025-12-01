/**
 * Adapter de compatibilidade para quiz21-v4-saas.json
 * 
 * Permite que o código existente funcione com o novo formato,
 * enquanto você migra gradualmente os componentes.
 * 
 * @version 4.1.0
 * @date 2025-12-01
 */

import React from 'react';

// ========================================
// 1. OPTION ADAPTER
// ========================================

export interface LegacyOption {
  id: string;
  text?: string;
  image?: string;
  value?: string;
}

export interface SaaSOption {
  id: string;
  label: string;
  imageUrl: string | null;
  value: string;
  score: {
    category: string;
    points: number;
  };
}

/**
 * Normaliza options antigas para o novo formato
 */
export function normalizeOption(option: LegacyOption | SaaSOption): SaaSOption {
  // Já está no novo formato
  if ('label' in option && 'score' in option) {
    return option as SaaSOption;
  }

  const legacy = option as LegacyOption;
  
  // Mapear id → category (fallback para migração)
  const categoryMap: Record<string, string> = {
    natural: 'Natural',
    classico: 'Clássico',
    contemporaneo: 'Contemporâneo',
    elegante: 'Elegante',
    romantico: 'Romântico',
    sexy: 'Sexy',
    dramatico: 'Dramático',
    criativo: 'Criativo',
  };

  return {
    id: legacy.id,
    label: legacy.text || '',
    imageUrl: legacy.image || null,
    value: legacy.value || legacy.id,
    score: {
      category: categoryMap[legacy.id] || legacy.id,
      points: 1,
    },
  };
}

// ========================================
// 2. RICH-TEXT ADAPTER
// ========================================

export interface RichTextBlock {
  type: 'text' | 'highlight';
  value: string;
}

export interface RichTextContent {
  type: 'rich-text';
  blocks: RichTextBlock[];
}

export type TextContent = string | RichTextContent;

/**
 * Converte rich-text para estrutura de dados (não JSX)
 * Use este helper em seu componente React para renderizar
 */
export function renderRichText(
  content: TextContent,
  highlightClassName = 'font-semibold text-primary'
): Array<{ type: 'text' | 'highlight'; value: string; className?: string; key: number }> {
  if (typeof content === 'string') {
    return [{ type: 'text', value: content, key: 0 }];
  }

  return content.blocks.map((block, i) => ({
    type: block.type,
    value: block.value,
    className: block.type === 'highlight' ? highlightClassName : undefined,
    key: i,
  }));
}

/**
 * Converte rich-text para plain text (útil para SEO, previews)
 */
export function richTextToPlainText(content: TextContent): string {
  if (typeof content === 'string') {
    return content;
  }

  return content.blocks.map((block) => block.value).join('');
}

// ========================================
// 3. VALIDATION ADAPTER
// ========================================

export interface ValidationRules {
  required?: boolean;
  minSelections?: number;
  maxSelections?: number;
  errorMessage?: string;
  inheritsDefaults?: boolean;
}

/**
 * Resolve validações considerando defaults globais
 */
export function resolveValidation(
  stepValidation: ValidationRules | undefined,
  stepType: 'intro' | 'question' | 'result',
  globalDefaults: Record<string, ValidationRules>
): ValidationRules {
  // Se herda defaults, usar os globais
  if (stepValidation?.inheritsDefaults) {
    return globalDefaults[stepType] || {};
  }

  // Se tem regras próprias, usar elas
  if (stepValidation && !stepValidation.inheritsDefaults) {
    return stepValidation;
  }

  // Fallback: tentar defaults
  return globalDefaults[stepType] || { required: false };
}

// ========================================
// 4. SCORING ENGINE (novo)
// ========================================

export interface ScoreResult {
  category: string;
  points: number;
  percentage: number;
}

/**
 * Calcula pontuação a partir das opções selecionadas
 */
export function calculateScoring(
  selectedOptions: SaaSOption[],
  allCategories: string[]
): ScoreResult[] {
  const scores: Record<string, number> = {};

  // Inicializar todas as categorias com 0
  allCategories.forEach((cat) => {
    scores[cat] = 0;
  });

  // Somar pontos das opções selecionadas
  selectedOptions.forEach((option) => {
    const { category, points } = option.score;
    scores[category] = (scores[category] || 0) + points;
  });

  // Calcular total
  const totalPoints = Object.values(scores).reduce((sum, p) => sum + p, 0);

  // Converter para array e calcular percentuais
  return Object.entries(scores)
    .map(([category, points]) => ({
      category,
      points,
      percentage: totalPoints > 0 ? (points / totalPoints) * 100 : 0,
    }))
    .sort((a, b) => b.points - a.points); // Maior pontuação primeiro
}

/**
 * Retorna o estilo predominante
 */
export function getPredominantStyle(
  selectedOptions: SaaSOption[],
  allCategories: string[]
): string {
  const scores = calculateScoring(selectedOptions, allCategories);
  return scores[0]?.category || 'Natural'; // Fallback
}

// ========================================
// 5. ASSET URL RESOLVER
// ========================================

/**
 * Resolve URLs de assets (mapeia /quiz-assets/ para CDN real)
 * 
 * Usa variáveis de ambiente:
 * - VITE_ASSET_CDN_BASE_URL: Base URL do CDN (ex: https://res.cloudinary.com/cloudname/image/upload)
 * - VITE_ENABLE_ASSET_CDN: Habilita resolução de CDN (default: true em produção)
 */
export function resolveAssetUrl(
  url: string | null,
  cdnBaseUrl?: string
): string | null {
  if (!url) return null;

  // Se já é URL absoluta, retornar direto
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Verificar se CDN está habilitado
  const cdnEnabled = import.meta.env.VITE_ENABLE_ASSET_CDN !== 'false';
  
  if (!cdnEnabled) {
    // Em desenvolvimento sem CDN, retornar path relativo
    return url;
  }

  // Obter CDN base URL das variáveis de ambiente
  const baseCdn = 
    cdnBaseUrl || 
    import.meta.env.VITE_ASSET_CDN_BASE_URL || 
    'https://res.cloudinary.com/dqljyf76t/image/upload';

  // Se é path relativo, mapear para CDN
  if (url.startsWith('/quiz-assets/')) {
    const filename = url.replace('/quiz-assets/', '');
    // Remover v1744735329 hardcoded - usar diretamente o filename
    return `${baseCdn}/f_auto,q_auto/${filename}`;
  }

  return url;
}

// ========================================
// 6. EXEMPLO DE USO
// ========================================

/**
 * Hook para usar em componentes React
 */
export function useQuizV4Adapter(template: any) {
  const settings = template.settings;
  const validationDefaults = settings.validation?.defaults || {};

  return {
    // Normalizar opções
    normalizeOption,

    // Renderizar rich-text
    renderRichText,

    // Resolver validação
    resolveValidation: (stepValidation: ValidationRules | undefined, stepType: string) =>
      resolveValidation(stepValidation, stepType as any, validationDefaults),

    // Calcular scoring
    calculateScoring: (selectedOptions: SaaSOption[]) =>
      calculateScoring(selectedOptions, settings.scoring.categories),

    // Resolver asset URLs
    resolveAssetUrl,
  };
}

// ========================================
// EXPORT DEFAULT
// ========================================

export default {
  normalizeOption,
  renderRichText,
  richTextToPlainText,
  resolveValidation,
  calculateScoring,
  getPredominantStyle,
  resolveAssetUrl,
  useQuizV4Adapter,
};

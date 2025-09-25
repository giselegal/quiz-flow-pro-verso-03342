import { styleConfig } from '@/config/styleConfig';
import { getStyleColor } from '@/utils/styleUtils';
import { useQuizResult } from '@/hooks/useQuizResult';
import { useMemo } from 'react';

export interface StyleResultForHeader {
  name: string;
  description: string;
  percentage: number;
  image: string;
  guideImage: string;
  color: string;
}

export interface StyleResultsForHeader {
  primaryStyle: StyleResultForHeader;
  secondaryStyle: StyleResultForHeader;
  thirdStyle: StyleResultForHeader;
}

/**
 * Hook para fornecer dados de resultados de estilo para o header
 * Usa dados reais do quiz quando disponíveis, senão usa dados mock para preview no editor
 */
export const useStyleResultsForHeader = (): StyleResultsForHeader => {
  // 🔥 CONECTANDO DADOS REAIS DO QUIZ
  const { primaryStyle, secondaryStyles } = useQuizResult();

  return useMemo(() => {
    console.log('🎯 useStyleResultsForHeader - Dados reais:', { primaryStyle, secondaryStyles });

    const createStyleResult = (name: string, percentage: number): StyleResultForHeader => {
      const config = styleConfig[name];
      if (!config) {
        console.warn(`⚠️ Estilo não encontrado: ${name}`);
        return {
          name,
          description: 'Estilo não encontrado',
          percentage,
          image: 'https://via.placeholder.com/120x120',
          guideImage: 'https://via.placeholder.com/400x200',
          color: '#B89B7A',
        };
      }

      return {
        name,
        description: config.description,
        percentage,
        image: config.image,
        guideImage: config.guideImage,
        color: getStyleColor(name as any),
      };
    };

    // Se temos dados reais do quiz, usar eles
    if (primaryStyle && secondaryStyles && secondaryStyles.length >= 2) {
      const realStyles = [
        { name: (primaryStyle.style || 'Natural'), percentage: Math.round((primaryStyle.percentage ?? 0)) },
        { name: (secondaryStyles[0].style || 'Natural'), percentage: Math.round((secondaryStyles[0].percentage ?? 0)) },
        { name: (secondaryStyles[1].style || 'Natural'), percentage: Math.round((secondaryStyles[1].percentage ?? 0)) },
      ];

      console.log('✅ Usando dados REAIS do quiz:', realStyles);

      return {
        primaryStyle: createStyleResult(realStyles[0].name, realStyles[0].percentage),
        secondaryStyle: createStyleResult(realStyles[1].name, realStyles[1].percentage),
        thirdStyle: createStyleResult(realStyles[2].name, realStyles[2].percentage),
      };
    }

    // Fallback: Dados mock para preview no editor
    const mockStyles = [
      { name: 'Natural', percentage: 45 },
      { name: 'Contemporâneo', percentage: 28 },
      { name: 'Clássico', percentage: 27 },
    ];

    console.log('📝 Usando dados MOCK (preview):', mockStyles);

    return {
      primaryStyle: createStyleResult(mockStyles[0].name, mockStyles[0].percentage),
      secondaryStyle: createStyleResult(mockStyles[1].name, mockStyles[1].percentage),
      thirdStyle: createStyleResult(mockStyles[2].name, mockStyles[2].percentage),
    };
  }, [primaryStyle, secondaryStyles]);
};

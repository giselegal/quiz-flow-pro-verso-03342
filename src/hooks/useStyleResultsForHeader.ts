import { styleConfig } from '@/config/styleConfig';
import { getStyleColor } from '@/utils/styleUtils';
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
 * Inclui dados mockados para preview no editor
 */
export const useStyleResultsForHeader = (): StyleResultsForHeader => {
  return useMemo(() => {
    // Dados mock para preview no editor - sempre retorna os mesmos dados
    const mockStyles = [
      { name: 'Natural', percentage: 45 },
      { name: 'Contemporâneo', percentage: 28 },
      { name: 'Clássico', percentage: 27 }
    ];

    const createStyleResult = (name: string, percentage: number): StyleResultForHeader => {
      const config = styleConfig[name];
      if (!config) {
        return {
          name,
          description: 'Estilo não encontrado',
          percentage,
          image: 'https://via.placeholder.com/120x120',
          guideImage: 'https://via.placeholder.com/400x200',
          color: '#B89B7A'
        };
      }

      return {
        name,
        description: config.description,
        percentage,
        image: config.image,
        guideImage: config.guideImage,
        color: getStyleColor(name as any)
      };
    };

    return {
      primaryStyle: createStyleResult(mockStyles[0].name, mockStyles[0].percentage),
      secondaryStyle: createStyleResult(mockStyles[1].name, mockStyles[1].percentage),
      thirdStyle: createStyleResult(mockStyles[2].name, mockStyles[2].percentage)
    };
  }, []);
};
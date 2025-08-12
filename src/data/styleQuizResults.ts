import { QuizResult } from '@/hooks/useQuizResults';
import { styleConfig } from './styleConfig';

/**
 * Mapeia os estilos do styleConfig para o formato de resultados do quiz
 * para ser usado na configuração do componente QuizResultsBlock
 */
export const styleToQuizResults = (): QuizResult[] => {
  return Object.entries(styleConfig).map(([style, config], index) => {
    return {
      id: `style-${style}`,
      title: style,
      description: config.description,
      imageUrl: config.image,
      category: style,
      minScore: 0,
      maxScore: 100,
      displayOrder: index + 1,
    };
  });
};

/**
 * Configuração inicial para o sistema de resultados do quiz de estilo
 */
export const initialStyleQuizConfig = {
  calculationMethod: {
    type: 'highest' as const,
    tiebreaker: 'highest_score' as const,
  },
  results: styleToQuizResults(),
  showAllResults: false,
  showScores: true,
};

/**
 * Retorna o resultado para um estilo específico
 */
export const getStyleResult = (style: keyof typeof styleConfig): QuizResult | undefined => {
  return styleToQuizResults().find(result => result.title === style);
};

import { styleConfig } from '@/config/styleConfig';
import { StyleResult } from '@/types/quiz';
import { useEffect, useState } from 'react';

interface StyleCalculations {
  compatibilityScore: number;
  recommendationPriority: number;
  categoryScore: number;
  personalityMatch: {
    confidence: number;
    traits: string[];
  };
}

export const useStyleCalculations = (primaryStyle: StyleResult, secondaryStyles: StyleResult[]) => {
  const [calculations, setCalculations] = useState<StyleCalculations>({
    compatibilityScore: 0,
    recommendationPriority: 0,
    categoryScore: 0,
    personalityMatch: {
      confidence: 0,
      traits: [],
    },
  });

  useEffect(() => {
    if (!primaryStyle) return;

    // Cálculo de compatibilidade entre estilos
    const calculateCompatibility = () => {
      const primaryConfig = styleConfig[primaryStyle.category || primaryStyle.name];
      if (!primaryConfig) return 0;
      
      let compatibilityScore = 0;

      secondaryStyles.forEach(style => {
        const styleCategory = style.category || style.name;
        if (primaryConfig.compatibleWith?.includes(styleCategory)) {
          compatibilityScore += ((style.percentage || 0) / 100) * 0.5;
        }
      });

      compatibilityScore += (primaryStyle.percentage || 0) / 100;
      return Math.min(compatibilityScore * 100, 100);
    };

    // Cálculo de prioridade de recomendações
    const calculatePriority = () => {
      const baseScore = primaryStyle.percentage || 0;
      const secondaryInfluence = secondaryStyles.reduce(
        (acc, style) => acc + (style.percentage || 0) * 0.3,
        0
      );
      return Math.min((baseScore + secondaryInfluence) / 100, 10);
    };

    // Cálculo de pontuação por categoria
    const calculateCategoryScore = () => {
      const categoryConfig = styleConfig[primaryStyle.category || primaryStyle.name];
      if (!categoryConfig) return primaryStyle.percentage || 0;
      
      const baseScore = primaryStyle.percentage || 0;
      const categoryMultiplier = categoryConfig.scoreMultiplier || 1;
      return Math.min(baseScore * categoryMultiplier, 100);
    };

    // Análise de compatibilidade de personalidade
    const analyzePersonality = () => {
      const categoryConfig = styleConfig[primaryStyle.category || primaryStyle.name];
      const traits = categoryConfig?.personalityTraits || [];
      const confidenceScore =
        (((primaryStyle.percentage || 0) / 100) * (secondaryStyles[0]?.percentage || 0)) / 100;

      return {
        confidence: Math.min(confidenceScore * 100, 100),
        traits,
      };
    };

    // Atualizar todos os cálculos
    setCalculations({
      compatibilityScore: calculateCompatibility(),
      recommendationPriority: calculatePriority(),
      categoryScore: calculateCategoryScore(),
      personalityMatch: analyzePersonality(),
    });
  }, [primaryStyle, secondaryStyles]);

  return calculations;
};

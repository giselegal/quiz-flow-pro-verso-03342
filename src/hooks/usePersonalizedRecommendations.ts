import { styleConfig } from '@/config/styleConfig';
import { StyleResult } from '@/types/quiz';
import { useEffect, useState } from 'react';

interface Recommendation {
  id: string;
  type: 'color' | 'pattern' | 'fabric' | 'accessory';
  title: string;
  description: string;
  priority: number;
  confidence: number;
}

export const usePersonalizedRecommendations = (
  primaryStyle: StyleResult,
  secondaryStyles: StyleResult[],
  userName?: string
) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!primaryStyle) return;

    const generateRecommendations = () => {
      const primaryConfig = styleConfig[primaryStyle.category];
      const recommendations: Recommendation[] = [];

      // Gerar recomendações de cores
      if (primaryConfig.colors) {
        primaryConfig.colors.forEach((color, index) => {
          recommendations.push({
            id: `color-${index}`,
            type: 'color',
            title: `${color.name}`,
            description:
              color.description ||
              `${color.name} é uma cor que harmoniza perfeitamente com seu estilo ${primaryStyle.category}${userName ? `, ${userName}` : ''}.`,
            priority: (primaryStyle.percentage / 100) * (color.priority || 1),
            confidence: Math.min(primaryStyle.percentage, 100),
          });
        });
      }

      // Gerar recomendações de padrões
      if (primaryConfig.patterns) {
        primaryConfig.patterns.forEach((pattern, index) => {
          recommendations.push({
            id: `pattern-${index}`,
            type: 'pattern',
            title: `${pattern.name}`,
            description:
              pattern.description ||
              `Padrões ${pattern.name.toLowerCase()} são ideais para expressar sua personalidade ${primaryStyle.category}.`,
            priority: (primaryStyle.percentage / 100) * (pattern.priority || 1),
            confidence: Math.min(primaryStyle.percentage * 0.9, 100),
          });
        });
      }

      // Gerar recomendações de tecidos
      if (primaryConfig.fabrics) {
        primaryConfig.fabrics.forEach((fabric, index) => {
          recommendations.push({
            id: `fabric-${index}`,
            type: 'fabric',
            title: `${fabric.name}`,
            description:
              fabric.description ||
              `${fabric.name} é um tecido que combina com seu estilo ${primaryStyle.category}.`,
            priority: (primaryStyle.percentage / 100) * (fabric.priority || 1),
            confidence: Math.min(primaryStyle.percentage * 0.85, 100),
          });
        });
      }

      // Adicionar influência dos estilos secundários
      secondaryStyles.forEach(style => {
        const secondaryConfig = styleConfig[style.category];

        // Adicionar recomendações complementares dos estilos secundários
        if (secondaryConfig.colors) {
          secondaryConfig.colors
            .filter(color => !recommendations.some(r => r.title === color.name))
            .forEach((color, index) => {
              recommendations.push({
                id: `secondary-color-${style.category}-${index}`,
                type: 'color',
                title: `${color.name} (Complementar)`,
                description: `${color.name} pode ser usado como cor de apoio, refletindo a influência do seu estilo secundário ${style.category}.`,
                priority: (style.percentage / 100) * (color.priority || 1) * 0.7,
                confidence: Math.min(style.percentage * 0.8, 100),
              });
            });
        }
      });

      // Ordenar recomendações por prioridade
      return recommendations.sort((a, b) => b.priority - a.priority);
    };

    setIsLoading(true);
    const newRecommendations = generateRecommendations();
    setRecommendations(newRecommendations);
    setIsLoading(false);
  }, [primaryStyle, secondaryStyles, userName]);

  return {
    recommendations,
    isLoading,
    // Funções auxiliares para filtrar recomendações
    getByType: (type: 'color' | 'pattern' | 'fabric' | 'accessory') =>
      recommendations.filter(r => r.type === type),
    getTopRecommendations: (limit: number = 5) => recommendations.slice(0, limit),
    getHighConfidenceRecommendations: (threshold: number = 80) =>
      recommendations.filter(r => r.confidence >= threshold),
  };
};

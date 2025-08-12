import { QuestionOption } from '@/components/funnel-blocks/types';

export interface CategoryScore {
  category: string;
  score: number;
  count: number;
}

export interface QuizResult {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  minScore: number;
  maxScore: number;
  displayOrder: number;
}

export interface CalculationMethod {
  type: 'sum' | 'average' | 'highest' | 'majority';
  primaryCategory?: string;
  tiebreaker?: 'highest_score' | 'first_category';
}

export interface QuizResultsConfig {
  calculationMethod: CalculationMethod;
  results: QuizResult[];
  showAllResults: boolean;
  showScores: boolean;
}

/**
 * Hook para calcular os resultados do quiz baseado nas respostas do usuário
 */
export const useQuizResults = () => {
  // Calcular pontuações por categoria
  const calculateCategoryScores = (answers: Map<string, QuestionOption[]>): CategoryScore[] => {
    const categoryScores = new Map<string, CategoryScore>();

    // Processar todas as respostas
    answers.forEach(selectedOptions => {
      selectedOptions.forEach(option => {
        if (!option.category) return;

        const currentScore = categoryScores.get(option.category) || {
          category: option.category,
          score: 0,
          count: 0,
        };

        // Adicionar pontuação da opção
        const score = option.points || 1;
        categoryScores.set(option.category, {
          ...currentScore,
          score: currentScore.score + score,
          count: currentScore.count + 1,
        });
      });
    });

    return Array.from(categoryScores.values());
  };

  // Aplicar método de cálculo para determinar o resultado
  const applyCalculationMethod = (
    categoryScores: CategoryScore[],
    method: CalculationMethod
  ): CategoryScore | null => {
    if (categoryScores.length === 0) return null;

    switch (method.type) {
      case 'sum':
        // Retorna a categoria com maior soma de pontos
        return categoryScores.reduce((max, current) => (max.score > current.score ? max : current));

      case 'average':
        // Calcula a média para cada categoria e retorna a maior
        const withAverages = categoryScores.map(cs => ({
          ...cs,
          averageScore: cs.score / cs.count,
        }));
        return withAverages.reduce((max, current) =>
          max.averageScore > current.averageScore ? max : current
        );

      case 'highest':
        // Retorna a categoria com a pontuação individual mais alta
        if (method.primaryCategory) {
          // Se tiver categoria primária definida, priorizar ela
          const primaryCategoryScore = categoryScores.find(
            cs => cs.category === method.primaryCategory
          );
          if (primaryCategoryScore) return primaryCategoryScore;
        }
        return categoryScores.reduce((max, current) => (max.score > current.score ? max : current));

      case 'majority':
        // Retorna a categoria com mais ocorrências
        return categoryScores.reduce((max, current) => (max.count > current.count ? max : current));

      default:
        return categoryScores[0];
    }
  };

  // Determinar qual resultado mostrar baseado na pontuação e categoria
  const determineResult = (
    winningCategory: CategoryScore | null,
    results: QuizResult[],
    allAnswers: Map<string, QuestionOption[]>
  ): QuizResult | null => {
    if (!winningCategory || results.length === 0) return null;

    // Calcular pontuação total somando todos os pontos de todas as respostas
    let totalScore = 0;
    allAnswers.forEach(options => {
      options.forEach(opt => {
        totalScore += opt.points || 0;
      });
    });

    // Filtrar resultados pela categoria vencedora
    const categoryResults = results.filter(result => result.category === winningCategory.category);

    if (categoryResults.length === 0) {
      // Se não houver resultados para esta categoria, pegar qualquer um na faixa de pontuação
      return (
        results.find(result => totalScore >= result.minScore && totalScore <= result.maxScore) ||
        results[0]
      );
    }

    // Encontrar o resultado adequado para a pontuação dentro da categoria
    return (
      categoryResults.find(
        result => totalScore >= result.minScore && totalScore <= result.maxScore
      ) || categoryResults[0]
    );
  };

  return {
    calculateCategoryScores,
    applyCalculationMethod,
    determineResult,
  };
};

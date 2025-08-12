import { QuestionOption } from "@/components/funnel-blocks/types";
import { styleConfig } from "@/data/styleConfig";
import { initialStyleQuizConfig } from "@/data/styleQuizResults";
import { QuizResult, useQuizResults } from "@/hooks/useQuizResults";
import { useEffect, useState } from "react";

export interface StyleQuizResultData {
  mainResult: QuizResult | null;
  categoryScores: Record<string, number>;
  guideImageUrl: string | null;
}

/**
 * Hook personalizado para o quiz de estilos
 * Usa o sistema de cálculo de resultados e adiciona funcionalidades específicas
 * para o quiz de estilos como a imagem do guia
 */
export const useStyleQuizResults = (answers: Map<string, QuestionOption[]>) => {
  const { calculateCategoryScores, applyCalculationMethod, determineResult } = useQuizResults();
  const [resultData, setResultData] = useState<StyleQuizResultData>({
    mainResult: null,
    categoryScores: {},
    guideImageUrl: null,
  });

  useEffect(() => {
    // Calcular resultados quando as respostas mudarem
    if (answers.size > 0) {
      // Calcular pontuações por categoria
      const categoryScores = calculateCategoryScores(answers);

      // Aplicar método de cálculo para determinar o estilo predominante
      const winningCategory = applyCalculationMethod(
        categoryScores,
        initialStyleQuizConfig.calculationMethod
      );

      // Determinar o resultado final
      const mainResult = determineResult(winningCategory, initialStyleQuizConfig.results, answers);

      // Criar um objeto de pontuações por categoria para exibição
      const categoryScoresMap: Record<string, number> = {};
      categoryScores.forEach(cs => {
        categoryScoresMap[cs.category] = cs.score;
      });

      // Obter a URL da imagem do guia para o estilo vencedor
      let guideImageUrl = null;
      if (mainResult && mainResult.title in styleConfig) {
        const styleName = mainResult.title as keyof typeof styleConfig;
        guideImageUrl = styleConfig[styleName].guideImage;
      }

      setResultData({
        mainResult,
        categoryScores: categoryScoresMap,
        guideImageUrl,
      });
    }
  }, [answers, calculateCategoryScores, applyCalculationMethod, determineResult]);

  return resultData;
};

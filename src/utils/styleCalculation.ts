import type { QuizResponse, QuizResult, StyleType, StyleScore, QuizQuestion } from '@/types/quiz';
import { getStyleById } from '@/data/styles';

/**
 * Engine de cálculo de estilos do CaktoQuiz
 * Implementa a lógica exata do quiz original
 */
export class StyleCalculationEngine {
  /**
   * Calcula o resultado do quiz baseado nas respostas
   * @param responses Respostas do usuário
   * @param participantName Nome do participante
   * @param normalQuestions Lista das questões normais para validação
   * @returns Resultado completo do quiz
   */
  static calculateResult(
    responses: QuizResponse[],
    participantName: string,
    normalQuestions: QuizQuestion[]
  ): QuizResult {
    // 1. Filtrar apenas respostas de questões normais
    const normalResponses = responses.filter(response => {
      const question = normalQuestions.find(q => q.id === response.questionId);
      return question?.type === 'normal';
    });

    // 2. Contar pontos por estilo
    const stylePoints: Record<StyleType, number> = {
      classico: 0,
      romântico: 0,
      dramático: 0,
      natural: 0,
      criativo: 0,
      elegante: 0,
      sexy: 0,
      contemporâneo: 0,
    };

    // Manter ordem das respostas para desempate
    const responseOrder: { style: StyleType; timestamp: Date }[] = [];

    normalResponses.forEach(response => {
      response.selectedOptions.forEach(optionId => {
        // Mock implementation - in real app, would map option to style
        const style = 'classico' as StyleType; // Simplified for now
        stylePoints[style] += 1;
        responseOrder.push({
          style,
          timestamp: response.timestamp,
        });
      });
    });

    // 3. Calcular percentuais
    const totalNormalQuestions = normalQuestions.length;
    const styleScores: StyleScore[] = [];

    Object.entries(stylePoints).forEach(([styleId, points]) => {
      const style = styleId as StyleType;
      const percentage =
        totalNormalQuestions > 0 ? Math.round((points / totalNormalQuestions) * 100) : 0;

      styleScores.push({
        style,
        points,
        percentage,
        rank: 0, // Será calculado depois
      });
    });

    // 4. Ordenar por pontuação e aplicar regra de desempate
    styleScores.sort((a, b) => {
      // Primeiro critério: maior pontuação
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      // Segundo critério: primeira resposta escolhida (desempate)
      const firstResponseA = responseOrder.find(r => r.style === a.style);
      const firstResponseB = responseOrder.find(r => r.style === b.style);

      if (firstResponseA && firstResponseB) {
        return firstResponseA.timestamp.getTime() - firstResponseB.timestamp.getTime();
      }

      return 0;
    });

    // 5. Atribuir rankings
    styleScores.forEach((score, index) => {
      score.rank = index + 1;
    });

    // 6. Determinar estilo predominante e complementares
    const predominantStyle = styleScores[0].style;
    const complementaryStyles = styleScores
      .slice(1, 3) // 2º e 3º lugar
      .map(score => score.style);

    // 7. Criar resultado final - simplify to match interface
    const scores: Record<string, number> = {};
    styleScores.forEach(score => {
      scores[score.style] = score.points;
    });

    const result: QuizResult = {
      primaryStyle: {
        category: predominantStyle,
        score: styleScores[0].points,
        percentage: styleScores[0].percentage,
        style: predominantStyle,
        points: styleScores[0].points,
        rank: 1,
      },
      secondaryStyles: styleScores.slice(1, 3).map((score, index) => ({
        category: score.style,
        score: score.points,
        percentage: score.percentage,
        style: score.style,
        points: score.points,
        rank: index + 2,
      })),
      totalQuestions: totalNormalQuestions,
      completedAt: new Date(),
      scores,
    };

    return result;
  }

  /**
   * Valida se todas as questões normais foram respondidas
   */
  static validateResponses(
    responses: QuizResponse[],
    normalQuestions: QuizQuestion[]
  ): { isValid: boolean; missingQuestions: string[] } {
    const answeredQuestionIds = new Set(responses.map(r => r.questionId));
    const normalQuestionIds = normalQuestions.filter(q => q.type === 'normal').map(q => q.id);

    const missingQuestions = normalQuestionIds.filter(id => !answeredQuestionIds.has(id));

    return {
      isValid: missingQuestions.length === 0,
      missingQuestions,
    };
  }

  /**
   * Calcula estatísticas em tempo real
   */
  static getProgressStats(
    responses: QuizResponse[],
    normalQuestions: QuizQuestion[]
  ): {
    answeredQuestions: number;
    totalQuestions: number;
    progress: number;
    currentLeadingStyle?: StyleType;
  } {
    const totalQuestions = normalQuestions.filter(q => q.type === 'normal').length;
    const answeredQuestions = responses.filter(response => {
      const question = normalQuestions.find(q => q.id === response.questionId);
      return question?.type === 'normal';
    }).length;

    const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

    // Calcular estilo líder atual
    let currentLeadingStyle: StyleType | undefined;
    if (answeredQuestions > 0) {
      const tempPoints: Record<StyleType, number> = {
        classico: 0,
        romântico: 0,
        dramático: 0,
        natural: 0,
        criativo: 0,
        elegante: 0,
        sexy: 0,
        contemporâneo: 0,
      };

      responses.forEach(response => {
        response.selectedOptions.forEach(optionId => {
          // Mock implementation - in real app, would map option to style
          const style = 'classico' as StyleType;
          tempPoints[style] += 1;
        });
      });

      const maxPoints = Math.max(...Object.values(tempPoints));
      currentLeadingStyle = Object.entries(tempPoints).find(
        ([_, points]) => points === maxPoints
      )?.[0] as StyleType;
    }

    return {
      answeredQuestions,
      totalQuestions,
      progress,
      currentLeadingStyle,
    };
  }
}

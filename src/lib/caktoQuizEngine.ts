
import { QuizQuestion, UserResponse, StyleResult, StyleType, QuizResponse } from '@/types/quiz';

export interface CaktoQuizEngine {
  calculateStyleScores: (responses: UserResponse[]) => StyleResult[];
  determineResult: (responses: UserResponse[], participantName: string) => any;
}

// Convert UserResponse to QuizResponse format
const convertUserResponseToQuizResponse = (userResponse: UserResponse): QuizResponse => {
  return {
    questionId: userResponse.questionId,
    selectedOptionIds: userResponse.selectedOptions,
    selectedStyles: [],
    timestamp: userResponse.timestamp
  };
};

// Updated function signatures to match usage
export const calculateCaktoQuizResult = (responses: UserResponse[], participantName: string) => {
  const engine = createCaktoQuizEngine();
  return engine.determineResult(responses, participantName);
};

export const processMultipleSelections = (selectedOptions: string[], questionId: string): UserResponse => {
  return {
    questionId,
    selectedOptions,
    timestamp: new Date()
  };
};

// Updated to only require 2 parameters
export const validateQuestionResponse = (response: UserResponse, question: QuizQuestion): boolean => {
  if (!response.selectedOptions || response.selectedOptions.length === 0) {
    return false;
  }
  
  const maxSelections = question.multiSelect || 3;
  return response.selectedOptions.length <= maxSelections;
};

export const createCaktoQuizEngine = (): CaktoQuizEngine => {
  const calculateStyleScores = (responses: UserResponse[]): StyleResult[] => {
    // Simplified scoring algorithm
    const stylePoints: Record<StyleType, number> = {
      natural: 0,
      classico: 0,
      romantico: 0,
      dramatico: 0,
      criativo: 0,
      elegante: 0,
      sensual: 0,
      contemporaneo: 0
    };

    // Calculate points based on responses
    responses.forEach(response => {
      response.selectedOptions.forEach(option => {
        // This would normally map options to style points
        // Simplified for demo
        stylePoints.natural += Math.random() * 10;
        stylePoints.classico += Math.random() * 8;
        stylePoints.romantico += Math.random() * 6;
      });
    });

    // Convert to StyleResult array with all required properties
    const results: StyleResult[] = Object.entries(stylePoints).map(([style, points], index) => ({
      category: style.charAt(0).toUpperCase() + style.slice(1),
      score: points,
      percentage: (points / Math.max(...Object.values(stylePoints))) * 100,
      style: style as StyleType,
      points,
      rank: index + 1
    }));

    // Sort by score descending and update ranks
    return results.sort((a, b) => b.score - a.score).map((result, index) => ({
      ...result,
      rank: index + 1
    }));
  };

  const determineResult = (responses: UserResponse[], participantName: string) => {
    const styleScores = calculateStyleScores(responses);
    const predominantStyle = styleScores[0];
    
    return {
      id: `result-${Date.now()}`,
      participantName,
      responses: responses.map(convertUserResponseToQuizResponse),
      styleScores,
      predominantStyle: predominantStyle.style,
      primaryStyle: predominantStyle,
      complementaryStyles: styleScores.slice(1, 3).map(s => s.style),
      secondaryStyles: styleScores.slice(1, 3),
      totalNormalQuestions: responses.length,
      calculatedAt: new Date()
    };
  };

  return {
    calculateStyleScores,
    determineResult
  };
};

export const caktoQuizEngine = createCaktoQuizEngine();

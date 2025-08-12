import { QuizAnswer, QuizQuestion, QuizResult } from '@/types/quiz';

export function calculateQuizResult(answers: QuizAnswer[], questions: QuizQuestion[]): QuizResult {
  // Simple scoring algorithm
  const styleScores: Record<string, number> = {};

  // Calculate scores based on answers
  answers.forEach(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      const option = question.options.find(o => o.id === answer.optionId);
      if (option?.style) {
        styleScores[option.style] = (styleScores[option.style] || 0) + (option.weight || 1);
      }
    }
  });

  // Find predominant style
  const sortedStyles = Object.entries(styleScores).sort(([, a], [, b]) => b - a);
  const predominantStyle = sortedStyles[0]?.[0] || 'natural';
  const complementaryStyles = sortedStyles.slice(1, 4).map(([style]) => style);

  return {
    primaryStyle: {
      category: predominantStyle,
      score: styleScores[predominantStyle] || 0,
      percentage: Math.round(
        ((styleScores[predominantStyle] || 0) /
          Object.values(styleScores).reduce((a, b) => a + b, 1)) *
          100
      ),
      style: predominantStyle,
      points: styleScores[predominantStyle] || 0,
      rank: 1,
    },
    secondaryStyles: complementaryStyles.map((style, index) => ({
      category: style,
      score: styleScores[style] || 0,
      percentage: Math.round(
        ((styleScores[style] || 0) / Object.values(styleScores).reduce((a, b) => a + b, 1)) * 100
      ),
      style,
      points: styleScores[style] || 0,
      rank: index + 2,
    })),
    totalQuestions: questions.length,
    completedAt: new Date(),
    scores: styleScores,
    predominantStyle,
    complementaryStyles,
    styleScores,
  };
}

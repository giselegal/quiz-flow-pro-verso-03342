// @ts-nocheck
import { QuizQuestion, StyleResult } from '@/types/quiz';

// Note: Quiz questions are now hardcoded in the frontend for simplicity
// This eliminates the need for complex dynamic quiz management
export const fetchQuizQuestions = async (quizId: string) => {
  // Quiz questions are now statically defined in the application
  // This simplifies the migration and improves performance
  return [];
};

export const saveParticipant = async (name: string, email: string, quizId: string) => {
  const response = await fetch('http://localhost:3001/api/quiz-participants', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      quizId,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to save participant');
  }

  return result.data;
};

export const saveAnswers = async (
  participantId: string,
  answers: Array<{ questionId: string; optionId: string; points: number }>
) => {
  // Quiz answers are now handled client-side for performance
  // Results are calculated locally and don't need individual answer storage
  console.log('Quiz answers processed locally:', answers.length);
  return;
};

export const saveResults = async (participantId: string, results: Array<StyleResult>) => {
  // Results are calculated and displayed client-side
  // Storage can be implemented later if analytics are needed
  console.log('Quiz results calculated for participant:', participantId, results);
  return;
};


import { QuizQuestion } from '../types/quiz';
import { selfPerceptionQuestions } from './questions/selfPerceptionQuestions';
import { styleExperienceQuestions } from './questions/styleExperienceQuestions';
import { purchaseIntentQuestions } from './questions/purchaseIntentQuestions';
import { desiredOutcomesQuestions } from './questions/desiredOutcomesQuestions';

// Concatenate all strategic questions in the correct order
export const strategicQuestions: QuizQuestion[] = [
  ...selfPerceptionQuestions,
  ...styleExperienceQuestions,
  ...purchaseIntentQuestions,
  ...desiredOutcomesQuestions
];

console.log('Strategic questions loaded:', strategicQuestions.length);

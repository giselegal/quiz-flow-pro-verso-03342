import { QuizTemplate } from '@/types/quizBuilder';

interface QuestionScoringConfig {
  [key: string]: {
    type?: string;
    multiSelect?: number;
    scoring?: boolean;
  };
}

const questionScoringConfig: QuestionScoringConfig = {
  question1: {
    type: 'multiple-choice',
    multiSelect: 1,
    scoring: true,
  },
  question2: {
    type: 'multiple-choice',
    multiSelect: 1,
    scoring: true,
  },
  question3: {
    type: 'multiple-choice',
    multiSelect: 1,
    scoring: true,
  },
  question4: {
    type: 'multiple-choice',
    multiSelect: 1,
    scoring: true,
  },
  question5: {
    type: 'multiple-choice',
    multiSelect: 1,
    scoring: true,
  },
  question6: {
    type: 'multiple-choice',
    multiSelect: 1,
    scoring: true,
  },
  question7: {
    type: 'multiple-choice',
    multiSelect: 1,
    scoring: true,
  },
  question8: {
    type: 'multiple-choice',
    multiSelect: 1,
    scoring: true,
  },
  question9: {
    type: 'multiple-choice',
    multiSelect: 1,
    scoring: true,
  },
  question10: {
    type: 'multiple-choice',
    multiSelect: 1,
    scoring: true,
  },
};

export const generateRealQuestionTemplates = (): QuizTemplate[] => {
  const questionKeys = Object.keys(questionScoringConfig);

  return questionKeys.map((questionKey, index) => {
    const config = questionScoringConfig[questionKey as keyof typeof questionScoringConfig];

    return {
      id: `question-${index + 1}`,
      title: `Questão ${index + 1}`,
      type: config?.type || 'multiple-choice',
      progress: ((index + 1) / questionKeys.length) * 100,
      multiSelect: config?.multiSelect || 3,
      blocks: [],
      validationRules: config,
      scoringEnabled: config?.scoring || false,
    };
  });
};

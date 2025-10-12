import { generateRealQuestionTemplates } from '@/data/realQuizTemplates';

/**
 * ETAPAS 2-11: QUESTÕES PRINCIPAIS (10 QUESTÕES)
 * Factory para gerar questões baseadas no template real
 */
export const createQuestionStep = (stepNumber: number) => {
  const questionIndex = stepNumber - 2; // Etapa 2 = índice 0, Etapa 3 = índice 1, etc.
  const questionTemplates = generateRealQuestionTemplates();
  const questionTemplate = questionTemplates[questionIndex];

  if (!questionTemplate) {
    console.error(`❌ Template da questão ${questionIndex + 1} não encontrado`);
    return null;
  }

  return {
    id: `etapa-${stepNumber}`,
    name: `Q${questionIndex + 1}`,
    type: 'question',
    description: questionTemplate.title,
    multiSelect: questionTemplate.multiSelect || 3,
    blocks: questionTemplate.blocks,
    questionData: {
      title: questionTemplate.title,
      type: questionTemplate.type,
      progress: questionTemplate.progress,
      validationRules: questionTemplate.validationRules,
      scoringEnabled: questionTemplate.scoringEnabled,
    },
  };
};

/**
 * Função para gerar todas as etapas de questões (2-11)
 */
export const generateQuestionSteps = () => {
  const steps: any[] = [];

  for (let stepNumber = 2; stepNumber <= 11; stepNumber++) {
    const step = createQuestionStep(stepNumber);
    if (step) {
      steps.push(step);
    }
  }

  return steps;
};

export default createQuestionStep;

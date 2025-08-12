import {
  QuizBuilderState,
  QuizComponentData,
  QuizComponentType,
  QuizStage,
} from '@/types/quizBuilder';
import { generateId } from '@/utils/idGenerator';
import { ResultPageConfig } from '@/types/resultPageConfig';

// Function to create a basic quiz builder state with initial stages
export const generateInitialStages = () => {
  const welcomeStage: QuizStage = {
    id: generateId(),
    title: 'Bem-vindo',
    type: 'cover',
    order: 0,
  };

  const questionStage: QuizStage = {
    id: generateId(),
    title: 'Pergunta 1',
    type: 'question',
    order: 1,
  };

  const resultStage: QuizStage = {
    id: generateId(),
    title: 'Seu Resultado',
    type: 'result',
    order: 2,
  };

  const stages = [welcomeStage, questionStage, resultStage];

  // Create default components
  const components: QuizComponentData[] = [
    {
      id: generateId(),
      type: 'headline',
      stageId: welcomeStage.id,
      data: {
        title: 'Quiz de Estilo Pessoal',
        subtitle: 'Descubra seu estilo predominante',
        alignment: 'center',
      },
      order: 0,
    },
    {
      id: generateId(),
      type: 'text',
      stageId: questionStage.id,
      data: {
        text: 'Qual opção descreve melhor seu estilo?',
        alignment: 'center',
      },
      order: 0,
    },
    {
      id: generateId(),
      type: 'quizResult',
      stageId: resultStage.id,
      data: {
        title: 'Seu Resultado de Estilo Pessoal',
        showShare: true,
        alignment: 'center',
      },
      order: 0,
    },
  ];

  return { stages, components };
};

export const createBuilderStateFromQuiz = (
  quizQuestions: any[],
  title: string = 'Quiz de Estilo Pessoal',
  subtitle: string = 'Descubra seu estilo predominante',
  resultTitle: string = 'Seu Resultado de Estilo Pessoal'
) => {
  // Create stages
  const welcomeStage: QuizStage = {
    id: generateId(),
    title: 'Bem-vindo',
    type: 'cover',
    order: 0,
  };

  // Create a question stage for each question
  const questionStages: QuizStage[] = quizQuestions.map((_, index) => ({
    id: generateId(),
    title: `Pergunta ${index + 1}`,
    type: 'question',
    order: index + 1,
  }));

  const resultStage: QuizStage = {
    id: generateId(),
    title: 'Seu Resultado',
    type: 'result',
    order: questionStages.length + 1,
  };

  const stages = [welcomeStage, ...questionStages, resultStage];

  // Create welcome components
  const welcomeComponents: QuizComponentData[] = [
    {
      id: generateId(),
      type: 'headline',
      stageId: welcomeStage.id,
      data: {
        title,
        subtitle,
        alignment: 'center',
      },
      order: 0,
    },
    {
      id: generateId(),
      type: 'button',
      stageId: welcomeStage.id,
      data: {
        text: 'Iniciar Quiz',
        action: 'next',
        alignment: 'center',
      },
      order: 1,
    },
  ];

  // Create question components
  const questionComponents: QuizComponentData[] = [];
  quizQuestions.forEach((question, qIndex) => {
    questionComponents.push({
      id: generateId(),
      type: 'text',
      stageId: questionStages[qIndex].id,
      data: {
        text: question.text || `Pergunta ${qIndex + 1}`,
        alignment: 'center',
      },
      order: 0,
    });

    // Add options
    if (question.options && Array.isArray(question.options)) {
      question.options.forEach((option: any, oIndex: number) => {
        questionComponents.push({
          id: generateId(),
          type: 'multipleChoice',
          stageId: questionStages[qIndex].id,
          data: {
            text: option.text || `Opção ${oIndex + 1}`,
            value: option.value || String(oIndex),
            options: [option.text || `Opção ${oIndex + 1}`],
            alignment: 'center',
          },
          order: oIndex + 1,
        });
      });
    }
  });

  // Create result component
  const resultComponents: QuizComponentData[] = [
    {
      id: generateId(),
      type: 'quizResult',
      stageId: resultStage.id,
      data: {
        title: resultTitle,
        showShare: true,
        alignment: 'center',
      },
      order: 0,
    },
  ];

  const components = [...welcomeComponents, ...questionComponents, ...resultComponents];

  return { stages, components };
};

// Add function to convert ResultPageConfig to QuizBuilderState
export const createBuilderStateFromResultPage = (config: ResultPageConfig): QuizBuilderState => {
  const resultStageId = generateId();

  const stage: QuizStage = {
    id: resultStageId,
    title: 'Página de Resultado',
    type: 'result',
    order: 0,
  };

  // Convert blocks from ResultPageConfig to QuizComponentData
  const components: QuizComponentData[] =
    (config.blocks || []).map((block: any, index: number) => ({
      id: generateId(),
      type: block.type as QuizComponentType, // Fixing this line to use the imported QuizComponentType
      stageId: resultStageId,
      data: block.content,
      order: index,
    })) || [];

  return {
    stages: [stage],
    components,
  };
};

export const loadQuizResultConfig = (styleType: string) => {
  try {
    const configKey = `result_page_config_${styleType}`;
    const savedConfig = localStorage.getItem(configKey);
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
    return null;
  } catch (error) {
    console.error('Error loading quiz result config:', error);
    return null;
  }
};

import { generateQuestionSteps } from './QuestionStepsFactory';

/**
 * CENTRALIZADOR DE TODAS AS ETAPAS DO QUIZ
 * Arquitetura limpa e organizada
 */

// Etapa 1: Introdução (removido Step01Intro para evitar confusão)
export const getStep01 = () => ({
  id: 'etapa-1',
  name: 'Introdução',
  type: 'introduction',
  description: 'Tela de boas-vindas e captura de nome',
  blocks: []
});

// Etapas 2-11: Questões
export const getQuestionSteps = () => generateQuestionSteps();

// Etapa 12: Transição
export const getStep12 = () => ({
  id: 'etapa-12',
  name: 'Transição',
  type: 'transition',
  description: 'Análise dos resultados parciais',
  blocks: [
    {
      type: 'quiz-intro-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 60,
        progressMax: 100,
        showBackButton: true,
      },
    },
    {
      type: 'heading-inline',
      properties: {
        content: 'Agora vamos conhecer você melhor',
        level: 'h2',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 16,
      },
    },
    {
      type: 'text-inline',
      properties: {
        content:
          'Suas escolhas até agora já revelam muito sobre seu estilo. Agora vamos aprofundar para criar um perfil ainda mais preciso.',
        fontSize: 'text-lg',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 32,
      },
    },
    {
      type: 'button-inline',
      properties: {
        text: 'Continuar Análise',
        variant: 'primary',
        size: 'large',
        fullWidth: true,
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
      },
    },
  ],
});

// Função para obter qualquer etapa por ID
export const getStepById = (stepId: string) => {
  const stepNumber = parseInt(stepId.replace('etapa-', ''));

  switch (stepNumber) {
    case 1:
      return getStep01();
    case 12:
      return getStep12();
    default:
      if (stepNumber >= 2 && stepNumber <= 11) {
        const questionSteps = getQuestionSteps();
        return questionSteps.find(step => step.id === stepId);
      }
      return null;
  }
};

// Função para gerar todas as 21 etapas
export const generateAllSteps = () => {
  const allSteps = [];

  // Etapa 1
  allSteps.push(getStep01());

  // Etapas 2-11 (Questões)
  allSteps.push(...getQuestionSteps());

  // Etapa 12 (Transição)
  allSteps.push(getStep12());

  // TODO: Adicionar etapas 13-21 conforme necessário

  return allSteps;
};

export default {
  getStep01,
  getQuestionSteps,
  getStep12,
  getStepById,
  generateAllSteps,
};

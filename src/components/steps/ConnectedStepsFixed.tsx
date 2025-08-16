// Template universal para corrigir templates conectados que usavam hooks
import { COMPLETE_QUIZ_QUESTIONS } from '@/data/correctQuizQuestions';

/**
 * Gera template para etapas de quiz baseado no número da etapa
 */
export const generateConnectedStepTemplate = (stepNumber: number, questionIndex: number) => {
  const questionData = COMPLETE_QUIZ_QUESTIONS[questionIndex] || COMPLETE_QUIZ_QUESTIONS[0];
  const progressValue = (stepNumber / 21) * 100;
  
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: `step${String(stepNumber).padStart(2, '0')}-header`,
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: Math.round(progressValue),
        progressMax: 100,
        showBackButton: stepNumber > 1,
        spacing: 'small',
      },
    },

    // 🎯 TÍTULO DA QUESTÃO
    {
      id: `step${String(stepNumber).padStart(2, '0')}-question-title`,
      type: 'text-inline',
      properties: {
        content: questionData.text,
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        spacing: 'small',
      },
    },

    // 📊 CONTADOR DE QUESTÃO
    {
      id: `step${String(stepNumber).padStart(2, '0')}-question-counter`,
      type: 'text-inline',
      properties: {
        content: `Questão ${questionIndex + 1} de 10`,
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        spacing: 'small',
      },
    },

    // 🎯 GRADE DE OPÇÕES
    {
      id: `step${String(stepNumber).padStart(2, '0')}-options`,
      type: 'options-grid',
      properties: {
        options: questionData.options.map((option: any) => ({
          id: option.id,
          text: option.text,
          description: option.text,
          imageUrl: option.imageUrl,
          value: option.id,
          category: option.styleCategory,
          points: option.weight,
        })),
        layout: 'grid',
        columns: 2,
        gap: 16,
        questionId: questionData.id,
        allowMultiple: (questionData.multiSelect || 1) > 1,
        maxSelection: questionData.multiSelect || 1,
        autoAdvance: true,
        containerWidth: 'full',
        spacing: 'small',
      },
    },

    // 🔘 BOTÃO CONTINUAR
    {
      id: `step${String(stepNumber).padStart(2, '0')}-continue-button`,
      type: 'button-inline',
      properties: {
        text: 'Continuar →',
        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        fullWidth: true,
        spacing: 'small',
        onClick: 'navigate-next-step',
        stepId: `step-${String(stepNumber).padStart(2, '0')}`,
      },
    },
  ];
};

// Templates individuais corrigidos
export const ConnectedStep03Template = () => generateConnectedStepTemplate(3, 1);
export const ConnectedStep04Template = () => generateConnectedStepTemplate(4, 2);
export const ConnectedStep05Template = () => generateConnectedStepTemplate(5, 3);
export const ConnectedStep06Template = () => generateConnectedStepTemplate(6, 4);
export const ConnectedStep07Template = () => generateConnectedStepTemplate(7, 5);
export const ConnectedStep08Template = () => generateConnectedStepTemplate(8, 6);
export const ConnectedStep09Template = () => generateConnectedStepTemplate(9, 7);
export const ConnectedStep10Template = () => generateConnectedStepTemplate(10, 8);
export const ConnectedStep11Template = () => generateConnectedStepTemplate(11, 9);

// Templates estratégicos (12-19) com layout diferente
export const ConnectedStep12Template = () => generateConnectedStepTemplate(12, 0);
export const ConnectedStep13Template = () => generateConnectedStepTemplate(13, 0);
export const ConnectedStep14Template = () => generateConnectedStepTemplate(14, 0);
export const ConnectedStep15Template = () => generateConnectedStepTemplate(15, 0);
export const ConnectedStep16Template = () => generateConnectedStepTemplate(16, 0);
export const ConnectedStep17Template = () => generateConnectedStepTemplate(17, 0);
export const ConnectedStep18Template = () => generateConnectedStepTemplate(18, 0);
export const ConnectedStep19Template = () => generateConnectedStepTemplate(19, 0);

// Exports individuais para compatibilidade
export const getConnectedStep03Template = () => ConnectedStep03Template();
export const getConnectedStep04Template = () => ConnectedStep04Template();
export const getConnectedStep05Template = () => ConnectedStep05Template();
export const getConnectedStep06Template = () => ConnectedStep06Template();
export const getConnectedStep07Template = () => ConnectedStep07Template();
export const getConnectedStep08Template = () => ConnectedStep08Template();
export const getConnectedStep09Template = () => ConnectedStep09Template();
export const getConnectedStep10Template = () => ConnectedStep10Template();
export const getConnectedStep11Template = () => ConnectedStep11Template();
export const getConnectedStep12Template = () => ConnectedStep12Template();
export const getConnectedStep13Template = () => ConnectedStep13Template();
export const getConnectedStep14Template = () => ConnectedStep14Template();
export const getConnectedStep15Template = () => ConnectedStep15Template();
export const getConnectedStep16Template = () => ConnectedStep16Template();
export const getConnectedStep17Template = () => ConnectedStep17Template();
export const getConnectedStep18Template = () => ConnectedStep18Template();
export const getConnectedStep19Template = () => ConnectedStep19Template();
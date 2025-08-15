// Template universal para corrigir templates conectados que usavam hooks
import { COMPLETE_QUIZ_QUESTIONS } from '@/data/correctQuizQuestions';

/**
 * Gera template para questões principais do quiz (steps 3-11 = q1-q10)
 */
export const generateQuizQuestionTemplate = (stepNumber: number, questionIndex: number) => {
  const questionData = COMPLETE_QUIZ_QUESTIONS[questionIndex] || COMPLETE_QUIZ_QUESTIONS[1];
  const progressValue = (stepNumber / 21) * 100;
  const questionNumber = stepNumber - 2; // Step 3 = Question 1
  
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
        showBackButton: true,
        spacing: 'small',
        marginTop: 0,
        marginBottom: 0,
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
        marginBottom: 0,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 📊 CONTADOR DE QUESTÃO
    {
      id: `step${String(stepNumber).padStart(2, '0')}-question-counter`,
      type: 'text-inline',
      properties: {
        content: `Questão ${questionNumber} de 10`,
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 🎯 GRADE DE OPÇÕES
    {
      id: `step${String(stepNumber).padStart(2, '0')}-options`,
      type: 'options-grid',
      properties: {
        questionId: questionData.id,
        options: questionData.options.map((option: any) => ({
          id: option.id,
          text: option.text,
          description: option.text,
          imageUrl: option.imageUrl || undefined,
          value: option.id,
          category: option.styleCategory,
          styleCategory: option.styleCategory,
          points: option.weight,
          marginTop: 0,
          spacing: 'small',
          marginBottom: 0,
        })),
        
        // Layout baseado no tipo da questão
        columns: questionData.type === 'image' ? 2 : 1,
        showImages: !!questionData.options.some((opt: any) => opt.imageUrl),
        multipleSelection: (questionData.multiSelect || 1) > 1,
        maxSelections: questionData.multiSelect || 3,
        minSelections: questionData.multiSelect || 3,
        autoAdvance: true,
        validationMessage: `Selecione ${questionData.multiSelect || 3} opções`,
        gridGap: 12,
        responsiveColumns: false,
        
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        instantActivation: true,
        requiredSelections: questionData.multiSelect || 3,
        
        currentSelections: [],
        isLoading: false,
        marginTop: 0,
        spacing: 'small',
        marginBottom: 16,
      },
    },

    // 🔘 BOTÃO CONTINUAR
    {
      id: `step${String(stepNumber).padStart(2, '0')}-continue-button`,
      type: 'button-inline',
      properties: {
        text: 'Continuar →',
        textWhenDisabled: `Selecione ${questionData.multiSelect || 3} opções para continuar`,
        textWhenComplete: 'Continuar →',
        
        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        disabledBackgroundColor: '#E5E7EB',
        disabledTextColor: '#9CA3AF',
        
        disabled: true, // Será habilitado via event system
        requiresValidInput: true,
        instantActivation: true,
        autoAdvanceAfterActivation: false,
        
        fullWidth: true,
        marginTop: 0,
        textAlign: 'text-center',
        spacing: 'small',
        marginBottom: 0,
      },
    },
  ];
};

/**
 * Gera template para questões estratégicas (steps 13-18 = strategic1-strategic6)
 */
export const generateStrategicQuestionTemplate = (stepNumber: number, strategicIndex: number) => {
  const questionData = COMPLETE_QUIZ_QUESTIONS[12 + strategicIndex]; // strategic1-6 start at index 12
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
        showBackButton: true,
        spacing: 'small',
        marginTop: 0,
        marginBottom: 32,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO ESTRATÉGICA
    {
      id: `step${String(stepNumber).padStart(2, '0')}-question-title`,
      type: 'text-inline',
      properties: {
        content: questionData.text,
        fontSize: 'text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 32,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 🎯 OPÇÕES ESTRATÉGICAS (1 coluna, texto apenas)
    {
      id: `step${String(stepNumber).padStart(2, '0')}-strategic-options`,
      type: 'options-grid',
      properties: {
        questionId: questionData.id,
        options: questionData.options.map((option: any) => ({
          id: option.id,
          text: option.text,
          description: option.text,
          value: option.id,
          category: option.category,
          strategicType: option.strategicType,
          points: option.weight,
          marginTop: 0,
          spacing: 'small',
          marginBottom: 0,
        })),
        
        columns: 1,
        showImages: false,
        multipleSelection: false,
        maxSelections: 1,
        minSelections: 1,
        autoAdvance: false, // SEM AUTO-AVANÇO para estratégicas
        validationMessage: 'Selecione uma opção',
        gridGap: 12,
        responsiveColumns: false,
        
        currentSelections: [],
        isLoading: false,
      },
    },

    // 🔘 BOTÃO MANUAL (SEM AUTO-AVANÇO)
    {
      id: `step${String(stepNumber).padStart(2, '0')}-continue-button`,
      type: 'button-inline',
      properties: {
        text: 'Continuar',
        textWhenDisabled: 'Selecione uma opção para continuar',
        textWhenComplete: 'Continuar',

        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        disabledBackgroundColor: '#E5E7EB',
        disabledTextColor: '#9CA3AF',

        disabled: true, // Será habilitado via event system
        requiresValidInput: true,
        instantActivation: false,
        autoAdvanceAfterActivation: false,

        marginTop: 24,
        spacing: 'small',
        marginBottom: 0,
      },
    },
  ];
};

/**
 * Gera template para páginas de transição
 */
export const generateTransitionTemplate = (stepNumber: number, transitionId: string) => {
  const transitionData = COMPLETE_QUIZ_QUESTIONS.find(q => q.id === transitionId);
  const progressValue = (stepNumber / 21) * 100;
  
  const isFirstTransition = transitionId === 'transition1';
  const icon = isFirstTransition ? '🕐' : '✨';
  const subtitle = isFirstTransition 
    ? 'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.'
    : 'Agora, é hora de revelar o seu Estilo Predominante — e os seus Estilos Complementares.';
  
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
        showBackButton: true,
        spacing: 'small',
        marginTop: 0,
        marginBottom: 32,
      },
    },

    // 🕐/✨ ÍCONE DE TRANSIÇÃO
    {
      id: `step${String(stepNumber).padStart(2, '0')}-transition-icon`,
      type: 'text-inline',
      properties: {
        content: icon,
        fontSize: 'text-6xl',
        textAlign: 'text-center',
        marginBottom: 24,
        marginTop: 0,
        spacing: 'small',
      },
    },

    // 🎯 TÍTULO PRINCIPAL
    {
      id: `step${String(stepNumber).padStart(2, '0')}-main-title`,
      type: 'text-inline',
      properties: {
        content: transitionData?.text || 'Processando...',
        fontSize: 'text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 32,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 📝 SUBTÍTULO
    {
      id: `step${String(stepNumber).padStart(2, '0')}-subtitle`,
      type: 'text-inline',
      properties: {
        content: subtitle,
        fontSize: 'text-xl',
        fontWeight: 'font-medium',
        textAlign: 'text-center',
        color: '#6B4F43',
        marginBottom: 48,
        spacing: 'small',
        marginTop: 0,
        lineHeight: 'leading-relaxed',
      },
    },

    // 🔘 BOTÃO PARA CONTINUAR
    {
      id: `step${String(stepNumber).padStart(2, '0')}-continue-button`,
      type: 'button-inline',
      properties: {
        text: 'Vamos lá!',
        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        
        disabled: false, // Sempre habilitado (página de transição)
        requiresValidInput: false,

        fullWidth: true,
        marginTop: 24,
        textAlign: 'text-center',
        spacing: 'small',
        marginBottom: 0,
      },
    },
  ];
};

// ✅ TEMPLATES CORRIGIDOS COM MAPEAMENTO CORRETO

// Steps 3-11: Quiz Questions (q1-q10)
export const ConnectedStep03Template = () => generateQuizQuestionTemplate(3, 1);  // q1
export const ConnectedStep04Template = () => generateQuizQuestionTemplate(4, 2);  // q2
export const ConnectedStep05Template = () => generateQuizQuestionTemplate(5, 3);  // q3
export const ConnectedStep06Template = () => generateQuizQuestionTemplate(6, 4);  // q4
export const ConnectedStep07Template = () => generateQuizQuestionTemplate(7, 5);  // q5
export const ConnectedStep08Template = () => generateQuizQuestionTemplate(8, 6);  // q6
export const ConnectedStep09Template = () => generateQuizQuestionTemplate(9, 7);  // q7
export const ConnectedStep10Template = () => generateQuizQuestionTemplate(10, 8); // q8
export const ConnectedStep11Template = () => generateQuizQuestionTemplate(11, 9); // q9

// Step 12: Transition 1 (to strategic questions)
export const ConnectedStep12Template = () => generateTransitionTemplate(12, 'transition1');

// Steps 13-18: Strategic Questions (strategic1-strategic6)
export const ConnectedStep13Template = () => generateStrategicQuestionTemplate(13, 0); // strategic1
export const ConnectedStep14Template = () => generateStrategicQuestionTemplate(14, 1); // strategic2  
export const ConnectedStep15Template = () => generateStrategicQuestionTemplate(15, 2); // strategic3
export const ConnectedStep16Template = () => generateStrategicQuestionTemplate(16, 3); // strategic4
export const ConnectedStep17Template = () => generateStrategicQuestionTemplate(17, 4); // strategic5
export const ConnectedStep18Template = () => generateStrategicQuestionTemplate(18, 5); // strategic6

// Step 19: Transition 2 (to results)
export const ConnectedStep19Template = () => generateTransitionTemplate(19, 'transition2');

// ✅ EXPORTS INDIVIDUAIS PARA COMPATIBILIDADE
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
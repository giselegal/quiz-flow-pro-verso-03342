// 🎯 TEMPLATE DE BLOCOS DA ETAPA 9 - QUESTÃO 8: CALÇADOS PREFERIDOS

export const getStep09Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step09-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 50,
        progressMax: 100,
        showBackButton: true,
        marginTop: 0,
        spacing: 'small',
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO
    {
      id: 'step09-question-title',
      type: 'text-inline',
      properties: {
        content: 'QUAL DESSES SAPATOS VOCÊ TEM OU MAIS GOSTA?',
        level: 'h2',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 0,
        marginTop: 0,
        spacing: 'small',
      },
    },

    // 📊 CONTADOR DE QUESTÃO
    {
      id: 'step09-question-counter',
      type: 'text-inline',
      properties: {
        content: 'Questão 8 de 10',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24,
        marginTop: 0,
        spacing: 'small',
      },
    },

    // 🎯 GRADE DE OPÇÕES DE CALÇADOS
    {
      id: 'step09-shoe-options',
      type: 'options-grid',
      properties: {
        questionId: 'q8',
        options: [
          {
            id: '8a',
            text: 'Tênis confortáveis e práticos',
            value: '8a',
            category: 'Natural',
            styleCategory: 'Natural',
            points: 3,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735490/tenis-confortaveis_m8q4kn.webp',
          },
          {
            id: '8b',
            text: 'Sapatos baixos clássicos',
            value: '8b',
            category: 'Clássico',
            styleCategory: 'Clássico',
            points: 3,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735491/sapatos-classicos_p7kj2q.webp',
          },
          {
            id: '8c',
            text: 'Ankle boots modernas',
            value: '8c',
            category: 'Contemporâneo',
            styleCategory: 'Contemporâneo',
            points: 2,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735492/ankle-boots_x9qn7t.webp',
          },
          {
            id: '8d',
            text: 'Saltos altos sofisticados',
            value: '8d',
            category: 'Elegante',
            styleCategory: 'Elegante',
            points: 4,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735493/saltos-elegantes_k3lm8p.webp',
          },
          {
            id: '8e',
            text: 'Sapatilhas delicadas',
            value: '8e',
            category: 'Romântico',
            styleCategory: 'Romântico',
            points: 3,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735494/sapatilhas-delicadas_q7pn4k.webp',
          },
          {
            id: '8f',
            text: 'Saltos sensuais e marcantes',
            value: '8f',
            category: 'Sexy',
            styleCategory: 'Sexy',
            points: 4,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735495/saltos-sexy_m2kj9l.webp',
          },
          {
            id: '8g',
            text: 'Botas statement dramáticas',
            value: '8g',
            category: 'Dramático',
            styleCategory: 'Dramático',
            points: 4,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735496/botas-dramaticas_n8qm3x.webp',
          },
          {
            id: '8h',
            text: 'Calçados únicos e diferentes',
            value: '8h',
            category: 'Criativo',
            styleCategory: 'Criativo',
            points: 4,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735497/calcados-criativos_k9pj7q.webp',
          },
        ],
        columns: 2,
        showImages: true,
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 3,
        autoAdvance: true,
        validationMessage: 'Selecione até 3 tipos de calçados que mais usa',
        gridGap: 16,
        responsiveColumns: true,
        autoAdvanceOnComplete: true,
        autoAdvanceDelay: 1500,
        requiredSelections: 3,
        enableButtonOnlyWhenValid: false,
        instantActivation: true,
        showValidationFeedback: true,
      },
    },

    // 🔘 BOTÃO DE NAVEGAÇÃO
    {
      id: 'step09-continue-button',
      type: 'button-inline',
      properties: {
        text: 'Continuar →',
        variant: 'primary',
        size: 'large',
        fullWidth: true,
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        disabled: true,
        requiresValidSelection: true,
        marginTop: 0,
        spacing: 'small',
        marginBottom: 0,
      },
    },
  ];
};

export default getStep09Template;
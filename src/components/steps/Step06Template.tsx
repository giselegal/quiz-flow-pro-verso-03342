// 🎯 TEMPLATE DE BLOCOS DA ETAPA 6 - QUESTÃO 5: CORES PREFERIDAS

export const getStep06Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step06-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 33,
        progressMax: 100,
        showBackButton: true,
        marginTop: 0,
        spacing: 'small',
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO
    {
      id: 'step06-question-title',
      type: 'text-inline',
      properties: {
        content: 'QUAIS CORES VOCÊ MAIS SE IDENTIFICA?',
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
      id: 'step06-question-counter',
      type: 'text-inline',
      properties: {
        content: 'Questão 5 de 10',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24,
        marginTop: 0,
        spacing: 'small',
      },
    },

    // 🎯 GRADE DE OPÇÕES DE CORES
    {
      id: 'step06-color-options',
      type: 'options-grid',
      properties: {
        questionId: 'q5',
        options: [
          {
            id: '5a',
            text: 'Tons terrosos e naturais',
            value: '5a',
            category: 'Natural',
            styleCategory: 'Natural',
            points: 3,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735396/cores-naturais_yqw7mk.webp',
          },
          {
            id: '5b',
            text: 'Preto, branco e neutros',
            value: '5b',
            category: 'Clássico',
            styleCategory: 'Clássico',
            points: 3,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735395/cores-classicas_hx3q8w.webp',
          },
          {
            id: '5c',
            text: 'Cinza, bege e modernos',
            value: '5c',
            category: 'Contemporâneo',
            styleCategory: 'Contemporâneo',
            points: 3,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735394/cores-contemporaneas_z7pm4n.webp',
          },
          {
            id: '5d',
            text: 'Azul marinho e sofisticados',
            value: '5d',
            category: 'Elegante',
            styleCategory: 'Elegante',
            points: 3,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735396/cores-elegantes_mfp9xk.webp',
          },
          {
            id: '5e',
            text: 'Rosa, lavanda e delicados',
            value: '5e',
            category: 'Romântico',
            styleCategory: 'Romântico',
            points: 3,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735397/cores-romanticas_k8qm3l.webp',
          },
          {
            id: '5f',
            text: 'Vermelho e tons vibrantes',
            value: '5f',
            category: 'Sexy',
            styleCategory: 'Sexy',
            points: 3,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735398/cores-sexy_n4jp2r.webp',
          },
          {
            id: '5g',
            text: 'Preto intenso e dramáticos',
            value: '5g',
            category: 'Dramático',
            styleCategory: 'Dramático',
            points: 3,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735399/cores-dramaticas_x9qn8t.webp',
          },
          {
            id: '5h',
            text: 'Colorido e vibrante mix',
            value: '5h',
            category: 'Criativo',
            styleCategory: 'Criativo',
            points: 4,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735400/cores-criativas_p5kj7l.webp',
          },
        ],
        columns: 2,
        showImages: true,
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 3,
        autoAdvance: true,
        validationMessage: 'Selecione até 3 cores que mais combinam com você',
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
      id: 'step06-continue-button',
      type: 'button-inline',
      properties: {
        text: 'Próxima Questão →',
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

export default getStep06Template;
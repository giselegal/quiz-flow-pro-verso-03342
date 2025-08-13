// 🎯 TEMPLATE DE BLOCOS DA ETAPA 7 - QUESTÃO 6: ACESSÓRIOS PREFERIDOS

export const getStep07Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step07-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 39,
        progressMax: 100,
        showBackButton: true,
        marginTop: 0,
        spacing: 'small',
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO
    {
      id: 'step07-question-title',
      type: 'text-inline',
      properties: {
        content: 'QUAIS ACESSÓRIOS VOCÊ USA MAIS?',
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
      id: 'step07-question-counter',
      type: 'text-inline',
      properties: {
        content: 'Questão 6 de 10',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24,
        marginTop: 0,
        spacing: 'small',
      },
    },

    // 🎯 GRADE DE OPÇÕES DE ACESSÓRIOS
    {
      id: 'step07-accessory-options',
      type: 'options-grid',
      properties: {
        questionId: 'q6',
        options: [
          {
            id: '6a',
            text: 'Brincos pequenos e delicados',
            value: '6a',
            category: 'Natural',
            styleCategory: 'Natural',
            points: 2,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735430/brincos-delicados_m8q4kn.webp',
          },
          {
            id: '6b',
            text: 'Relógio clássico e elegante',
            value: '6b',
            category: 'Clássico',
            styleCategory: 'Clássico',
            points: 3,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735431/relogio-classico_p7kj2q.webp',
          },
          {
            id: '6c',
            text: 'Óculos modernos e estilosos',
            value: '6c',
            category: 'Contemporâneo',
            styleCategory: 'Contemporâneo',
            points: 2,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735432/oculos-modernos_x9qn7t.webp',
          },
          {
            id: '6d',
            text: 'Joias sofisticadas e finas',
            value: '6d',
            category: 'Elegante',
            styleCategory: 'Elegante',
            points: 4,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735433/joias-elegantes_k3lm8p.webp',
          },
          {
            id: '6e',
            text: 'Colares românticos e femininos',
            value: '6e',
            category: 'Romântico',
            styleCategory: 'Romântico',
            points: 3,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735434/colares-romanticos_q7pn4k.webp',
          },
          {
            id: '6f',
            text: 'Acessórios chamtivos e sexy',
            value: '6f',
            category: 'Sexy',
            styleCategory: 'Sexy',
            points: 4,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735435/acessorios-sexy_m2kj9l.webp',
          },
          {
            id: '6g',
            text: 'Peças statement marcantes',
            value: '6g',
            category: 'Dramático',
            styleCategory: 'Dramático',
            points: 4,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735436/statement-dramatico_n8qm3x.webp',
          },
          {
            id: '6h',
            text: 'Mix criativo e único',
            value: '6h',
            category: 'Criativo',
            styleCategory: 'Criativo',
            points: 4,
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735437/mix-criativo_k9pj7q.webp',
          },
        ],
        columns: 2,
        showImages: true,
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 3,
        autoAdvance: true,
        validationMessage: 'Selecione até 3 tipos de acessórios que mais usa',
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
      id: 'step07-continue-button',
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

export default getStep07Template;
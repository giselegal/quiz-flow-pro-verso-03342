// 🎯 TEMPLATE DE BLOCOS DA ETAPA 8 - QUESTÃO 7: TECIDOS PREFERIDOS

export const getStep08Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step08-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 44,
        progressMax: 100,
        showBackButton: true,
        marginTop: 0,
        spacing: 'small',
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO
    {
      id: 'step08-question-title',
      type: 'text-inline',
      properties: {
        content: 'QUAL SUA CALÇA FAVORITA?',
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
      id: 'step08-question-counter',
      type: 'text-inline',
      properties: {
        content: 'Questão 7 de 10',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24,
        marginTop: 0,
        spacing: 'small',
      },
    },

    // 🎯 GRADE DE OPÇÕES DE TECIDOS
    {
      id: 'step08-fabric-options',
      type: 'options-grid',
      properties: {
        questionId: 'q7',
        options: [
          {
            id: '7a',
            text: 'Algodão e linho naturais',
            value: '7a',
            category: 'Natural',
            styleCategory: 'Natural',
            points: 3,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735460/algodao-linho_m8q4kn.webp',
          },
          {
            id: '7b',
            text: 'Lã e tweed clássicos',
            value: '7b',
            category: 'Clássico',
            styleCategory: 'Clássico',
            points: 3,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735461/la-tweed_p7kj2q.webp',
          },
          {
            id: '7c',
            text: 'Tecidos técnicos modernos',
            value: '7c',
            category: 'Contemporâneo',
            styleCategory: 'Contemporâneo',
            points: 2,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735462/tecnicos-modernos_x9qn7t.webp',
          },
          {
            id: '7d',
            text: 'Seda e cashmere luxuosos',
            value: '7d',
            category: 'Elegante',
            styleCategory: 'Elegante',
            points: 4,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735463/seda-cashmere_k3lm8p.webp',
          },
          {
            id: '7e',
            text: 'Chiffon e rendas delicadas',
            value: '7e',
            category: 'Romântico',
            styleCategory: 'Romântico',
            points: 3,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735464/chiffon-renda_q7pn4k.webp',
          },
          {
            id: '7f',
            text: 'Couro e tecidos justos',
            value: '7f',
            category: 'Sexy',
            styleCategory: 'Sexy',
            points: 4,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735465/couro-justos_m2kj9l.webp',
          },
          {
            id: '7g',
            text: 'Tecidos estruturados marcantes',
            value: '7g',
            category: 'Dramático',
            styleCategory: 'Dramático',
            points: 4,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735466/estruturados_n8qm3x.webp',
          },
          {
            id: '7h',
            text: 'Mix de texturas diferentes',
            value: '7h',
            category: 'Criativo',
            styleCategory: 'Criativo',
            points: 4,
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735467/mix-texturas_k9pj7q.webp',
          },
        ],
        columns: 2,
        showImages: true,
        multipleSelection: true,
        maxSelections: 3,
        minSelections: 3,
        autoAdvance: true,
        validationMessage: 'Selecione até 3 tipos de tecidos preferidos',
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
      id: 'step08-continue-button',
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

export default getStep08Template;

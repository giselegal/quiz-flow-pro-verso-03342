// 🎯 TEMPLATE DE BLOCOS DA ETAPA 2 - QUESTÃO 1: TIPO DE ROUPA FAVORITA
export const getStep02Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step02-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 10,
        progressMax: 100,
        showBackButton: true,
        spacing: 'small',
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: 'step02-question-title',
      type: 'text-inline',
      properties: {
        content: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 0,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 📊 CONTADOR DE QUESTÃO (EDITÁVEL SEPARADAMENTE)
    {
      id: 'step02-question-counter',
      type: 'text-inline',
      properties: {
        content: 'Questão 1 de 10',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 24,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 🎯 GRADE DE OPÇÕES INLINE (100% COMPATÍVEL COM EDITOR)
    {
      id: 'step02-clothing-options',
      type: 'options-grid', // Agora usa OptionsGridInlineBlock
      properties: {
        // 📊 OPÇÕES (mesmo conteúdo, estrutura simplificada para inline)
        options: [
          {
            id: '1a',
            text: 'Natural & Confortável',
            description: 'Amo roupas confortáveis e práticas para o dia a dia',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
            value: '1a',
            category: 'Natural',
            points: 1,
          },
          {
            id: '1b',
            text: 'Clássico & Elegante',
            description: 'Prefiro peças atemporais e elegantes',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
            value: '1b',
            category: 'Clássico',
            points: 2,
          },
          {
            id: '1c',
            text: 'Contemporâneo & Moderno',
            description: 'Gosto de combinar moderno com clássico',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp',
            value: '1c',
            category: 'Contemporâneo',
            points: 2,
          },
          {
            id: '1d',
            text: 'Elegante & Sofisticado',
            description: 'Valorizo sofisticação e refinamento',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
            value: '1d',
            category: 'Elegante',
            points: 3,
          },
          {
            id: '1e',
            text: 'Romântico & Delicado',
            description: 'Adoro looks delicados e femininos',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp',
            value: '1e',
            category: 'Romântico',
            points: 2,
          },
          {
            id: '1f',
            text: 'Sexy & Sedutor',
            description: 'Prefiro roupas que valorizam minha silhueta',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp',
            value: '1f',
            category: 'Sexy',
            points: 3,
          },
          {
            id: '1g',
            text: 'Dramático & Impactante',
            description: 'Gosto de looks marcantes e impactantes',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp',
            value: '1g',
            category: 'Dramático',
            points: 3,
          },
          {
            id: '1h',
            text: 'Criativo & Único',
            description: 'Amo experimentar cores e estampas ousadas',
            imageUrl:
              'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp',
            value: '1h',
            category: 'Criativo',
            points: 4,
          },
        ],

        // 🎨 LAYOUT E ESTILO (simplificado para inline)
        columns: 2,
        imageSize: 256,
        showImages: true,

        // 🎯 VALIDAÇÃO
        multipleSelection: true,
        autoAdvanceOnComplete: true,
        minSelections: 3,
        autoAdvance: true,
        maxSelections: 3,

        // 🎨 CORES
        borderColor: '#E5E7EB',
        selectedBorderColor: '#B89B7A',
        hoverColor: '#F3E8D3',

        // 🎯 CONTAINER
        containerWidth: 'full',
        spacing: 'small',
        marginBottom: 16,
      },
    },

    // 🔘 BOTÃO AVANÇADO OTIMIZADO (EDITÁVEL SEPARADAMENTE)
    {
      id: 'step02-continue-button',
      type: 'button-inline',
      properties: {
        // 📝 TEXTO DINÂMICO
        text: 'Continuar →',
        textWhenDisabled: 'Selecione 3 opções para continuar',
        textWhenComplete: 'Continuar',

        // 🎨 ESTILO AVANÇADO
        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        disabledBackgroundColor: '#d1d5db',
        disabledTextColor: '#9ca3af',

        // 🎯 COMPORTAMENTO INTELIGENTE
        disabled: true,
        requiresValidInput: true,
        instantActivation: false,
        noDelay: false,

        // 📏 DIMENSÕES E LAYOUT
        fullWidth: true,
        padding: 'py-3 px-6',
        borderRadius: '7px',
        fontSize: 'text-base',
        fontWeight: 'font-semibold',

        // ✨ EFEITOS VISUAIS
        shadowType: 'small',
        shadowColor: '#B89B7A',
        effectType: 'hover-lift',
        hoverOpacity: '75%',

        // 🚀 AUTO-ADVANCE
        autoAdvanceAfterActivation: false,
        autoAdvanceDelay: 1500,

        // 📊 FEEDBACK
        showSuccessAnimation: false,
        showPulseWhenEnabled: false,
        quickFeedback: true,

        // 📱 RESPONSIVIDADE,
        marginTop: 24,
        textAlign: 'text-center',
        spacing: 'small',
        marginBottom: 0,
      },
    },
  ];
};

export default getStep02Template;

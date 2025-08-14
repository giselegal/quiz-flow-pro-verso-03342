/**
 * Step15Template - Template Modular para Etapa 15 do Quiz
 *
 * ✅ APENAS TEMPLATE MODULAR - Questão estratégica 3
 * ❌ Componente monolítico removido para evitar conflitos arquiteturais
 *
 * CORREÇÃO DE FLUXO:
 * - Etapa 15: TERCEIRA questão estratégica (NÃO pontua)
 * - Monitora cliques para métricas da jornada do usuário
 */

// ✅ FUNÇÃO DE TEMPLATE (MANTIDA PARA COMPATIBILIDADE)
export const getStep15Template = () => {
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: 'progress-header-step15',
      type: 'quiz-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 81, // 81% - questões estratégicas
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: '15 de 21',
        spacing: 'small',
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: 'decorative-bar-step15',
      type: 'decorative-bar-inline',
      properties: {
        width: '100%',
        height: 4,
        color: '#B89B7A',
        gradientColors: ['#B89B7A', '#D4C2A8', '#B89B7A'],
        borderRadius: 3,
        marginTop: 0,
        marginBottom: 32,
        showShadow: true,
        spacing: 'small',
      },
    },

    // 📝 TÍTULO DA QUESTÃO ESTRATÉGICA
    {
      id: 'question-title-step15',
      type: 'text-inline',
      properties: {
        content: 'QUESTÃO ESTRATÉGICA 3',
        fontSize: 'text-2xl md:text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 16,
        spacing: 'medium',
      },
    },

    // 🎯 PERGUNTA PRINCIPAL
    {
      id: 'strategic-question-step15',
      type: 'text-inline',
      properties: {
        content: 'Qual é o seu orçamento mensal para roupas?',
        fontSize: 'text-xl md:text-2xl',
        fontWeight: 'font-semibold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 32,
        maxWidth: '720px',
        spacing: 'medium',
      },
    },

    // 📊 OPÇÕES DA QUESTÃO ESTRATÉGICA (NÃO PONTUAM - APENAS MÉTRICAS)
    {
      id: 'strategic-options-step15',
      type: 'options-grid',
      properties: {
        options: [
          {
            id: 'strategic-15-a',
            text: 'Até R$ 200',
            category: 'low-budget',
            strategicType: 'budget',
          },
          {
            id: 'strategic-15-b',
            text: 'R$ 200 - R$ 500',
            category: 'medium-budget',
            strategicType: 'budget',
          },
          {
            id: 'strategic-15-c',
            text: 'R$ 500 - R$ 1.000',
            category: 'high-budget',
            strategicType: 'budget',
          },
          {
            id: 'strategic-15-d',
            text: 'Mais de R$ 1.000',
            category: 'premium-budget',
            strategicType: 'budget',
          },
        ],
        multiSelect: false, // Questões estratégicas: seleção única
        columns: 2,
        backgroundColor: '#FFFFFF',
        borderColor: '#E5DDD5',
        hoverBackgroundColor: '#F3E8E6',
        selectedBackgroundColor: '#B89B7A',
        selectedTextColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        spacing: 'medium',
        trackingEnabled: true, // ✅ HABILITADO PARA MÉTRICAS
      },
    },

    // 🔄 BOTÃO DE NAVEGAÇÃO
    {
      id: 'navigation-button-step15',
      type: 'button-inline',
      properties: {
        text: 'Próxima Questão →',
        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#FFFFFF',
        hoverBackgroundColor: '#A1835D',
        borderRadius: 12,
        padding: '16px 32px',
        fontSize: 'text-lg',
        fontWeight: 'font-semibold',
        marginTop: 32,
        marginBottom: 16,
        showShadow: true,
        spacing: 'medium',
        disabled: true, // Desabilitado até seleção
        requiresSelection: true, // Requer seleção para habilitar
      },
    },

    // 📊 INDICADOR DE PROGRESSO ESTRATÉGICO
    {
      id: 'strategic-progress-step15',
      type: 'text-inline',
      properties: {
        content: 'Questão Estratégica 3 de 6 • Não afeta sua pontuação',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#432818',
        opacity: 0.6,
        marginTop: 16,
        spacing: 'small',
      },
    },
  ];
};

// ✅ EXPORT PADRÃO (COMPATIBILIDADE)
export default getStep15Template;

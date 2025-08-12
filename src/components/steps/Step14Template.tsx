/**
 * Step14Template - Template Modular para Etapa 14 do Quiz
 *
 * ✅ APENAS TEMPLATE MODULAR - Questão estratégica 2
 * ❌ Componente monolítico removido para evitar conflitos arquiteturais
 *
 * CORREÇÃO DE FLUXO:
 * - Etapa 14: SEGUNDA questão estratégica (NÃO pontua)
 * - Monitora cliques para métricas da jornada do usuário
 */

// ✅ FUNÇÃO DE TEMPLATE (MANTIDA PARA COMPATIBILIDADE)
export const getStep14Template = () => {
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: 'progress-header-step14',
      type: 'quiz-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 78, // 78% - questões estratégicas
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: '14 de 21',
        spacing: 'small',
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: 'decorative-bar-step14',
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
      id: 'question-title-step14',
      type: 'text-inline',
      properties: {
        content: 'QUESTÃO ESTRATÉGICA 2',
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
      id: 'strategic-question-step14',
      type: 'text-inline',
      properties: {
        content: 'Qual é o seu maior desafio quando se veste?',
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
      id: 'strategic-options-step14',
      type: 'options-grid',
      properties: {
        options: [
          {
            id: 'strategic-14-a',
            text: 'Não sei o que combina comigo',
            category: 'knowledge',
            strategicType: 'challenge',
          },
          {
            id: 'strategic-14-b',
            text: 'Tenho pouca variedade no guarda-roupa',
            category: 'variety',
            strategicType: 'challenge',
          },
          {
            id: 'strategic-14-c',
            text: 'Não tenho tempo para pensar em looks',
            category: 'time',
            strategicType: 'challenge',
          },
          {
            id: 'strategic-14-d',
            text: 'Não me sinto confiante com minhas escolhas',
            category: 'confidence',
            strategicType: 'challenge',
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
      id: 'navigation-button-step14',
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
      id: 'strategic-progress-step14',
      type: 'text-inline',
      properties: {
        content: 'Questão Estratégica 2 de 6 • Não afeta sua pontuação',
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
export default getStep14Template;

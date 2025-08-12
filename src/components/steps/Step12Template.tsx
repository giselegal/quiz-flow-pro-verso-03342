/**
 * Step12Template - Template Modular para Etapa 12 do Quiz
 *
 * ✅ TRANSIÇÃO PARA QUESTÕES ESTRATÉGICAS
 * ❌ Componente monolítico removido para evitar conflitos arquiteturais
 * 
 * CORREÇÃO DE FLUXO:
 * - Etapa 12: TRANSIÇÃO após questões que pontuam (2-11)
 * - Prepara usuário para questões estratégicas (13-18)
 */
export const getStep12Template = () => {
  return [
    // 🎯 CABEÇALHO COM PROGRESSO
    {
      id: 'progress-header-step12',
      type: 'quiz-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 60, // 60% após questões principais
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: '12 de 21',
        spacing: 'small',
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // 🎨 BARRA DECORATIVA
    {
      id: 'decorative-bar-step12',
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

    // 📱 TÍTULO DA TRANSIÇÃO
    {
      id: 'transition-title-step12',
      type: 'text-inline',
      properties: {
        content: 'Estamos quase lá.... 🎉',
        fontSize: 'text-4xl md:text-5xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 24,
        spacing: 'medium',
      },
    },

    // 📝 SUBTÍTULO EXPLICATIVO
    {
      id: 'transition-subtitle-step12',
      type: 'text-inline',
      properties: {
        content: 'Agora vamos conhecer você melhor...',
        fontSize: 'text-lg md:text-xl',
        textAlign: 'text-center',
        color: '#432818',
        opacity: 0.8,
        marginBottom: 32,
        maxWidth: '640px',
        spacing: 'medium',
      },
    },

    // 💡 INFORMAÇÃO SOBRE QUESTÕES ESTRATÉGICAS
    {
      id: 'strategic-info-step12',
      type: 'text-inline',
      properties: {
        content: 'Essas próximas perguntas nos ajudam a personalizar melhor sua experiência.',
        fontSize: 'text-base',
        textAlign: 'text-center',
        color: '#432818',
        opacity: 0.7,
        marginBottom: 32,
        maxWidth: '600px',
        backgroundColor: '#F8F6F4',
        padding: '16px 24px',
        borderRadius: 12,
        spacing: 'medium',
      },
    },

    // 🖼️ IMAGEM DE LOADING/TRANSIÇÃO
    {
      id: 'transition-image-step12',
      type: 'image-display-inline',
      properties: {
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838151/20250509_2148_An%C3%A1lise_de_Dados_simple_compose_01jtvtb6j93t4r2hvdza0n0fqm_axmjjx.webp',
        alt: 'Analisando seu Perfil...',
        width: 500,
        height: 350,
        className: 'object-cover w-full max-w-lg h-72 rounded-xl mx-auto shadow-lg',
        textAlign: 'text-center',
        marginBottom: 32,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 💭 TEXTO DESCRITIVO
    {
      id: 'transition-description-step12',
      type: 'text-inline',
      properties: {
        content: 'Estamos processando suas respostas para identificar seu estilo único.',
        fontSize: 'text-lg',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 40,
        lineHeight: '1.6',
        spacing: 'small',
        marginTop: 0,
      },
    },
  ];
};

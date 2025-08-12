/**
 * Step19Template - Template Modular para Etapa 19 do Quiz
 * ✅ TRANSIÇÃO PARA RESULTADO - Processa as respostas das etapas 2-11
 */

export const getStep19Template = () => {
  return [
    {
      id: 'progress-header-step19',
      type: 'quiz-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 80,
        logoHeight: 80,
        progressValue: 95,
        progressMax: 100,
        showBackButton: false,
        showProgress: true,
        stepNumber: '19 de 21',
        spacing: 'small',
      },
    },
    {
      id: 'decorative-bar-step19',
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
    {
      id: 'processing-title-step19',
      type: 'text-inline',
      properties: {
        content: 'Analisando seu perfil...',
        fontSize: 'text-4xl md:text-5xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 24,
        spacing: 'medium',
      },
    },
    {
      id: 'processing-subtitle-step19',
      type: 'text-inline',
      properties: {
        content: 'Estamos processando suas respostas para descobrir seu estilo predominante.',
        fontSize: 'text-lg md:text-xl',
        textAlign: 'text-center',
        color: '#432818',
        opacity: 0.8,
        marginBottom: 32,
        maxWidth: '640px',
        spacing: 'medium',
      },
    },
    {
      id: 'loading-animation-step19',
      type: 'loading-animation',
      properties: {
        type: 'spinner',
        size: 'large',
        color: '#B89B7A',
        duration: 3000,
        marginBottom: 32,
        spacing: 'medium',
      },
    },
    {
      id: 'processing-steps-step19',
      type: 'text-inline',
      properties: {
        content: '✓ Analisando suas 10 respostas principais\n✓ Calculando compatibilidade por estilo\n✓ Definindo seu resultado personalizado',
        fontSize: 'text-base',
        textAlign: 'text-center',
        color: '#432818',
        opacity: 0.7,
        marginBottom: 32,
        lineHeight: 1.8,
        spacing: 'medium',
      },
    },
    {
      id: 'continue-to-result-step19',
      type: 'button-inline',
      properties: {
        text: 'Ver Meu Resultado →',
        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#FFFFFF',
        hoverBackgroundColor: '#A1835D',
        borderRadius: 12,
        padding: '16px 32px',
        fontSize: 'text-lg',
        fontWeight: 'font-semibold',
        marginTop: 16,
        marginBottom: 32,
        showShadow: true,
        spacing: 'medium',
        autoTrigger: true, // ✅ Dispara automaticamente após 3s
        autoTriggerDelay: 3000,
      },
    },
    {
      id: 'final-progress-step19',
      type: 'text-inline',
      properties: {
        content: 'Quase lá! Preparando seu resultado...',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#432818',
        opacity: 0.6,
        marginTop: 24,
        spacing: 'small',
      },
    },
  ];
};

export default getStep19Template;

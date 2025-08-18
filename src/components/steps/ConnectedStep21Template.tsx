// 🔗 CONNECTED STEP 21 TEMPLATE - Página de Oferta/Conversão
// Template para página final com call-to-action

import { QUIZ_QUESTIONS_COMPLETE } from '@/templates/quiz21StepsComplete';

export const ConnectedStep21Template = () => {
  // 🎯 Buscar questão real dos dados (FONTE ÚNICA)
  const questionText = QUIZ_QUESTIONS_COMPLETE[21] || 'RECEBA SEU GUIA DE ESTILO COMPLETO';

  return [
    // 📱 CABEÇALHO COM LOGO (SEM PROGRESSO)
    {
      id: 'step21-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 100,
        progressMax: 100,
        showBackButton: false,
        showProgress: false,
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA OFERTA
    {
      id: 'step21-offer-title',
      type: 'text-inline',
      properties: {
        content: questionText,
        fontSize: 'text-4xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 16,
        spacing: 'large',
        marginTop: 24,
      },
    },

    // ✨ SUBTÍTULO MOTIVACIONAL
    {
      id: 'step21-offer-subtitle',
      type: 'text-inline',
      properties: {
        content: 'Transforme seu guarda-roupa com confiança e praticidade',
        fontSize: 'text-xl',
        fontWeight: 'font-medium',
        textAlign: 'text-center',
        color: '#6B4F43',
        marginBottom: 32,
      },
    },

    // 🎁 LISTA DE BENEFÍCIOS
    {
      id: 'step21-benefits-list',
      type: 'text-inline',
      properties: {
        content:
          '✓ Guia personalizado baseado no seu estilo\n✓ Dicas práticas para montar looks\n✓ Cores que mais combinam com você\n✓ Peças essenciais para seu guarda-roupa',
        fontSize: 'text-lg',
        textAlign: 'text-left',
        color: '#374151',
        marginBottom: 32,
        backgroundColor: '#F3F4F6',
        padding: '24px',
        borderRadius: '8px',
      },
    },

    // 💰 DESTAQUE DA OFERTA
    {
      id: 'step21-price-highlight',
      type: 'text-inline',
      properties: {
        content: 'Valor: R$ 97,00\nPor tempo limitado: GRATUITO',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#059669',
        marginBottom: 24,
        backgroundColor: '#ECFDF5',
        padding: '20px',
        borderRadius: '8px',
        border: '2px solid #10B981',
      },
    },

    // 🎯 BOTÃO PRINCIPAL DE CONVERSÃO
    {
      id: 'step21-cta-button',
      type: 'quiz-navigation-button',
      properties: {
        text: 'QUERO RECEBER MEU GUIA GRATUITO',
        variant: 'primary',
        size: 'large',
        fullWidth: true,
        action: 'convert',
        backgroundColor: '#059669',
        textColor: '#FFFFFF',
        hoverColor: '#047857',
        borderRadius: '8px',
        fontSize: 'text-xl',
        fontWeight: 'font-bold',
        padding: '20px 32px',
        marginTop: 16,
        marginBottom: 16,
      },
    },

    // 🔒 GARANTIA E SEGURANÇA
    {
      id: 'step21-security-note',
      type: 'text-inline',
      properties: {
        content: '🔒 Seus dados estão seguros • 📧 Sem spam • ⚡ Entrega imediata',
        fontSize: 'text-sm',
        textAlign: 'text-center',
        color: '#6B7280',
        marginTop: 16,
      },
    },
  ];
};

// 🔧 FUNÇÃO EXPORT PARA COMPATIBILIDADE COM STEP_TEMPLATES_MAPPING
export const getConnectedStep21Template = () => {
  return ConnectedStep21Template();
};

export default ConnectedStep21Template;

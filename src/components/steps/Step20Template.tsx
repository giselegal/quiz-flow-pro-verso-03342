/**
 * Step20Template - Lead Capture (UPDATED)
 * Template para captura de leads com formulário completo
 */
export const getStep20Template = () => {
  console.log('📋 Step20Template - Lead Capture carregado!');
  return [
    {
      id: 'step20-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 95,
        progressTotal: 100,
        showProgress: true,
        containerWidth: 'full',
        spacing: 'small'
      }
    },
    {
      id: 'step20-title',
      type: 'text-inline',
      properties: {
        content: 'RECEBA SEU GUIA DE ESTILO COMPLETO',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        containerWidth: 'full',
        spacing: 'small'
      }
    },
    {
      id: 'step20-subtitle',
      type: 'text-inline',
      properties: {
        content: 'Deixe seus dados e receba gratuitamente seu guia personalizado baseado nas suas respostas',
        fontSize: 'text-base',
        textAlign: 'text-center',
        color: '#6B7280',
        containerWidth: 'full',
        spacing: 'small',
        marginBottom: 24
      }
    },
    {
      id: 'step20-lead-form',
      type: 'lead-form', // ✅ COMPONENTE CORRETO
      properties: {
        fields: ['name', 'email', 'phone'],
        submitText: 'Receber Guia Gratuito →',
        backgroundColor: '#FFFFFF',
        borderColor: '#B89B7A',
        textColor: '#432818',
        primaryColor: '#B89B7A',
        containerWidth: 'full',
        spacing: 'medium',
        marginTop: 16,
        marginBottom: 32
      }
    },
    {
      id: 'step20-privacy-notice',
      type: 'text-inline',
      properties: {
        content: '🔒 Seus dados estão seguros conosco. Não compartilhamos suas informações com terceiros.',
        fontSize: 'text-xs',
        textAlign: 'text-center',
        color: '#9CA3AF',
        containerWidth: 'full',
        spacing: 'small'
      }
    }
  ];
};

export default getStep20Template;
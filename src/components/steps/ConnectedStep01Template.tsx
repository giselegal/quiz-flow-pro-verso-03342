// 🎯 STEP 01 TEMPLATE - COLETA DE NOME
// Template específico para coleta do nome do usuário

export const ConnectedStep01Template = () => {
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step01-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 5,
        progressMax: 100,
        showBackButton: false,
        spacing: 'small',
        marginTop: 0,
        marginBottom: 32,
      },
    },

    // 🎯 TÍTULO PRINCIPAL
    {
      id: 'step01-main-title',
      type: 'text-inline',
      properties: {
        content: 'Chega de um guarda-roupa lotado e da sensação de que nada combina com Você.',
        fontSize: 'text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 16,
        spacing: 'small',
        marginTop: 0,
        lineHeight: 'leading-tight',
      },
    },

    // 📝 SUBTÍTULO PRINCIPAL
    {
      id: 'step01-subtitle',
      type: 'text-inline',
      properties: {
        content: 'Descubra seu estilo predominante e transforme seu guarda-roupa',
        fontSize: 'text-2xl',
        fontWeight: 'font-semibold',
        textAlign: 'text-center',
        color: '#B89B7A',
        marginBottom: 24,
        spacing: 'small',
        marginTop: 0,
        lineHeight: 'leading-relaxed',
      },
    },

    // 📄 DESCRIÇÃO
    {
      id: 'step01-description',
      type: 'text-inline',
      properties: {
        content: 'Em poucos minutos, descubra seu Estilo Predominante — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.',
        fontSize: 'text-xl',
        fontWeight: 'font-normal',
        textAlign: 'text-center',
        color: '#6B4F43',
        marginBottom: 48,
        spacing: 'small',
        marginTop: 0,
        lineHeight: 'leading-relaxed',
      },
    },

    // 📋 CAMPO DE NOME
    {
      id: 'step01-name-input',
      type: 'form-input',
      properties: {
        inputType: 'text',
        placeholder: 'Digite seu nome',
        label: 'NOME',
        required: true,
        validation: {
          minLength: 2,
          pattern: '[a-zA-ZÀ-ÿ\\s]+',
          message: 'Digite um nome válido (mínimo 2 caracteres)',
        },
        
        // Styling
        borderColor: '#B89B7A',
        focusBorderColor: '#432818',
        backgroundColor: '#ffffff',
        textColor: '#432818',
        labelColor: '#432818',
        
        marginBottom: 32,
        spacing: 'small',
        marginTop: 0,
        fullWidth: true,
      },
    },

    // 🔘 BOTÃO PRINCIPAL (CONDICIONAL)
    {
      id: 'step01-start-button',
      type: 'button-inline',
      properties: {
        text: 'Quero Descobrir meu Estilo Agora!',
        textWhenDisabled: 'Digite seu nome para continuar',
        
        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        disabledBackgroundColor: '#E5E7EB',
        disabledTextColor: '#9CA3AF',
        
        // Lógica condicional
        disabled: true, // Será habilitado via form validation
        requiresValidInput: true,
        validateTarget: 'step01-name-input',
        
        fullWidth: true,
        marginTop: 16,
        marginBottom: 32,
        spacing: 'small',
        
        // Ação de navegação
        onClick: 'navigate-next-step',
        stepId: 'step-01'
      },
    },

    // 📜 AVISO LEGAL
    {
      id: 'step01-legal-notice',
      type: 'text-inline',
      properties: {
        content: 'Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade',
        fontSize: 'text-sm',
        fontWeight: 'font-normal',
        textAlign: 'text-center',
        color: '#9CA3AF',
        marginBottom: 24,
        spacing: 'small',
        marginTop: 0,
        lineHeight: 'leading-relaxed',
      },
    },

    // 📅 FOOTER COPYRIGHT
    {
      id: 'step01-copyright',
      type: 'text-inline',
      properties: {
        content: '2025 - Gisele Galvão - Todos os direitos reservados',
        fontSize: 'text-xs',
        fontWeight: 'font-normal',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 0,
        spacing: 'small',
        marginTop: 0,
      },
    },
  ];
};

// 🎯 FUNÇÃO WRAPPER PARA COMPATIBILIDADE
export const getConnectedStep01Template = () => {
  return ConnectedStep01Template();
};

export default ConnectedStep01Template;
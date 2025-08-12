// 🎯 ETAPA 1 - CONFIGURAÇÃO SIMPLIFICADA E CONSISTENTE
// Template simplificado baseado na estrutura do Step02Template para melhor consistência

export const getStep01Template = () => {
  return [
    {
      id: 'step01-header',
      type: 'quiz-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 0,
        progressMax: 100,
        showBackButton: false,
        showProgress: false,
      },
    },
    {
      id: 'intro-decorative-bar',
      type: 'decorative-bar-inline',
      properties: {
        width: '100%',
        height: 4,
        color: '#B89B7A',
        backgroundColor: '#B89B7A',
        marginTop: 0,
        marginBottom: 24,
      },
    },
    {
      id: 'intro-main-title',
      type: 'text-inline',
      properties: {
        content:
          '<span style="color: #B89B7A">Chega</span> de um guarda-roupa lotado e da sensação de que nada combina com <span style="color: #B89B7A">Você</span>.',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 16,
      },
    },
    {
      id: 'intro-image',
      type: 'image-display-inline',
      properties: {
        src: 'https://res.cloudinary.com/der8kogzu/image/upload/f_avif,q_85,w_300,c_limit/v1752443943/Gemini_Generated_Image_i5cst6i5cst6i5cs_fpoukb.avif',
        alt: 'Descubra seu estilo predominante',
        width: 300,
        height: 204,
        containerPosition: 'center',
        marginBottom: 16,
      },
    },
    {
      id: 'intro-subtitle',
      type: 'text-inline',
      properties: {
        content: 'Descubra seu <strong>ESTILO PREDOMINANTE</strong> em apenas alguns minutos!',
        fontSize: 'text-lg',
        fontWeight: 'font-medium',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 24,
      },
    },
    // ✅ NOVO: Form Container com input e botão integrados
    {
      id: 'intro-form-container',
      type: 'form-container',
      properties: {
        backgroundColor: 'transparent',
        marginTop: 0,
        marginBottom: 16,
        paddingTop: 0,
        paddingBottom: 0,
        requireNameToEnableButton: true,
        targetButtonId: 'intro-cta-button',
        visuallyDisableButton: true,
      },
      children: [
        {
          id: 'intro-form-input',
          type: 'form-input',
          properties: {
            inputType: 'text',
            placeholder: 'Digite seu primeiro nome aqui...',
            label: 'Como posso te chamar?',
            required: true,
            name: 'userName',
            backgroundColor: '#ffffff',
            borderColor: '#B89B7A',
            marginBottom: 16,
          },
        },
        {
          id: 'intro-cta-button',
          type: 'button-inline',
          properties: {
            text: 'Quero Descobrir meu Estilo Agora!',
            variant: 'primary',
            size: 'lg',
            fullWidth: true,
            backgroundColor: '#B89B7A',
            textColor: '#ffffff',
            // ✅ Configurações de controle condicional
            requiresValidInput: true,
            watchInputId: 'intro-form-input',
            nextStepUrl: '/quiz/step-2',
            nextStepId: 'step-2',
            disabledText: 'Digite seu nome para continuar',
            showDisabledState: true,
            disabledOpacity: 0.6,
          },
        },
      ],
    },
  ];
};

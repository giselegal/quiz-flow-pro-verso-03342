/**
 * ETAPA 1: INTRODUÇÃO COM COLETA DE NOME
 * Primeira etapa do quiz de estilo com formulário de nome
 */
export const Step01Intro = () => {
  return {
    id: 'etapa-1',
    name: 'Introdução',
    type: 'intro',
    description: 'Apresentação do Quiz de Estilo',
    blocks: [
      {
        type: 'quiz-intro-header',
        properties: {
          logoUrl:
            'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
          logoAlt: 'Logo Gisele Galvão',
          logoWidth: 120,
          logoHeight: 120,
          progressValue: 0,
          progressMax: 100,
          showBackButton: false,
          showProgress: false,
        },
      },
      {
        type: 'decorative-bar-inline',
        properties: {
          width: '100%',
          height: 4,
          color: '#B89B7A',
          gradientColors: ['#B89B7A', '#D4C2A8', '#B89B7A'],
          borderRadius: 3,
          marginTop: 8,
          marginBottom: 24,
          showShadow: true,
        },
      },
      {
        type: 'text-inline',
        properties: {
          content:
            '<span style="color: #B89B7A; font-weight: 700; font-family: \'Playfair Display\', serif;">Chega</span> <span style="font-family: \'Playfair Display\', serif;">de um guarda-roupa lotado e da sensação de que</span> <span style="color: #B89B7A; font-weight: 700; font-family: \'Playfair Display\', serif;">nada combina com você.</span>',
          fontSize: 'text-4xl',
          fontWeight: 'font-bold',
          fontFamily: 'Playfair Display, serif',
          textAlign: 'text-center',
          color: '#432818',
          marginBottom: 32,
          lineHeight: '1.2',
        },
      },
      {
        type: 'image-display-inline',
        properties: {
          src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/20250509_2137_Desordem_e_Reflex%C3%A3o_simple_compose_01jtvszf8sfaytz493z9f16rf2_z1c2up.webp',
          alt: 'Transforme seu guarda-roupa',
          width: 600,
          height: 400,
          className: 'object-cover w-full max-w-2xl h-80 rounded-xl mx-auto shadow-lg',
          textAlign: 'text-center',
          marginBottom: 32,
        },
      },
      {
        type: 'text-inline',
        properties: {
          content:
            'Em poucos minutos, descubra seu <strong style="color: #B89B7A;">Estilo Predominante</strong> — e aprenda a montar looks que realmente refletem sua essência, com praticidade e confiança.',
          fontSize: 'text-xl',
          textAlign: 'text-center',
          color: '#432818',
          marginTop: 0,
          marginBottom: 40,
          lineHeight: '1.6',
        },
      },
      {
        type: 'form-input',
        properties: {
          label: 'COMO VOCÊ GOSTARIA DE SER CHAMADA?',
          placeholder: 'Digite seu nome aqui...',
          required: true,
          inputType: 'text',
          helperText: 'Seu nome será usado para personalizar sua experiência',
          name: 'userName',
          textAlign: 'text-center',
          marginBottom: 32,
        },
      },
      {
        type: 'button-inline',
        properties: {
          text: '✨ Quero Descobrir meu Estilo Agora! ✨',
          variant: 'primary',
          size: 'large',
          fullWidth: true,
          backgroundColor: '#B89B7A',
          textColor: '#ffffff',
          requiresValidInput: true,
          textAlign: 'text-center',
          borderRadius: 'rounded-full',
          padding: 'py-4 px-8',
          fontSize: 'text-lg',
          fontWeight: 'font-bold',
          boxShadow: 'shadow-xl',
          hoverEffect: true,
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          margin: '0 auto',
        },
      },
      {
        type: 'legal-notice-inline',
        properties: {
          privacyText:
            'Seu nome é necessário para personalizar sua experiência. Ao clicar, você concorda com nossa política de privacidade',
          copyrightText: '© 2025 Gisele Galvão - Todos os direitos reservados',
          showIcon: true,
          iconType: 'shield',
          textAlign: 'text-center',
          textSize: 'text-xs',
          textColor: '#6B7280',
          linkColor: '#B89B7A',
          marginTop: 24,
          marginBottom: 0,
          backgroundColor: 'transparent',
        },
      },
    ],
  };
};

export default Step01Intro;

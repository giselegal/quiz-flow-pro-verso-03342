
import React from 'react';

// Template para a Etapa 3
export const getStep03Template = () => [
  {
    type: 'quiz-intro-header',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 10,
      progressMax: 100,
      showBackButton: true
    }
  },
  {
    type: 'heading-inline',
    properties: {
      content: 'Etapa 3 - Template em Desenvolvimento',
      level: 'h2',
      fontSize: 'text-2xl',
      fontWeight: 'font-bold',
      textAlign: 'text-center',
      color: '#432818',
      marginBottom: 8
    }
  },
  {
    type: 'text-inline',
    properties: {
      content: 'Este template será personalizado em breve',
      fontSize: 'text-lg',
      textAlign: 'text-center',
      color: '#6B7280',
      marginBottom: 32
    }
  },
  {
    type: 'button-inline',
    properties: {
      text: 'Continuar',
      variant: 'primary',
      size: 'large',
      fullWidth: true,
      backgroundColor: '#B89B7A',
      textColor: '#ffffff'
    }
  }
];

export default getStep03Template;

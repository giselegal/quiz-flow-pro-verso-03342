import React from 'react';

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 12 - TRANSIÇÃO: MEIO DO CAMINHO
export const getStep12Template = () => [
  {
    type: 'quiz-intro-header',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 55,
      progressMax: 100,
      showBackButton: true
    }
  },
  {
    type: 'heading-inline',
    properties: {
      content: '🎉 MEIO DO CAMINHO!',
      level: 'h1',
      fontSize: 'text-4xl',
      fontWeight: 'font-bold',
      textAlign: 'text-center',
      color: '#432818',
      marginBottom: 16
    }
  },
  {
    type: 'text-inline',
    properties: {
      content: 'Você está indo muito bem! Já respondeu metade das perguntas.',
      fontSize: 'text-lg',
      textAlign: 'text-center',
      color: '#6B7280',
      marginBottom: 16
    }
  },
  {
    type: 'text-inline',
    properties: {
      content: 'Agora vamos para as perguntas mais estratégicas que vão nos ajudar a definir seu perfil de estilo único!',
      fontSize: 'text-base',
      textAlign: 'text-center',
      color: '#432818',
      marginBottom: 32
    }
  },
  {
    type: 'image-inline',
    properties: {
      src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      alt: 'Motivação - Meio do Caminho',
      width: 120,
      height: 120,
      borderRadius: 'rounded-full',
      marginBottom: 24,
      className: 'mx-auto'
    }
  },
  {
    type: 'button-inline',
    properties: {
      text: 'Continuar Quiz',
      variant: 'primary',
      size: 'large',
      fullWidth: true,
      backgroundColor: '#B89B7A',
      textColor: '#ffffff',
      disabled: false
    }
  }
];

export default getStep12Template;
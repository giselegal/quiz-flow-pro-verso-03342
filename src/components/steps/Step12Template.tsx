
import React from 'react';

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 12 - TRANSIÇÃO PRINCIPAL
export const getStep12Template = () => [
  {
    type: 'quiz-intro-header',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 57,
      progressMax: 100,
      showBackButton: true
    }
  },
  {
    type: 'heading-inline',
    properties: {
      content: 'Perfeito! Agora vamos conhecer você ainda melhor...',
      level: 'h2',
      fontSize: 'text-3xl',
      fontWeight: 'font-bold',
      textAlign: 'text-center',
      color: '#432818',
      marginBottom: 16
    }
  },
  {
    type: 'text-inline',
    properties: {
      content: 'Suas respostas já revelam muito sobre seu estilo predominante. As próximas questões vão nos ajudar a criar um perfil ainda mais preciso e personalizado para você.',
      fontSize: 'text-lg',
      textAlign: 'text-center',
      color: '#6B7280',
      marginBottom: 32,
      lineHeight: '1.6'
    }
  },
  {
    type: 'progress-inline',
    properties: {
      value: 57,
      max: 100,
      showPercentage: true,
      color: '#B89B7A',
      backgroundColor: '#F3F4F6',
      height: 8,
      borderRadius: 'rounded-full',
      marginBottom: 32
    }
  },
  {
    type: 'image-display-inline',
    properties: {
      src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/transicao-principal_z1c2up.webp',
      alt: 'Descobrindo seu estilo único',
      width: 400,
      height: 300,
      className: 'object-cover w-full max-w-md h-72 rounded-xl mx-auto shadow-lg',
      textAlign: 'text-center',
      marginBottom: 32
    }
  },
  {
    type: 'button-inline',
    properties: {
      text: 'Vamos Continuar! ✨',
      variant: 'primary',
      size: 'large',
      fullWidth: true,
      backgroundColor: '#B89B7A',
      textColor: '#ffffff',
      borderRadius: 'rounded-full',
      padding: 'py-4 px-8',
      fontSize: 'text-lg',
      fontWeight: 'font-bold',
      boxShadow: 'shadow-xl',
      hoverEffect: true
    }
  }
];

export default getStep12Template;

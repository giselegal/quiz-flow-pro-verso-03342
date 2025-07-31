
import React from 'react';

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 19 - TRANSIÇÃO FINAL
export const getStep19Template = () => [
  {
    type: 'quiz-intro-header',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 90,
      progressMax: 100,
      showBackButton: true
    }
  },
  {
    type: 'heading-inline',
    properties: {
      content: '🎉 Parabéns! Estamos quase lá...',
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
      content: 'Agora vou analisar todas as suas respostas e preparar o seu resultado personalizado com o estilo que mais combina com você.',
      fontSize: 'text-lg',
      textAlign: 'text-center',
      color: '#6B7280',
      marginBottom: 24,
      lineHeight: '1.6'
    }
  },
  {
    type: 'progress-inline',
    properties: {
      value: 90,
      max: 100,
      showPercentage: true,
      color: '#B89B7A',
      backgroundColor: '#F3F4F6',
      height: 12,
      borderRadius: 'rounded-full',
      marginBottom: 32,
      animationType: 'pulse'
    }
  },
  {
    type: 'loading-animation-inline',
    properties: {
      text: 'Analisando suas respostas...',
      subtext: 'Criando seu perfil de estilo personalizado',
      animationType: 'dots',
      color: '#B89B7A',
      duration: 3000,
      showProgress: true,
      marginBottom: 32
    }
  },
  {
    type: 'text-inline',
    properties: {
      content: 'Em instantes você descobrirá qual é o seu estilo predominante e receberá dicas exclusivas para transformar seu guarda-roupa.',
      fontSize: 'text-base',
      textAlign: 'text-center',
      color: '#9CA3AF',
      marginBottom: 32,
      fontStyle: 'italic'
    }
  },
  {
    type: 'button-inline',
    properties: {
      text: 'Ver Meu Resultado Agora! 🎯',
      variant: 'primary',
      size: 'large',
      fullWidth: true,
      backgroundColor: '#B89B7A',
      textColor: '#ffffff',
      borderRadius: 'rounded-full',
      padding: 'py-4 px-8',
      fontSize: 'text-xl',
      fontWeight: 'font-bold',
      boxShadow: 'shadow-2xl',
      hoverEffect: true,
      pulse: true
    }
  }
];

export default getStep19Template;

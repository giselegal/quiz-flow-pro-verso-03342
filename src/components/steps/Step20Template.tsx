
import React from 'react';

// 🎯 TEMPLATE DE BLOCOS DA ETAPA 20 - RESULTADO PERSONALIZADO
export const getStep20Template = () => [
  {
    type: 'result-header-inline',
    properties: {
      logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
      logoAlt: 'Logo Gisele Galvão',
      logoWidth: 96,
      logoHeight: 96,
      progressValue: 100,
      progressMax: 100,
      showBackButton: false,
      celebration: true
    }
  },
  {
    type: 'result-card-inline',
    properties: {
      title: 'Seu Estilo Predominante:',
      styleCategory: 'dynamic', // Será substituído pelo cálculo real
      percentage: 75, // Será substituído pelo cálculo real
      description: 'Baseado nas suas respostas, identificamos o estilo que mais representa você.',
      showPercentage: true,
      showBadge: true,
      backgroundColor: '#F8F9FA',
      borderColor: '#B89B7A',
      marginBottom: 32
    }
  },
  {
    type: 'text-inline',
    properties: {
      content: 'Suas principais características de estilo incluem versatilidade, elegância natural e facilidade para criar looks que refletem sua personalidade única.',
      fontSize: 'text-lg',
      textAlign: 'text-center',
      color: '#4B5563',
      marginBottom: 24,
      lineHeight: '1.6'
    }
  },
  {
    type: 'image-display-inline',
    properties: {
      src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746838118/transformacao-resultado_z1c2up.webp',
      alt: 'Sua transformação de estilo',
      width: 500,
      height: 350,
      className: 'object-cover w-full max-w-lg h-80 rounded-xl mx-auto shadow-xl',
      textAlign: 'text-center',
      marginBottom: 32
    }
  },
  {
    type: 'heading-inline',
    properties: {
      content: 'Seus Estilos Secundários',
      level: 'h3',
      fontSize: 'text-2xl',
      fontWeight: 'font-bold',
      textAlign: 'text-center',
      color: '#432818',
      marginBottom: 16
    }
  },
  {
    type: 'style-card-inline',
    properties: {
      styleCategory: 'secondary-1', // Será substituído pelo cálculo
      percentage: 15,
      showPercentage: true,
      compact: true,
      marginBottom: 12
    }
  },
  {
    type: 'style-card-inline',
    properties: {
      styleCategory: 'secondary-2', // Será substituído pelo cálculo
      percentage: 10,
      showPercentage: true,
      compact: true,
      marginBottom: 12
    }
  },
  {
    type: 'style-card-inline',
    properties: {
      styleCategory: 'secondary-3', // Será substituído pelo cálculo
      percentage: 0,
      showPercentage: true,
      compact: true,
      marginBottom: 24
    }
  },
  {
    type: 'text-inline',
    properties: {
      content: 'Agora que você conhece seu estilo, que tal descobrir como aplicá-lo no dia a dia e criar um guarda-roupa que realmente funciona?',
      fontSize: 'text-lg',
      textAlign: 'text-center',
      color: '#6B7280',
      marginBottom: 32,
      lineHeight: '1.5'
    }
  },
  {
    type: 'button-inline',
    properties: {
      text: 'Quero Transformar Meu Guarda-roupa! ✨',
      variant: 'primary',
      size: 'large',
      fullWidth: true,
      backgroundColor: '#B89B7A',
      textColor: '#ffffff',
      borderRadius: 'rounded-full',
      padding: 'py-4 px-8',
      fontSize: 'text-lg',
      fontWeight: 'font-bold',
      boxShadow: 'shadow-2xl',
      hoverEffect: true,
      pulse: true
    }
  }
];

export default getStep20Template;

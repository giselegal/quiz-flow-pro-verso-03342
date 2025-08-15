// 🔗 CONNECTED STEP 21 TEMPLATE - RESULTADO PERSONALIZADO CONECTADO
// Template do resultado final personalizado conectado aos hooks de quiz

import { useCallback } from 'react';
import { useQuizLogic } from '@/hooks/useQuizLogic';

export const ConnectedStep21Template = () => {
  const { quizResult } = useQuizLogic();
  
  const handleComplete = useCallback(() => {
    console.log('🎯 Connected Step21: Quiz finalizado');
  }, []);

  // 🎯 Obter dados personalizados do quiz
  const userName = localStorage.getItem('quizUserName') || '';
  const styleCategory = quizResult?.primaryStyle || 'Elegante';

  return [
    // 📱 CABEÇALHO COM LOGO FINAL
    {
      id: 'step21-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 120,
        logoHeight: 120,
        progressValue: 100,
        progressMax: 100,
        showBackButton: false,
        showProgress: false,
        spacing: 'large',
        marginTop: 0,
        marginBottom: 32,
      },
    },

    // 🎉 TÍTULO DE RESULTADO PERSONALIZADO
    {
      id: 'step21-result-title',
      type: 'text-inline',
      properties: {
        content: userName 
          ? `🎉 ${userName}, Seu Estilo é ${styleCategory}!`
          : `🎉 Seu Estilo é ${styleCategory}!`,
        fontSize: 'text-4xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#B89B7A',
        marginBottom: 24,
        spacing: 'large',
        marginTop: 0,
      },
    },

    // 🎨 IMAGEM DO RESULTADO PERSONALIZADA
    {
      id: 'step21-style-image',
      type: 'image-display-inline',
      properties: {
        src: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911668/GUIA_ELEGANTE_bcksfq.webp',
        alt: `Guia de estilo ${styleCategory}`,
        width: 400,
        height: 300,
        containerWidth: 'large',
        spacing: 'large',
        marginBottom: 32,
      },
    },

    // 📋 DESCRIÇÃO DO ESTILO
    {
      id: 'step21-style-description',
      type: 'text-inline',
      properties: {
        content: `Seu estilo ${styleCategory} representa sofisticação e refinamento. Você possui uma elegância natural que se expressa através de escolhas conscientes e atemporais.`,
        fontSize: 'text-lg',
        fontWeight: 'font-normal',
        textAlign: 'text-center',
        color: '#432818',
        backgroundColor: '#F9F9F7',
        borderColor: '#B89B7A',
        containerWidth: 'large',
        spacing: 'large',
        marginBottom: 32,
        lineHeight: 'leading-relaxed',
      },
    },

    // 🎁 OFERTA PERSONALIZADA
    {
      id: 'step21-personalized-offer',
      type: 'text-inline',
      properties: {
        content: userName 
          ? `${userName}, seu guia personalizado está pronto! Receba agora seu material completo com looks, dicas e estratégias específicas para o seu estilo ${styleCategory}.`
          : `Seu guia personalizado está pronto! Receba agora seu material completo com looks, dicas e estratégias específicas para o seu estilo ${styleCategory}.`,
        fontSize: 'text-xl',
        fontWeight: 'font-medium',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 32,
        spacing: 'large',
        marginTop: 0,
      },
    },

    // 🔘 BOTÃO DE CONVERSÃO
    {
      id: 'step21-conversion-button',
      type: 'button-inline',
      properties: {
        text: 'QUERO MEU GUIA PERSONALIZADO AGORA!',
        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',
        
        disabled: false,
        requiresValidInput: false,

        fullWidth: true,
        marginTop: 24,
        textAlign: 'text-center',
        spacing: 'large',
        marginBottom: 32,

        // 🔗 HANDLER DE CONVERSÃO
        onClick: handleComplete,
      },
    },

    // 💕 MENSAGEM FINAL
    {
      id: 'step21-final-message',
      type: 'text-inline',
      properties: {
        content: '💕 Obrigada por confiar em mim para te ajudar a descobrir seu estilo único!\n\nCom carinho, Gisele Galvão',
        fontSize: 'text-base',
        fontWeight: 'font-normal',
        fontStyle: 'italic',
        textAlign: 'text-center',
        color: '#432818',
        backgroundColor: '#FAF9F7',
        containerWidth: 'large',
        spacing: 'large',
        marginBottom: 0,
      },
    },
  ];
};

export const getConnectedStep21Template = () => {
  return ConnectedStep21Template();
};

export default ConnectedStep21Template;
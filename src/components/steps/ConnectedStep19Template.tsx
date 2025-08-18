// 🔗 CONNECTED STEP 19 TEMPLATE - PÁGINA DE TRANSIÇÃO PARA RESULTADO
// Transição: "Obrigada por compartilhar..."

import { useCallback } from 'react';
import { COMPLETE_QUIZ_QUESTIONS } from '@/data/correctQuizQuestions';

export const ConnectedStep19Template = () => {
  // 🎯 Buscar dados da transição 2
  const transitionData = COMPLETE_QUIZ_QUESTIONS.find(q => q.id === 'transition2');

  const handleContinue = useCallback(() => {
    console.log('🎯 Connected Step19: Navegando para resultado');
  }, []);

  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step19-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 95,
        progressMax: 100,
        showBackButton: true,
        spacing: 'small',
        marginTop: 0,
        marginBottom: 32,
      },
    },

    // ✨ ÍCONE DE AGRADECIMENTO
    {
      id: 'step19-thanks-icon',
      type: 'text-inline',
      properties: {
        content: '✨',
        fontSize: 'text-6xl',
        textAlign: 'text-center',
        marginBottom: 24,
        marginTop: 0,
        spacing: 'small',
      },
    },

    // 🎯 TÍTULO PRINCIPAL (DADOS REAIS)
    {
      id: 'step19-main-title',
      type: 'text-inline',
      properties: {
        content: transitionData?.text || 'Obrigada por compartilhar...',
        fontSize: 'text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 32,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 📝 DESCRIÇÃO PRINCIPAL
    {
      id: 'step19-main-description',
      type: 'text-inline',
      properties: {
        content:
          (transitionData as any)?.description ||
          'Chegar até aqui já mostra que você está pronta para se olhar com mais amor, se vestir com mais intenção e deixar sua imagem comunicar quem você é de verdade — com leveza e propósito.',
        fontSize: 'text-lg',
        fontWeight: 'font-normal',
        textAlign: 'text-center',
        color: '#6B4F43',
        marginBottom: 32,
        spacing: 'small',
        marginTop: 0,
        lineHeight: 'leading-relaxed',
      },
    },

    // 🎨 SUBTÍTULO SOBRE RESULTADO
    {
      id: 'step19-result-subtitle',
      type: 'text-inline',
      properties: {
        content:
          (transitionData as any)?.subtitle ||
          'Agora, é hora de revelar o seu Estilo Predominante — e os seus Estilos Complementares. E, mais do que isso, uma oportunidade real de aplicar o seu Estilo com leveza e confiança — todos os dias.',
        fontSize: 'text-xl',
        fontWeight: 'font-medium',
        textAlign: 'text-center',
        color: '#8B7355',
        marginBottom: 24,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 🎁 CALL TO ACTION SOBRE SURPRESA
    {
      id: 'step19-surprise-cta',
      type: 'text-inline',
      properties: {
        content:
          (transitionData as any)?.callToAction ||
          'Ah, e lembra do valor que mencionamos? Prepare-se para uma surpresa: o que você vai receber vale muito mais do que imagina — e vai custar muito menos do que você esperava.',
        fontSize: 'text-lg',
        fontWeight: 'font-medium',
        textAlign: 'text-center',
        color: '#B89B7A',
        marginBottom: 48,
        spacing: 'small',
        marginTop: 0,
        fontStyle: 'italic',
      },
    },

    // 🔘 BOTÃO PARA O RESULTADO
    {
      id: 'step19-result-button',
      type: 'button-inline',
      properties: {
        text: (transitionData as any)?.buttonText || 'Vamos ao resultado?',
        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#ffffff',

        // 🔗 SEMPRE HABILITADO (página de transição)
        disabled: false,
        requiresValidInput: false,

        fullWidth: true,
        marginTop: 24,
        textAlign: 'text-center',
        spacing: 'small',
        marginBottom: 0,

        // 🔗 HANDLER CONECTADO
        onClick: handleContinue,
      },
    },
  ];
};

export const getConnectedStep19Template = () => {
  return ConnectedStep19Template();
};

export default ConnectedStep19Template;

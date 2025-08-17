// 🔗 CONNECTED STEP 12 TEMPLATE - PÁGINA DE TRANSIÇÃO PARA QUESTÕES ESTRATÉGICAS
// Transição: "Enquanto calculamos o seu resultado..."

import { useCallback } from 'react';
import { COMPLETE_QUIZ_QUESTIONS } from '@/data/correctQuizQuestions';

export const ConnectedStep12Template = () => {
  // 🎯 Buscar dados da transição
  const transitionData = COMPLETE_QUIZ_QUESTIONS.find(q => q.id === 'transition1');

  const handleContinue = useCallback(() => {
    console.log('🎯 Connected Step12: Navegando para questões estratégicas');
  }, []);

  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step12-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl:
          'https://res.cloudinary.com/dqljyf76t/image/upload/v1744911572/LOGO_DA_MARCA_GISELE_r14oz2.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 96,
        logoHeight: 96,
        progressValue: 60,
        progressMax: 100,
        showBackButton: true,
        spacing: 'small',
        marginTop: 0,
        marginBottom: 32,
      },
    },

    // 🕐 ÍCONE DE LOADING/CALCULANDO
    {
      id: 'step12-loading-icon',
      type: 'text-inline',
      properties: {
        content: '🕐',
        fontSize: 'text-6xl',
        textAlign: 'text-center',
        marginBottom: 24,
        marginTop: 0,
        spacing: 'small',
      },
    },

    // 🎯 TÍTULO PRINCIPAL (DADOS REAIS)
    {
      id: 'step12-main-title',
      type: 'text-inline',
      properties: {
        content: transitionData?.text || 'Enquanto calculamos o seu resultado...',
        fontSize: 'text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 32,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 📝 SUBTÍTULO
    {
      id: 'step12-subtitle',
      type: 'text-inline',
      properties: {
        content:
          (transitionData as any)?.subtitle ||
          'Queremos te fazer algumas perguntas que vão tornar sua experiência ainda mais completa.',
        fontSize: 'text-xl',
        fontWeight: 'font-medium',
        textAlign: 'text-center',
        color: '#6B4F43',
        marginBottom: 24,
        spacing: 'small',
        marginTop: 0,
      },
    },

    // 📋 DESCRIÇÃO
    {
      id: 'step12-description',
      type: 'text-inline',
      properties: {
        content:
          (transitionData as any)?.description ||
          'A ideia é simples: te ajudar a enxergar com mais clareza onde você está agora — e para onde pode ir com mais intenção, leveza e autenticidade.',
        fontSize: 'text-lg',
        fontWeight: 'font-normal',
        textAlign: 'text-center',
        color: '#8B7355',
        marginBottom: 32,
        spacing: 'small',
        marginTop: 0,
        lineHeight: 'leading-relaxed',
      },
    },

    // 💬 CALL TO ACTION
    {
      id: 'step12-call-to-action',
      type: 'text-inline',
      properties: {
        content:
          (transitionData as any)?.callToAction ||
          '💬 Responda com sinceridade. Isso é só entre você e a sua nova versão.',
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

    // 🔘 BOTÃO PARA QUESTÕES ESTRATÉGICAS
    {
      id: 'step12-continue-button',
      type: 'button-inline',
      properties: {
        text: (transitionData as any)?.buttonText || 'Vamos lá?',
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

export const getConnectedStep12Template = () => {
  return ConnectedStep12Template();
};

export default ConnectedStep12Template;

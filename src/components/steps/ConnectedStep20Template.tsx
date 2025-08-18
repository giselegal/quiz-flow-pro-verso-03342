// 🔗 CONNECTED STEP 20 TEMPLATE - Página de Resultado
// Template para apresentação do resultado personalizado do quiz

import { QUIZ_QUESTIONS_COMPLETE } from '@/templates/quiz21StepsComplete';

export const ConnectedStep20Template = () => {
  // 🎯 Buscar questão real dos dados (FONTE ÚNICA)
  const questionText = QUIZ_QUESTIONS_COMPLETE[20] || 'SEU ESTILO PESSOAL É:';

  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step20-header',
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
        showProgress: true,
        marginTop: 0,
        marginBottom: 0,
      },
    },

    // 🎯 TÍTULO DA PÁGINA DE RESULTADO
    {
      id: 'step20-result-title',
      type: 'text-inline',
      properties: {
        content: questionText,
        fontSize: 'text-3xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 24,
        spacing: 'large',
        marginTop: 0,
      },
    },

    // 🎨 ÁREA DE RESULTADO PERSONALIZADO
    {
      id: 'step20-result-display',
      type: 'quiz-result-display',
      properties: {
        showUserName: true,
        showStyleCategory: true,
        showDescription: true,
        showRecommendations: true,
        backgroundColor: '#F8F9FA',
        padding: '32px',
        borderRadius: '12px',
        marginBottom: 24,
      },
    },

    // 📊 RESUMO DO QUIZ
    {
      id: 'step20-quiz-summary',
      type: 'text-inline',
      properties: {
        content: 'Baseado em suas 19 respostas, identificamos seu estilo predominante:',
        fontSize: 'text-lg',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 32,
      },
    },

    // 🎯 BOTÃO PARA PRÓXIMA ETAPA
    {
      id: 'step20-continue-button',
      type: 'quiz-navigation-button',
      properties: {
        text: 'Ver Recomendações Completas',
        variant: 'primary',
        size: 'large',
        fullWidth: true,
        action: 'next',
        backgroundColor: '#432818',
        textColor: '#FFFFFF',
        hoverColor: '#2D1810',
        borderRadius: '8px',
        fontSize: 'text-lg',
        fontWeight: 'font-semibold',
        padding: '16px 32px',
        marginTop: 24,
      },
    },
  ];
};

// 🔧 FUNÇÃO EXPORT PARA COMPATIBILIDADE COM STEP_TEMPLATES_MAPPING
export const getConnectedStep20Template = (userData?: any) => {
  const userName = localStorage.getItem('quizUserName') || userData?.userName || '';
  const styleCategory =
    localStorage.getItem('quizPrimaryStyle') || userData?.styleCategory || 'Elegante';
  const sessionId = userData?.sessionId || 'default-session';

  console.log('🎨 Step20 personalized data:', { userName, styleCategory, sessionId });

  return ConnectedStep20Template();
};

export default ConnectedStep20Template;

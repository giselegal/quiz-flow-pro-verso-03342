export const FUNNEL_TEMPLATES = {
  styleQuiz: {
    id: 'style-quiz-template',
    name: 'Quiz de Estilo Pessoal',
    description: 'Template completo para quiz de descoberta de estilo',
    category: 'Quiz',
    pages: [
      {
        id: 'intro',
        name: 'Introdução',
        type: 'intro',
        blocks: [
          {
            id: 'intro-header',
            type: 'QuizIntroBlock',
            properties: {
              title: 'Descubra Seu Estilo Pessoal',
              subtitle: 'Quiz gratuito em 5 minutos',
              showBenefits: true,
            },
          },
        ],
      },
      // ... outras páginas
    ],
  },
  leadMagnet: {
    id: 'lead-magnet-template',
    name: 'Ímã de Leads',
    description: 'Template para captura de leads com oferta',
    category: 'Marketing',
    pages: [
      // Páginas do template
    ],
  },
};

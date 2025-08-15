// 🔗 STEP 02 TEMPLATE - QUESTÃO 1: QUAL O SEU TIPO DE ROUPA FAVORITA?
// Template estático que retorna configuração de blocos

import { COMPLETE_QUIZ_QUESTIONS } from '@/data/correctQuizQuestions';

export const getConnectedStep02Template = () => {
  // 🎯 Buscar questão real dos dados
  const questionData = COMPLETE_QUIZ_QUESTIONS.find(q => q.id === 'q1') || COMPLETE_QUIZ_QUESTIONS[1];
  
  return [
    // 📱 CABEÇALHO COM LOGO E PROGRESSO
    {
      id: 'step02-header',
      type: 'quiz-intro-header',
      properties: {
        logoUrl: 'https://res.cloudinary.com/der8kogzu/image/upload/v1752430327/LOGO_DA_MARCA_GISELE_l78gin.webp',
        logoAlt: 'Logo Gisele Galvão',
        logoWidth: 120,
        logoHeight: 50,
        progressValue: 15, // 2/21 * 100 ≈ 15%
        progressMax: 100,
        showBackButton: false,
        spacing: 'medium',
      },
    },

    // 🎯 TÍTULO DA QUESTÃO (DADOS REAIS)
    {
      id: 'step02-question-title',
      type: 'text-inline',
      properties: {
        content: questionData?.title || 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
        fontSize: 'text-2xl',
        fontWeight: 'font-bold',
        textAlign: 'text-center',
        color: '#432818',
        marginBottom: 24,
        marginTop: 16,
      },
    },

    // 📝 DESCRIÇÃO
    {
      id: 'step02-description',
      type: 'text-inline', 
      properties: {
        content: 'Escolha 3 opções que mais combinam com você:',
        fontSize: 'text-lg',
        fontWeight: 'font-medium',
        textAlign: 'text-center',
        color: '#6B7280',
        marginBottom: 32,
      },
    },

    // 🎨 GRID DE OPÇÕES COM IMAGENS (DADOS REAIS)
    {
      id: 'step02-options-grid',
      type: 'options-grid',
      properties: {
        questionId: questionData?.id || 'q1',
        multiSelect: 3,
        exactSelections: true,
        autoAdvance: true,
        autoAdvanceDelay: 800,
        options: questionData?.options || [
          {
            id: '1a',
            text: 'Conforto, leveza e praticidade no vestir',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
            styleCategory: 'Natural',
            weight: 1,
          },
          {
            id: '1b',
            text: 'Discrição, caimento clássico e sobriedade',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
            styleCategory: 'Clássico',
            weight: 1,
          },
          {
            id: '1c',
            text: 'Praticidade com um toque de estilo atual',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp',
            styleCategory: 'Contemporâneo',
            weight: 1,
          },
          {
            id: '1d',
            text: 'Elegância refinada, moderna e sem exageros',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
            styleCategory: 'Elegante',
            weight: 1,
          },
          {
            id: '1e',
            text: 'Delicadeza em tecidos suaves e fluidos',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp',
            styleCategory: 'Romântico',
            weight: 1,
          },
          {
            id: '1f',
            text: 'Sensualidade com destaque para o corpo',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp',
            styleCategory: 'Sexy',
            weight: 1,
          },
          {
            id: '1g',
            text: 'Impacto visual com peças estruturadas e assimétricas',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp',
            styleCategory: 'Dramático',
            weight: 1,
          },
          {
            id: '1h',
            text: 'Mix criativo com formas ousadas e originais',
            imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp',
            styleCategory: 'Criativo',
            weight: 1,
          },
        ],
        gridColumns: 2,
        spacing: 'medium',
        showImages: true,
        allowTextWrapping: true,
      },
    },

    // 🚀 BOTÃO AVANÇAR (ATIVADO APENAS APÓS 3 SELEÇÕES)
    {
      id: 'step02-advance-button',
      type: 'button-inline',
      properties: {
        text: 'Avançar',
        variant: 'primary',
        size: 'large',
        backgroundColor: '#B89B7A',
        textColor: '#FFFFFF',
        borderRadius: 'rounded-lg',
        marginTop: 32,
        marginBottom: 16,
        disabled: true, // Será habilitado pela lógica do quiz
        enabledOnlyWhenValid: true,
        dependsOnQuestion: questionData?.id || 'q1',
        navigationTarget: 'step-03',
      },
    },
  ];
};

export default getConnectedStep02Template;
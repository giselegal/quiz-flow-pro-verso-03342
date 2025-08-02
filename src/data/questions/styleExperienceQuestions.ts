
import { QuizQuestion } from '../../types/quiz';

export const styleExperienceQuestions: QuizQuestion[] = [
  {
    id: 'strategic-3',
    order: 13,
    question: 'Como você aprende melhor sobre estilo e moda?',
    title: 'Como você aprende melhor sobre estilo e moda?',
    type: 'text',
    multiSelect: 1,
    options: [
      {
        id: 'strategic-3-1',
        text: 'Vendo exemplos visuais e imagens de referência',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-3-2',
        text: 'Lendo guias detalhados com explicações passo-a-passo',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-3-3',
        text: 'Com exemplos práticos que posso aplicar no meu dia a dia',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-3-4',
        text: 'Com orientação personalizada para o meu caso específico',
        styleCategory: 'Strategic'
      }
    ]
  },
  {
    id: 'strategic-4',
    order: 14,
    question: 'O que você mais valoriza em um guia de estilo?',
    title: 'O que você mais valoriza em um guia de estilo?',
    type: 'text',
    multiSelect: 1,
    options: [
      {
        id: 'strategic-4-1',
        text: 'Praticidade e facilidade de aplicação',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-4-2',
        text: 'Exemplos de looks montados para diferentes ocasiões',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-4-3',
        text: 'Explicações detalhadas sobre o porquê das recomendações',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-4-4',
        text: 'Dicas para economizar e aproveitar melhor o que já tenho',
        styleCategory: 'Strategic'
      }
    ]
  }
];

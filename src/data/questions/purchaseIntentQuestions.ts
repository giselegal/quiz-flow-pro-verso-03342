
import { QuizQuestion } from '../../types/quiz';

export const purchaseIntentQuestions: QuizQuestion[] = [
  {
    id: 'strategic-5',
    order: 15,
    question: 'Você já considerou investir em algum guia ou consultoria de estilo no passado?',
    title: 'Você já considerou investir em algum guia ou consultoria de estilo no passado?',
    type: 'text',
    multiSelect: 1,
    options: [
      {
        id: 'strategic-5-1',
        text: 'Sim, já pesquisei mas não cheguei a comprar',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-5-2',
        text: 'Sim, já investi em algum curso/guia/consultoria',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-5-3',
        text: 'Não, esta é a primeira vez que considero isso',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-5-4',
        text: 'Prefiro não responder',
        styleCategory: 'Strategic'
      }
    ]
  },
  {
    id: 'strategic-6',
    order: 16,
    question: 'Quanto você estaria disposta a investir em um guia completo de estilo personalizado?',
    title: 'Quanto você estaria disposta a investir em um guia completo de estilo personalizado?',
    type: 'text',
    multiSelect: 1,
    imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744920677/Espanhol_Portugu%C3%AAs_6_jxqlxx.webp',
    options: [
      {
        id: 'strategic-6-1',
        text: 'Menos de R$100',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-6-2',
        text: 'Entre R$100 e R$300',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-6-3',
        text: 'Entre R$300 e R$500',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-6-4',
        text: 'Mais de R$500',
        styleCategory: 'Strategic'
      }
    ]
  }
];

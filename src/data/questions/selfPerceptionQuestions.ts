
import { QuizQuestion } from '../../types/quiz';

export const selfPerceptionQuestions: QuizQuestion[] = [
  {
    id: 'strategic-1',
    order: 11,
    question: 'Como você se sente em relação ao seu estilo pessoal hoje?',
    title: 'Como você se sente em relação ao seu estilo pessoal hoje?',
    type: 'text',
    multiSelect: 1,
    imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746334754/ChatGPT_Image_4_de_mai._de_2025_00_30_44_naqom0.webp',
    options: [
      {
        id: 'strategic-1-1',
        text: 'Completamente perdida, não sei o que combina comigo',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-1-2',
        text: 'Tenho algumas ideias, mas não sei como aplicá-las',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-1-3',
        text: 'Conheço meu estilo, mas quero refiná-lo',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-1-4',
        text: 'Estou satisfeita, só buscando inspiração',
        styleCategory: 'Strategic'
      }
    ]
  },
  {
    id: 'strategic-2',
    order: 12,
    question: 'Qual é o maior desafio que você enfrenta ao se vestir?',
    title: 'Qual é o maior desafio que você enfrenta ao se vestir?',
    type: 'text',
    multiSelect: 1,
    imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1746334753/ChatGPT_Image_4_de_mai._de_2025_01_30_01_vbiysd.webp',
    options: [
      {
        id: 'strategic-2-1',
        text: 'Nunca sei o que combina com o quê',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-2-2',
        text: 'Tenho muitas roupas, mas sempre sinto que não tenho nada para vestir',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-2-3',
        text: 'Não consigo criar looks diferentes com as peças que tenho',
        styleCategory: 'Strategic'
      },
      {
        id: 'strategic-2-4',
        text: 'Compro peças por impulso que depois não uso',
        styleCategory: 'Strategic'
      }
    ]
  }
];

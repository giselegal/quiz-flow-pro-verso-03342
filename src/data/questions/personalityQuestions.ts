
import { QuizQuestion } from '../../types/quiz';

export const personalityQuestions: QuizQuestion[] = [
  {
    id: '2',
    order: 2,
    question: 'RESUMA A SUA PERSONALIDADE:',
    title: 'RESUMA A SUA PERSONALIDADE:',
    type: 'text',
    multiSelect: 3,
    options: [
      {
        id: '2a',
        text: 'Informal, espontânea, alegre, essencialista.',
        styleCategory: 'Natural',
        points: 1
      },
      {
        id: '2b',
        text: 'Conservadora, séria, organizada.',
        styleCategory: 'Clássico',
        points: 1
      },
      {
        id: '2c',
        text: 'Informada, ativa, prática.',
        styleCategory: 'Contemporâneo',
        points: 1
      },
      {
        id: '2d',
        text: 'Exigente, sofisticada, seletiva.',
        styleCategory: 'Elegante',
        points: 1
      },
      {
        id: '2e',
        text: 'Feminina, meiga, delicada, sensível.',
        styleCategory: 'Romântico',
        points: 1
      },
      {
        id: '2f',
        text: 'Glamorosa, vaidosa, sensual.',
        styleCategory: 'Sexy',
        points: 1
      },
      {
        id: '2g',
        text: 'Cosmopolita, moderna e audaciosa.',
        styleCategory: 'Dramático',
        points: 1
      },
      {
        id: '2h',
        text: 'Exótica, aventureira, livre.',
        styleCategory: 'Criativo',
        points: 1
      }
    ]
  }
];


import { QuizQuestion } from '../../types/quiz';

export const stylePreferencesQuestions: QuizQuestion[] = [
  {
    id: '5',
    order: 5,
    question: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
    title: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
    type: 'both',
    multiSelect: 3,
    options: [
      {
        id: '5a',
        text: 'Listras simples ou sem estampa.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/19_rqsmym.webp',
        styleCategory: 'Natural',
        points: 1
      },
      {
        id: '5b',
        text: 'Xadrez clássico ou listras discretas.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/20_fxtgdv.webp',
        styleCategory: 'Clássico',
        points: 1
      },
      {
        id: '5c',
        text: 'Estampas geométricas modernas.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/21_ccnrbe.webp',
        styleCategory: 'Contemporâneo',
        points: 1
      },
      {
        id: '5d',
        text: 'Estampas sofisticadas e atemporais.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/22_bsdbnc.webp',
        styleCategory: 'Elegante',
        points: 1
      },
      {
        id: '5e',
        text: 'Floral delicado ou poá romântico.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/23_fwpqj5.webp',
        styleCategory: 'Romântico',
        points: 1
      },
      {
        id: '5f',
        text: 'Animal print ou estampas sensuais.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/24_gwbdap.webp',
        styleCategory: 'Sexy',
        points: 1
      },
      {
        id: '5g',
        text: 'Estampas gráficas impactantes.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/25_pdsrpa.webp',
        styleCategory: 'Dramático',
        points: 1
      },
      {
        id: '5h',
        text: 'Estampas étnicas ou artísticas.',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735424/26_o7o0jf.webp',
        styleCategory: 'Criativo',
        points: 1
      }
    ]
  },
  {
    id: '10',
    order: 10,
    question: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
    title: 'VOCÊ ESCOLHE CERTOS TECIDOS, PRINCIPALMENTE PORQUE ELES...',
    type: 'text',
    multiSelect: 1,
    options: [
      {
        id: '10a',
        text: 'São confortáveis e não amassam facilmente.',
        styleCategory: 'Natural',
        points: 1
      },
      {
        id: '10b',
        text: 'Têm qualidade e durabilidade.',
        styleCategory: 'Clássico',
        points: 1
      },
      {
        id: '10c',
        text: 'São práticos para o dia a dia.',
        styleCategory: 'Contemporâneo',
        points: 1
      },
      {
        id: '10d',
        text: 'Têm acabamento impecável e caimento perfeito.',
        styleCategory: 'Elegante',
        points: 1
      },
      {
        id: '10e',
        text: 'São macios, fluidos e delicados ao toque.',
        styleCategory: 'Romântico',
        points: 1
      },
      {
        id: '10f',
        text: 'Modelam o corpo e valorizam as curvas.',
        styleCategory: 'Sexy',
        points: 1
      },
      {
        id: '10g',
        text: 'Têm estrutura e mantêm a forma.',
        styleCategory: 'Dramático',
        points: 1
      },
      {
        id: '10h',
        text: 'São diferentes, têm textura interessante.',
        styleCategory: 'Criativo',
        points: 1
      }
    ]
  }
];

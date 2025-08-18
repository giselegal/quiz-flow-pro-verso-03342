import { QuizQuestion } from '@/types/quiz';

/**
 * ✅ QUIZ COMPLETO DE ESTILO PESSOAL - 18 ETAPAS BASEADO NO FLUXO ORIGINAL
 *
 * FLUXO CORRETO:
 * 1. QuizIntro → Coleta do nome
 * 2-11. 10 questões normais com pontuação (8 categorias de estilo)
 * 12. QuizTransition → Apresenta primeira questão estratégica
 * 13-17. 6 questões estratégicas restantes
 * 18. Etapa Transição 2: mensagem antes do resultado
 * 19. Página de resultado personalizada + ofertas
 */
export const caktoquizQuestions: QuizQuestion[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // 🎯 ETAPA 1: COLETA DE NOME (não pontua)
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'q0',
    text: 'Qual é o seu primeiro nome?',
    order: 0,
    type: 'name-input',
    options: [], // Input de texto para coleta de nome
  },

  // ═══════════════════════════════════════════════════════════════════════
  // 🎯 ETAPAS 2-11: QUESTÕES QUE PONTUAM PARA O RESULTADO (10 questões)
  // 8 Categorias: Natural, Clássico, Contemporâneo, Elegante, Romântico, Sexy, Dramático, Criativo
  // ═══════════════════════════════════════════════════════════════════════
  {
    id: 'q1',
    text: 'Que roupas você mais gosta de usar no dia a dia?',
    order: 1,
    type: 'multiple-choice',
    multiSelect: 3,
    options: [
      {
        id: 'q1_o1',
        text: 'Vestidos femininos e delicados',
        style: 'romântico',
        imageUrl: 'https://example.com/romantic-dress.jpg',
        weight: 2,
      },
      {
        id: 'q1_o2',
        text: 'Roupas confortáveis e práticas',
        style: 'natural',
        imageUrl: 'https://example.com/casual-wear.jpg',
        weight: 2,
      },
      {
        id: 'q1_o3',
        text: 'Peças estruturadas e clássicas',
        style: 'classico',
        imageUrl: 'https://example.com/classic-suit.jpg',
        weight: 2,
      },
      {
        id: 'q1_o4',
        text: 'Looks modernos e ousados',
        style: 'contemporâneo',
        imageUrl: 'https://example.com/modern-outfit.jpg',
        weight: 2,
      },
    ],
  },
  {
    id: 'q2',
    text: 'Qual seu estilo de acessórios preferido?',
    order: 2,
    type: 'single-choice',
    options: [
      {
        id: 'q2_o1',
        text: 'Joias delicadas e femininas',
        style: 'romântico',
        weight: 2,
      },
      {
        id: 'q2_o2',
        text: 'Acessórios minimalistas',
        style: 'natural',
        weight: 2,
      },
      {
        id: 'q2_o3',
        text: 'Peças clássicas atemporais',
        style: 'classico',
        weight: 2,
      },
      {
        id: 'q2_o4',
        text: 'Acessórios statement',
        style: 'dramático',
        weight: 2,
      },
    ],
  },
  {
    id: 'q3',
    text: 'Como você gosta de se sentir nas suas roupas?',
    order: 3,
    type: 'single-choice',
    options: [
      {
        id: 'q3_o1',
        text: 'Feminina e delicada',
        style: 'romântico',
        weight: 2,
      },
      {
        id: 'q3_o2',
        text: 'Confortável e à vontade',
        style: 'natural',
        weight: 2,
      },
      {
        id: 'q3_o3',
        text: 'Elegante e sofisticada',
        style: 'elegante',
        weight: 2,
      },
      {
        id: 'q3_o4',
        text: 'Poderosa e marcante',
        style: 'dramático',
        weight: 2,
      },
    ],
  },
  {
    id: 'q4',
    text: 'Qual dessas cores você mais usa?',
    order: 4,
    type: 'single-choice',
    options: [
      {
        id: 'q4_o1',
        text: 'Rosa, lavanda e tons pastéis',
        style: 'romântico',
        weight: 2,
      },
      {
        id: 'q4_o2',
        text: 'Bege, marrom e tons terrosos',
        style: 'natural',
        weight: 2,
      },
      {
        id: 'q4_o3',
        text: 'Azul marinho, branco e cinza',
        style: 'classico',
        weight: 2,
      },
      {
        id: 'q4_o4',
        text: 'Preto, vermelho e cores vibrantes',
        style: 'dramático',
        weight: 2,
      },
    ],
  },
  {
    id: 'q5',
    text: 'Que tipo de evento você mais frequenta?',
    order: 5,
    type: 'single-choice',
    options: [
      {
        id: 'q5_o1',
        text: 'Encontros românticos e jantares',
        style: 'romântico',
        weight: 2,
      },
      {
        id: 'q5_o2',
        text: 'Atividades ao ar livre e casuais',
        style: 'natural',
        weight: 2,
      },
      {
        id: 'q5_o3',
        text: 'Reuniões profissionais e formais',
        style: 'classico',
        weight: 2,
      },
      {
        id: 'q5_o4',
        text: 'Festas e eventos sociais',
        style: 'dramático',
        weight: 2,
      },
    ],
  },
  {
    id: 'q6',
    text: 'Qual seu tipo de sapato favorito?',
    order: 6,
    type: 'single-choice',
    options: [
      {
        id: 'q6_o1',
        text: 'Sapatilhas e sandálias delicadas',
        style: 'romântico',
        weight: 2,
      },
      {
        id: 'q6_o2',
        text: 'Tênis e sapatos confortáveis',
        style: 'natural',
        weight: 2,
      },
      {
        id: 'q6_o3',
        text: 'Scarpin e sapatos clássicos',
        style: 'classico',
        weight: 2,
      },
      {
        id: 'q6_o4',
        text: 'Botas e sapatos marcantes',
        style: 'dramático',
        weight: 2,
      },
    ],
  },
  {
    id: 'q7',
    text: 'Como você prefere seu cabelo?',
    order: 7,
    type: 'single-choice',
    options: [
      {
        id: 'q7_o1',
        text: 'Solto e com cachos suaves',
        style: 'romântico',
        weight: 2,
      },
      {
        id: 'q7_o2',
        text: 'Natural e com movimento',
        style: 'natural',
        weight: 2,
      },
      {
        id: 'q7_o3',
        text: 'Bem penteado e estruturado',
        style: 'classico',
        weight: 2,
      },
      {
        id: 'q7_o4',
        text: 'Com volume e statement',
        style: 'dramático',
        weight: 2,
      },
    ],
  },
  {
    id: 'q8',
    text: 'Qual sua estampa preferida?',
    order: 8,
    type: 'single-choice',
    options: [
      {
        id: 'q8_o1',
        text: 'Flores e padrões delicados',
        style: 'romântico',
        weight: 2,
      },
      {
        id: 'q8_o2',
        text: 'Listras e padrões simples',
        style: 'natural',
        weight: 2,
      },
      {
        id: 'q8_o3',
        text: 'Listras navais e padrões clássicos',
        style: 'classico',
        weight: 2,
      },
      {
        id: 'q8_o4',
        text: 'Animal print e padrões ousados',
        style: 'dramático',
        weight: 2,
      },
    ],
  },
  {
    id: 'q9',
    text: 'Como você gosta de se maquiar?',
    order: 9,
    type: 'single-choice',
    options: [
      {
        id: 'q9_o1',
        text: 'Maquiagem suave e natural',
        style: 'romântico',
        weight: 2,
      },
      {
        id: 'q9_o2',
        text: 'Só o básico ou quase nada',
        style: 'natural',
        weight: 2,
      },
      {
        id: 'q9_o3',
        text: 'Clássica e bem feita',
        style: 'classico',
        weight: 2,
      },
      {
        id: 'q9_o4',
        text: 'Marcante com detalhes especiais',
        style: 'dramático',
        weight: 2,
      },
    ],
  },
  {
    id: 'q10',
    text: 'Qual dessas peças não pode faltar no seu guarda-roupa?',
    order: 10,
    type: 'single-choice',
    options: [
      {
        id: 'q10_o1',
        text: 'Vestido florido',
        style: 'romântico',
        weight: 2,
      },
      {
        id: 'q10_o2',
        text: 'Jeans confortável',
        style: 'natural',
        weight: 2,
      },
      {
        id: 'q10_o3',
        text: 'Blazer estruturado',
        style: 'classico',
        weight: 2,
      },
      {
        id: 'q10_o4',
        text: 'Peça statement única',
        style: 'dramático',
        weight: 2,
      },
    ],
  },

  // ETAPAS 12: Transição para questões estratégicas
  {
    id: 'q11',
    text: 'Transição: Agora vamos entender melhor seus objetivos!',
    order: 11,
    type: 'transition',
    options: [], // Apenas informativo
  },

  // ETAPAS 13-18: QUESTÕES ESTRATÉGICAS (não pontuam, apenas coletam dados)
  {
    id: 'q12',
    text: 'Qual é o seu principal objetivo ao melhorar seu estilo?',
    order: 12,
    type: 'strategic',
    options: [
      {
        id: 'q12_o1',
        text: 'Aumentar minha autoestima',
        styleCategory: 'personal-development',
      },
      {
        id: 'q12_o2',
        text: 'Impressionar no trabalho',
        styleCategory: 'professional-growth',
      },
      {
        id: 'q12_o3',
        text: 'Sentir-me mais atraente',
        styleCategory: 'confidence',
      },
      {
        id: 'q12_o4',
        text: 'Organizar meu guarda-roupa',
        styleCategory: 'organization',
      },
    ],
  },
  {
    id: 'q13',
    text: 'Quanto você costuma investir mensalmente em roupas?',
    order: 13,
    type: 'strategic',
    options: [
      {
        id: 'q13_o1',
        text: 'Até R$ 200',
        styleCategory: 'budget-conscious',
      },
      {
        id: 'q13_o2',
        text: 'R$ 200 - R$ 500',
        styleCategory: 'moderate-budget',
      },
      {
        id: 'q13_o3',
        text: 'R$ 500 - R$ 1000',
        styleCategory: 'investment-oriented',
      },
      {
        id: 'q13_o4',
        text: 'Mais de R$ 1000',
        styleCategory: 'premium-budget',
      },
    ],
  },
  {
    id: 'q14',
    text: 'Que tipo de conteúdo sobre moda mais te interessa?',
    order: 14,
    type: 'strategic',
    options: [
      {
        id: 'q14_o1',
        text: 'Dicas de combinações',
        styleCategory: 'styling-tips',
      },
      {
        id: 'q14_o2',
        text: 'Tendências da moda',
        styleCategory: 'trends',
      },
      {
        id: 'q14_o3',
        text: 'Consultoria personalizada',
        styleCategory: 'personal-consultation',
      },
      {
        id: 'q14_o4',
        text: 'Guia de compras inteligentes',
        styleCategory: 'smart-shopping',
      },
    ],
  },
  {
    id: 'q15',
    text: 'Com que frequência você gostaria de receber dicas de estilo?',
    order: 15,
    type: 'strategic',
    options: [
      {
        id: 'q15_o1',
        text: 'Diariamente',
        styleCategory: 'high-engagement',
      },
      {
        id: 'q15_o2',
        text: 'Semanalmente',
        styleCategory: 'regular-engagement',
      },
      {
        id: 'q15_o3',
        text: 'Quinzenalmente',
        styleCategory: 'moderate-engagement',
      },
      {
        id: 'q15_o4',
        text: 'Mensalmente',
        styleCategory: 'low-engagement',
      },
    ],
  },
  {
    id: 'q16',
    text: 'Qual seu maior desafio atual com seu guarda-roupa?',
    order: 16,
    type: 'strategic',
    options: [
      {
        id: 'q16_o1',
        text: 'Não sei combinar as peças',
        styleCategory: 'styling-challenges',
      },
      {
        id: 'q16_o2',
        text: 'Tenho muitas roupas mas nada para usar',
        styleCategory: 'wardrobe-overwhelm',
      },
      {
        id: 'q16_o3',
        text: 'Compro peças que não uso',
        styleCategory: 'purchase-regrets',
      },
      {
        id: 'q16_o4',
        text: 'Não sei qual é meu estilo',
        styleCategory: 'style-confusion',
      },
    ],
  },
  {
    id: 'q17',
    text: 'Como você prefere receber orientações sobre seu estilo?',
    order: 17,
    type: 'strategic',
    options: [
      {
        id: 'q17_o1',
        text: 'E-books e guias digitais',
        styleCategory: 'digital-content',
      },
      {
        id: 'q17_o2',
        text: 'Vídeos e tutoriais',
        styleCategory: 'video-content',
      },
      {
        id: 'q17_o3',
        text: 'Consultoria ao vivo',
        styleCategory: 'live-consultation',
      },
      {
        id: 'q17_o4',
        text: 'Posts e dicas rápidas',
        styleCategory: 'quick-tips',
      },
    ],
  },

  // ETAPA 19: Transição para resultado
  {
    id: 'q18',
    text: 'Preparando seu resultado personalizado...',
    order: 18,
    type: 'transition-to-result',
    options: [], // Apenas informativo
  },

  // ETAPA 20: Resultado (calculado das questões 2-11)
  {
    id: 'q19',
    text: 'Seu Resultado Personalizado',
    order: 19,
    type: 'result-display',
    options: [], // Resultado calculado
  },

  // ETAPA 21: Página de obrigado/CTA final
  {
    id: 'q20',
    text: 'Parabéns! Agora você conhece seu estilo predominante!',
    order: 20,
    type: 'thank-you-page',
    options: [], // CTA final
  },
];

export default caktoquizQuestions;

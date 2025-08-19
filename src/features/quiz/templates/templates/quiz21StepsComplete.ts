/**
 * 🎯 TEMPLATE COMPLETO DAS 21 ETAPAS DO QUIZ DE ESTILO PESSOAL
 * 
 * Dados estruturados para todas as etapas do quiz com questões,
 * opções, pontuações e configurações visuais.
 */

export interface QuizOption {
  id: string;
  text: string;
  imageUrl?: string;
  points: Record<string, number>; // Pontos para cada estilo
}

export interface QuizStepData {
  stepNumber: number;
  stepId: string;
  title: string;
  subtitle?: string;
  question?: string;
  type: 'intro' | 'question' | 'transition' | 'result' | 'offer';
  options?: QuizOption[];
  isRequired?: boolean;
  maxSelections?: number;
  backgroundColor?: string;
  textColor?: string;
}

export const QUIZ_21_STEPS_COMPLETE: QuizStepData[] = [
  {
    stepNumber: 1,
    stepId: 'step-1',
    title: 'Descubra seu Estilo Pessoal',
    subtitle: 'Quiz de Personalidade e Estilo',
    type: 'intro',
    backgroundColor: '#F8F9FA',
    textColor: '#333333'
  },
  {
    stepNumber: 2,
    stepId: 'step-2',
    title: 'Qual tipo de roupa você se sente mais confortável?',
    type: 'question',
    maxSelections: 3,
    isRequired: true,
    options: [
      {
        id: 'casual',
        text: 'Roupas casuais e confortáveis',
        points: { casual: 3, confortavel: 2, pratico: 2 }
      },
      {
        id: 'elegante',
        text: 'Peças elegantes e sofisticadas',
        points: { elegante: 3, sofisticado: 2, classico: 1 }
      },
      {
        id: 'moderno',
        text: 'Looks modernos e tendência',
        points: { moderno: 3, trendy: 2, inovador: 1 }
      },
      {
        id: 'boho',
        text: 'Estilo boho e livre',
        points: { boho: 3, livre: 2, criativo: 2 }
      },
      {
        id: 'minimalista',
        text: 'Visual clean e minimalista',
        points: { minimalista: 3, clean: 2, simples: 1 }
      },
      {
        id: 'romantico',
        text: 'Peças românticas e delicadas',
        points: { romantico: 3, delicado: 2, feminino: 2 }
      }
    ]
  },
  {
    stepNumber: 3,
    stepId: 'step-3',
    title: 'Quais cores mais combinam com você?',
    type: 'question',
    maxSelections: 3,
    isRequired: true,
    options: [
      {
        id: 'neutras',
        text: 'Tons neutros (bege, branco, cinza)',
        points: { minimalista: 2, classico: 2, elegante: 1 }
      },
      {
        id: 'vibrantes',
        text: 'Cores vibrantes (vermelho, rosa, amarelo)',
        points: { moderno: 2, criativo: 2, extrovertido: 3 }
      },
      {
        id: 'escuras',
        text: 'Tons escuros (preto, marinho, vinho)',
        points: { elegante: 2, sofisticado: 3, misterioso: 2 }
      },
      {
        id: 'terrosas',
        text: 'Cores terrosas (marrom, caramelo, verde)',
        points: { boho: 3, natural: 2, organico: 2 }
      },
      {
        id: 'pasteis',
        text: 'Tons pastéis (rosa claro, azul bebê)',
        points: { romantico: 3, delicado: 2, suave: 2 }
      },
      {
        id: 'metalicas',
        text: 'Tons metálicos (dourado, prata, bronze)',
        points: { glamouroso: 3, sofisticado: 2, luxuoso: 2 }
      }
    ]
  },
  {
    stepNumber: 4,
    stepId: 'step-4',
    title: 'Que tipo de acessórios você prefere?',
    type: 'question',
    maxSelections: 3,
    isRequired: true,
    options: [
      {
        id: 'delicados',
        text: 'Joias delicadas e discretas',
        points: { minimalista: 2, elegante: 2, discreto: 3 }
      },
      {
        id: 'statement',
        text: 'Peças statement e marcantes',
        points: { extrovertido: 3, moderno: 2, ousado: 3 }
      },
      {
        id: 'vintage',
        text: 'Acessórios vintage e únicos',
        points: { boho: 2, vintage: 3, criativo: 2 }
      },
      {
        id: 'classicos',
        text: 'Acessórios clássicos atemporais',
        points: { classico: 3, elegante: 2, tradicional: 2 }
      },
      {
        id: 'naturais',
        text: 'Materiais naturais (madeira, pedras)',
        points: { boho: 3, natural: 3, organico: 2 }
      },
      {
        id: 'modernos',
        text: 'Designs modernos e geométricos',
        points: { moderno: 3, geometrico: 2, inovador: 2 }
      }
    ]
  },
  {
    stepNumber: 5,
    stepId: 'step-5',
    title: 'Para uma ocasião especial, você escolheria:',
    type: 'question',
    maxSelections: 3,
    isRequired: true,
    options: [
      {
        id: 'vestido-longo',
        text: 'Vestido longo elegante',
        points: { elegante: 3, glamouroso: 2, feminino: 2 }
      },
      {
        id: 'conjunto-moderno',
        text: 'Conjunto moderno e estiloso',
        points: { moderno: 3, sofisticado: 2, contemporaneo: 2 }
      },
      {
        id: 'look-boho',
        text: 'Look boho chic único',
        points: { boho: 3, criativo: 2, livre: 3 }
      },
      {
        id: 'classico-atemporal',
        text: 'Visual clássico atemporal',
        points: { classico: 3, tradicional: 2, elegante: 1 }
      },
      {
        id: 'minimalista-chic',
        text: 'Minimalista chic',
        points: { minimalista: 3, clean: 2, sofisticado: 1 }
      },
      {
        id: 'romantico-delicado',
        text: 'Look romântico delicado',
        points: { romantico: 3, delicado: 2, feminino: 3 }
      }
    ]
  },
  {
    stepNumber: 6,
    stepId: 'step-6',
    title: 'Qual estilo de cabelo mais combina com você?',
    type: 'question',
    maxSelections: 3,
    isRequired: true,
    options: [
      {
        id: 'liso-clean',
        text: 'Liso e clean',
        points: { minimalista: 2, elegante: 2, clean: 3 }
      },
      {
        id: 'ondulado-natural',
        text: 'Ondulado natural',
        points: { boho: 2, natural: 3, livre: 2 }
      },
      {
        id: 'estruturado-moderno',
        text: 'Corte estruturado moderno',
        points: { moderno: 3, geometrico: 2, ousado: 2 }
      },
      {
        id: 'classico-elegante',
        text: 'Penteado clássico elegante',
        points: { classico: 3, elegante: 2, tradicional: 2 }
      },
      {
        id: 'despojado-texturizado',
        text: 'Despojado e texturizado',
        points: { casual: 3, descontraido: 2, pratico: 2 }
      },
      {
        id: 'romantico-solto',
        text: 'Romântico e solto',
        points: { romantico: 3, delicado: 2, feminino: 2 }
      }
    ]
  },
  {
    stepNumber: 7,
    stepId: 'step-7',
    title: 'Sua abordagem com maquiagem é:',
    type: 'question',
    maxSelections: 3,
    isRequired: true,
    options: [
      {
        id: 'natural-suave',
        text: 'Natural e suave',
        points: { natural: 3, suave: 2, minimalista: 2 }
      },
      {
        id: 'marcante-dramatica',
        text: 'Marcante e dramática',
        points: { glamouroso: 3, ousado: 3, extrovertido: 2 }
      },
      {
        id: 'classica-elegante',
        text: 'Clássica e elegante',
        points: { classico: 3, elegante: 2, sofisticado: 2 }
      },
      {
        id: 'criativa-colorida',
        text: 'Criativa e colorida',
        points: { criativo: 3, moderno: 2, artistico: 3 }
      },
      {
        id: 'pratica-rapida',
        text: 'Prática e rápida',
        points: { pratico: 3, casual: 2, descomplicado: 3 }
      },
      {
        id: 'romantica-rosada',
        text: 'Romântica com tons rosados',
        points: { romantico: 3, delicado: 2, feminino: 2 }
      }
    ]
  },
  {
    stepNumber: 8,
    stepId: 'step-8',
    title: 'Que tipo de sapato você usa mais?',
    type: 'question',
    maxSelections: 3,
    isRequired: true,
    options: [
      {
        id: 'tenis-confortavel',
        text: 'Tênis confortável',
        points: { casual: 3, pratico: 3, confortavel: 3 }
      },
      {
        id: 'salto-elegante',
        text: 'Salto alto elegante',
        points: { elegante: 3, glamouroso: 2, feminino: 2 }
      },
      {
        id: 'bota-estilosa',
        text: 'Bota estilosa',
        points: { moderno: 2, ousado: 2, versatil: 3 }
      },
      {
        id: 'sapatilha-delicada',
        text: 'Sapatilha delicada',
        points: { romantico: 2, delicado: 3, feminino: 2 }
      },
      {
        id: 'oxford-classico',
        text: 'Oxford clássico',
        points: { classico: 3, sofisticado: 2, tradicional: 2 }
      },
      {
        id: 'sandalia-boho',
        text: 'Sandália boho',
        points: { boho: 3, livre: 2, natural: 2 }
      }
    ]
  },
  {
    stepNumber: 9,
    stepId: 'step-9',
    title: 'Seu estilo de vida é mais:',
    type: 'question',
    maxSelections: 3,
    isRequired: true,
    options: [
      {
        id: 'agitado-urbano',
        text: 'Agitado e urbano',
        points: { moderno: 3, dinamico: 3, urbano: 3 }
      },
      {
        id: 'tranquilo-organizado',
        text: 'Tranquilo e organizado',
        points: { minimalista: 2, organizado: 3, equilibrado: 2 }
      },
      {
        id: 'criativo-artistico',
        text: 'Criativo e artístico',
        points: { criativo: 3, artistico: 3, boho: 2 }
      },
      {
        id: 'social-extrovertido',
        text: 'Social e extrovertido',
        points: { extrovertido: 3, social: 3, comunicativo: 2 }
      },
      {
        id: 'tradicional-familia',
        text: 'Tradicional e familiar',
        points: { classico: 2, tradicional: 3, conservador: 2 }
      },
      {
        id: 'aventureiro-livre',
        text: 'Aventureiro e livre',
        points: { livre: 3, aventureiro: 3, boho: 2 }
      }
    ]
  },
  {
    stepNumber: 10,
    stepId: 'step-10',
    title: 'Sua maior inspiração de estilo vem de:',
    type: 'question',
    maxSelections: 3,
    isRequired: true,
    options: [
      {
        id: 'revistas-moda',
        text: 'Revistas de moda',
        points: { moderno: 2, trendy: 3, fashionista: 3 }
      },
      {
        id: 'rua-pessoas',
        text: 'Estilo de rua e pessoas reais',
        points: { casual: 2, autentico: 3, urbano: 2 }
      },
      {
        id: 'arte-cultura',
        text: 'Arte e cultura',
        points: { criativo: 3, artistico: 3, intelectual: 2 }
      },
      {
        id: 'natureza-viagens',
        text: 'Natureza e viagens',
        points: { boho: 3, natural: 3, aventureiro: 2 }
      },
      {
        id: 'classicos-atemporais',
        text: 'Clássicos atemporais',
        points: { classico: 3, elegante: 2, tradicional: 2 }
      },
      {
        id: 'intuicao-pessoal',
        text: 'Minha própria intuição',
        points: { autentico: 3, individual: 3, confiante: 2 }
      }
    ]
  },
  {
    stepNumber: 11,
    stepId: 'step-11',
    title: 'Como as pessoas te descrevem?',
    type: 'question',
    maxSelections: 3,
    isRequired: true,
    options: [
      {
        id: 'elegante-sofisticada',
        text: 'Elegante e sofisticada',
        points: { elegante: 3, sofisticado: 3, refinado: 2 }
      },
      {
        id: 'criativa-original',
        text: 'Criativa e original',
        points: { criativo: 3, original: 3, artistico: 2 }
      },
      {
        id: 'pratica-organizada',
        text: 'Prática e organizada',
        points: { pratico: 3, organizado: 3, eficiente: 2 }
      },
      {
        id: 'carinhosa-delicada',
        text: 'Carinhosa e delicada',
        points: { romantico: 3, delicado: 3, amorosa: 2 }
      },
      {
        id: 'confiante-moderna',
        text: 'Confiante e moderna',
        points: { moderno: 3, confiante: 3, ousado: 2 }
      },
      {
        id: 'livre-autenetica',
        text: 'Livre e autêntica',
        points: { livre: 3, autentico: 3, individual: 2 }
      }
    ]
  },
  {
    stepNumber: 12,
    stepId: 'step-12',
    title: 'Agora vamos aprofundar...',
    subtitle: 'As próximas perguntas vão revelar aspectos únicos do seu estilo',
    type: 'transition',
    backgroundColor: '#F0F4F8',
    textColor: '#2D3748'
  },
  {
    stepNumber: 13,
    stepId: 'step-13',
    title: 'Qual dessas palavras mais ressoa com você?',
    type: 'question',
    maxSelections: 3,
    isRequired: true,
    options: [
      {
        id: 'sofisticacao',
        text: 'Sofisticação',
        points: { elegante: 3, sofisticado: 3, refinado: 2 }
      },
      {
        id: 'autenticidade',
        text: 'Autenticidade',
        points: { autentico: 3, individual: 2, honesto: 2 }
      },
      {
        id: 'criatividade',
        text: 'Criatividade',
        points: { criativo: 3, artistico: 2, inovador: 2 }
      },
      {
        id: 'harmonia',
        text: 'Harmonia',
        points: { equilibrado: 3, pacifico: 2, serenidade: 2 }
      },
      {
        id: 'paixao',
        text: 'Paixão',
        points: { intenso: 3, apaixonado: 2, vibrante: 2 }
      },
      {
        id: 'liberdade',
        text: 'Liberdade',
        points: { livre: 3, independente: 2, aventureiro: 2 }
      }
    ]
  },
  {
    stepNumber: 14,
    stepId: 'step-14',
    title: 'Em um dia perfeito, você estaria:',
    type: 'question',
    maxSelections: 3,
    isRequired: true,
    options: [
      {
        id: 'evento-elegante',
        text: 'Em um evento elegante',
        points: { elegante: 3, social: 2, glamouroso: 2 }
      },
      {
        id: 'cafe-arte',
        text: 'Em um café lendo sobre arte',
        points: { intelectual: 3, criativo: 2, contemplativo: 2 }
      },
      {
        id: 'natureza-livre',
        text: 'Na natureza, livre e relaxada',
        points: { natural: 3, livre: 3, tranquilo: 2 }
      },
      {
        id: 'projeto-criativo',
        text: 'Trabalhando em um projeto criativo',
        points: { criativo: 3, focado: 2, produtivo: 2 }
      },
      {
        id: 'familia-casa',
        text: 'Em casa com família/amigos',
        points: { acolhedor: 3, familiar: 2, intimista: 2 }
      },
      {
        id: 'explorando-cidade',
        text: 'Explorando uma nova cidade',
        points: { aventureiro: 3, curioso: 2, urbano: 2 }
      }
    ]
  },
  {
    stepNumber: 15,
    stepId: 'step-15',
    title: 'Sua cor favorita para um ambiente é:',
    type: 'question',
    maxSelections: 3,
    isRequired: true,
    options: [
      {
        id: 'branco-puro',
        text: 'Branco puro e clean',
        points: { minimalista: 3, clean: 3, puro: 2 }
      },
      {
        id: 'dourado-luxo',
        text: 'Dourado e tons de luxo',
        points: { luxuoso: 3, glamouroso: 3, opulento: 2 }
      },
      {
        id: 'verde-natureza',
        text: 'Verde e tons da natureza',
        points: { natural: 3, organico: 2, tranquilo: 2 }
      },
      {
        id: 'rosa-delicado',
        text: 'Rosa e tons delicados',
        points: { romantico: 3, delicado: 3, feminino: 2 }
      },
      {
        id: 'preto-dramatico',
        text: 'Preto e contrastes dramáticos',
        points: { dramatico: 3, ousado: 3, intenso: 2 }
      },
      {
        id: 'cores-vibrantes',
        text: 'Cores vibrantes e energéticas',
        points: { vibrante: 3, energetico: 3, alegre: 2 }
      }
    ]
  },
  {
    stepNumber: 16,
    stepId: 'step-16',
    title: 'Qual dessas experiências mais te atrai?',
    type: 'question',
    maxSelections: 3,
    isRequired: true,
    options: [
      {
        id: 'opera-teatro',
        text: 'Ópera ou teatro clássico',
        points: { classico: 3, cultural: 3, refinado: 2 }
      },
      {
        id: 'galeria-arte',
        text: 'Galeria de arte contemporânea',
        points: { moderno: 3, artistico: 3, intelectual: 2 }
      },
      {
        id: 'festival-musica',
        text: 'Festival de música ao ar livre',
        points: { livre: 3, musical: 2, social: 2 }
      },
      {
        id: 'spa-relaxamento',
        text: 'Spa e relaxamento',
        points: { tranquilo: 3, cuidado_pessoal: 3, serenidade: 2 }
      },
      {
        id: 'workshop-criativo',
        text: 'Workshop criativo',
        points: { criativo: 3, aprendizado: 2, hands_on: 2 }
      },
      {
        id: 'jantar-elegante',
        text: 'Jantar em restaurante elegante',
        points: { elegante: 3, gourmet: 2, sofisticado: 2 }
      }
    ]
  },
  {
    stepNumber: 17,
    stepId: 'step-17',
    title: 'Seu perfume ideal tem notas de:',
    type: 'question',
    maxSelections: 3,
    isRequired: true,
    options: [
      {
        id: 'flores-delicadas',
        text: 'Flores delicadas (rosa, peônia)',
        points: { romantico: 3, delicado: 3, feminino: 2 }
      },
      {
        id: 'madeiras-nobres',
        text: 'Madeiras nobres (sândalo, cedro)',
        points: { sofisticado: 3, terroso: 2, profundo: 2 }
      },
      {
        id: 'citricos-frescos',
        text: 'Cítricos frescos (bergamota, limão)',
        points: { fresco: 3, energetico: 2, vibrante: 2 }
      },
      {
        id: 'especiarias-orientais',
        text: 'Especiarias orientais (canela, cardamomo)',
        points: { misterioso: 3, exotico: 2, sensual: 2 }
      },
      {
        id: 'oceano-brisa',
        text: 'Oceano e brisa marinha',
        points: { natural: 3, livre: 2, refrescante: 2 }
      },
      {
        id: 'vanilla-doce',
        text: 'Baunilha e notas doces',
        points: { acolhedor: 3, confortavel: 2, carinhoso: 2 }
      }
    ]
  },
  {
    stepNumber: 18,
    stepId: 'step-18',
    title: 'Quando você entra em uma sala, as pessoas percebem:',
    type: 'question',
    maxSelections: 3,
    isRequired: true,
    options: [
      {
        id: 'elegancia-presenca',
        text: 'Sua elegância e presença',
        points: { elegante: 3, magnetico: 2, imponente: 2 }
      },
      {
        id: 'energia-alegria',
        text: 'Sua energia e alegria',
        points: { energetico: 3, alegre: 3, contagiante: 2 }
      },
      {
        id: 'serenidade-paz',
        text: 'Sua serenidade e paz',
        points: { tranquilo: 3, serenidade: 3, equilibrado: 2 }
      },
      {
        id: 'criatividade-originalidade',
        text: 'Sua criatividade e originalidade',
        points: { criativo: 3, original: 3, unico: 2 }
      },
      {
        id: 'confianca-forca',
        text: 'Sua confiança e força',
        points: { confiante: 3, forte: 2, determinado: 2 }
      },
      {
        id: 'docura-carinho',
        text: 'Sua doçura e carinho',
        points: { carinhoso: 3, doce: 2, acolhedor: 2 }
      }
    ]
  },
  {
    stepNumber: 19,
    stepId: 'step-19',
    title: 'Preparando seu resultado...',
    subtitle: 'Analisando suas respostas para revelar seu estilo único',
    type: 'transition',
    backgroundColor: '#EDF2F7',
    textColor: '#2D3748'
  },
  {
    stepNumber: 20,
    stepId: 'step-20',
    title: 'Seu Estilo Pessoal Revelado',
    subtitle: 'Descubra quem você é através do seu estilo único',
    type: 'result',
    backgroundColor: '#F7FAFC',
    textColor: '#1A202C'
  },
  {
    stepNumber: 21,
    stepId: 'step-21',
    title: 'Transforme seu Estilo Agora',
    subtitle: 'Consultoria personalizada para desenvolver seu estilo único',
    type: 'offer',
    backgroundColor: '#B89B7A',
    textColor: '#FFFFFF'
  }
];

export default QUIZ_21_STEPS_COMPLETE;
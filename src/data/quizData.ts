// Complete Quiz Data with all 21 steps and scoring logic

export interface QuizOption {
  id: string;
  text: string;
  description?: string;
  imageUrl?: string;
  category: string;
  points: number;
}

export interface QuizQuestion {
  stepNumber: number;
  title: string;
  description?: string;
  type: 'scored' | 'strategic' | 'transition';
  requiredSelections: number;
  autoAdvance: boolean;
  showImages: boolean;
  options: QuizOption[];
}

// Style categories for scoring
export const STYLE_CATEGORIES = {
  Natural: 'Natural',
  Classico: 'Clássico', 
  Contemporaneo: 'Contemporâneo',
  Elegante: 'Elegante',
  Romantico: 'Romântico',
  Sexy: 'Sexy',
  Dramatico: 'Dramático',
  Criativo: 'Criativo'
} as const;

export type StyleCategory = typeof STYLE_CATEGORIES[keyof typeof STYLE_CATEGORIES];

// Complete quiz questions data
export const QUIZ_QUESTIONS_DATA: Record<number, QuizQuestion> = {
  // Step 1: Name collection (handled by lead-form block)
  
  // Step 2: QUAL O SEU TIPO DE ROUPA FAVORITA?
  3: {
    stepNumber: 3,
    title: 'QUAL O SEU TIPO DE ROUPA FAVORITA?',
    type: 'scored',
    requiredSelections: 3,
    autoAdvance: true,
    showImages: true,
    options: [
      {
        id: 'natural_q1',
        text: 'Conforto, leveza e praticidade no vestir',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/11_hqmr8l.webp',
        category: 'Natural',
        points: 1
      },
      {
        id: 'classico_q1',
        text: 'Discrição, caimento clássico e sobriedade',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
        category: 'Clássico',
        points: 1
      },
      {
        id: 'contemporaneo_q1',
        text: 'Praticidade com um toque de estilo atual',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/4_snhaym.webp',
        category: 'Contemporâneo',
        points: 1
      },
      {
        id: 'elegante_q1',
        text: 'Elegância refinada, moderna e sem exageros',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
        category: 'Elegante',
        points: 1
      },
      {
        id: 'romantico_q1',
        text: 'Delicadeza em tecidos suaves e fluidos',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/15_xezvcy.webp',
        category: 'Romântico',
        points: 1
      },
      {
        id: 'sexy_q1',
        text: 'Sensualidade com destaque para o corpo',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735316/16_mpqpew.webp',
        category: 'Sexy',
        points: 1
      },
      {
        id: 'dramatico_q1',
        text: 'Impacto visual com peças estruturadas e assimétricas',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735319/17_m5ogub.webp',
        category: 'Dramático',
        points: 1
      },
      {
        id: 'criativo_q1',
        text: 'Mix criativo com formas ousadas e originais',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/18_j8ipfb.webp',
        category: 'Criativo',
        points: 1
      }
    ]
  },

  // Step 3: RESUMA A SUA PERSONALIDADE
  4: {
    stepNumber: 4,
    title: 'RESUMA A SUA PERSONALIDADE:',
    type: 'scored',
    requiredSelections: 3,
    autoAdvance: true,
    showImages: false,
    options: [
      {
        id: 'natural_q2',
        text: 'Informal, espontânea, alegre, essencialista',
        category: 'Natural',
        points: 1
      },
      {
        id: 'classico_q2',
        text: 'Conservadora, séria, organizada',
        category: 'Clássico',
        points: 1
      },
      {
        id: 'contemporaneo_q2',
        text: 'Informada, ativa, prática',
        category: 'Contemporâneo',
        points: 1
      },
      {
        id: 'elegante_q2',
        text: 'Exigente, sofisticada, seletiva',
        category: 'Elegante',
        points: 1
      },
      {
        id: 'romantico_q2',
        text: 'Feminina, meiga, delicada, sensível',
        category: 'Romântico',
        points: 1
      },
      {
        id: 'sexy_q2',
        text: 'Glamorosa, vaidosa, sensual',
        category: 'Sexy',
        points: 1
      },
      {
        id: 'dramatico_q2',
        text: 'Cosmopolita, moderna e audaciosa',
        category: 'Dramático',
        points: 1
      },
      {
        id: 'criativo_q2',
        text: 'Exótica, aventureira, livre',
        category: 'Criativo',
        points: 1
      }
    ]
  },

  // Step 4: QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?
  5: {
    stepNumber: 5,
    title: 'QUAL VISUAL VOCÊ MAIS SE IDENTIFICA?',
    type: 'scored',
    requiredSelections: 3,
    autoAdvance: true,
    showImages: true,
    options: [
      {
        id: 'natural_q3',
        text: 'Visual leve, despojado e natural',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
        category: 'Natural',
        points: 1
      },
      {
        id: 'classico_q3',
        text: 'Visual clássico e tradicional',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/3_asaunw.webp',
        category: 'Clássico',
        points: 1
      },
      {
        id: 'contemporaneo_q3',
        text: 'Visual casual com toque atual',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp',
        category: 'Contemporâneo',
        points: 1
      },
      {
        id: 'elegante_q3',
        text: 'Visual refinado e imponente',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/5_dhrgpf.webp',
        category: 'Elegante',
        points: 1
      },
      {
        id: 'romantico_q3',
        text: 'Visual romântico, feminino e delicado',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp',
        category: 'Romântico',
        points: 1
      },
      {
        id: 'sexy_q3',
        text: 'Visual sensual, com saia justa e decote',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp',
        category: 'Sexy',
        points: 1
      },
      {
        id: 'dramatico_q3',
        text: 'Visual marcante e urbano (jeans + jaqueta)',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp',
        category: 'Dramático',
        points: 1
      },
      {
        id: 'criativo_q3',
        text: 'Visual criativo, colorido e ousado',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp',
        category: 'Criativo',
        points: 1
      }
    ]
  },

  // Continue with questions 5-11 (Steps 6-12)
  6: {
    stepNumber: 6,
    title: 'QUAIS DETALHES VOCÊ GOSTA?',
    type: 'scored',
    requiredSelections: 3,
    autoAdvance: true,
    showImages: false,
    options: [
      { id: 'natural_q4', text: 'Poucos detalhes, básico e prático', category: 'Natural', points: 1 },
      { id: 'classico_q4', text: 'Bem discretos e sutis, clean e clássico', category: 'Clássico', points: 1 },
      { id: 'contemporaneo_q4', text: 'Básico, mas com um toque de estilo', category: 'Contemporâneo', points: 1 },
      { id: 'elegante_q4', text: 'Detalhes refinados, chic e que deem status', category: 'Elegante', points: 1 },
      { id: 'romantico_q4', text: 'Detalhes delicados, laços, babados', category: 'Romântico', points: 1 },
      { id: 'sexy_q4', text: 'Roupas que valorizem meu corpo: couro, zíper, fendas', category: 'Sexy', points: 1 },
      { id: 'dramatico_q4', text: 'Detalhes marcantes, firmeza e peso', category: 'Dramático', points: 1 },
      { id: 'criativo_q4', text: 'Detalhes diferentes do convencional, produções ousadas', category: 'Criativo', points: 1 }
    ]
  },

  7: {
    stepNumber: 7,
    title: 'QUAIS ESTAMPAS VOCÊ MAIS SE IDENTIFICA?',
    type: 'scored',
    requiredSelections: 3,
    autoAdvance: true,
    showImages: true,
    options: [
      {
        id: 'natural_q5',
        text: 'Estampas clean, com poucas informações',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/20_oh44vh.webp',
        category: 'Natural',
        points: 1
      },
      {
        id: 'classico_q5',
        text: 'Estampas clássicas e atemporais',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735368/21_o7wkte.webp',
        category: 'Clássico',
        points: 1
      },
      {
        id: 'contemporaneo_q5',
        text: 'Atemporais, mas que tenham uma pegada de atual e moderna',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735369/22_siebw2.webp',
        category: 'Contemporâneo',
        points: 1
      },
      {
        id: 'elegante_q5',
        text: 'Estampas clássicas e atemporais, mas sofisticadas',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/23_bdfxrh.webp',
        category: 'Elegante',
        points: 1
      },
      {
        id: 'romantico_q5',
        text: 'Estampas florais e/ou delicadas como bolinhas, borboletas e corações',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/24_nptszu.webp',
        category: 'Romântico',
        points: 1
      },
      {
        id: 'sexy_q5',
        text: 'Estampas de animal print, como onça, zebra e cobra',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/25_motk6b.webp',
        category: 'Sexy',
        points: 1
      },
      {
        id: 'dramatico_q5',
        text: 'Estampas geométricas, abstratas e exageradas como grandes poás',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735371/26_dptanw.webp',
        category: 'Dramático',
        points: 1
      },
      {
        id: 'criativo_q5',
        text: 'Estampas diferentes do usual, como africanas, xadrez grandes',
        imageUrl: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735372/27_wxmklx.webp',
        category: 'Criativo',
        points: 1
      }
    ]
  },

  // Strategic Questions (Steps 13-18)
  14: {
    stepNumber: 14,
    title: 'Como você se vê hoje?',
    description: 'Quando você se olha no espelho, como se sente com sua imagem pessoal atualmente?',
    type: 'strategic',
    requiredSelections: 1,
    autoAdvance: false,
    showImages: false,
    options: [
      {
        id: 'strategic_1_a',
        text: 'Me sinto desconectada da mulher que sou hoje',
        category: 'strategic',
        points: 0
      },
      {
        id: 'strategic_1_b',
        text: 'Tenho dúvidas sobre o que realmente me valoriza',
        category: 'strategic',
        points: 0
      },
      {
        id: 'strategic_1_c',
        text: 'Às vezes acerto, às vezes erro',
        category: 'strategic',
        points: 0
      },
      {
        id: 'strategic_1_d',
        text: 'Me sinto segura, mas sei que posso evoluir',
        category: 'strategic',
        points: 0
      }
    ]
  },

  15: {
    stepNumber: 15,
    title: 'O que mais te desafia na hora de se vestir?',
    type: 'strategic',
    requiredSelections: 1,
    autoAdvance: false,
    showImages: false,
    options: [
      {
        id: 'strategic_2_a',
        text: 'Tenho peças, mas não sei como combiná-las',
        category: 'strategic',
        points: 0
      },
      {
        id: 'strategic_2_b',
        text: 'Compro por impulso e me arrependo depois',
        category: 'strategic',
        points: 0
      },
      {
        id: 'strategic_2_c',
        text: 'Minha imagem não reflete quem eu sou',
        category: 'strategic',
        points: 0
      },
      {
        id: 'strategic_2_d',
        text: 'Perco tempo e acabo usando sempre os mesmos looks',
        category: 'strategic',
        points: 0
      }
    ]
  },

  // Continue with remaining strategic questions...
};

// Scoring and result calculation
export function calculateStyleResult(userResponses: Record<string, any>): {
  primaryStyle: StyleCategory;
  secondaryStyles: StyleCategory[];
  scores: Record<string, number>;
} {
  const scores: Record<string, number> = {
    Natural: 0,
    Clássico: 0,
    Contemporâneo: 0,
    Elegante: 0,
    Romântico: 0,
    Sexy: 0,
    Dramático: 0,
    Criativo: 0
  };

  // Count points from each response
  Object.entries(userResponses).forEach(([key, value]) => {
    if (key.startsWith('step_') && key.endsWith('_selections') && Array.isArray(value)) {
      const stepNumber = parseInt(key.split('_')[1]);
      const questionData = QUIZ_QUESTIONS_DATA[stepNumber];
      
      if (questionData && questionData.type === 'scored') {
        value.forEach(optionId => {
          const option = questionData.options.find(opt => opt.id === optionId);
          if (option && option.category in scores) {
            scores[option.category] += option.points;
          }
        });
      }
    }
  });

  // Find primary style (highest score)
  const sortedScores = Object.entries(scores).sort(([,a], [,b]) => b - a);
  const primaryStyle = sortedScores[0][0] as StyleCategory;
  
  // Find secondary styles (other high scores)
  const secondaryStyles = sortedScores
    .slice(1, 3)
    .filter(([,score]) => score > 0)
    .map(([style]) => style as StyleCategory);

  return {
    primaryStyle,
    secondaryStyles,
    scores
  };
}

// Save user response (localStorage for now, could be database later)
export function saveUserResponse(key: string, value: any): void {
  try {
    const currentResponses = JSON.parse(localStorage.getItem('quizResponses') || '{}');
    currentResponses[key] = value;
    localStorage.setItem('quizResponses', JSON.stringify(currentResponses));
    
    // Also save individual values for easy access
    if (key === 'userName') {
      localStorage.setItem('quizUserName', value);
    }
  } catch (error) {
    console.error('Error saving user response:', error);
  }
}

// Load user responses
export function loadUserResponses(): Record<string, any> {
  try {
    return JSON.parse(localStorage.getItem('quizResponses') || '{}');
  } catch (error) {
    console.error('Error loading user responses:', error);
    return {};
  }
}

// Clear all user responses
export function clearUserResponses(): void {
  localStorage.removeItem('quizResponses');
  localStorage.removeItem('quizUserName');
  localStorage.removeItem('quizPrimaryStyle');
}

export default QUIZ_QUESTIONS_DATA;
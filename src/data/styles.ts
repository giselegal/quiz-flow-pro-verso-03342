import type { Style, StyleType } from '@/types/quiz';

/**
 * 🎨 CONFIGURAÇÃO DOS ESTILOS PESSOAIS - QUIZ GISELE GALVÃO
 * 
 * Este arquivo contém todos os dados dos 8 estilos do quiz:
 * Natural, Clássico, Contemporâneo, Elegante, Romântico, Sexy, Dramático, Criativo
 */

export interface StyleConfig {
  id: string;
  name: string;
  image: string;
  guideImage: string;
  description: string;
  category: string;
  keywords: string[];
  specialTips: string[];
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// Configuração completa dos estilos baseada no HTML fornecido
export const styleConfigGisele: Record<string, StyleConfig> = {
  Natural: {
    id: 'natural',
    name: 'Natural',
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735317/2_ziffwx.webp',
    guideImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071344/GUIA_NATURAL_fzp6fc.webp',
    description: 'Você valoriza o conforto e a praticidade, com um visual descontraído e autêntico que reflete sua personalidade natural.',
    category: 'Conforto & Praticidade',
    keywords: ['conforto', 'praticidade', 'descontraído', 'autêntico', 'natural', 'casual'],
    specialTips: [
      'Invista em peças de algodão, linho e malha.',
      'Prefira cores neutras e terrosas.',
      'Aposte em acessórios discretos e funcionais.',
      'Mantenha um guarda-roupa versátil e confortável.'
    ],
    colors: {
      primary: '#deac6d',
      secondary: '#fefefe',
      accent: '#5b4135'
    }
  },
  Clássico: {
    id: 'classico',
    name: 'Clássico',
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/12_edlmwf.webp',
    guideImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_CL%C3%81SSICO_ux1yhf.webp',
    description: 'Você aprecia a elegância atemporal, com peças de qualidade e caimento perfeito.',
    category: 'Elegância Atemporal',
    keywords: ['elegância', 'sofisticação', 'atemporal', 'clássico', 'refinado', 'tradicional'],
    specialTips: [
      'Invista em peças de alfaiataria e camisas bem cortadas.',
      'Prefira cores sóbrias como azul-marinho, branco e preto.',
      'Aposte em acessórios discretos e clássicos.',
      'Mantenha um guarda-roupa organizado e atemporal.'
    ],
    colors: {
      primary: '#5b4135',
      secondary: '#fefefe',
      accent: '#deac6d'
    }
  },
  Contemporâneo: {
    id: 'contemporaneo',
    name: 'Contemporâneo',
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/13_uvbciq.webp',
    guideImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_CONTEMPOR%C3%82NEO_vcklxe.webp',
    description: 'Você busca um equilíbrio entre o clássico e o moderno, com peças práticas e atuais.',
    category: 'Equilíbrio & Modernidade',
    keywords: ['contemporâneo', 'equilibrado', 'prático', 'atual', 'versátil', 'funcional'],
    specialTips: [
      'Invista em peças minimalistas com cortes modernos.',
      'Prefira cores neutras com pontos de cor.',
      'Aposte em acessórios geométricos e sofisticados.',
      'Mantenha um guarda-roupa versátil e atualizado.'
    ],
    colors: {
      primary: '#5b4135',
      secondary: '#fefefe',
      accent: '#deac6d'
    }
  },
  Elegante: {
    id: 'elegante',
    name: 'Elegante',
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/14_l2nprc.webp',
    guideImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071342/GUIA_ELEGANTE_asez1q.webp',
    description: 'Você tem um olhar refinado para detalhes sofisticados e peças de alta qualidade.',
    category: 'Refinamento & Qualidade',
    keywords: ['elegante', 'refinado', 'sofisticado', 'qualidade', 'luxo', 'distinto'],
    specialTips: [
      'Invista em peças de tecidos nobres como seda e crepe.',
      'Prefira cores clássicas como branco, preto, bege e off-white.',
      'Aposte em acessórios finos e discretos.',
      'Mantenha um guarda-roupa sofisticado e impecável.'
    ],
    colors: {
      primary: '#1a1716',
      secondary: '#fefefe',
      accent: '#deac6d'
    }
  },
  Romântico: {
    id: 'romantico',
    name: 'Romântico',
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735330/6_gnoxfg.webp',
    guideImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071343/GUIA_ROM%C3%82NTICO_ci4hgk.webp',
    description: 'Você valoriza a delicadeza e os detalhes femininos, com muita suavidade.',
    category: 'Delicadeza & Feminilidade',
    keywords: ['romântico', 'delicado', 'feminino', 'suave', 'encantador', 'doce'],
    specialTips: [
      'Invista em peças com rendas, laços e babados.',
      'Prefira cores suaves e pastéis.',
      'Aposte em acessórios delicados e femininos.',
      'Mantenha um guarda-roupa leve e encantador.'
    ],
    colors: {
      primary: '#deac6d',
      secondary: '#fefefe',
      accent: '#bd0000'
    }
  },
  Sexy: {
    id: 'sexy',
    name: 'Sexy',
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735327/7_ynez1z.webp',
    guideImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071349/GUIA_SEXY_t5x2ov.webp',
    description: 'Você gosta de valorizar suas curvas e exibir sua sensualidade com confiança.',
    category: 'Sensualidade & Confiança',
    keywords: ['sexy', 'sensual', 'confiante', 'ousado', 'sedutor', 'empoderado'],
    specialTips: [
      'Invista em peças justas e decotadas na medida certa.',
      'Prefira cores intensas como vermelho e preto.',
      'Aposte em acessórios marcantes e sedutores.',
      'Mantenha um guarda-roupa ousado e poderoso.'
    ],
    colors: {
      primary: '#bd0000',
      secondary: '#fefefe',
      accent: '#1a1716'
    }
  },
  Dramático: {
    id: 'dramatico',
    name: 'Dramático',
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/8_yqu3hw.webp',
    guideImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745073346/GUIA_DRAM%C3%81TICO_mpn60d.webp',
    description: 'Você tem personalidade forte e gosta de causar impacto com seu visual.',
    category: 'Impacto & Presença',
    keywords: ['dramático', 'marcante', 'impactante', 'presença', 'ousado', 'statement'],
    specialTips: [
      'Invista em peças estruturadas e de design arrojado.',
      'Prefira cores contrastantes e vibrantes.',
      'Aposte em acessórios grandes e de impacto.',
      'Mantenha um guarda-roupa ousado e marcante.'
    ],
    colors: {
      primary: '#1a1716',
      secondary: '#fefefe',
      accent: '#bd0000'
    }
  },
  Criativo: {
    id: 'criativo',
    name: 'Criativo',
    image: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1744735329/9_x6so6a.webp',
    guideImage: 'https://res.cloudinary.com/dqljyf76t/image/upload/v1745071342/GUIA_CRIATIVO_ntbzph.webp',
    description: 'Você aprecia a originalidade e não tem medo de ousar em combinações únicas.',
    category: 'Expressão & Individualidade',
    keywords: ['criativo', 'único', 'artístico', 'individual', 'expressivo', 'original'],
    specialTips: [
      'Invista em peças diferentes e estampadas.',
      'Prefira cores contrastantes e combinações inusitadas.',
      'Aposte em acessórios criativos e divertidos.',
      'Mantenha um guarda-roupa original e cheio de personalidade.'
    ],
    colors: {
      primary: '#deac6d',
      secondary: '#fefefe',
      accent: '#5b4135'
    }
  },
};

// Mapeamento de IDs para nomes dos estilos (compatibilidade com sistema existente)
export const styleMapping = {
  'natural': 'Natural',
  'classico': 'Clássico',
  'contemporaneo': 'Contemporâneo',
  'elegante': 'Elegante',
  'romantico': 'Romântico',
  'sexy': 'Sexy',
  'dramatico': 'Dramático',
  'criativo': 'Criativo'
} as const;

export type StyleId = keyof typeof styleMapping;
export type StyleName = typeof styleMapping[StyleId];

// Definição dos 8 estilos do CaktoQuiz (manter compatibilidade)
export const STYLES: Record<StyleType, Style> = {
  classico: {
    id: 'classico',
    name: 'Clássico',
    description:
      'Seu estilo é atemporal e sofisticado. Você valoriza peças de qualidade, cores neutras e um visual elegante que nunca sai de moda. Prefere investir em básicos versáteis que podem ser combinados de várias formas.',
    imageUrl: '/estilos/classico-personal.jpg',
    guideImageUrl: '/estilos/classico-guide.jpg',
    colors: {
      primary: '#2C3E50',
      secondary: '#BDC3C7',
      accent: '#34495E',
    },
    keywords: ['atemporal', 'sofisticado', 'elegante', 'neutro', 'versátil'],
  },
  romântico: {
    id: 'romântico',
    name: 'Romântico',
    description:
      'Seu estilo é delicado e feminino. Você adora peças com detalhes florais, rendas, babados e cores suaves. Sua personalidade doce se reflete nas escolhas de roupas que fazem você se sentir especial e única.',
    imageUrl: '/estilos/romantico-personal.jpg',
    guideImageUrl: '/estilos/romantico-guide.jpg',
    colors: {
      primary: '#F8BBD9',
      secondary: '#FCE4EC',
      accent: '#E91E63',
    },
    keywords: ['delicado', 'feminino', 'floral', 'suave', 'doce'],
  },
  dramático: {
    id: 'dramático',
    name: 'Dramático',
    description:
      'Seu estilo é marcante e impactante. Você não tem medo de se destacar e adora peças com contrastes fortes, geometrias definidas e elementos que causam impacto visual. Você é uma pessoa confiante e isso transpareece no seu visual.',
    imageUrl: '/estilos/dramatico-personal.jpg',
    guideImageUrl: '/estilos/dramatico-guide.jpg',
    colors: {
      primary: '#000000',
      secondary: '#FFFFFF',
      accent: '#E74C3C',
    },
    keywords: ['marcante', 'impactante', 'contraste', 'geométrico', 'confiante'],
  },
  natural: {
    id: 'natural',
    name: 'Natural',
    description:
      'Seu estilo é descomplicado e confortável. Você prioriza o conforto sem abrir mão da beleza, optando por tecidos naturais, cores terrosas e peças que permitem movimento livre. Sua autenticidade é sua maior marca.',
    imageUrl: '/estilos/natural-personal.jpg',
    guideImageUrl: '/estilos/natural-guide.jpg',
    colors: {
      primary: '#8D6E63',
      secondary: '#D7CCC8',
      accent: '#4CAF50',
    },
    keywords: ['descomplicado', 'confortável', 'natural', 'terroso', 'autêntico'],
  },
  criativo: {
    id: 'criativo',
    name: 'Criativo',
    description:
      'Seu estilo é único e expressivo. Você adora experimentar, misturar estampas, brincar com cores e criar looks que ninguém mais pensou. Sua criatividade não tem limites e isso se reflete nas suas escolhas de moda.',
    imageUrl: '/estilos/criativo-personal.jpg',
    guideImageUrl: '/estilos/criativo-guide.jpg',
    colors: {
      primary: '#9C27B0',
      secondary: '#FF9800',
      accent: '#2196F3',
    },
    keywords: ['único', 'expressivo', 'experimental', 'colorido', 'criativo'],
  },
  elegante: {
    id: 'elegante',
    name: 'Elegante',
    description:
      'Seu estilo é refinado e polido. Você aprecia a alta qualidade, o caimento perfeito e os detalhes bem acabados. Cada peça do seu guarda-roupa é escolhida com cuidado para transmitir sofisticação e bom gosto.',
    imageUrl: '/estilos/elegante-personal.jpg',
    guideImageUrl: '/estilos/elegante-guide.jpg',
    colors: {
      primary: '#1A237E',
      secondary: '#C5CAE9',
      accent: '#3F51B5',
    },
    keywords: ['refinado', 'polido', 'qualidade', 'sofisticação', 'bom gosto'],
  },
  sexy: {
    id: 'sexy',
    name: 'Sexy',
    description:
      'Seu estilo é sedutor e confiante. Você não tem medo de mostrar sua feminilidade e sabe usar peças que realçam suas curvas e destacam sua personalidade marcante. Você se sente poderosa quando está bem vestida.',
    imageUrl: '/estilos/sexy-personal.jpg',
    guideImageUrl: '/estilos/sexy-guide.jpg',
    colors: {
      primary: '#B71C1C',
      secondary: '#FFCDD2',
      accent: '#000000',
    },
    keywords: ['sedutor', 'confiante', 'feminino', 'marcante', 'poderosa'],
  },
  contemporâneo: {
    id: 'contemporâneo',
    name: 'Contemporâneo',
    description:
      'Seu estilo é moderno e atual. Você está sempre antenada nas últimas tendências, mas sabe adaptá-las ao seu gosto pessoal. Gosta de peças com design inovador e não tem medo de experimentar o que há de novo na moda.',
    imageUrl: '/estilos/contemporaneo-personal.jpg',
    guideImageUrl: '/estilos/contemporaneo-guide.jpg',
    colors: {
      primary: '#607D8B',
      secondary: '#ECEFF1',
      accent: '#FF5722',
    },
    keywords: ['moderno', 'atual', 'tendência', 'inovador', 'experimental'],
  },
};

// Helper para obter estilo por ID
export const getStyleById = (styleId: StyleType): Style => {
  return STYLES[styleId];
};

// Helper para obter todos os estilos como array
export const getAllStyles = (): Style[] => {
  return Object.values(STYLES);
};

// Helper para obter nome do estilo
export const getStyleName = (styleId: StyleType): string => {
  return STYLES[styleId].name;
};
